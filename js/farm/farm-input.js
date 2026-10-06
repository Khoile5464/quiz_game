/* ---------- nông trại: chạm / bế thú + vòng lặp ---------- */
function hitAnimal(px, py){
  for (const a of herd().sort((p, q) => rt(q).y - rt(p).y)){
    const m = rt(a), s = sprOf(a), alt = altOf(a);
    if (px >= m.x - s.w / 2 - 1 && px <= m.x + s.w / 2 + 1 && py >= m.y - s.h - 2 - alt && py <= m.y + 1) return a;
  }
  return null;
}
const fpos = e => { const b = cv.getBoundingClientRect(); return [(e.clientX - b.left) * FW / b.width, (e.clientY - b.top) * FH / b.height]; };
function wakeUp(a){ const m = rt(a); if (!m.sleep) return ""; m.sleep = false; m.wait = 4; addParts(m.x, m.y - sprOf(a).h - 2, "star", 3, "#fff3a3"); return `😳 ${a.name} tỉnh dậy rồi! `; }
function petAnimal(a, px){
  const m = rt(a), s = sprOf(a), sp = SPECIES[a.t], alt = altOf(a), woke = wakeUp(a);
  m.hop = sp.hi ? 6 : 3; addParts(m.x, m.y - s.h - alt, "heart", 3); animalVoice(a);
  if (sp.pose){ m.pose = 14; m.wait = Math.max(m.wait, 14); if (a.t.includes("owl")) m.dir = px >= m.x ? 1 : -1; }
  if (sp.jump && !m.jump){ m.jump = 14; m.wait = Math.max(m.wait, 16); }
  if (sp.hue) m.cc = (m.cc || 0) + 1;
  if (sp.fxTouch === "spout") spoutAt(a, false);
  if (sp.fxTouch === "rainbow"){ spoutAt(a, true); spoutAt(a, true); }
  if (sp.fxTouch === "notes") addParts(m.x + (m.dir > 0 ? 1 : -1) * s.w * .3, m.y - s.h * .8, "note", 6, ["#ffb3e8", "#9ff0ff", "#ffe066"]);
  if (sp.big){ flash = 6; addParts(m.x, m.y - s.h / 2, "star", 14, "#ffe066"); addParts(m.x, m.y - s.h / 2, "ember", 10, "#ff9a3c"); }
  farmSay(`${woke}${sp.emoji} ${a.name} (${sp.label}) — ${STAGE_NAME[stageOf(a.f)]} · đã ăn ${a.f}/${MAXF} bữa`);
  selectAnimal(a); drawFarm();
}
let dragA = null, dragSt = null;
cv.style.touchAction = "none";
cv.addEventListener("pointerdown", e => {
  const [px, py] = fpos(e), a = hitAnimal(px, py); if (!a) return;
  const m = rt(a); dragA = a; dragSt = {x: e.clientX, y: e.clientY, moved: false, px, dx: m.x - px, dy: m.y - py};
  try{ cv.setPointerCapture(e.pointerId); }catch(err){}
});
cv.addEventListener("pointermove", e => {
  if (!dragA) return;
  if (!dragSt.moved){
    if (Math.hypot(e.clientX - dragSt.x, e.clientY - dragSt.y) < 5) return;
    dragSt.moved = true; rt(dragA).drag = true; selectAnimal(dragA);
    farmSay(`${wakeUp(dragA)}✋ Đang bế ${dragA.name} — thả ra để đặt xuống chỗ mới`); try{ animalVoice(dragA); }catch(err){}
  }
  const m = rt(dragA), [px, py] = fpos(e), lo = sprOf(dragA).w / 2 + 4;
  m.x = Math.min(FW - lo, Math.max(lo, px + dragSt.dx)); const rg = rangeOf(dragA); m.y = Math.min(rg.y1, Math.max(rg.y0, py + dragSt.dy));
  drawFarm();
});
function endDrag(e, cancel){
  if (!dragA) return;
  const a = dragA, m = rt(a), ds = dragSt; dragA = null; dragSt = null;
  try{ cv.releasePointerCapture(e.pointerId); }catch(err){}
  if (ds.moved){ m.drag = false; m.tx = -1; m.wait = 8; m.hop = 2; farmSay(`🫳 Đã đặt ${a.name} xuống chỗ mới`); drawFarm(); }
  else if (!cancel) petAnimal(a, ds.px);
}
cv.addEventListener("pointerup", e => endDrag(e, false));
cv.addEventListener("pointercancel", e => endDrag(e, true));
setInterval(() => { if (document.hidden || $("home").classList.contains("hidden")) return; farmStep(); }, 110);

