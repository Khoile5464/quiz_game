/* ---------- chapter scope ---------- */
const SCOPES = [["c12","Giữa kỳ · Ch.1+2",[1,2]],["c1","Chương 1",[1]],["c2","Chương 2",[2]],["c3","Chương 3",[3]],["c4","Khác (KTCT, CNXH…)",[4]],["c5","🧭 Hành trình DVLS",[5]],["all","Tất cả",null]];
let scope = "c12";
try{const v=localStorage.getItem("mln111_scope");if(SCOPES.some(s=>s[0]===v))scope=v}catch(e){}
const inScope = (q, sc = scope) => { const d = SCOPES.find(s => s[0] === sc)[2]; return !d || d.includes(q.c); };
const pool = () => Q.filter(q => inScope(q));
const learned = q => (S.stats[q.id]?.n || 0) > 0;
const reviewPool = () => Q.filter(q => inScope(q) && learned(q));
const newPool = () => Q.filter(q => inScope(q) && !learned(q));
const templePool = () => Q.filter(learned);
const TEMPLE_SIZE = 100;
const scopeLabel = sc => (SCOPES.find(s => s[0] === sc) || SCOPES[SCOPES.length - 1])[1];
/* giải đề: tiến độ đang lưu (còn câu chưa làm) */
const giaideLeft = () => S.giaide && S.giaide.i < S.giaide.ids.length ? S.giaide : null;
/* ôn câu sai: lượt ôn đang làm dở (còn câu chưa làm) */
const onsaiLeft = () => S.onsai.run && S.onsai.run.i < S.onsai.run.ids.length ? S.onsai.run : null;
function renderScope(){
  $("scopeChips").replaceChildren(...SCOPES.map(([k, label]) => {
    const b = el("button", "chip" + (k === scope ? " on" : ""), label);
    b.append(el("small", "", String(Q.filter(q => inScope(q, k)).length)));
    b.onclick = () => { scope = k; try{localStorage.setItem("mln111_scope", k)}catch(e){} renderHome(); };
    return b;
  }));
  const n = pool().length, m = pool().filter(q => (S.stats[q.id]?.box || 0) >= 3).length;
  const nn = newPool().length;
  $("startBtn").disabled = !nn;
  $("startMain").textContent = nn ? `Bắt đầu ${Math.min(SESSION_SIZE, nn)} câu mới ✦` : "Hết câu mới 🎉";
  $("startSub").textContent = nn ? `còn ${nn} câu chưa học · xu thưởng ×2` : "đã học hết phạm vi này — qua Đền ôn tập nhé";
  const tn = templePool().length;
  $("templeBtn").disabled = !tn;
  $("templeSub").textContent = tn ? `${Math.min(TEMPLE_SIZE, tn)} câu liên tiếp · 🏆 HighScore: ${S.temple.best}` : "học vài câu trước đã";
  $("todayMsg").dataset.scope = `${m}/${n}`;
  const rn = reviewPool().length;
  $("reviewBtn").disabled = !rn;
  $("reviewSub").textContent = rn ? `${Math.min(SESSION_SIZE, rn)} câu đã học · xu cơ bản` : "chưa có câu nào để ôn";
  const g = giaideLeft();
  $("giaideMain").textContent = g ? "📖 Giải đề tiếp" : "📖 Giải đề";
  $("giaideSub").textContent = g ? `câu ${g.i + 1}/${g.ids.length} · ${scopeLabel(g.sc)}` : `${n} câu · kèm trích Study Guide`;
  $("giaideBtn").disabled = !g && !n;
  $("giaideReset").classList.toggle("hidden", !g);
  const qids = new Set(Q.map(q => q.id)); S.onsai.ids = S.onsai.ids.filter(id => qids.has(id)); // bỏ câu đã bị xoá khỏi ngân hàng đề
  const o = onsaiLeft(), on = S.onsai.ids.length; // kho câu sai không theo phạm vi: hiện khi có câu sai từ Giải đề
  $("onsaiBtn").classList.toggle("hidden", !o && !on);
  $("onsaiMain").textContent = o ? "📕 Ôn câu sai tiếp" : "📕 Ôn câu sai";
  $("onsaiSub").textContent = o ? `câu ${o.i + 1}/${o.ids.length} · kho còn ${on} câu` : `${on} câu sai từ Giải đề`;
}
/* học mới: toàn bộ là câu chưa từng làm, xáo ngẫu nhiên */
const pickNew = () => shuffle(newPool()).slice(0, SESSION_SIZE);
/* ôn tập: ưu tiên vừa sai → đang nhớ → khá ổn → đã thuộc → rất chắc → master; cùng mức thì xáo ngẫu nhiên */
const prio = q => { const b = boxOf(q); return b < 0 ? 0 : b; };
const pickReview = () => shuffle(reviewPool()).sort((a, b) => prio(a) - prio(b)).slice(0, SESSION_SIZE);
/* ngôi đền huyền thoại: 100 câu ngẫu nhiên trong các câu đã học (mọi chương) */
const pickTemple = () => shuffle(templePool()).slice(0, TEMPLE_SIZE);
/* giải đề: toàn bộ câu trong phạm vi, đi lần lượt Ch.1 → Ch.2 → Ch.3 → Khác → Hành trình DVLS (Phần I → V); trong mỗi chương/phần xáo ngẫu nhiên */
const pickGiaide = () => shuffle(pool()).sort((a, b) => a.c - b.c || (a.p || 0) - (b.p || 0));
function boxOf(q){const s=S.stats[q.id];if(!s||!s.n)return 0;if(s.lastWrong&&s.box===0)return -1;return s.box}
const mastered = () => Q.filter(q => (S.stats[q.id]?.box || 0) >= 3).length;

