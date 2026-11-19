/* ---------- «Endless Run Quiz»: lớp nối engine với app (chỉ chạy trong trình duyệt) ----------
   - LocalStore  : adapter lưu vào S (localStorage) theo giao diện store của run-server.js: tx() chạy trên BẢN SAO rồi mới commit nguyên khối
   - QuestionProvider (AppQuestionProvider): nguồn câu hỏi = câu ĐÃ HỌC của môn đang chọn, trộn theo mức ghi nhớ (CONFIG.reviewMixRatio);
       recordAnswer cập nhật mastery ĐÚNG như submit() của quiz (n, w, box, lastWrong) — không viết lại thuật toán chọn câu/ghi nhớ
   - RunAPI      : bề mặt giống REST (post/get trả {ok,data|error}); phần giao diện chỉ nói chuyện qua đây nên đổi sang fetch() backend thật rất gọn
   GIỚI HẠN THÀNH THẬT: app là web tĩnh (localStorage), nên «server» chạy cùng trang với client; người dùng cố tình mở DevTools vẫn sửa được dữ liệu của chính họ.
   Toàn bộ luật (đo giờ, chấm, bốc hộp, pity, giới hạn) đã nằm trong run-server.js, không phụ thuộc DOM, để chuyển lên backend thật mà không viết lại. */
const RunLocal = (() => {
  const dayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const cryptoRng = () => { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] / 4294967296; };
  const clone = o => JSON.parse(JSON.stringify(o));
  const rfAnimals = () => S.farm.animals.filter(a => mapOfA(a) === RUN_CONFIG.mapId);
  const byId = new Map(ALLQ.map(q => [q.id, q]));

  function ensure(){
    if (!S.rf || typeof S.rf !== "object" || Array.isArray(S.rf)) S.rf = {};
    if (!S.rf.runs || typeof S.rf.runs !== "object" || Array.isArray(S.rf.runs)) S.rf.runs = {};
    if (!S.rf.day || typeof S.rf.day !== "object") S.rf.day = {key: "", count: 0};
    S.rf.best = Math.max(0, +S.rf.best || 0);
    if (!S.farm.pity || typeof S.farm.pity !== "object") S.farm.pity = {};
  }
  /* run đã kết thúc chỉ giữ lại tóm tắt gọn (10 gần nhất) để không phình localStorage */
  function prune(runs){
    const done = Object.values(runs).filter(r => r.status !== "active").sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));
    done.slice(10).forEach(r => delete runs[r.id]);
    done.slice(0, 10).forEach(r => { r.events = []; r.usedTokens = {}; r.tokens = []; r.askedIds = r.askedIds.slice(-3); r.pending = null; });
  }
  const store = {
    read(){
      ensure();
      const owned = {}; for (const a of rfAnimals()) owned[a.t] = (owned[a.t] || 0) + 1;
      for (const k of Object.keys(S.farm.dex)) if (SPECIES[k] && SPECIES[k].map === RUN_CONFIG.mapId && !owned[k]) owned[k] = 0; // đã từng có (đã bán): isNew = false cũng hợp lý? giữ 0 để isNew đúng với «đang sở hữu»
      return {coins: S.coins, farmCount: rfAnimals().length, ownedPetIds: owned, pity: S.farm.pity[RUN_CONFIG.mapId] || 0, day: clone(S.rf.day), runs: clone(S.rf.runs),
        userPets: rfAnimals().map(a => ({id: a.id, petId: a.t, nickname: a.name, acquiredAt: a.acquiredAt || 0, source: a.source || "", runId: a.runId || null}))};
    },
    tx(fn){
      const d = this.read(); d.newPets = [];
      const out = fn(d);               // ném lỗi → không commit gì
      S.coins = d.coins; S.farm.pity[RUN_CONFIG.mapId] = d.pity; S.rf.day = d.day; S.rf.runs = d.runs; prune(S.rf.runs);
      for (const p of d.newPets){
        const a = newAnimal(p.petId); a.id = p.id; a.acquiredAt = p.acquiredAt; a.source = p.source; a.runId = p.runId;
        S.farm.animals.push(a); S.farm.dex[p.petId] = (S.farm.dex[p.petId] || 0) + 1;
      }
      save();
      return out;
    },
  };

  /* ----- nguồn câu hỏi: chỉ câu đã học, đáp án đơn ----- */
  const single = q => q.a.length === 1 && q.o.length >= 2;
  const CFG_ = RUN_CONFIG;
  const isLearned = q => (S.stats[q.id]?.n || 0) > 0;
  const learnedPool = () => Q.filter(q => isLearned(q) && single(q));
  const freshPool = () => Q.filter(q => !isLearned(q) && single(q));
  /* Kho ôn quá nhỏ thì cùng vài câu lặp đi lặp lại. Khi số câu đã học < runPoolTarget, trộn thêm câu CHƯA học của môn (tỉ lệ càng cao khi học càng ít);
     đủ câu đã học thì chỉ ôn câu đã học như thiết kế gốc. */
  const usingFallback = () => learnedPool().length < CFG_.runPoolTarget;
  const eligible = () => usingFallback() ? Q.filter(single) : learnedPool();
  const bucketOf = q => { const b = boxOf(q); return b <= 1 ? "weak" : b <= 3 ? "mid" : "strong"; }; // vừa sai / đang nhớ → weak; khá ổn / đã thuộc → mid; rất chắc / master → strong
  /* câu vừa hỏi ở các ván gần đây (qua nhiều ván) được hạ ưu tiên để không gặp lại ngay */
  const recent = () => { ensureRecent(); return S.rf.recent; };
  function ensureRecent(){ if (!S.rf || typeof S.rf !== "object") S.rf = {}; if (!Array.isArray(S.rf.recent)) S.rf.recent = []; }
  let lastId = null;
  const provider = {
    learnedCount: () => eligible().length,
    next({exclude}){
      const learned = learnedPool(), fresh = usingFallback() ? freshPool() : [];
      const all = learned.concat(fresh); if (!all.length) return null;
      const rec = new Set(recent());
      let pool = all.filter(q => !exclude.has(q.id));
      if (!pool.length) pool = all.length > 1 ? all.filter(q => q.id !== lastId) : all; // kho đã hết thì mới lặp lại, chỉ tránh lặp ngay câu vừa hỏi
      const fresher = pool.filter(q => !rec.has(q.id)); if (fresher.length >= 3 || fresher.length === pool.length) pool = fresher.length ? fresher : pool; else if (fresher.length) pool = fresher.concat(pool.filter(q => rec.has(q.id)).slice(0, 2));
      const buckets = {weak: [], mid: [], strong: [], fresh: []};
      for (const q of pool) buckets[isLearned(q) ? bucketOf(q) : "fresh"].push(q);
      const mix = CFG_.reviewMixRatio, learnedN = learned.length;
      const wf = buckets.fresh.length ? Math.max(.35, 1 - learnedN / CFG_.runPoolTarget) : 0; // học càng ít thì câu mới càng nhiều (tối thiểu 35%)
      const W = {weak: (mix.weak || 0) * (1 - wf), mid: (mix.mid || 0) * (1 - wf), strong: (mix.strong || 0) * (1 - wf), fresh: wf};
      let keys = Object.keys(buckets).filter(k => buckets[k].length && W[k] > 0); if (!keys.length) keys = Object.keys(buckets).filter(k => buckets[k].length);
      let r = Math.random() * keys.reduce((t, k) => t + (W[k] || 1), 0), key = keys[keys.length - 1];
      for (const k of keys){ r -= (W[k] || 1); if (r < 0){ key = k; break; } }
      const list = buckets[key], q = list[Math.floor(Math.random() * list.length)]; lastId = q.id;
      ensureRecent(); S.rf.recent.push(q.id); if (S.rf.recent.length > CFG_.runRecentMemory) S.rf.recent.splice(0, S.rf.recent.length - CFG_.runRecentMemory);
      return {id: q.id, text: q.q, options: q.o.slice(), correct: q.a[0], ordered: !!q.f, ...(q.vi ? {textVi: q.vi.q, optionsVi: q.vi.o.slice()} : {})};
    },
    /* giống hệt nhánh cập nhật của submit() trong session.js (khi không phải chế độ «làm lại câu sai») */
    recordAnswer(id, ok){
      const q = byId.get(id); if (!q) return; const s = st(q.id);
      s.n++; S.answered++;
      if (ok){ s.box = Math.min(5, s.box + 1); s.lastWrong = false; S.correct++; }
      else { s.w++; s.box = 0; s.lastWrong = true; }
      save();
    },
  };

  const server = RunServerLib.createRunServer({config: RUN_CONFIG, pets: RAINFOREST_PETS, questions: provider, store, clock: () => performance.now(), today: dayKey, rng: cryptoRng});
  /* mở app lại: run còn treo từ phiên trước bị kết thúc (đồng hồ đơn điệu đã reset theo trang), hộp chưa mở được mở nốt để không mất thưởng */
  let swept = [];
  try{ swept = server.sweep(true); }catch(e){}

  /* ----- bề mặt REST-like ----- */
  const routes = {
    "POST /run/start": () => server.start(),
    "POST /run/answer": b => server.answer(b),
    "POST /run/box/open": b => server.openBox(b),
    "POST /run/end": b => server.end(b),
    "POST /run/pause": b => server.pause(b),
    "POST /run/resume": b => server.resume(b),
    "GET /farm/rainforest": () => server.farm(),
  };
  const RunAPI = {
    async request(method, path, body){
      const h = routes[method + " " + path];
      if (!h) return {ok: false, error: {code: "NOT_FOUND", message: "Không có API này."}};
      try{ return {ok: true, data: h(body || {})}; }
      catch(e){ if (e && e.code) return {ok: false, error: {code: e.code, message: e.message, ...("replay" in e ? {replay: e.replay} : {}), ...("summary" in e ? {summary: e.summary} : {}), ...("need" in e ? {need: e.need, have: e.have} : {})}}; throw e; }
    },
    post(path, body){ return this.request("POST", path, body); },
    get(path){ return this.request("GET", path); },
  };
  return {RunAPI, dayKey, learnedCount: provider.learnedCount, usingFallback, provider, swept, server};
})();
