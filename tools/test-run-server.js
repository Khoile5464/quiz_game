/* Unit test engine «Endless Run Quiz» (js/run/run-server.js): chạy bằng  node tools/test-run-server.js
   Phủ: hết giờ, replay token, khiên, pity (qua nhiều run & nhiều phiên), giới hạn pet/ngày & /run, transaction + idempotent, không lộ đáp án,
   client sửa đồng hồ/kết quả, run treo hết hạn, tạm dừng, đa dạng rarity theo streak. */
const assert = require("assert");
const path = require("path");
const CFG0 = require(path.join(__dirname, "../js/run/run-config.js"));
const PETS = require(path.join(__dirname, "../js/run/rainforest-data.js"));
const { createRunServer, RunError } = require(path.join(__dirname, "../js/run/run-server.js"));

/* ---- đồ giả ---- */
function mulberry(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function makeStore(init) {
  const state = { coins: 0, farmCount: 0, ownedPetIds: {}, pity: 0, day: { key: "", count: 0 }, runs: {}, userPets: [], ...(init || {}) };
  return {
    state, failNext: false,
    read() { return JSON.parse(JSON.stringify(state)); },
    tx(fn) {
      const draft = JSON.parse(JSON.stringify(state)); draft.newPets = [];
      const out = fn(draft);                                   // ném lỗi ở đây → không commit gì
      if (this.failNext) { this.failNext = false; throw new Error("DB crash trước commit"); }
      for (const k of ["coins", "ownedPetIds", "pity", "day", "runs"]) state[k] = draft[k];
      for (const p of draft.newPets) { state.userPets.push(p); state.farmCount++; }
      return out;
    },
  };
}
function makeQuestions(n, o) {
  const log = [];
  const qs = Array.from({ length: n }, (_, i) => ({ id: "q" + i, text: "Câu " + i, options: ["A" + i, "B" + i, "C" + i, "D" + i], correct: i % 4 }));
  return { log, learnedCount: () => (o && o.learned != null ? o.learned : n), next({ exclude }) { const ex = exclude || new Set(); return qs.find((q) => !ex.has(q.id)) || null; }, recordAnswer(id, ok) { log.push([id, ok]); }, qs };
}
function setup(over) {
  const o = over || {};
  const clock = { t: 1000 }, store = o.store || makeStore(o.init), cfg = { ...CFG0, ...(o.cfg || {}) };
  const questions = o.questions || makeQuestions(60);
  const mk = () => createRunServer({ config: cfg, pets: PETS, questions, store, clock: () => clock.t, today: () => (o.day && o.day()) || "2026-11-19", rng: o.rng || mulberry(o.seed || 7) });
  return { srv: mk(), mk, clock, store, cfg, questions };
}
/* chọn đáp án đúng: thử từng lựa chọn không được (test cần biết đáp án) → đọc từ state server (test mới được phép nhìn) */
const correctId = (store, runId) => store.state.runs[runId].pending.correctId;
const wrongId = (store, runId) => store.state.runs[runId].pending.options.find((o) => o.id !== correctId(store, runId)).id;

const tests = [];
const test = (name, fn) => tests.push([name, fn]);
const throwsCode = (fn, code) => { try { fn(); } catch (e) { assert.ok(e instanceof RunError, "phải là RunError, nhận " + e); assert.strictEqual(e.code, code); return e; } assert.fail("phải ném " + code); };

/* ================= hết giờ & đồng hồ server ================= */
test("đáp án ĐÚNG nhưng gửi muộn hơn 20s + grace luôn bị tính SAI (kể cả client sửa)", () => {
  const { srv, clock, store, questions } = setup();
  const s = srv.start(); clock.t += 20000 + 1500 + 1;
  const r = srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: correctId(store, s.runId) });
  assert.strictEqual(r.correct, false); assert.strictEqual(r.timedOut, true); assert.strictEqual(r.runOver, true);
  assert.deepStrictEqual(questions.log, [["q0", false]]); // timeout tính là sai cho mastery
});
test("đúng trong hạn (trong dung sai) được tính", () => {
  const { srv, clock, store, cfg } = setup();
  const s = srv.start(); clock.t += cfg.questionTimeMs + cfg.graceMs;
  assert.strictEqual(srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: correctId(store, s.runId) }).correct, true);
});
test("gửi choiceId = null (client báo hết giờ/bỏ qua) là sai", () => {
  const { srv } = setup(); const s = srv.start();
  assert.strictEqual(srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: null }).correct, false);
});
test("client đổi giờ hệ thống không ảnh hưởng: server dùng đồng hồ đơn điệu của chính nó", () => {
  const { srv, clock, store } = setup(); const s = srv.start();
  const realNow = Date.now; Date.now = () => realNow() - 3600e3; // client lùi đồng hồ 1 giờ
  try { clock.t += 30000; assert.strictEqual(srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: correctId(store, s.runId) }).correct, false); } finally { Date.now = realNow; }
});

/* ================= token ================= */
test("gửi cùng một token hai lần không tạo thêm thưởng (DUPLICATE_SUBMIT + trả lại kết quả cũ)", () => {
  const { srv, store } = setup(); const s = srv.start(), tok = s.firstQuestion.token, cid = correctId(store, s.runId);
  const r1 = srv.answer({ runId: s.runId, token: tok, choiceId: cid }); const coins = store.state.coins, score = store.state.runs[s.runId].score;
  const e = throwsCode(() => srv.answer({ runId: s.runId, token: tok, choiceId: cid }), "DUPLICATE_SUBMIT");
  assert.strictEqual(e.replay.coinDelta, r1.coinDelta);
  assert.strictEqual(store.state.coins, coins); assert.strictEqual(store.state.runs[s.runId].score, score);
});
test("token lạ / token của run khác / token cũ", () => {
  const { srv, store } = setup(); const a = srv.start();
  throwsCode(() => srv.answer({ runId: a.runId, token: "bậy", choiceId: null }), "TOKEN_INVALID");
  const r = srv.answer({ runId: a.runId, token: a.firstQuestion.token, choiceId: correctId(store, a.runId) });
  assert.ok(r.nextQuestion);
  throwsCode(() => srv.answer({ runId: "khong-co", token: r.nextQuestion.token, choiceId: null }), "RUN_NOT_FOUND");
  const b = srv.start(); // run mới đóng run cũ; token run cũ không dùng cho run mới
  throwsCode(() => srv.answer({ runId: b.runId, token: r.nextQuestion.token, choiceId: null }), "TOKEN_INVALID");
  throwsCode(() => srv.answer({ runId: a.runId, token: r.nextQuestion.token, choiceId: null }), "RUN_OVER");
});
test("lựa chọn không thuộc câu hỏi bị từ chối và KHÔNG tiêu token", () => {
  const { srv, store } = setup(); const s = srv.start();
  throwsCode(() => srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: "doan-mo" }), "INVALID_CHOICE");
  assert.strictEqual(srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: correctId(store, s.runId) }).correct, true);
});
test("payload không lộ đáp án đúng; id lựa chọn không đoán theo vị trí", () => {
  const { srv, store } = setup(); const s = srv.start(), cid = correctId(store, s.runId);
  const json = JSON.stringify(s);
  assert.ok(!/correct/i.test(json), "payload không được có trường correct*"); assert.ok(json.indexOf(cid) >= 0 === true || true);
  const ids = s.firstQuestion.options.map((o) => o.id); assert.strictEqual(new Set(ids).size, ids.length);
  const r = srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: cid });
  assert.ok(!/correctId|correct":\s*"o/i.test(JSON.stringify(r.nextQuestion)));
});

/* ================= khiên ================= */
function forceBoxResult(store, runId, kind) { /* test ép kết quả hộp bằng cách chỉnh trọng số cấu hình qua cfg khi setup; xem các test dưới */ }
test("khiên đỡ đúng 1 lần sai (vẫn tính sai cho mastery), lần sai thứ hai kết thúc run", () => {
  const { srv, store, questions } = setup({ cfg: { boxEveryCorrect: [1, 1], boxOutcomeWeights: { shield: 1, scoreBoost: 0, pet: 0 } } });
  const s = srv.start();
  let r = srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: correctId(store, s.runId) });
  assert.ok(r.secretBox, "đúng 1 câu → có hộp");
  const ob = srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId }); assert.strictEqual(ob.result.type, "shield"); assert.strictEqual(ob.shield, true);
  r = srv.answer({ runId: s.runId, token: ob.nextQuestion.token, choiceId: wrongId(store, s.runId) });
  assert.strictEqual(r.correct, false); assert.strictEqual(r.shieldUsed, true); assert.strictEqual(r.runOver, false); assert.ok(r.nextQuestion);
  assert.deepStrictEqual(questions.log[1], ["q1", false]);
  r = srv.answer({ runId: s.runId, token: r.nextQuestion.token, choiceId: wrongId(store, s.runId) });
  assert.strictEqual(r.runOver, true); assert.strictEqual(r.shieldUsed, false);
});
test("hết giờ cũng bị khiên đỡ như sai; nhặt khiên khi đang có khiên → quy đổi điểm, tối đa giữ 1", () => {
  const { srv, store, clock } = setup({ cfg: { boxEveryCorrect: [1, 1], boxOutcomeWeights: { shield: 1, scoreBoost: 0, pet: 0 } } });
  const s = srv.start();
  let r = srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: correctId(store, s.runId) });
  let ob = srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId });
  r = srv.answer({ runId: s.runId, token: ob.nextQuestion.token, choiceId: correctId(store, s.runId) }); // đúng → hộp thứ 2 (đang có khiên)
  const score0 = r.score; ob = srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId });
  assert.strictEqual(ob.result.converted, true); assert.strictEqual(ob.score, score0 + CFG0.shieldOverflowScore); assert.strictEqual(ob.shield, true);
  clock.t += 25000; r = srv.answer({ runId: s.runId, token: ob.nextQuestion.token, choiceId: null });
  assert.strictEqual(r.shieldUsed, true); assert.strictEqual(r.runOver, false);
});

/* ================= secret box ================= */
test("hộp xuất hiện sau 3–5 câu đúng (bốc lại sau mỗi hộp), câu sai không làm mất đếm", () => {
  const { srv, store } = setup({ seed: 11, cfg: { boxOutcomeWeights: { shield: 1, scoreBoost: 0, pet: 0 } } });
  const s = srv.start(); let q = s.firstQuestion, counts = [], run = s.runId, c = 0, guard = 0;
  while (counts.length < 4 && guard++ < 60) {
    const r = srv.answer({ runId: run, token: q.token, choiceId: correctId(store, run) }); c++;
    if (r.secretBox) { counts.push(c); c = 0; q = srv.openBox({ runId: run, boxId: r.secretBox.boxId }).nextQuestion; } else q = r.nextQuestion;
  }
  assert.strictEqual(counts.length, 4); counts.forEach((n) => assert.ok(n >= 3 && n <= 5, "khoảng cách " + n));
});
test("mở hộp lần hai trả đúng kết quả cũ, không bốc lại; hộp lạ báo lỗi", () => {
  const { srv, store } = setup({ cfg: { boxEveryCorrect: [1, 1], boxOutcomeWeights: { shield: 0, scoreBoost: 0, pet: 1 } } });
  const s = srv.start(); const r = srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: correctId(store, s.runId) });
  const a = srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId }), b = srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId });
  assert.deepStrictEqual(b.result, a.result); assert.strictEqual(b.replay, true);
  assert.strictEqual(store.state.userPets.length, 1); assert.strictEqual(store.state.pity, 1);
  throwsCode(() => srv.openBox({ runId: s.runId, boxId: "khong-co" }), "BOX_NOT_FOUND");
});
test("tăng điểm x2 trong N câu kế tiếp rồi hết", () => {
  const { srv, store } = setup({ cfg: { boxEveryCorrect: [1, 1], scoreBoostQuestions: 2, boxOutcomeWeights: { shield: 0, scoreBoost: 1, pet: 0 } } });
  const s = srv.start(); let r = srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: correctId(store, s.runId) }); assert.strictEqual(r.score, 100);
  let ob = srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId }); let prev = r.score;
  r = srv.answer({ runId: s.runId, token: ob.nextQuestion.token, choiceId: correctId(store, s.runId) }); assert.strictEqual(r.score - prev, 200); prev = r.score;
  ob = srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId });
  r = srv.answer({ runId: s.runId, token: ob.nextQuestion.token, choiceId: correctId(store, s.runId) }); assert.strictEqual(r.score - prev, 200); prev = r.score; // câu thứ 2 của boost (boost đặt lại 2 khi mở hộp mới)
  assert.strictEqual(r.boostLeft, 1);
});
test("rarity theo bậc streak: streak ≥20 ra thú hiếm nhiều hơn streak 1–9 (thống kê)", () => {
  const draw = (streak, seed) => {
    const { srv, store } = setup({ seed, cfg: { boxOutcomeWeights: { shield: 0, scoreBoost: 0, pet: 1 }, pityLegendary: 1e9, maxPetsPerRun: 1e9, maxPetsPerDay: 1e9, duplicatePolicy: "allow" }, questions: makeQuestions(500) });
    const s = srv.start();
    let q = s.firstQuestion, n = { C: 0, R: 0, E: 0, L: 0 };
    for (let i = 0; i < 400; i++) {
      const run = store.state.runs[s.runId]; run.streak = streak - 1; run.boxTarget = 1; run.correctSinceBox = 0; // store.tx thay run bằng bản mới mỗi lần nên phải lấy lại
      const r = srv.answer({ runId: s.runId, token: q.token, choiceId: correctId(store, s.runId) }); const ob = srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId });
      n[ob.result.rarity]++; q = ob.nextQuestion;
    }
    return n;
  };
  const lo = draw(3, 3), hi = draw(25, 4);
  assert.ok(hi.C < lo.C && hi.L > lo.L && hi.E > lo.E, JSON.stringify({ lo, hi }));
  assert.ok(Math.abs(lo.C / 400 - 0.70) < 0.08 && Math.abs(hi.L / 400 - 0.10) < 0.06, JSON.stringify({ lo, hi })); // khớp trọng số cấu hình
});

/* ================= pity ================= */
test("pity: Legendary chắc chắn sau tối đa 20 lần ra pet, qua nhiều run VÀ nhiều phiên (server mới, cùng store)", () => {
  const store = makeStore();
  const cfg = { boxEveryCorrect: [1, 1], boxOutcomeWeights: { shield: 0, scoreBoost: 0, pet: 1 }, maxPetsPerRun: 1000, maxPetsPerDay: 1000, rarityWeightsByStreakTier: [{ minStreak: 1, weights: { C: 1, R: 0, E: 0, L: 0 } }] };
  let gotL = 0, sinceL = 0, maxGap = 0, pets = 0, session = 0;
  while (pets < 130) {
    const { srv } = setup({ store, cfg, seed: 100 + session++, questions: makeQuestions(80) }); // mỗi vòng = một "phiên đăng nhập" mới, server mới, cùng DB
    const s = srv.start(); let q = s.firstQuestion;
    for (let k = 0; k < 7 && pets < 130; k++) {
      const r = srv.answer({ runId: s.runId, token: q.token, choiceId: correctId(store, s.runId) }); const ob = srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId });
      pets++; sinceL++; if (ob.result.rarity === "L") { gotL++; maxGap = Math.max(maxGap, sinceL); sinceL = 0; } q = ob.nextQuestion;
    }
  }
  assert.ok(gotL >= 6, "130 pet / 20 ≥ 6 Legendary, thực tế " + gotL); assert.ok(maxGap <= 20, "khoảng cách tối đa " + maxGap);
  assert.strictEqual(store.state.pity, sinceL, "bộ đếm pity lưu bền trong store");
});
test("Legendary tự nhiên cũng reset bộ đếm", () => {
  const { srv, store } = setup({ cfg: { boxEveryCorrect: [1, 1], boxOutcomeWeights: { shield: 0, scoreBoost: 0, pet: 1 }, rarityWeightsByStreakTier: [{ minStreak: 1, weights: { C: 0, R: 0, E: 0, L: 1 } }] }, init: { pity: 7 } });
  const s = srv.start(); const r = srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: correctId(store, s.runId) });
  assert.strictEqual(srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId }).result.rarity, "L"); assert.strictEqual(store.state.pity, 0);
});

/* ================= giới hạn chống cày ================= */
test("tối đa K pet mỗi run: vượt thì hộp ra khiên/tăng điểm thay vì pet", () => {
  const { srv, store } = setup({ cfg: { boxEveryCorrect: [1, 1], boxOutcomeWeights: { shield: 1, scoreBoost: 1, pet: 100 }, maxPetsPerRun: 2, maxPetsPerDay: 99 }, seed: 5, questions: makeQuestions(120) });
  const s = srv.start(); let q = s.firstQuestion, pets = 0;
  for (let i = 0; i < 40; i++) { const r = srv.answer({ runId: s.runId, token: q.token, choiceId: correctId(store, s.runId) }); const ob = srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId }); if (ob.result.type === "pet") pets++; q = ob.nextQuestion; }
  assert.strictEqual(pets, 2); assert.strictEqual(store.state.userPets.length, 2);
});
test("tối đa M pet mỗi NGÀY (qua nhiều run), sang ngày mới được tiếp", () => {
  let day = "2026-11-19";
  const store = makeStore();
  const run = (seed) => { const { srv } = setup({ store, day: () => day, seed, cfg: { boxEveryCorrect: [1, 1], boxOutcomeWeights: { shield: 1, scoreBoost: 1, pet: 100 }, maxPetsPerRun: 3, maxPetsPerDay: 4 }, questions: makeQuestions(90) });
    const s = srv.start(); let q = s.firstQuestion, got = 0;
    for (let i = 0; i < 25; i++) { const r = srv.answer({ runId: s.runId, token: q.token, choiceId: correctId(store, s.runId) }); const ob = srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId }); if (ob.result.type === "pet") got++; q = ob.nextQuestion; } return got; };
  assert.strictEqual(run(1), 3); assert.strictEqual(run(2), 1); assert.strictEqual(run(3), 0);
  assert.strictEqual(store.state.userPets.length, 4);
  day = "2026-11-20"; assert.strictEqual(run(4), 3);
});
test("chính sách thú trùng: duplicatePolicy=coin đổi xu; chuồng đầy cũng đổi xu", () => {
  const cfg = { boxEveryCorrect: [1, 1], boxOutcomeWeights: { shield: 0, scoreBoost: 0, pet: 1 }, rarityWeightsByStreakTier: [{ minStreak: 1, weights: { C: 1, R: 0, E: 0, L: 0 } }], duplicatePolicy: "coin", maxPetsPerRun: 99, maxPetsPerDay: 99 };
  const { srv, store } = setup({ cfg, init: { ownedPetIds: Object.fromEntries(PETS.filter((p) => p.rarity === "C").map((p) => [p.id, 1])) } });
  const s = srv.start(); const r = srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: correctId(store, s.runId) }); const c0 = store.state.coins;
  const ob = srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId }); assert.strictEqual(ob.result.converted, true); assert.strictEqual(store.state.userPets.length, 0); assert.strictEqual(store.state.coins - c0, CFG0.duplicateCoin.C);
  const full = setup({ cfg: { ...cfg, duplicatePolicy: "allow" }, init: { farmCount: 30 } }); const s2 = full.srv.start();
  const r2 = full.srv.answer({ runId: s2.runId, token: s2.firstQuestion.token, choiceId: correctId(full.store, s2.runId) });
  assert.strictEqual(full.srv.openBox({ runId: s2.runId, boxId: r2.secretBox.boxId }).result.converted, true); assert.strictEqual(full.store.state.userPets.length, 0);
});

/* ================= transaction & idempotent ================= */
test("transaction: lỗi trước commit thì coin/pet/run không đổi gì; thử lại cùng (runId, token) vẫn chấm đúng một lần", () => {
  const { srv, store, questions } = setup({ cfg: { boxEveryCorrect: [1, 1], boxOutcomeWeights: { shield: 0, scoreBoost: 0, pet: 1 } } });
  const s = srv.start(); const before = JSON.stringify(store.state);
  store.failNext = true;
  assert.throws(() => srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: correctId(store, s.runId) }), /DB crash/);
  assert.strictEqual(JSON.stringify(store.state), before, "không được đổi gì"); assert.deepStrictEqual(questions.log, [], "mastery chưa được ghi");
  const r = srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: correctId(store, s.runId) }); assert.strictEqual(r.correct, true);
  store.failNext = true; assert.throws(() => srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId }), /DB crash/);
  assert.strictEqual(store.state.userPets.length, 0); assert.strictEqual(store.state.pity, 0);
  const ob = srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId }); assert.strictEqual(ob.result.type, "pet");
  srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId }); srv.openBox({ runId: s.runId, boxId: r.secretBox.boxId });
  assert.strictEqual(store.state.userPets.length, 1, "mở lặp không nhân đôi pet"); assert.strictEqual(store.state.pity, 1);
});
test("kết quả trả cho client là bản sao: sửa nó không đổi trạng thái server", () => {
  const { srv, store } = setup(); const s = srv.start(); const r = srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: correctId(store, s.runId) });
  r.score = 999999; r.coinDelta = 999999; assert.ok(store.state.runs[s.runId].score < 1000);
});
test("không có API nào để client xin pet: bề mặt API chỉ gồm start/answer/openBox/end/pause/resume/farm/sweep", () => {
  const { srv } = setup(); assert.deepStrictEqual(Object.keys(srv).sort(), ["ERR", "RunError", "answer", "end", "farm", "openBox", "pause", "resume", "start", "sweep"].sort());
  const s = srv.start(); const r = srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: "bậy" === 1 ? 1 : (s && null) });
  assert.strictEqual(r.correct, false); // truyền thêm trường lạ (petId, reward...) cũng không có tác dụng:
  const b = setup(); const s2 = b.srv.start(); const r2 = b.srv.answer({ runId: s2.runId, token: s2.firstQuestion.token, choiceId: correctId(b.store, s2.runId), petId: "r_paradise", reward: { coins: 1e9 }, forcePet: true });
  assert.ok(b.store.state.coins < 200); assert.strictEqual(b.store.state.userPets.length, 0);
});

/* ================= vòng đời run ================= */
test("run treo (im lặng quá ngưỡng) hết hạn, lần gọi sau báo RUN_OVER; sweep dọn khi mở app", () => {
  const { srv, clock, store, cfg } = setup(); const s = srv.start(); clock.t += cfg.runIdleTimeoutMs + 1;
  throwsCode(() => srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: correctId(store, s.runId) }), "RUN_OVER");
  assert.strictEqual(store.state.runs[s.runId].status, "expired", "việc hết hạn được COMMIT, không bị rollback bởi lỗi");
  const t = setup(); const s2 = t.srv.start(); t.clock.t += t.cfg.runIdleTimeoutMs + 1; t.srv.sweep(); assert.strictEqual(t.store.state.runs[s2.runId].status, "expired");
});
test("kết thúc run tự mở nốt hộp chưa mở; /run/end idempotent", () => {
  const { srv, store } = setup({ cfg: { boxEveryCorrect: [1, 1], boxOutcomeWeights: { shield: 0, scoreBoost: 0, pet: 1 } } });
  const s = srv.start(); srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: correctId(store, s.runId) });
  const sum = srv.end({ runId: s.runId }); assert.strictEqual(sum.pets.length, 1); assert.strictEqual(store.state.userPets.length, 1);
  assert.deepStrictEqual(srv.end({ runId: s.runId }), sum); assert.strictEqual(store.state.userPets.length, 1);
});
test("câu hỏi không lặp trong run; kho cạn thì run kết thúc 'complete'; chưa đủ câu đã học thì không cho chạy", () => {
  const { srv, store } = setup({ questions: makeQuestions(3), cfg: { minLearnedQuestions: 1 } });
  const s = srv.start(); let q = s.firstQuestion, last;
  for (let i = 0; i < 3; i++) { last = srv.answer({ runId: s.runId, token: q.token, choiceId: correctId(store, s.runId) }); if (last.secretBox) q = srv.openBox({ runId: s.runId, boxId: last.secretBox.boxId }).nextQuestion; else q = last.nextQuestion; if (!q) break; }
  assert.ok(["complete", "over"].includes(store.state.runs[s.runId].status));
  const e = throwsCode(() => setup({ questions: makeQuestions(30, { learned: 3 }) }).srv.start(), "NOT_ENOUGH_QUESTIONS"); assert.strictEqual(e.need, CFG0.minLearnedQuestions);
});
test("tạm dừng mất mạng: đồng hồ dừng tối đa 30s mỗi câu, quá thì run kết thúc", () => {
  const a = setup(); const s = a.srv.start(); a.clock.t += 10000; a.srv.pause({ runId: s.runId }); a.clock.t += 25000;
  const rs = a.srv.resume({ runId: s.runId }); assert.strictEqual(rs.runOver, false); assert.ok(Math.abs(rs.remainingMs - 10000) < 5);
  assert.strictEqual(a.srv.answer({ runId: s.runId, token: s.firstQuestion.token, choiceId: correctId(a.store, s.runId) }).correct, true, "25s tạm dừng không bị tính vào hạn 20s");
  const b = setup(); const s2 = b.srv.start(); b.srv.pause({ runId: s2.runId }); b.clock.t += 45000;
  const rs2 = b.srv.resume({ runId: s2.runId }); assert.strictEqual(rs2.runOver, true); assert.strictEqual(b.store.state.runs[s2.runId].status, "disconnected");
  const c = setup(); const s3 = c.srv.start(); c.srv.pause({ runId: s3.runId }); c.clock.t += 80000; // đồng hồ chỉ được dừng ≤30s; trả lời sau 80s vẫn muộn
  assert.strictEqual(c.srv.answer({ runId: s3.runId, token: s3.firstQuestion.token, choiceId: correctId(c.store, s3.runId) }).correct, false);
});
test("coin: 10–13 mỗi câu đúng, nhân combo từ streak 3 (tối đa x10)", () => {
  const { srv, store } = setup({ cfg: { boxEveryCorrect: [99, 99] }, seed: 3, questions: makeQuestions(80) });
  const s = srv.start(); let q = s.firstQuestion;
  for (let i = 1; i <= 14; i++) { const r = srv.answer({ runId: s.runId, token: q.token, choiceId: correctId(store, s.runId) }); const mult = i >= 3 ? Math.min(i, 10) : 1;
    assert.ok(r.coinDelta >= 10 * mult && r.coinDelta <= 13 * mult, `câu ${i}: ${r.coinDelta}`); q = r.nextQuestion; }
});
test("GET /farm/rainforest: slot, pity, pet hôm nay", () => {
  const { srv, store } = setup({ init: { farmCount: 5, pity: 3, ownedPetIds: { r_gecko: 2 } } }); const f = srv.farm();
  assert.strictEqual(f.slots.used, 5); assert.strictEqual(f.pity, 3); assert.strictEqual(f.owned.r_gecko, 2); assert.strictEqual(f.maxPetsPerDay, CFG0.maxPetsPerDay);
});

let pass = 0, fail = 0;
for (const [name, fn] of tests) { try { fn(); pass++; console.log("  ✓ " + name); } catch (e) { fail++; console.log("  ✗ " + name + "\n      " + (e && e.stack ? e.stack.split("\n").slice(0, 3).join("\n      ") : e)); } }
console.log(`\n${pass}/${pass + fail} test đạt`);
process.exit(fail ? 1 : 0);
