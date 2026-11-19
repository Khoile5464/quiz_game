/* ---------- «Chạy rừng»: giao diện + luồng chơi (chỉ nói chuyện với server qua RunLocal.RunAPI) ---------- */
const RunUI = (() => {
  const API = RunLocal.RunAPI, CFG = RUN_CONFIG, TIME = CFG.questionTimeMs;
  const root = $("run");
  const X = {};               // các phần tử DOM
  const G = {active: false};  // trạng thái ván hiện tại
  let built = false;

  const mk = (tag, cls, text) => el(tag, cls, text);
  const btn = (label, cls, fn) => { const b = mk("button", "btn " + (cls || ""), label); b.type = "button"; b.onclick = fn; return b; };

  function build(){
    if (built) return; built = true;
    const win = mk("div", "win runwin"), bar = mk("div", "bar");
    bar.innerHTML = '<span class="t pixel">chay_rung.exe</span><span class="dots"><i>_</i><i>□</i><i id="runQuitX" style="cursor:pointer" title="Thoát">×</i></span>';
    const body = mk("div", "body");
    X.intro = mk("div", "rintro"); X.game = mk("div", "rgame hidden"); X.sum = mk("div", "rsum hidden");
    // --- HUD + cảnh + bộ đếm
    const hud = mk("div", "rhud");
    X.score = mk("span", "chip", "⭐ 0"); X.coins = mk("span", "chip", "🪙 0"); X.streak = mk("span", "chip", "🔥 0");
    X.shield = mk("span", "chip rshield hidden", "🛡 khiên"); X.boost = mk("span", "chip rboost hidden", "✨ ×2");
    X.vi = mk("button", "chip hidden", "🇻🇳 Dịch"); X.vi.type = "button"; X.vi.onclick = () => { viOn = !viOn; try{ localStorage.setItem("mln111_vi", viOn ? "1" : "0"); }catch(e){} document.body.classList.toggle("vi-on", viOn); X.vi.classList.toggle("on", viOn); };
    hud.append(X.score, X.coins, X.streak, X.shield, X.boost, X.vi);
    const stage = mk("div", "rstage"); X.cv = mk("canvas"); X.cv.width = 240; X.cv.height = 120; X.cv.setAttribute("aria-label", "Cảnh chạy rừng");
    X.toast = mk("div", "rtoast hidden"); X.over = mk("div", "rover hidden");
    stage.append(X.cv, X.toast, X.over);
    const tm = mk("div", "rtimer"); X.tbar = mk("div", "rtbar"); X.tnum = mk("span", "rtnum", "20"); const track = mk("div", "rtrack"); track.append(X.tbar); tm.append(track, X.tnum);
    X.qcard = mk("div", "rq"); X.qtext = mk("p", "qtext"); X.qvi = mk("p", "qvi vi"); X.opts = mk("div", "opts"); X.qcard.append(X.qtext, X.qvi, X.opts);
    X.net = mk("div", "rnet hidden", "📡 Mất mạng: tạm dừng tại câu này (tối đa 30 giây)");
    X.game.append(hud, stage, tm, X.net, X.qcard);
    body.append(X.intro, X.game, X.sum); win.append(bar, body); root.replaceChildren(win);
    bar.querySelector("#runQuitX").onclick = quit;
    RunScene.init(X.cv);
  }

  /* ---------- màn hình mở đầu ---------- */
  function showIntro(){
    stopTimer(); RunScene.stop();
    X.intro.classList.remove("hidden"); X.game.classList.add("hidden"); X.sum.classList.add("hidden");
    const have = RunLocal.learnedCount(), need = CFG.minLearnedQuestions, pity = (S.farm.pity && S.farm.pity[CFG.mapId]) || 0;
    const rules = mk("ul", "rrules");
    [`⏱ Mỗi câu có ${TIME / 1000} giây: trả lời đúng thì nhảy qua chướng ngại, sai hoặc hết giờ thì vấp ngã.`,
     "🛡 Có khiên thì được vấp 1 lần mà vẫn chạy tiếp (câu đó vẫn tính là sai để ôn lại).",
     `📦 Cứ ${CFG.boxEveryCorrect[0]}–${CFG.boxEveryCorrect[1]} câu đúng có một hộp bí mật: khiên, điểm ×${CFG.scoreBoostFactor}, hoặc một con thú Rừng nhiệt đới.`,
     "🔥 Đúng liên tiếp càng nhiều thì hộp càng dễ ra thú hiếm.",
     (RunLocal.usingFallback() ? "📚 Câu hỏi lấy từ cả môn đang chọn (bạn mới học ít). Có nút 🇻🇳 Dịch nếu môn có bản dịch." : "📚 Câu hỏi lấy từ các câu bạn ĐÃ HỌC (ưu tiên câu hay sai), không có câu mới.")].forEach(t => rules.append(mk("li", "", t)));
    const stats = mk("div", "rstats");
    [["🏆 Kỷ lục", vnd((S.rf && S.rf.best) || 0)], ["🐾 Thú hôm nay", `${rfDayCount()}/${CFG.maxPetsPerDay}`], ["🛡 Bảo hiểm huyền thoại", `${pity}/${CFG.pityLegendary}`], ["🌴 Đã sưu tầm", `${RAINFOREST_PETS.filter(p => S.farm.dex[p.id]).length}/30`]]
      .forEach(([k, v]) => { const d = mk("div", "rstat"); d.append(mk("small", "", k), mk("b", "", v)); stats.append(d); });
    const go = btn("🏃 Bắt đầu chạy", "big-start", startRun); go.disabled = have < need;
    const act = mk("div", "ract"); act.append(go, btn("← Về trang chủ", "lav", leave));
    X.intro.replaceChildren(mk("h2", "rtitle", "🏃 Chạy rừng"), mk("p", "rsub", "Endless Run Quiz · nhận thú Rừng nhiệt đới"), rules, stats,
      have < need ? mk("p", "rwarn", `Cần đã học ≥ ${need} câu của môn này (hiện ${have}). Học thêm vài câu rồi quay lại nhé ✦`) : mk("p", "rsub", RunLocal.usingFallback() ? `Môn này bạn mới học ít nên ván chạy dùng cả câu chưa học (${have} câu) — vừa chơi vừa học ✦` : `Có ${have} câu đã học để ôn trong lúc chạy.`), act);
  }

  /* ---------- vòng đời ván ---------- */
  async function open(){
    build();
    if (typeof run !== "undefined" && run){ toast("Thoát bài đang làm rồi hãy chạy nha ✦"); return; }
    if (RunLocal.learnedCount() < CFG.minLearnedQuestions){ toast(`Cần đã học ≥ ${CFG.minLearnedQuestions} câu để chạy rừng (hiện ${RunLocal.learnedCount()}) ✦`); return; }
    show("run"); showIntro();
  }
  function leave(){ stopTimer(); RunScene.stop(); G.active = false; renderHome(); show("home"); }

  async function startRun(){
    const r = await API.post("/run/start");
    if (!r.ok){ toast(r.error.code === "NOT_ENOUGH_QUESTIONS" ? `Cần đã học ≥ ${r.error.need} câu ✦` : "Không bắt đầu được: " + r.error.message); return; }
    Object.assign(G, {active: true, runId: r.data.runId, busy: false, score: 0, coins: 0, streak: 0, shield: false, boost: 0, q: null, over: false, paused: false});
    X.intro.classList.add("hidden"); X.sum.classList.add("hidden"); X.game.classList.remove("hidden"); X.over.classList.add("hidden");
    document.body.classList.toggle("vi-on", viOn);
    RunScene.reset(isNight()); RunScene.start(); hud();
    present(r.data.firstQuestion);
  }

  function hud(){
    X.score.textContent = "⭐ " + vnd(G.score); X.coins.textContent = "🪙 " + vnd(G.coins); X.streak.textContent = "🔥 " + G.streak;
    X.streak.classList.toggle("hot", G.streak >= 10);
    X.shield.classList.toggle("hidden", !G.shield); X.boost.classList.toggle("hidden", !(G.boost > 0)); X.boost.textContent = `✨ ×${CFG.scoreBoostFactor} (${G.boost})`;
    RunScene.setShield(G.shield); RunScene.setBoost(G.boost > 0);
  }

  /* ---------- câu hỏi + đếm ngược (chỉ hiển thị; server mới là bên đo giờ và chấm) ---------- */
  function present(q){
    G.q = q; G.busy = false; G.issuedAt = performance.now(); G.pausedTotal = 0; G.pauseAt = null; G.autoSent = false;
    X.qtext.textContent = q.text; X.qvi.textContent = q.textVi || ""; X.vi.classList.toggle("hidden", !q.textVi); X.vi.classList.toggle("on", viOn);
    X.opts.replaceChildren(...q.options.map((o, i) => {
      const b = mk("button", "opt"); b.type = "button"; b.dataset.id = o.id;
      const t = mk("span", "ot"); t.append(mk("span", "", o.text)); if (o.vi) t.append(mk("small", "vi", o.vi));
      b.append(mk("span", "k", LETTERS[i]), t); b.onclick = () => pick(o.id); return b;
    }));
    X.qcard.classList.remove("rq-out"); X.over.classList.add("hidden");
    RunScene.spawnObstacle(null, 1.5 + Math.min(.9, G.streak * .03));
    startTimer();
  }
  let timerRaf = 0;
  function startTimer(){ stopTimer(); const tick = () => { timerRaf = requestAnimationFrame(tick); if (G.paused || G.busy) return; const left = TIME - (performance.now() - G.issuedAt - G.pausedTotal); paintTimer(left); if (left <= 0 && !G.autoSent){ G.autoSent = true; pick(null); } }; tick(); }
  function stopTimer(){ cancelAnimationFrame(timerRaf); timerRaf = 0; }
  function paintTimer(left){
    const p = Math.max(0, Math.min(1, left / TIME)); X.tbar.style.width = (p * 100) + "%"; X.tnum.textContent = Math.max(0, Math.ceil(left / 1000));
    const low = left <= 5000; X.tbar.classList.toggle("low", low); X.tnum.classList.toggle("low", low);
  }

  async function pick(choiceId){
    if (G.busy || !G.active) return; G.busy = true; stopTimer();
    X.opts.querySelectorAll(".opt").forEach(b => { b.disabled = true; if (b.dataset.id === choiceId) b.classList.add("sel"); });
    let r = await API.post("/run/answer", {runId: G.runId, token: G.q.token, choiceId});
    if (!r.ok && r.error.code === "DUPLICATE_SUBMIT" && r.error.replay) r = {ok: true, data: r.error.replay};
    if (!r.ok){
      if (r.error.code === "RUN_OVER" && r.error.summary){ finish(r.error.summary); return; }
      toast("Lỗi: " + r.error.message); G.busy = false; endRunSafe(); return;
    }
    const res = r.data;
    // chấm xong: lộ đáp án đúng để học
    X.opts.querySelectorAll(".opt").forEach(b => { if (b.dataset.id === res.correctChoiceId) b.classList.add("right"); else if (b.dataset.id === choiceId) b.classList.add("wrong"); });
    G.score = res.score; G.coins += res.coinDelta; G.streak = res.streak; G.shield = res.shield; G.boost = res.boostLeft; hud();
    if (res.correct){ try{ sfx.ok(); }catch(e){} floatMsg(`+${res.coinDelta} xu`); } else { try{ sfx.bad(); }catch(e){} floatMsg(res.timedOut && choiceId == null ? "⏰ Hết giờ!" : res.shieldUsed ? "🛡 Khiên vỡ!" : "💥 Vấp ngã!"); }
    await RunScene.resolve(res.correct ? "jump" : res.shieldUsed ? "shield" : "fall");
    if (res.shieldUsed) hud();
    if (res.runOver){ finish(res.summary); return; }
    if (res.secretBox){ showBox(res.secretBox.boxId); return; }
    present(res.nextQuestion);
  }
  function floatMsg(t){ X.toast.textContent = t; X.toast.classList.remove("hidden"); X.toast.style.animation = "none"; void X.toast.offsetWidth; X.toast.style.animation = ""; clearTimeout(floatMsg.t); floatMsg.t = setTimeout(() => X.toast.classList.add("hidden"), 1100); }

  /* ---------- hộp bí mật ---------- */
  function showBox(boxId){
    RunScene.dropBox();
    X.qcard.classList.add("rq-out");
    const card = mk("div", "rcard"); card.append(mk("h3", "", "📦 Hộp bí mật!"), mk("p", "", "Bên trong có thể là khiên, điểm ×2 hoặc một con thú Rừng nhiệt đới."));
    const open = btn("✨ Mở hộp", "big-start", async () => {
      open.disabled = true;
      const r = await API.post("/run/box/open", {runId: G.runId, boxId});
      if (!r.ok){ if (r.error.code === "RUN_OVER" && r.error.summary){ finish(r.error.summary); return; } toast("Lỗi: " + r.error.message); open.disabled = false; return; }
      X.over.classList.add("hidden"); RunScene.openBox(() => reveal(r.data));
    });
    card.append(open); X.over.replaceChildren(card); X.over.classList.remove("hidden"); open.focus({preventScroll: true});
  }
  function reveal(d){
    const res = d.result; G.score = d.score != null ? d.score : G.score; G.shield = d.shield != null ? d.shield : G.shield; G.boost = d.boostLeft != null ? d.boostLeft : G.boost;
    if (res.type === "pet" && res.converted) G.coins += res.coinDelta || 0;
    hud();
    const card = mk("div", "rcard");
    if (res.type === "shield") card.append(mk("div", "rbig", "🛡"), mk("h3", "", res.converted ? "Đã có khiên rồi!" : "Khiên bảo vệ!"), mk("p", "", res.converted ? `Khiên thừa được quy đổi thành +${vnd(res.scoreDelta)} điểm.` : "Đỡ cho bạn 1 lần sai hoặc hết giờ."));
    else if (res.type === "scoreBoost") card.append(mk("div", "rbig", "✨"), mk("h3", "", `Điểm ×${res.factor}!`), mk("p", "", `Nhân điểm trong ${res.questions} câu đúng kế tiếp.`));
    else card.append(...petCard(res));
    const cont = btn(d.runOver ? "Xem tổng kết ▶" : "Tiếp tục chạy ▶", "big-start", () => { if (d.runOver) finish(d.summary); else present(d.nextQuestion); });
    const row = mk("div", "ract"); row.append(cont);
    if (res.type === "pet" && res.userPetId) row.append(btn("🌴 Xem trong trang trại", "lav", () => goFarm(res.userPetId)));
    card.append(row); X.over.replaceChildren(card); X.over.classList.remove("hidden"); cont.focus({preventScroll: true});
    if (res.type === "pet"){ try{ gachaSnd(RF_RAR[res.rarity]); }catch(e){} const b = X.over.getBoundingClientRect(); if (RF_RAR[res.rarity]) burst(b.left + b.width / 2, b.top + 90, [0, 10, 20, 36][RF_RAR[res.rarity]]); }
    else { try{ sfx.ok(); }catch(e){} }
  }
  /* card nhận thú: tên, rarity, mới, hoạt ảnh idle */
  function petCard(res, small){
    const sp = SPECIES[res.petId], rr = RF_RAR[res.rarity], col = RAR_COL[rr], pet = RAINFOREST_PETS.find(p => p.id === res.petId);
    const chip = mk("span", "grar r" + rr, RAR[rr]); if (rr < 3) chip.style.background = col;
    const stage = mk("div", "gstage"); stage.style.setProperty("--gc", col + "66");
    const sc = small ? 3 : Math.max(4, Math.min(8, Math.floor(130 / Math.max(sp.W, sp.H)))), cvs = [0, 1].map(f => spriteCv(animRows(res.petId, f), sp.pal, sc));
    stage.append(cvs[0]); let fl = 0; const iv = setInterval(() => { if (!stage.isConnected){ clearInterval(iv); return; } fl ^= 1; stage.replaceChildren(cvs[fl]); }, 420);
    const title = mk("h3", "", pet.name); if (res.isNew) title.append(mk("span", "gnew", "✦ MỚI"));
    const out = [chip, stage, title];
    if (!small) out.push(mk("p", "", res.converted ? `${res.isNew ? "Chuồng đầy" : "Đã có bé này"}: đổi thành +${vnd(res.coinDelta)} xu.` : `${({ground: "Sống ở mặt đất", trunk: "Sống trên thân cây", canopy: "Sống ở tán rừng"})[pet.habitatLayer]} · đã vào trang trại 🌴`));
    return out;
  }
  function goFarm(userPetId){
    const next = () => { leave(); setMap("rainforest"); const a = S.farm.animals.find(x => x.id === userPetId); if (a) selectAnimal(a); $("farmCv").scrollIntoView({behavior: "smooth", block: "center"}); };
    if (G.active){ API.post("/run/end", {runId: G.runId}).then(r => { G.active = false; if (r.ok) wrapUp(r.data); next(); }); } else next();
  }

  /* ---------- kết thúc ---------- */
  function wrapUp(sum){
    if (sum.score > ((S.rf && S.rf.best) || 0)){ S.rf.best = sum.score; }
    if (sum.answered >= 5){ try{ touchStreak(); }catch(e){} }
    const got = (typeof checkBadges === "function") ? checkBadges() : []; save();
    if (got.length && typeof showBadge === "function") setTimeout(() => showBadge(got), 400);
  }
  function finish(sum){
    stopTimer(); G.active = false; G.busy = true;
    wrapUp(sum);
    X.game.classList.add("hidden"); X.sum.classList.remove("hidden"); X.over.classList.add("hidden");
    const why = {over: "Bạn vấp ngã rồi!", ended: "Bạn đã dừng chạy.", expired: "Ván chạy hết hạn do im lặng quá lâu.", disconnected: "Mất mạng quá lâu nên ván kết thúc.", abandoned: "Ván cũ đã đóng.", complete: "Đã hết câu để hỏi, giỏi quá!"}[sum.status] || "Kết thúc ván.";
    const stats = mk("div", "rstats");
    [["⭐ Điểm", vnd(sum.score)], ["✅ Câu đúng", `${sum.correctCount}/${sum.answered}`], ["🔥 Streak dài nhất", sum.bestStreak], ["🪙 Xu nhận", vnd(sum.coins)]].forEach(([k, v]) => { const d = mk("div", "rstat"); d.append(mk("small", "", k), mk("b", "", v)); stats.append(d); });
    const items = mk("div", "ritems");
    items.append(mk("span", "chip", `📦 ${sum.boxesOpened} hộp`), mk("span", "chip", `🛡 ${sum.shieldsUsed} khiên đã dùng`));
    const petsBox = mk("div", "rpets");
    if (sum.pets.length) sum.pets.forEach(p => { const d = mk("div", "rpet"); d.append(...petCard(p, true)); petsBox.append(d); });
    else petsBox.append(mk("p", "rsub", "Lần này chưa ra thú. Đúng liên tiếp càng nhiều, hộp càng dễ ra thú hiếm!"));
    const act = mk("div", "ract");
    const again = btn("🏃 Chạy lại", "big-start", () => { RunLocal.learnedCount() >= CFG.minLearnedQuestions ? startRun() : toast("Chưa đủ câu đã học ✦"); });
    act.append(again);
    if (sum.pets.some(p => p.userPetId)) act.append(btn("🌴 Xem trang trại", "lav", () => goFarm(sum.pets.filter(p => p.userPetId).slice(-1)[0].userPetId)));
    act.append(btn("← Trang chủ", "lav", leave));
    X.sum.replaceChildren(mk("h2", "rtitle", "🏁 Tổng kết"), mk("p", "rsub", why), stats, items, mk("h4", "rfgrp", `Thú nhận được (${sum.pets.length})`), petsBox, act);
    if (sum.score > 0) try{ burst(innerWidth / 2, 200, 24); }catch(e){}
    RunScene.stop();
  }
  async function endRunSafe(){ if (!G.runId) return leave(); const r = await API.post("/run/end", {runId: G.runId}); if (r.ok) finish(r.data); else leave(); }
  async function quit(){
    if (!G.active){ leave(); return; }
    if (!confirm("Dừng chạy? Phần thưởng đã nhận vẫn được giữ.")) return;
    G.busy = true; stopTimer(); await endRunSafe();
  }

  /* ---------- mất mạng giữa run: dừng đồng hồ tại câu hiện tại (tối đa 30 giây) ---------- */
  addEventListener("offline", async () => {
    if (!G.active || G.paused) return; G.paused = true; G.pauseAt = performance.now(); X.net.classList.remove("hidden");
    await API.post("/run/pause", {runId: G.runId});
    clearTimeout(G.netT); G.netT = setTimeout(() => { if (G.paused) resumeNet(); }, CFG.pauseMaxMs + 500);
  });
  addEventListener("online", () => { if (G.active && G.paused) resumeNet(); });
  async function resumeNet(){
    clearTimeout(G.netT); const r = await API.post("/run/resume", {runId: G.runId}); G.paused = false; X.net.classList.add("hidden");
    if (!r.ok){ if (r.error.code === "RUN_OVER" && r.error.summary) finish(r.error.summary); return; }
    if (r.data.runOver){ finish(r.data.summary); return; }
    G.issuedAt = performance.now() - (TIME - r.data.remainingMs); G.pausedTotal = 0;
  }

  addEventListener("keydown", e => {
    if (!G.active || $("run").classList.contains("hidden") || G.busy || e.ctrlKey || e.metaKey || e.altKey) return;
    const i = /^[1-6]$/.test(e.key) ? +e.key - 1 : "abcdef".indexOf(e.key.toLowerCase());
    if (i >= 0 && G.q && G.q.options[i]){ e.preventDefault(); pick(G.q.options[i].id); }
  });
  $("runBtn").onclick = open;
  if (RunLocal.swept.length && RunLocal.swept.some(s => s.pets.length || s.coins)) setTimeout(() => toast("🏃 Ván chạy lần trước đã được kết thúc và giữ phần thưởng ✦"), 1200);
  return {open, get active(){ return G.active; }};
})();
