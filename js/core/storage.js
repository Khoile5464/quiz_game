/* ---------- storage ---------- */
function fresh(){return {stats:{},xp:0,streak:{count:0,last:""},best:0,sessions:0,answered:0,correct:0,maxCombo:0,perfect:0,badges:[],sound:true}}
const numOf = (v, d = 0) => ((typeof v === "number" || (typeof v === "string" && v.trim() !== "")) && Number.isFinite(+v)) ? +v : d;
/* giải đề đang làm dở: {sc, ids, i, score, combo, maxCombo, xp, wrong:[[id, [đáp án đã chọn]]]} */
function normGiaide(g){
  if (!(g && typeof g === "object" && Array.isArray(g.ids) && g.ids.length)) return null;
  g.ids = g.ids.filter(x => typeof x === "string"); g.sc = typeof g.sc === "string" ? g.sc : "all";
  g.i = Math.min(g.ids.length, Math.max(0, Math.floor(numOf(g.i))));
  for (const k of ["score", "combo", "maxCombo", "xp"]) g[k] = Math.max(0, Math.floor(numOf(g[k])));
  g.wrong = Array.isArray(g.wrong) ? g.wrong.filter(w => Array.isArray(w) && typeof w[0] === "string" && Array.isArray(w[1])) : [];
  return g;
}
/* kho câu sai từ Giải đề: {ids: [id theo thứ tự sai], run: lượt ôn đang làm dở {ids, i, score, combo, maxCombo, xp, wrong}} */
function normOnsai(o, legacyIds){
  o = o && typeof o === "object" && !Array.isArray(o) ? o : {ids: legacyIds};
  o.ids = [...new Set(Array.isArray(o.ids) ? o.ids.filter(x => typeof x === "string") : [])];
  const r = o.run;
  if (r && typeof r === "object" && Array.isArray(r.ids) && r.ids.length){
    r.ids = r.ids.filter(x => typeof x === "string");
    r.i = Math.min(r.ids.length, Math.max(0, Math.floor(numOf(r.i))));
    for (const k of ["score", "combo", "maxCombo", "xp"]) r[k] = Math.max(0, Math.floor(numOf(r[k])));
    r.wrong = Array.isArray(r.wrong) ? r.wrong.filter(w => Array.isArray(w) && typeof w[0] === "string" && Array.isArray(w[1])) : [];
  } else o.run = null;
  return o;
}
/* câu có id cố định (q.id) nhưng từng lưu dưới id băm cũ (q.alt): chuyển tiến trình sang id mới, không mất gì */
function migrateIds(s){
  const map = new Map(ALLQ.filter(q => q.alt).map(q => [q.alt, q.id]));
  if (!map.size) return;
  const mv = id => map.get(id) || id;
  for (const [a, id] of map) if (s.stats[a]){ if (!s.stats[id]) s.stats[id] = s.stats[a]; delete s.stats[a]; }
  for (const k of Object.keys(s)){
    if (!/^(giaide|onsai)/.test(k) || !s[k] || typeof s[k] !== "object") continue;
    const g = s[k];
    if (Array.isArray(g.ids)) g.ids = [...new Set(g.ids.map(mv))];
    if (Array.isArray(g.wrong)) g.wrong = g.wrong.map(w => Array.isArray(w) ? [mv(w[0]), ...w.slice(1)] : w);
    if (g.run && Array.isArray(g.run.ids)){ g.run.ids = [...new Set(g.run.ids.map(mv))]; if (Array.isArray(g.run.wrong)) g.run.wrong = g.run.wrong.map(w => Array.isArray(w) ? [mv(w[0]), ...w.slice(1)] : w); }
  }
}
/* chuẩn hoá mọi dữ liệu lưu cũ/thiếu/hỏng: thêm trường mặc định, bỏ giá trị sai kiểu — KHÔNG đổi KEY để người dùng cũ giữ được tiến trình */
function norm(s){
  s = Object.assign(fresh(), s && typeof s === "object" ? s : {});
  if (!s.stats || typeof s.stats !== "object" || Array.isArray(s.stats)) s.stats = {};
  for (const k of Object.keys(s.stats)){
    const v = s.stats[k];
    if (!v || typeof v !== "object"){ delete s.stats[k]; continue; }
    v.n = Math.max(0, numOf(v.n)); v.w = Math.max(0, numOf(v.w)); v.box = Math.min(5, Math.max(0, Math.floor(numOf(v.box)))); v.lastWrong = !!v.lastWrong;
  }
  for (const k of ["xp", "best", "sessions", "answered", "correct", "maxCombo", "perfect"]) s[k] = Math.max(0, numOf(s[k]));
  s.coins = Math.max(0, Math.floor(numOf(s.coins, s.xp)));
  if (!s.streak || typeof s.streak !== "object") s.streak = {count: 0, last: ""};
  s.streak.count = Math.max(0, numOf(s.streak.count)); if (typeof s.streak.last !== "string") s.streak.last = "";
  if (!Array.isArray(s.badges)) s.badges = [];
  if (!s.farm || typeof s.farm !== "object") s.farm = {};
  if (!Array.isArray(s.farm.animals)) s.farm.animals = [];
  if (!s.farm.dex || typeof s.farm.dex !== "object" || Array.isArray(s.farm.dex)) s.farm.dex = {};
  if (!s.farm.pity || typeof s.farm.pity !== "object" || Array.isArray(s.farm.pity)) s.farm.pity = {};
  if (!s.unl || typeof s.unl !== "object" || Array.isArray(s.unl)) s.unl = {};
  if (!s.temple || typeof s.temple !== "object" || Array.isArray(s.temple)) s.temple = {};
  s.temple.best = Math.max(0, Math.floor(numOf(s.temple.best))); s.temple.runs = Math.max(0, Math.floor(numOf(s.temple.runs)));
  // mỗi môn một giải đề + kho câu sai riêng: MLN111 giữ khoá cũ (giaide, onsai) để không mất tiến trình, môn khác thêm hậu tố (giaide122, onsai122, giaideipr, onsaiipr)
  for (const sfx of ["", "122", "ipr"]){
    s["giaide" + sfx] = normGiaide(s["giaide" + sfx]);
    // dữ liệu cũ chưa có kho (chỉ MLN111): lấy luôn các câu đã sai trong lượt giải đề đang làm dở
    s["onsai" + sfx] = normOnsai(s["onsai" + sfx], !sfx && s.giaide ? s.giaide.wrong.map(w => w[0]) : []);
  }
  if (typeof s.seenNews !== "string") s.seenNews = "";
  // Câu chuyện KTCT (MLN122): {done: {"a3.s1": điểm quiz chốt}, cards: {thẻ Study Guide đã mở: true}, acts: {hồi đã xong: true}}
  const sto = s.story && typeof s.story === "object" && !Array.isArray(s.story) ? s.story : {};
  for (const k of ["done", "cards", "acts"]) if (!sto[k] || typeof sto[k] !== "object" || Array.isArray(sto[k])) sto[k] = {};
  s.story = sto;
  migrateIds(s);
  s.lastBackup = Math.max(0, numOf(s.lastBackup)); s.firstUse = numOf(s.firstUse) > 0 ? numOf(s.firstUse) : Date.now();
  return s;
}
/* dọn danh sách thú (cần SPECIES nên chạy sau khi định nghĩa): bỏ loài không còn, sửa trường thiếu */
function cleanFarm(s){
  const seen = new Set();
  // KHÔNG xoá thú có loài chưa biết (bản cũ/mới hơn của app): cất vào farm.hold, khi loài đó có lại sẽ trả về chuồng
  const known = a => a && typeof a === "object" && typeof a.t === "string" && SPECIES[a.t];
  const all = [...s.farm.animals, ...(Array.isArray(s.farm.hold) ? s.farm.hold : [])];
  s.farm.animals = all.filter(known);
  s.farm.hold = all.filter(a => a && typeof a === "object" && !known(a));
  for (const a of s.farm.animals){
    if (typeof a.id !== "string" || a.id.length < 3 || seen.has(a.id)) a.id = "r" + Math.random().toString(36).slice(2, 8);
    seen.add(a.id);
    a.f = Math.min(MAXF, Math.max(0, Math.floor(numOf(a.f))));
    a.name = typeof a.name === "string" && a.name.trim() ? a.name.slice(0, 16) : NAMES[0];
    a.named = !!a.named; a.voice = !!a.voice; a.vp = Math.min(1.8, Math.max(.6, numOf(a.vp, 1)));
  }
  return s;
}
const normFull = s => cleanFarm(norm(s));
/* QUY TẮC: cập nhật app/môn học KHÔNG được làm mất dữ liệu người dùng.
   - KEY không bao giờ đổi; norm() chỉ thêm trường thiếu, không xoá dữ liệu hợp lệ
   - dữ liệu đọc không được (hỏng) thì giữ nguyên bản gốc ở KEY_corrupt, không để lần lưu sau ghi đè mất
   - mỗi lần lên phiên bản mới, chụp một bản dự phòng nguyên trạng ở KEY_prev trước khi code mới đụng vào
   - id câu hỏi phải ổn định (xem tools/check-data-safety.js) */
const APP_VER = "0.3.34", KEY_PREV = KEY + "_prev", KEY_CORRUPT = KEY + "_corrupt";
function safetyCopy(raw){
  try{
    if (localStorage.getItem("mln111_appver") === APP_VER) return;
    if (raw.length < 1.5e6) localStorage.setItem(KEY_PREV, raw); // quá nặng (nhiều giọng ghi âm) thì bỏ qua để không đầy bộ nhớ
    localStorage.setItem("mln111_appver", APP_VER);
  }catch(e){}
}
function load(){
  let raw = null; try{ raw = localStorage.getItem(KEY); }catch(e){}
  if (raw){
    let s = null; try{ s = JSON.parse(raw); }catch(e){}
    if (s && typeof s === "object" && !Array.isArray(s)){
      safetyCopy(raw);
      try{ return norm(Object.assign(fresh(), s)); }
      catch(e){ // dữ liệu hợp lệ nhưng chuẩn hoá lỗi: KHÔNG được rơi về bản trống, cứu từng phần
        try{ localStorage.setItem(KEY_CORRUPT, raw); }catch(e2){}
        for (const keep of [["stats", "farm", "badges", "streak", "coins", "xp", "best", "answered", "correct", "unl", "temple"], ["stats", "coins", "xp"], ["stats"]]){
          try{ const part = {}; for (const k of keep) if (k in s) part[k] = s[k]; return norm(Object.assign(fresh(), part)); }catch(e3){}
        }
      }
    }
    try{ localStorage.setItem(KEY_CORRUPT, raw); }catch(e){} // đừng để save() sau này ghi đè mất bản gốc
  }
  return norm(fresh());
}
let S = load();
/* giải đề + kho câu sai của môn đang chọn (xem norm): code khác cứ dùng D.giaide / D.onsai như trước */
const slot = base => subject === "111" ? base : base + subject;
const D = {get giaide(){return S[slot("giaide")]}, set giaide(v){S[slot("giaide")] = v}, get onsai(){return S[slot("onsai")]}, set onsai(v){S[slot("onsai")] = v}};
let saveBad = false, saveFailAt = 0;
function save(){
  if (typeof Mirror !== "undefined") Mirror.queue(); // bản sao thứ hai trong IndexedDB (js/core/mirror.js)
  try{ localStorage.setItem(KEY, JSON.stringify(S)); saveBad = false; }
  catch(e){
    try{ localStorage.removeItem(KEY_PREV); localStorage.setItem(KEY, JSON.stringify(S)); saveBad = false; return; }catch(e2){} // nhường chỗ cho tiến trình thật
    saveBad = true; const now = Date.now();
    if (now - saveFailAt > 30000){ saveFailAt = now; try{ toast("⚠️ Không lưu được tiến trình (bộ nhớ trình duyệt đầy hoặc bị chặn). Bấm Sao lưu ngay để giữ dữ liệu!"); }catch(err){} }
  }
}
const st = id => S.stats[id] || (S.stats[id] = {n:0,w:0,box:0,lastWrong:false});

