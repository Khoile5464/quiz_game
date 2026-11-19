/* ---------- «Endless Run Quiz» — engine server-authoritative ----------
   Không đụng DOM. Mọi quyết định về phần thưởng nằm ở đây: sinh câu hỏi, tự đo thời hạn mỗi câu (CONFIG.questionTimeMs, hiện 45 giây), tự chấm, bốc hộp, pity, ghi pet.
   Client chỉ gọi 5 API (start / answer / box/open / end / farm) + pause/resume và nhận kết quả.

   Phụ thuộc được TIÊM vào (nên chạy được trong trình duyệt với LocalStore lẫn Node với store giả khi test, và chuyển lên backend thật được):
   - config   : RUN_CONFIG (run-config.js)
   - pets     : RAINFOREST_PETS (rainforest-data.js)
   - questions: QuestionProvider { next({runId, exclude}) -> {id, text, options[], correct, ordered?} | null,
                                    recordAnswer(questionId, correct) -> cập nhật mastery (thuật toán chọn câu/ghi nhớ giữ nguyên ở app) ,
                                    learnedCount() -> số câu đủ điều kiện }
   - store    : { read() -> state (bản sao), tx(fn) -> chạy fn(draft) rồi commit nguyên khối (fn ném lỗi thì không commit gì) }
                state = { coins, farmCount, ownedPetIds:{petId:n}, pity, day:{key,count}, runs:{id: run}, newPets:[] (chỉ trong draft) }
   - clock()  : mili-giây đơn điệu (không đổi theo đồng hồ hệ thống) để đo thời gian trả lời · today(): chuỗi ngày cho giới hạn theo ngày
   - rng()    : số ngẫu nhiên [0,1) (production dùng crypto) */
(function (root) {
  class RunError extends Error {
    constructor(code, message, extra) { super(message || code); this.code = code; Object.assign(this, extra || {}); }
  }
  const ERR = {
    RUN_NOT_FOUND: "Không tìm thấy run.", RUN_OVER: "Run đã kết thúc.", TOKEN_INVALID: "Token câu hỏi không hợp lệ.", TOKEN_EXPIRED: "Token câu hỏi đã hết hạn.",
    DUPLICATE_SUBMIT: "Câu này đã được gửi đáp án rồi.", INVALID_CHOICE: "Lựa chọn không thuộc câu hỏi.", BOX_NOT_FOUND: "Không có hộp này.", BOX_PENDING: "Hãy mở hộp trước.",
    NOT_ENOUGH_QUESTIONS: "Chưa đủ câu đã học để chạy.", NOT_PAUSED: "Run không đang tạm dừng.", NO_QUESTION: "Không có câu đang chờ.",
  };

  function createRunServer({ config, pets, questions, store, clock, today, rng, newId }) {
    const C = config;
    const now = clock || (() => (typeof performance !== "undefined" ? performance.now() : Date.now()));
    const dayKey = today || (() => new Date().toISOString().slice(0, 10));
    const rand = rng || (() => Math.random());
    const mkId = newId || ((p) => p + Math.floor(rand() * 2 ** 32).toString(36) + Math.floor(rand() * 2 ** 32).toString(36) + Math.floor(rand() * 2 ** 32).toString(36));
    const petById = new Map(pets.map((p) => [p.id, p]));
    const randInt = (a, b) => a + Math.floor(rand() * (b - a + 1));
    const err = (code, extra) => new RunError(code, ERR[code], extra);

    function weightedPick(items, wOf) {
      const total = items.reduce((s, it) => s + Math.max(0, wOf(it)), 0);
      if (!(total > 0)) return null;
      let r = rand() * total;
      for (const it of items) { r -= Math.max(0, wOf(it)); if (r < 0) return it; }
      return items[items.length - 1];
    }
    const tierOf = (streak) => { let t = C.rarityWeightsByStreakTier[0]; for (const x of C.rarityWeightsByStreakTier) if (streak >= x.minStreak) t = x; return t; };
    const coinFor = (streak) => randInt(C.coinPerCorrect[0], C.coinPerCorrect[1]) * (streak >= C.comboThreshold ? Math.min(streak, C.comboMultCap) : 1);

    /* ---- trạng thái run ---- */
    function getRun(draft, runId) { const r = draft.runs[runId]; if (!r) throw err("RUN_NOT_FOUND"); return r; }
    function log(run, type, payload) { run.events.push({ type, payload, at: now() }); if (run.events.length > 300) run.events.splice(0, run.events.length - 300); }

    function questionPayload(run) {
      const q = run.pending; return { token: q.token, index: q.index, text: q.text, ...(q.textVi ? { textVi: q.textVi } : {}), options: q.options.map((o) => ({ id: o.id, text: o.text, ...(o.vi ? { vi: o.vi } : {}) })), ordered: !!q.ordered, deadlineMs: C.questionTimeMs };
    }
    /* phát câu hỏi kế tiếp; hết câu (kho cạn) thì kết thúc run kiểu "complete" */
    function issueQuestion(draft, run) {
      const q = questions.next({ runId: run.id, exclude: new Set(run.askedIds) });
      if (!q) { finalize(draft, run, "complete"); return null; }
      // server xáo thứ tự lựa chọn (trừ câu có phương án tham chiếu chéo như «A và B» → q.ordered), id lựa chọn ngẫu nhiên mỗi lần, không đoán được theo vị trí
      const idx = q.options.map((_, i) => i);
      if (!q.ordered) for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
      const ids = idx.map(() => mkId("o"));
      run.askedIds.push(q.id);
      const token = mkId("q");
      run.pending = { token, index: run.askedIds.length, qid: q.id, text: q.text, textVi: q.textVi || null, ordered: !!q.ordered,
        options: idx.map((oi, pos) => ({ id: ids[pos], text: q.options[oi], ...(q.optionsVi ? { vi: q.optionsVi[oi] } : {}) })), correctId: ids[idx.indexOf(q.correct)], sentAt: now(), pausedMs: 0, pausedAt: null };
      run.tokens.push(token);
      log(run, "question", { index: run.pending.index, qid: q.id });
      return questionPayload(run);
    }

    /* ---- kết thúc run (tự mở nốt hộp chưa mở để phần thưởng không bị mất) ---- */
    function finalize(draft, run, status) {
      if (run.status !== "active") return;
      for (const b of Object.values(run.boxes)) if (!b.opened) openBoxInner(draft, run, b);
      run.status = status; run.endedAt = now(); run.pending = null;
      log(run, "end", { status, score: run.score, correct: run.correctCount });
    }
    function summary(run) {
      return { runId: run.id, status: run.status, score: run.score, correctCount: run.correctCount, answered: run.answered, coins: run.coins, bestStreak: run.bestStreak,
        pets: run.pets.map((p) => ({ ...p })), shieldsUsed: run.shieldsUsed, boxesOpened: Object.values(run.boxes).filter((b) => b.opened).length };
    }
    /* chạy mỗi lần có người gọi: run im lặng quá ngưỡng thì hết hạn */
    function settleIdle(draft, run) {
      if (run.status === "active" && now() - run.lastActivity > C.runIdleTimeoutMs) finalize(draft, run, "expired");
    }
    function touch(run) { run.lastActivity = now(); }

    /* ---- secret box ---- */
    function rollPet(draft, run, box) {
      const tier = tierOf(box.streak), w = tier.weights;
      let rarity;
      const pity = draft.pity || 0;
      if (pity + 1 >= C.pityLegendary) rarity = "L";
      else rarity = weightedPick(["C", "R", "E", "L"], (r) => w[r] || 0);
      const pool = pets.filter((p) => p.rarity === rarity);
      const pet = weightedPick(pool, (p) => p.weight || 1);
      draft.pity = rarity === "L" ? 0 : pity + 1;
      return pet;
    }
    function openBoxInner(draft, run, box) {
      const day = dayKey();
      if (draft.day.key !== day) draft.day = { key: day, count: 0 };
      const petsOk = run.pets.length < C.maxPetsPerRun && draft.day.count < C.maxPetsPerDay;
      const W = { ...C.boxOutcomeWeights }; if (!petsOk) W.pet = 0;
      const kind = weightedPick(Object.keys(W), (k) => W[k]);
      let result;
      if (kind === "shield") {
        if (run.shield) { run.score += C.shieldOverflowScore; result = { type: "shield", converted: true, scoreDelta: C.shieldOverflowScore }; }
        else { run.shield = true; result = { type: "shield", converted: false }; }
      } else if (kind === "scoreBoost") {
        run.boostLeft = C.scoreBoostQuestions; result = { type: "scoreBoost", questions: C.scoreBoostQuestions, factor: C.scoreBoostFactor };
      } else {
        const pet = rollPet(draft, run, box);
        const owned = (draft.ownedPetIds[pet.id] || 0) > 0, full = draft.farmCount + draft.newPets.length >= (C.maxAnimalsPerMap || 30);
        const toCoin = (C.duplicatePolicy === "coin" && owned) || (full && C.farmFullPolicy === "coin");
        draft.day.count++;
        const rec = { petId: pet.id, rarity: pet.rarity, isNew: !owned };
        if (toCoin) { const coin = C.duplicateCoin[pet.rarity] || 0; draft.coins += coin; run.coins += coin; rec.converted = true; rec.coinDelta = coin; rec.overflow = full; }
        else { const up = { id: mkId("u"), petId: pet.id, acquiredAt: Date.now(), source: "run", runId: run.id }; draft.newPets.push(up); draft.ownedPetIds[pet.id] = (draft.ownedPetIds[pet.id] || 0) + 1; rec.userPetId = up.id; }
        run.pets.push(rec);
        result = { type: "pet", petId: pet.id, rarity: pet.rarity, isNew: !owned, ...(rec.converted ? { converted: true, coinDelta: rec.coinDelta } : { userPetId: rec.userPetId }) };
      }
      box.opened = true; box.result = result;
      log(run, "box", { boxId: box.id, result });
      return result;
    }

    /* lỗi RUN_OVER sau khi settleIdle phải COMMIT việc kết thúc run (không rollback) rồi mới ném ra */
    function guard(fn) { const r = store.tx(fn); if (r && r.__err) throw r.__err; return r; }
    const over = (run) => ({ __err: err("RUN_OVER", { summary: summary(run) }) });

    /* ---- API ---- */
    function start() {
      if (questions.learnedCount() < C.minLearnedQuestions) throw err("NOT_ENOUGH_QUESTIONS", { need: C.minLearnedQuestions, have: questions.learnedCount() });
      return store.tx((draft) => {
        for (const r of Object.values(draft.runs)) if (r.status === "active") finalize(draft, r, "abandoned"); // một tài khoản một run đang chạy
        const run = { id: mkId("r"), status: "active", score: 0, correctCount: 0, answered: 0, coins: 0, streak: 0, bestStreak: 0, shield: false, boostLeft: 0, shieldsUsed: 0,
          correctSinceBox: 0, boxTarget: randInt(C.boxEveryCorrect[0], C.boxEveryCorrect[1]), boxes: {}, pets: [], askedIds: [], tokens: [], usedTokens: {}, pending: null,
          startedAt: Date.now(), endedAt: null, lastActivity: now(), events: [] };
        draft.runs[run.id] = run; log(run, "start", {});
        const firstQuestion = issueQuestion(draft, run);
        if (!firstQuestion) throw err("NOT_ENOUGH_QUESTIONS", { need: C.minLearnedQuestions, have: 0 });
        return { runId: run.id, firstQuestion, shield: run.shield, config: { questionTimeMs: C.questionTimeMs } };
      });
    }

    function answer({ runId, token, choiceId }) {
      const masteryEvents = [];
      const out = guard((draft) => {
        const run = getRun(draft, runId);
        settleIdle(draft, run);
        if (run.status !== "active") return over(run);
        if (run.usedTokens[token]) throw err("DUPLICATE_SUBMIT", { replay: run.usedTokens[token] }); // idempotent: trả lại đúng kết quả cũ, KHÔNG thưởng thêm
        const q = run.pending;
        if (!q || token !== q.token) throw err(run.tokens.includes(token) ? "TOKEN_EXPIRED" : "TOKEN_INVALID");
        if (choiceId != null && !q.options.some((o) => o.id === choiceId)) throw err("INVALID_CHOICE");
        // đồng hồ do server giữ: thời gian trôi từ lúc gửi câu hỏi, trừ phần tạm dừng hợp lệ
        if (q.pausedAt != null) { q.pausedMs += Math.min(now() - q.pausedAt, Math.max(0, C.pauseMaxMs - q.pausedMs)); q.pausedAt = null; }
        const elapsed = now() - q.sentAt - q.pausedMs;
        const late = elapsed > C.questionTimeMs + C.graceMs;
        const correct = !late && choiceId != null && choiceId === q.correctId;
        run.answered++; touch(run);
        masteryEvents.push([q.qid, correct]);
        const res = { correct, timedOut: late || choiceId == null, correctChoiceId: q.correctId /* chỉ lộ SAU khi đã chấm, token đã bị tiêu */, shieldUsed: false, runOver: false, score: 0, coinDelta: 0 };
        let nextQuestion, secretBox;
        run.usedTokens[token] = res; // điền kết quả vào sau (cùng tham chiếu)
        if (correct) {
          run.streak++; run.correctCount++; run.bestStreak = Math.max(run.bestStreak, run.streak);
          const factor = run.boostLeft > 0 ? C.scoreBoostFactor : 1; if (run.boostLeft > 0) run.boostLeft--;
          run.score += C.scorePerCorrect * factor;
          const coin = coinFor(run.streak); draft.coins += coin; run.coins += coin; res.coinDelta = coin;
          run.correctSinceBox++;
          if (run.correctSinceBox >= run.boxTarget) {
            run.correctSinceBox = 0; run.boxTarget = randInt(C.boxEveryCorrect[0], C.boxEveryCorrect[1]);
            const box = { id: mkId("b"), streak: run.streak, opened: false, result: null }; run.boxes[box.id] = box; run.pending = null; secretBox = { boxId: box.id };
          }
        } else {
          run.streak = 0;
          if (run.shield) { run.shield = false; run.shieldsUsed++; res.shieldUsed = true; }
          else { finalize(draft, run, "over"); res.runOver = true; }
        }
        log(run, "answer", { qid: q.qid, correct, late, shieldUsed: res.shieldUsed });
        if (!res.runOver && !secretBox) { nextQuestion = issueQuestion(draft, run); if (run.status !== "active") res.runOver = true; }
        res.score = run.score; res.streak = run.streak; res.shield = run.shield; res.boostLeft = run.boostLeft;
        if (nextQuestion) res.nextQuestion = nextQuestion;
        if (secretBox) res.secretBox = secretBox;
        if (res.runOver) res.summary = summary(run);
        return JSON.parse(JSON.stringify(res)); // bản sao: client sửa kết quả cũng không động tới trạng thái server
      });
      for (const [qid, ok] of masteryEvents) questions.recordAnswer(qid, ok); // timeout/ khiên cứu vẫn tính là SAI
      return out;
    }

    function openBox({ runId, boxId }) {
      return guard((draft) => {
        const run = getRun(draft, runId);
        settleIdle(draft, run);
        const box = run.boxes[boxId]; if (!box) throw err("BOX_NOT_FOUND");
        if (box.opened) { // mở lại: trả đúng kết quả cũ, không bốc lại
          return { result: JSON.parse(JSON.stringify(box.result)), replay: true, ...(run.pending ? { nextQuestion: questionPayload(run) } : {}), runOver: run.status !== "active" };
        }
        if (run.status !== "active") return over(run);
        touch(run);
        const result = openBoxInner(draft, run, box);
        const out = { result: JSON.parse(JSON.stringify(result)), score: run.score, shield: run.shield, boostLeft: run.boostLeft, runOver: false };
        out.nextQuestion = issueQuestion(draft, run); // đồng hồ câu kế tiếp chỉ bắt đầu chạy từ lúc mở hộp
        if (run.status !== "active") { out.runOver = true; out.summary = summary(run); }
        return out;
      });
    }

    function end({ runId }) {
      return store.tx((draft) => {
        const run = getRun(draft, runId);
        settleIdle(draft, run);
        if (run.status === "active") finalize(draft, run, "ended");
        return summary(run);
      });
    }

    function pause({ runId }) {
      return guard((draft) => {
        const run = getRun(draft, runId); settleIdle(draft, run);
        if (run.status !== "active") return over(run);
        if (!run.pending) throw err("NO_QUESTION");
        if (run.pending.pausedAt == null) run.pending.pausedAt = now();
        touch(run); return { paused: true, pauseBudgetMs: Math.max(0, C.pauseMaxMs - run.pending.pausedMs) };
      });
    }
    function resume({ runId }) {
      return guard((draft) => {
        const run = getRun(draft, runId); settleIdle(draft, run);
        if (run.status !== "active") return over(run);
        const q = run.pending; if (!q) throw err("NO_QUESTION"); if (q.pausedAt == null) throw err("NOT_PAUSED");
        const want = now() - q.pausedAt, room = Math.max(0, C.pauseMaxMs - q.pausedMs);
        q.pausedMs += Math.min(want, room); q.pausedAt = null; touch(run);
        if (want > room) { finalize(draft, run, "disconnected"); return { runOver: true, summary: summary(run) }; } // mất mạng quá lâu
        const left = Math.max(0, C.questionTimeMs - (now() - q.sentAt - q.pausedMs));
        return { runOver: false, remainingMs: left };
      });
    }

    function farm() {
      const s = store.read();
      return { mapId: C.mapId, owned: s.ownedPetIds, pity: s.pity || 0, pityMax: C.pityLegendary, dayPets: s.day.key === dayKey() ? s.day.count : 0, maxPetsPerDay: C.maxPetsPerDay,
        slots: { used: s.farmCount, max: C.maxAnimalsPerMap || 30 }, userPets: s.userPets || [] };
    }
        /* dọn run treo khi mở app lại: đồng hồ đơn điệu đã reset theo trang nên mọi run còn «active» đều bị kết thúc (tự mở nốt hộp) — trả danh sách tóm tắt */
    function sweep(all) { return store.tx((draft) => { const out = []; for (const r of Object.values(draft.runs)) if (r.status === "active" && (all || now() - r.lastActivity > C.runIdleTimeoutMs)) { finalize(draft, r, "expired"); out.push(summary(r)); } return out; }); }

    return { start, answer, openBox, end, pause, resume, farm, sweep, RunError, ERR };
  }

  const api = { createRunServer, RunError };
  root.RunServerLib = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
