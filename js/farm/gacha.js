/* ---------- gacha ---------- */
function spriteCv(rows, pal, scale){
  const c = document.createElement("canvas"), w = rows[0].length, h = rows.length, g = c.getContext("2d");
  c.width = w; c.height = h; c.style.width = w * scale + "px"; c.style.height = h * scale + "px"; c.style.imageRendering = "pixelated";
  rows.forEach((r, y) => { for (let x = 0; x < w; x++){ const ch = r[x]; if (ch === ".") continue; const col = (pal && pal[ch]) || PAL[ch]; if (col){ g.fillStyle = col; g.fillRect(x, y, 1, 1); } } });
  return c;
}
const animRows = (k, fr = 0) => { const sp = SPECIES[k]; return mkSprite(sp.W, sp.H, c => sp.draw(c, fr)); };
const CAP_ROWS = Array.from({length: 14}, (_, y) => Array.from({length: 14}, (_, x) => { const d = (x - 6.5) ** 2 + (y - 6.5) ** 2; return d > 42.25 ? "." : d > 31 || y === 6 || y === 7 ? "D" : y < 7 ? (x === 3 && y === 3 ? "w" : "T") : "W"; }).join(""));
const rollRarity = m => { let r = Math.random() * 100, i = 0; for (; i < 3; i++){ if (r < m.rates[i]) break; r -= m.rates[i]; } return i; };
let gT = 0, gAnim = 0, gBadges = [], gCleanup = null;
const gm = $("gModal"), gb = $("gBox");
function closeG(){ clearTimeout(gT); clearInterval(gAnim); if (gCleanup){ const f = gCleanup; gCleanup = null; f(); } gm.classList.add("hidden"); if (gBadges.length){ const b = gBadges; gBadges = []; showBadge(b); } }
gm.addEventListener("click", e => { if (e.target === gm) closeG(); });
addEventListener("keydown", e => { if (e.key === "Escape" && !gm.classList.contains("hidden")) closeG(); });

function pullGacha(mi){
  const m = GACHA[mi];
  if (countMap(m.map) >= MAX_ANIMALS){ toast(`Chuồng đầy rồi (${MAX_ANIMALS} con) — bán bớt một bé nha 🥲`); return; }
  if (S.coins < m.price){ toast("Chưa đủ xu — làm thêm vài câu quiz nha ✦"); return; }
  if (curMap !== m.map) setMap(m.map);
  let rar = rollRarity(m); const cnt = (S.farm.pity[m.id] || 0) + 1;
  if (m.pity){ if (cnt >= m.pity) rar = 3; S.farm.pity[m.id] = rar === 3 ? 0 : cnt; }
  const pool = m.animals.filter(an => an.r === rar), an = pool[Math.floor(Math.random() * pool.length)];
  S.coins -= m.price;
  const isNew = !S.farm.dex[an.k]; S.farm.dex[an.k] = (S.farm.dex[an.k] || 0) + 1;
  const a = newAnimal(an.k); S.farm.animals.push(a); rt(a).sleep = false;
  gBadges = gBadges.concat(checkBadges()); save();
  selectAnimal(a); renderFarmUI();
  farmSay(`${SPECIES[an.k].emoji} ${a.name} (${an.n}) vừa chui ra từ ${m.name}!`);
  showPull(mi, an, isNew);
}
function showPull(mi, an, isNew){
  const m = GACHA[mi], sp = SPECIES[an.k], reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
  clearTimeout(gT); clearInterval(gAnim); gb.className = "gbox";
  const cap = el("div", "gstage gcap"); cap.style.setProperty("--gc", "transparent");
  cap.append(spriteCv(CAP_ROWS, {D: "#4b2b73", T: m.pal.M, W: "#fffdf5"}, 9));
  gb.replaceChildren(cap, el("p", "gnote", "Đang quay…"));
  gm.classList.remove("hidden");
  let done = false;
  const reveal = () => {
    if (done) return; done = true; gb.onclick = null; clearTimeout(gT);
    const rar = an.r, col = RAR_COL[rar];
    const chip = el("span", "grar r" + rar, RAR[rar]); if (rar < 3) chip.style.background = col;
    const stage = el("div", "gstage"); stage.style.setProperty("--gc", col + "66");
    const sc = Math.max(4, Math.min(10, Math.floor(170 / Math.max(an.W, an.H))));
    const cvs = [0, 1].map(f => spriteCv(animRows(an.k, f), sp.pal, sc));
    cvs[0].classList.add("pop"); stage.append(cvs[0]); setTimeout(() => cvs[0].classList.remove("pop"), 700);
    if (sp.anim){ let fl = 0; gAnim = setInterval(() => { fl ^= 1; stage.replaceChildren(cvs[fl]); }, 420); }
    const title = el("h3", "", an.n); if (isNew) title.append(el("span", "gnew", "✦ MỚI"));
    const again = el("button", "btn", `🎰 Quay tiếp · ${vnd(m.price)} xu`);
    again.disabled = S.coins < m.price || countMap(m.map) >= MAX_ANIMALS; again.onclick = () => pullGacha(mi);
    const close = el("button", "btn lav", "Đóng"); close.onclick = closeG;
    const act = el("div", "gact"); act.append(again, close);
    gb.replaceChildren(chip, stage, title, el("p", "gnote", an.note), act);
    gachaSnd(rar);
    const r = stage.getBoundingClientRect(); if (rar) burst(r.left + r.width / 2, r.top + r.height / 2, [0, 10, 20, 36][rar]);
    close.focus({preventScroll: true});
  };
  gb.onclick = () => { if (!done) reveal(); };
  gachaSnd("shake");
  gT = setTimeout(reveal, reduced ? 150 : 1300);
}
function openDex(mi){
  const m = GACHA[mi];
  clearTimeout(gT); clearInterval(gAnim); gb.onclick = null; gb.className = "gbox";
  const rates = el("div", "grates");
  RAR.forEach((n, i) => { const s = el("span", "", `${n} ${String(m.rates[i]).replace(".", ",")}%`); s.style.color = RAR_COL[i]; s.style.borderColor = RAR_COL[i]; rates.append(s); });
  const grid = el("div", "gdex"); let own = 0;
  m.animals.forEach(an => {
    const n = S.farm.dex[an.k] || 0, sp = SPECIES[an.k]; if (n) own++;
    const d = el("div", "gslot" + (n ? "" : " off")); d.style.setProperty("--rc", RAR_COL[an.r]);
    const v = el("div", "gv"); v.append(spriteCv(animRows(an.k, 0), sp.pal, Math.max(2, Math.min(4, Math.floor(56 / an.H), Math.floor(100 / an.W)))));
    d.append(v, el("small", "", RAR[an.r]), el("b", "", n ? an.n : "???"), el("em", "", n ? `${an.note} · quay ${n} lần` : "Chưa sưu tầm"));
    grid.append(d);
  });
  const q = el("button", "btn", `🎰 Quay · ${vnd(m.price)} xu`); q.disabled = S.coins < m.price || countMap(m.map) >= MAX_ANIMALS; q.onclick = () => pullGacha(mi);
  const close = el("button", "btn lav", "Đóng"); close.onclick = closeG;
  const act = el("div", "gact"); act.append(q, close);
  gb.replaceChildren(el("h3", "", `${m.icon} ${m.name}`), el("p", "gnote", `${m.sub} · ${vnd(m.price)} xu / lần · đã sưu tầm ${own}/10`), rates,
    el("p", "gnote", m.pity ? `🛡 Bảo hiểm: chắc chắn ra Huyền Thoại sau tối đa ${m.pity} lần quay (hiện ${S.farm.pity[m.id] || 0}/${m.pity})` : `Trung bình ~${Math.round(100 / m.rates[3])} lần quay để có Huyền Thoại`), grid, act);
  gm.classList.remove("hidden"); close.focus({preventScroll: true});
}
