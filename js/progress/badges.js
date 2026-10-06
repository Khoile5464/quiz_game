/* ---------- badges ---------- */
const BADGES = [
  ["first","🌱","Buổi học đầu tiên",()=>S.sessions>=1],
  ["s5","📚","Hoàn thành 5 buổi",()=>S.sessions>=5],
  ["perfect","💯","30/30 hoàn hảo",()=>S.perfect>=1],
  ["combo10","⚡","Combo ×10",()=>S.maxCombo>=10],
  ["combo30","🌈","Combo ×30",()=>S.maxCombo>=30],
  ["streak3","🔥","Học 3 ngày liền",()=>S.streak.count>=3],
  ["streak7","💎","Học 7 ngày liền",()=>S.streak.count>=7],
  ["m50","🌸","Thuộc 50 câu",()=>mastered()>=50],
  ["m100","👑","Thuộc hết bộ câu hỏi",()=>mastered()>=Q.length],
  ["a500","🍓","Trả lời 500 câu",()=>S.answered>=500],
  ["a50","🐾","Trả lời 50 câu",()=>S.answered>=50],
  ["a150","🧋","Trả lời 150 câu",()=>S.answered>=150],
  ["a1000","🏆","Trả lời 1000 câu",()=>S.answered>=1000],
  ["c100","✅","Đúng 100 câu",()=>S.correct>=100],
  ["c300","🎯","Đúng 300 câu",()=>S.correct>=300],
  ["combo3","✨","Combo ×3 đầu tiên",()=>S.maxCombo>=3],
  ["combo5","🚀","Combo ×5",()=>S.maxCombo>=5],
  ["combo20","🌋","Combo ×20",()=>S.maxCombo>=20],
  ["s10","📝","Hoàn thành 10 buổi",()=>S.sessions>=10],
  ["s25","🎓","Hoàn thành 25 buổi",()=>S.sessions>=25],
  ["perfect3","🦄","3 lần hoàn hảo",()=>S.perfect>=3],
  ["streak14","🌙","Học 14 ngày liền",()=>S.streak.count>=14],
  ["m25","🍀","Thuộc 25 câu",()=>mastered()>=25],
  ["m75","🍰","Thuộc 75 câu",()=>mastered()>=75],
  ["farm1","🐥","Có con vật đầu tiên",()=>S.farm.animals.length>=1],
  ["farm6","🐷","Nông trại 6 con",()=>S.farm.animals.length>=6],
  ["fat","🐮","Nuôi một con mập ú",()=>S.farm.animals.some(a=>a.f>=MAXF)],
  ["xp1000","💰","Kiếm tổng 1000 xu",()=>S.xp>=1000],
  ["gacha1","🎰","Quay gacha lần đầu",()=>Object.keys(S.farm.dex).length>=1],
  ["dex10","📖","Sưu tầm 10 loài gacha",()=>Object.keys(S.farm.dex).length>=10],
  ["legend","🌟","Có thú Huyền Thoại",()=>Object.keys(S.farm.dex).some(k=>SPECIES[k]&&SPECIES[k].rar===3)],
  ["best25","🥇","Một buổi đúng ≥25 câu",()=>S.best>=25],
];
function checkBadges(){
  const got = [];
  for (const [id,,,ok] of BADGES) if (!S.badges.includes(id) && ok()) { S.badges.push(id); got.push(id); }
  return got;
}
/* khoe tổng hợp danh hiệu sau buổi 30 câu: phóng to giữa màn hình, bấm nút để tắt */
function showBadge(ids){
  const ov = el("div","brag"), card = el("div","brag-card");
  const close = el("button","btn","Tắt ✕");
  close.onclick = () => ov.remove();
  const grid = el("div","brag-grid");
  ids.forEach((id, i) => {
    const b = BADGES.find(x => x[0] === id), it = el("div","brag-it");
    it.style.animationDelay = (.3 + i * .15) + "s";
    it.append(el("div","ic",b[1]), el("div","",b[2])); grid.append(it);
  });
  card.append(el("div","brag-top",`✦ ${ids.length} DANH HIỆU MỚI ✦`), grid, close);
  ov.append(card); document.body.append(ov);
  try { sfx.ok(); } catch {}
  const r = card.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + 60, 26);
  close.focus({preventScroll:true});
}
/* v0.1.2: danh hiệu mới thêm — điều kiện đã đạt từ trước thì ghi nhận âm thầm, không khoe dồn */
if (S.bv !== 2){ checkBadges(); S.bv = 2; save(); }
function badgeEl(b, off){
  const d = el("div", "badge" + (off ? " off" : ""));
  d.append(el("div","ic",b[1]), el("div","",b[2]));
  return d;
}

