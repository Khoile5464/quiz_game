/* ---------- home ---------- */
function renderHome(){
  checkUnlocks(); renderFarmUI(); farmSay(FARM_HINT); renderBackupHint();

  const m = mastered();
  $("sStreak").textContent = liveStreak();
  $("sMaster").textContent = `${m}/${Q.length}`;
  $("sAcc").textContent = S.answered ? Math.round(S.correct / S.answered * 100) + "%" : "–";
  $("sBest").textContent = S.sessions ? `${S.best}/30` : "–";

  renderScope();
  const done = S.streak.last === today();
  $("todayMsg").textContent = done
    ? "✓ Hôm nay bạn đã học rồi, giỏi quá! Làm thêm 1 lượt để nhớ lâu hơn nha~"
    : liveStreak() ? `Học ngay để giữ chuỗi 🔥 ${liveStreak()} ngày!` : "Bắt đầu chuỗi ngày học đầu tiên nào ✦";

  $("mapCount").textContent = `${m}/${Q.length} câu đã thuộc. Trong phạm vi đang chọn: ${$("todayMsg").dataset.scope}`;
  $("masterBar").style.width = (m / Q.length * 100) + "%";
  const g = $("grid"); g.replaceChildren();
  Q.forEach((q, i) => { const c = el("i"); c.dataset.b = boxOf(q); c.title = `Câu ${i + 1}: ${q.q}`; if (!inScope(q)) c.className = "out"; g.append(c); });

  const weak = Q.filter(q => S.stats[q.id]?.w > 0)
    .map(q => ({q, s: S.stats[q.id]})).sort((x, y) => y.s.w / y.s.n - x.s.w / x.s.n || y.s.w - x.s.w).slice(0, 5);
  if (!weak.length) $("weakList").replaceChildren(el("li", "", "Chưa có câu nào hay sai. Làm một buổi để thấy ở đây nhé ✦"));
  else $("weakList").replaceChildren(...weak.map(({q, s}) => {
    const li = el("li"); li.append(el("span","rate",`sai ${s.w}/${s.n}`), el("span","",q.q)); return li;
  }));

  $("badges").replaceChildren(...BADGES.map(b => badgeEl(b, !S.badges.includes(b[0]))));
}

/* ---------- tab bảng thông tin ---------- */
function setTab(k){
  document.querySelectorAll(".tab").forEach(b => { const on = b.dataset.tab === k; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
  document.querySelectorAll(".tabp").forEach(p => p.classList.toggle("hidden", p.id !== "tp-" + k));
  try{ localStorage.setItem("mln111_tab", k); }catch(e){}
}
document.querySelectorAll(".tab").forEach(b => b.onclick = () => setTab(b.dataset.tab));
try{ const t = localStorage.getItem("mln111_tab"); if (t && document.getElementById("tp-" + t)) setTab(t); }catch(e){}

