/* ---------- map «Rừng nhiệt đới»: nền, tầng sống (ground / trunk / canopy), bảng sổ thú ---------- */
RANGES.ground = {y0: 84, y1: 101}; RANGES.trunk = {y0: 58, y1: 78}; RANGES.canopy = {y0: 36, y1: 54};
const RF_HINT = "🌴 Rừng nhiệt đới: thú ở đây chỉ nhận được từ hộp bí mật khi 🏃 Chạy rừng (trả lời đúng liên tiếp càng xa càng dễ ra thú hiếm). Thú sống đúng tầng: mặt đất · thân cây · tán rừng ♡";
let jungleCache = null, jungleNight = null;
const rndJ = (s => () => (s = s * 16807 % 2147483647) / 2147483647)(4242);
const JL_TRUNKS = [[14, 7], [62, 9], [118, 8], [170, 10]], JL_LEAVES = Array.from({length: 46}, () => [rndJ() * FW, rndJ() * 36, 5 + rndJ() * 9]), JL_FERNS = Array.from({length: 30}, () => [rndJ() * FW, 86 + rndJ() * 20]);
const JL_FALL = [];

function makeJungle(night){
  const c = document.createElement("canvas"); c.width = FW; c.height = FH;
  const g = c.getContext("2d");
  const r = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), w, h); };
  const disc = (x, y, rad, col) => { for (let dy = -rad; dy <= rad; dy++){ const w = Math.round(Math.sqrt(rad * rad - dy * dy)); r(x - w, y + dy, 2 * w + 1, 1, col); } };
  const sky = night ? ["#0a1f24", "#0e2a30", "#123438", "#173f3f", "#1c4a44", "#215548"] : ["#7fd6a8", "#6cc99a", "#5dbb8b", "#4fae7c", "#44a070", "#3a9264"];
  sky.forEach((col, i) => r(0, i * 9, FW, 9, col));
  // lớp cây xa (mờ)
  for (let x = 0; x < FW; x++){ const h = 14 + Math.round(8 * Math.sin(x / 17) + 4 * Math.sin(x / 7)); r(x, 62 - h, 1, h + 22, night ? "#14393a" : "#52b080"); }
  for (let x = 0; x < FW; x += 9){ r(x, 38 + (x * 7) % 11, 3, 40, night ? "#103030" : "#3f9a6c"); }
  // thân cây lớn + cành
  JL_TRUNKS.forEach(([x, w], i) => {
    r(x - w / 2, 14, w, 78, night ? "#3a2a22" : "#7a5a3a"); r(x - w / 2, 14, 2, 78, night ? "#2e211b" : "#5f4529"); r(x + w / 2 - 2, 14, 1, 78, night ? "#4a372c" : "#9a7a52");
    for (let y = 20; y < 90; y += 6) r(x - w / 2 + 2, y, w - 4, 1, night ? "#33251e" : "#6b4d31");
    r(x - w / 2 - 6, 70, w + 12, 4, night ? "#3a2a22" : "#7a5a3a");  // rễ
    const dir = i % 2 ? -1 : 1; for (let k = 0; k < 14; k++) r(x + dir * (w / 2 + k * 2), 52 - Math.round(k * .6), 3, 3, night ? "#3a2a22" : "#7a5a3a"); // cành
  });
  // tán lá
  JL_LEAVES.forEach(([x, y, rad], i) => { disc(x, y, rad, night ? (i % 2 ? "#1b5a3a" : "#16482f") : (i % 2 ? "#2f8f4e" : "#3aa65a")); disc(x - 1, y - 2, Math.round(rad * .55), night ? "#237048" : "#5ad07a"); });
  // dây leo
  [[34, 30], [96, 36], [146, 28], [186, 34]].forEach(([x, len]) => { for (let y = 12; y < 12 + len; y++) r(x + Math.round(Math.sin(y / 5) * 1.4), y, 1, 1, night ? "#1f6a3a" : "#2f8a46"); r(x - 1, 12 + len, 3, 2, night ? "#7a2a4a" : "#ff7ac8"); });
  // mặt đất
  r(0, 84, FW, 24, night ? "#1b3a22" : "#4a8a3a"); r(0, 84, FW, 2, night ? "#245030" : "#66ae4e");
  for (let x = 0; x < FW; x += 6) r(x, 90 + (x * 5) % 12, 4, 1, night ? "#15301c" : "#3d7a2e");
  r(0, 98, FW, 10, night ? "#2a2018" : "#6a4a2a"); for (let x = 0; x < FW; x += 5) r(x, 99 + (x * 3) % 6, 3, 1, night ? "#3a2c20" : "#82603a");
  JL_FERNS.forEach(([x, y]) => { for (let i = -3; i <= 3; i++) r(x + i, y - 4 + Math.abs(i), 1, 3 - (Math.abs(i) >> 1), night ? "#2a7a46" : "#4ec06a"); });
  // nấm + hoa lan
  [[40, 96, "#e8434f"], [108, 100, "#ff9a3c"], [156, 97, "#e8434f"]].forEach(([x, y, col]) => { r(x, y - 3, 4, 2, col); r(x + 1, y - 1, 2, 2, "#f4efe8"); });
  [[22, 56], [77, 60], [132, 54], [178, 58]].forEach(([x, y]) => { r(x, y, 3, 3, "#ff7ac8"); r(x + 1, y + 1, 1, 1, "#fff3a3"); });
  return c;
}
let leafT = 0;
function drawJungle(){
  const night = isNight();
  if (!jungleCache || jungleNight !== night){ jungleCache = makeJungle(night); jungleNight = night; }
  cx.drawImage(jungleCache, 0, 0);
  const R = (x, y, w, h, c) => { cx.fillStyle = c; cx.fillRect(Math.round(x), Math.round(y), w, h); };
  // tia nắng xuyên tán lá
  if (!night) for (let i = 0; i < 4; i++){ const x = 24 + i * 48 + Math.sin(ftick / 40 + i) * 4; cx.globalAlpha = .13; for (let k = 0; k < 60; k++) R(x + k * .35, 6 + k, 8, 1, "#fff6b8"); cx.globalAlpha = 1; }
  if (ftick % 40 === 0 && JL_FALL.length < 8) JL_FALL.push({x: Math.random() * FW, y: 6, vx: .2 + Math.random() * .3, s: Math.random() * 6});
  for (let i = JL_FALL.length - 1; i >= 0; i--){ const l = JL_FALL[i]; l.y += .28; l.x += Math.sin(l.y / 6 + l.s) * .25 + l.vx * .2; R(l.x, l.y, 2, 1, night ? "#2a7a46" : "#7ad07a"); if (l.y > 100) JL_FALL.splice(i, 1); }
  const list = herd().sort((p, q) => rt(p).y - rt(q).y);
  for (const a of list) paintAnimal(a, R, night);
  paintParts(R);
  if (night){ cx.fillStyle = "rgba(6,20,30,.28)"; cx.fillRect(0, 0, FW, FH); }
  if (flash > 0){ cx.fillStyle = "rgba(255,226,120," + (flash * .07) + ")"; cx.fillRect(0, 0, FW, FH); }
  drawTags(list);
}

/* ---------- bảng «Chạy rừng» + sổ thú (dùng khung gachaShop của map) ---------- */
const silPal = new Proxy({}, {get: () => "#3a2f55"});
function rfDayCount(){ const d = (S.rf && S.rf.day) || {}; return d.key === RunLocal.dayKey() ? d.count || 0 : 0; }
function renderRainforest(total){
  const learned = typeof RunLocal !== "undefined" ? RunLocal.learnedCount() : 0, need = RUN_CONFIG.minLearnedQuestions;
  const own = RAINFOREST_PETS.filter(p => S.farm.dex[p.id]).length, pity = (S.farm.pity && S.farm.pity.rainforest) || 0;
  const head = el("div", "gcard"); head.style.setProperty("--g1", "#e4ffe8"); head.style.setProperty("--g2", "#c8f5d0");
  const gi = el("div", "gi"); gi.append(el("b", "", "🏃 Chạy rừng"), el("small", "", `${own}/30 đã sưu tầm · thú hôm nay ${rfDayCount()}/${RUN_CONFIG.maxPetsPerDay} · bảo hiểm ${pity}/${RUN_CONFIG.pityLegendary}`));
  const run = el("button", "btn small", "🏃 Chạy ngay"); run.disabled = learned < need; run.title = learned < need ? `Cần đã học ≥ ${need} câu (hiện ${learned})` : "Trả lời đúng liên tiếp, mở hộp bí mật để nhận thú";
  run.onclick = () => { if (typeof RunUI !== "undefined") RunUI.open(); };
  const bt = el("div", "gbtns"); bt.append(run); if (learned < need) bt.append(el("small", "", `Cần học ≥ ${need} câu (hiện ${learned})`));
  head.append(gi, bt);
  const nodes = [head, el("p", "gnote rfnote", total >= MAX_ANIMALS ? "Chuồng Rừng đầy: thú mới sẽ được đổi thành xu. Bán bớt một bé nhé." : "Hộp bí mật ra khiên, tăng điểm hoặc thú. Chạy càng xa (đúng liên tiếp) càng dễ ra thú hiếm.")];
  for (const grp of ["Tầng thấp", "Tán rừng", "Trời rừng"]){
    const grid = el("div", "gdex");
    RAINFOREST_PETS.filter(p => p.group === grp).forEach(p => {
      const n = S.farm.dex[p.id] || 0, sp = SPECIES[p.id], rr = RF_RAR[p.rarity];
      const d = el("div", "gslot" + (n ? "" : " off")); d.style.setProperty("--rc", RAR_COL[rr]);
      const v = el("div", "gv"); v.append(spriteCv(animRows(p.id, 0), n ? sp.pal : silPal, Math.max(2, Math.min(4, Math.floor(56 / sp.H), Math.floor(100 / sp.W)))));
      d.append(v, el("small", "", RAR[rr]), el("b", "", n ? p.name : "???"), el("em", "", n ? `${({ground: "mặt đất", trunk: "thân cây", canopy: "tán rừng"})[p.habitatLayer]} · nhận ${n} lần` : "Chưa sưu tầm"));
      grid.append(d);
    });
    nodes.push(el("h4", "rfgrp", grp), grid);
  }
  const wrap = el("div", "rfpanel"); wrap.append(...nodes); $("gachaShop").replaceChildren(wrap);
}
