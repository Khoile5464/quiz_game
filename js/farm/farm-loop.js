const RANGES = {farm: PEN, swim: {y0: 30, y1: 82}, floor: {y0: 97, y1: 106}, top: {y0: 24, y1: 28}};
const rangeOf = a => RANGES[SPECIES[a.t].hab || "farm"];
const mapOfA = a => SPECIES[a.t].map || "farm";
const herd = () => S.farm.animals.filter(a => mapOfA(a) === curMap);
const countMap = k => S.farm.animals.filter(a => mapOfA(a) === k).length;
const penPick = a => { const w = sprOf(a).w, lo = w / 2 + 6, rg = rangeOf(a); return [lo + Math.random() * (FW - 2 * lo), rg.y0 + Math.random() * (rg.y1 - rg.y0)]; };
const rt = a => rtMap[a.id] || (rtMap[a.id] = {x: penPick(a)[0], y: penPick(a)[1], tx: -1, ty: -1, dir: Math.random() < .5 ? -1 : 1, wait: Math.floor(Math.random() * 12), hop: 0, step: 0, sleep: SPECIES[a.t].map !== "ocean" && Math.random() < .4, drag: false, pose: 0, cc: 0, jump: 0});
function addParts(x, y, kind, n, col, o){
  const star = kind === "star", emb = kind === "ember", dot = kind === "dot", spray = kind === "spray", bub = kind === "bub", snow = kind === "snow", note = kind === "note";
  for (let i = 0; i < n; i++) parts.push(Object.assign({x: x + (Math.random() - .5) * 8, y,
    vx: (Math.random() - .5) * (star ? .6 : spray ? .7 : snow ? .4 : 1.2),
    vy: star ? .25 + Math.random() * .35 : emb ? -.15 - Math.random() * .4 : dot ? -.1 - Math.random() * .3 : spray ? -1.1 - Math.random() * .6 : bub ? -.35 - Math.random() * .25 : snow ? .12 + Math.random() * .15 : note ? -.3 - Math.random() * .2 : -.6 - Math.random() * .9,
    g: spray ? .12 : 0, life: spray ? 16 : bub || note ? 24 : snow ? 22 : star ? 16 : emb ? 11 : 10 + Math.floor(Math.random() * 6), kind,
    col: Array.isArray(col) ? col[Math.floor(Math.random() * col.length)] : col}, o));
}
const HEART = [".r.r.", "rrrrr", "rrrrr", ".rrr.", "..r.."];

const hOf = (s, sleep) => sleep ? sleepOf(s).length : s.h;
const sleepOf = s => s.sleep || (s.sleep = s.rows.filter((_, i) => i % 3 !== 1));
const ZZ = ["###", "..#", ".#.", "#..", "###"];
function farmStep(){
  ftick++; if (flash > 0) flash--;
  if (curMap === "ocean") oceanStep();
  for (const a of herd()){
    const m = rt(a), sp = SPECIES[a.t], fx = sp.fx || {}, h = hashOf(a), spd = sp.slow ? (ftick % 3 === 0 ? 1 : 0) : sp.speed;
    if (m.pose > 0) m.pose--;
    if (m.drag){ m.wait = 3; m.hop = 0; }
    else if (m.sleep){
      m.wait = 3; m.hop = 0;
      if (ftick % 14 === a.id.charCodeAt(1) % 14) addParts(m.x + (m.dir > 0 ? 3 : -3), m.y - hOf(sprOf(a), true) - 1, "zzz", 1);
      if (Math.random() < .003) m.sleep = false;
    } else if (m.wait > 0){
      m.wait--;
      if (!m.pose && sp.map !== "ocean" && Math.random() < .0025) m.sleep = true;
      if (fx.idle === "zzz" && ftick % 16 === h % 16) addParts(m.x + (m.dir > 0 ? 3 : -3), m.y - sprOf(a).h - 1, "zzz", 1);
    } else {
      if (m.tx < 0) [m.tx, m.ty] = penPick(a);
      const dx = m.tx - m.x, dy = m.ty - m.y;
      if (Math.abs(dx) <= Math.max(spd, 1) && Math.abs(dy) <= 1){ m.wait = sp.hab === "swim" ? 1 + Math.floor(Math.random() * 8) : 4 + Math.floor(Math.random() * 22); [m.tx, m.ty] = penPick(a); }
      else { if (Math.abs(dx) > spd){ m.x += Math.sign(dx) * spd; m.dir = Math.sign(dx); } if (Math.abs(dy) > 1 && ftick % 2 === 0) m.y += Math.sign(dy); m.step++; }
    }
    const s0 = sprOf(a), lo = s0.w / 2 + 4;
    const rg = rangeOf(a); m.x = Math.min(FW - lo, Math.max(lo, m.x)); m.y = Math.min(rg.y1, Math.max(rg.y0, m.y));
    if (m.hop > 0) m.hop--;
    if (m.jump > 0){ m.jump--; m.wait = Math.max(m.wait, 2); addParts(m.x, m.y - s0.h / 2 - altOf(a), "spray", 2, RAINB, {vy: -.2, g: .05}); }
    if (!m.sleep && !m.drag && (fx.aura || fx.trail || fx.spout)){
      const alt = altOf(a), em = d => addParts(m.x + (Math.random() - .5) * s0.w * .7, m.y - alt - 1 - Math.random() * s0.h, d[0], 1, d[1]);
      if (fx.aura && ftick % fx.aura[2] === h % fx.aura[2]) em(fx.aura);
      if (fx.trail && m.wait === 0 && ftick % 3 === 0) em(fx.trail);
      if (fx.spout && ftick % fx.spout[2] === h % fx.spout[2]) spoutAt(a, fx.spout[3]);
    }
  }
  for (let i = parts.length - 1; i >= 0; i--){ const p = parts[i]; p.x += p.vx; p.y += p.vy; p.vy += p.g || 0; if (--p.life <= 0) parts.splice(i, 1); }
  drawFarm();
}

const discAt = (x, y, rad, col) => { cx.fillStyle = col; for (let dy = -rad; dy <= rad; dy++){ const w = Math.round(Math.sqrt(rad * rad - dy * dy)); cx.fillRect(Math.round(x) - w, Math.round(y) + dy, 2 * w + 1, 1); } };
const colAt = (pal, ch) => (pal && pal[ch]) || PAL[ch];
function spoutAt(a, rainbow){
  const m = rt(a), s = sprOf(a), x = m.x + (m.dir > 0 ? 1 : -1) * s.w * .2;
  addParts(x, m.y - s.h - altOf(a) + 1, "spray", rainbow ? 12 : 8, rainbow ? RAINB : ["#bfe9ff", "#ffffff", "#8fd8ff"]);
}
function paintAnimal(a, R, night){
  const m = rt(a), sp = SPECIES[a.t], s = sprOf(a, frameOf(a)), moving = m.wait === 0, alt = altOf(a), swim = sp.hab === "swim" || sp.hab === "top";
  const pal = sp.hue ? Object.assign({}, s.pal, {[sp.hue]: hslc(ftick * 2.2 + m.cc * 70 + hashOf(a) * 30)}) : s.pal;
  const rowsA = m.sleep ? sleepOf(s) : s.rows, hh = rowsA.length;
  const bob = m.sleep ? 0 : m.hop > 0 ? bobOf(a, m) : swim ? Math.round(Math.sin(ftick / 6 + hashOf(a))) : (moving && m.step % 2 ? -1 : 0);
  const left = Math.round(m.x - s.w / 2), top = Math.round(m.y - hh) + bob - alt, flipV = m.jump > 4 && m.jump < 10;
  if (night && sp.glow){
    const [gc, gx, gy, gr] = sp.glow, hx = left + (m.dir < 0 ? s.w - 1 - gx : gx), hy = top + gy, pu = .75 + .25 * Math.sin(ftick / 5 + hashOf(a));
    cx.globalAlpha = .13 * pu; discAt(hx, hy, gr, gc); cx.globalAlpha = .22 * pu; discAt(hx, hy, Math.round(gr * .55), gc); cx.globalAlpha = 1;
  }
  if (!swim) R(left + 1 + (alt ? 2 : 0), m.y - 1, s.w - 2 - (alt ? 4 : 0), 2, alt ? "rgba(0,0,0,.14)" : "rgba(0,0,0,.2)");
  for (let r = 0; r < hh; r++){
    const row = rowsA[flipV ? hh - 1 - r : r];
    for (let c = 0; c < s.w; c++){
      const ch = row[m.dir < 0 ? s.w - 1 - c : c];
      if (ch !== ".") R(left + c, top + r, 1, 1, colAt(pal, ch));
    }
  }
  if (stageOf(a.f) === 3 && (ftick + a.id.charCodeAt(0)) % 10 < 5){ R(m.x - 1, top - 4, 3, 1, "#ffd84a"); R(m.x, top - 5, 1, 3, "#ffd84a"); }
}
function paintParts(R){
  for (const p of parts){
    if (p.kind === "zzz") ZZ.forEach((row, ry) => [...row].forEach((ch, rx) => { if (ch === "#") R(p.x + rx, p.y + ry, 1, 1, "#e6f4ff"); }));
    else if (p.kind === "heart") HEART.forEach((row, ry) => [...row].forEach((ch, rx) => { if (ch === "r") R(p.x + rx - 2, p.y + ry, 1, 1, "#ff5fa2"); }));
    else if (p.kind === "star"){ const c = p.col || "#fff3a3"; R(p.x, p.y - 1, 1, 3, c); R(p.x - 1, p.y, 3, 1, c); }
    else if (p.kind === "ember") R(p.x, p.y, 1, 2, p.col || "#ff8a3c");
    else if (p.kind === "dot" || p.kind === "spray") R(p.x, p.y, 1, 1, p.col || "#fff");
    else if (p.kind === "snow") R(p.x, p.y, 1, 1, "#ffffff");
    else if (p.kind === "bub"){ R(p.x, p.y, 2, 2, "#d9f6ff"); R(p.x, p.y, 1, 1, "#ffffff"); }
    else if (p.kind === "note"){ const c = p.col || "#ffb3e8"; R(p.x, p.y + 3, 2, 2, c); R(p.x + 1, p.y, 1, 4, c); R(p.x + 1, p.y, 2, 1, c); }
    else R(p.x, p.y, 2, 2, p.kind === "grain" ? "#f2c14e" : "#ffd84a");
  }
}
function drawFarm(){
  if (curMap === "ocean"){ drawOcean(); return; }
  const night = isNight();
  if (!bgCache || bgNight !== night){ bgCache = makeBg(night); bgNight = night; }
  cx.drawImage(bgCache, 0, 0);
  const R = (x, y, w, h, c) => { cx.fillStyle = c; cx.fillRect(Math.round(x), Math.round(y), w, h); };
  for (let i = 0; i < 3; i++){ const x = (i * 71 + ftick * .35) % (FW + 40) - 20, y = 5 + i * 6; cx.globalAlpha = night ? .25 : .9; R(x, y, 14, 3, "#fff"); R(x + 2, y - 2, 8, 2, "#fff"); cx.globalAlpha = 1; }
  for (let i = 0; i < 6; i++) R((i * 37 + ftick * .5) % FW, 48 + (i % 3) * 3, 5, 1, "#bfe6ff");
  const list = herd().sort((p, q) => rt(p).y - rt(q).y);
  for (const a of list) paintAnimal(a, R, night);
  paintParts(R);
  if (night){ cx.fillStyle = "rgba(18,10,70,.3)"; cx.fillRect(0, 0, FW, FH); }
  if (flash > 0){ cx.fillStyle = "rgba(255,226,120," + (flash * .07) + ")"; cx.fillRect(0, 0, FW, FH); }
  drawTags(list);
}
const tagEls = {};
function drawTags(list){
  const box = $("farmTags"), live = new Set();
  for (const a of list){
    if (!a.named) continue;
    live.add(a.id);
    let t = tagEls[a.id];
    if (!t){ t = tagEls[a.id] = el("span", "ftag"); box.append(t); }
    if (t.textContent !== a.name) t.textContent = a.name;
    const m = rt(a), s = sprOf(a), bob = bobOf(a, m);
    t.style.left = (m.x / FW * 100) + "%";
    t.style.top = ((m.y - hOf(s, rt(a).sleep) + bob - 4 - altOf(a)) / FH * 100) + "%";
    t.style.zIndex = Math.round(m.y);
  }
  for (const id in tagEls) if (!live.has(id)){ tagEls[id].remove(); delete tagEls[id]; }
}

let selId = null, sellArm = null, sellT = 0;
function selectAnimal(a){ selId = a.id; $("renameIn").value = a.name; sellArm = null; renderSel(); }
$("renameForm").onsubmit = e => {
  e.preventDefault();
  const a = S.farm.animals.find(x => x.id === selId), name = $("renameIn").value.trim().slice(0, 16);
  if (!a) return;
  if (!name){ a.named = false; save(); farmSay(`${SPECIES[a.t].emoji} Đã bỏ tên hiển thị của ${a.name}`); return; }
  a.name = name; a.named = true; save(); farmSay(`${SPECIES[a.t].emoji} Từ nay bé tên là ${name} ♡`); toast(`Đã đổi tên thành ${name}`);
};
function farmSay(msg){ $("farmInfo").textContent = msg; }
const FARM_HINT = "Làm quiz đúng để kiếm xu → mua con vật hoặc quay 🎰 Gacha → cho ăn cho chúng lớn & mập. Bấm vào con vật để vuốt ve ♡";
const valueOf = a => { const sp = SPECIES[a.t]; return (sp.sell != null ? sp.sell : Math.floor(sp.price * .5)) + Math.floor(sp.feed * a.f * .5); };
const vnd = n => n.toLocaleString("vi-VN");
let ftab = "shop";
try{ if (localStorage.getItem("mln111_ftab") === "gacha") ftab = "gacha"; }catch(e){}
document.querySelectorAll("[data-ft]").forEach(b => b.onclick = () => { ftab = b.dataset.ft; try{localStorage.setItem("mln111_ftab", ftab)}catch(e){} renderFarmUI(); });

