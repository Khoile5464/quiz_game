/* ---------- nông trại Olympus (pixel 2D) ---------- */
const MAXF = 10, MAX_ANIMALS = 30;
const STAGE_NAME = ["con non", "đang lớn", "trưởng thành", "mập ú ✦"];
const stageOf = f => f >= 10 ? 3 : f >= 6 ? 2 : f >= 3 ? 1 : 0;
const SPECIES = {
  chicken: {label: "Gà con",  emoji: "🐥", price: 30,  feed: 5,  speed: 2},
  pig:     {label: "Heo con", emoji: "🐷", price: 80,  feed: 12, speed: 1},
  cow:     {label: "Bò con",  emoji: "🐮", price: 150, feed: 25, speed: 1},
  dog:     {label: "Chó mặt xệ", emoji: "🐶", price: 2000, feed: 40, speed: 1, unique: true},
};
const PEN = {y0: 80, y1: 97};
/* ---------- gacha: sprite builder ---------- */
function mkSprite(w, h, fn){
  const g = Array.from({length: h}, () => Array(w).fill("."));
  const P = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && x < w && y >= 0 && y < h) g[y][x] = c; };
  const R = (x, y, ww, hh, c) => { for (let j = 0; j < hh; j++) for (let i = 0; i < ww; i++) P(x + i, y + j, c); };
  const E = (cx, cy, rx, ry, c) => { for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++){ const dx = (x - cx) / rx, dy = (y - cy) / ry; if (dx * dx + dy * dy <= 1.02) P(x, y, c); } };
  fn({P, R, E});
  return g.map(r => r.join(""));
}
const RAR = ["Thường", "Hiếm", "Siêu Hiếm", "Huyền Thoại"], RAR_COL = ["#8fa0c8", "#3ba0ff", "#b45cff", "#ffb800"];
const SELL_X = [.25, .5, 1, 2], FEED_X = [.01, .015, .02, .03];

/* các nét vẽ dùng chung */
function owlDraw({P, R, E}, f, o){
  E(6, 8, 4.5, 5, "A"); E(6, 9.5, 3, 3.5, "B"); E(6, 5, 4.4, 3.2, "A");
  P(2, 1, "A"); P(2, 2, "A"); P(3, 2, "A"); P(10, 1, "A"); P(10, 2, "A"); P(9, 2, "A");
  E(4, 5, 2, 2, o.eye || "w"); E(8, 5, 2, 2, o.eye || "w");
  const dx = f === 2 ? 1 : 0; P(4 + dx, 5, "k"); P(8 + dx, 5, "k");
  P(6, 6, "Y"); P(6, 7, "Y"); R(4, 12, 1, 2, "Y"); R(8, 12, 1, 2, "Y"); E(2.5, 9, 1.3, 3, "D"); E(9.5, 9, 1.3, 3, "D");
  if (o.stars) [[5, 9, "w"], [7, 11, "Y"], [6, 13, "w"], [3, 8, "w"], [9, 8, "Y"], [8, 3, "w"]].forEach(([x, y, c], i) => { if ((i + f) % 3 !== 0) P(x, y, c); });
}
function squirrelDraw({P, R, E}, f, o){
  if (o.fire){
    const t = f ? 1 : 0;
    E(3, 6 - t, 3, 5, "o"); E(3, 6 - t, 1.8, 3.6, "y"); P(3, 0 - t, "r"); P(2, 1 - t, "r"); P(4, 1, "o"); E(3, 3, 1, 1.5, "w");
  } else { E(3, 6, 2.8, 5, "A"); E(3.5, 6, 1, 3.5, "B"); P(4, 0, "A"); }
  E(8, 10, 3, 3, "A"); E(9, 10, 1.6, 2, "B"); E(9, 5.5, 2.5, 2.4, "A");
  P(8, 2, "A"); P(8, 3, "A"); P(10, 2, "A"); P(10, 3, "A"); P(10, 5, "k"); P(12, 6, "k");
  if (o.fire){ P(8, 2, "r"); P(10, 2, "r"); }
  R(7, 12, 2, 2, "A"); R(10, 12, 2, 2, "A");
  if (!o.fire){ E(11, 9, 1.3, 1.3, "N"); R(10, 7, 3, 1, "D"); }
}
function deerDraw({P, R, E}, f, o){
  E(7, 11, 5, 3, "A"); R(10, 5, 3, 7, "A"); E(13, 4, 2.4, 2, "A"); E(15, 5.5, 1.3, 1, "B"); P(15, 4, "B");
  P(13, 3, "k"); P(11, 3, "A"); P(10, 3, "A");
  R(12, 0, 1, 2, "E"); P(11, 0, "E"); P(14, 0, "E"); R(14, 1, 1, 1, "E");
  if (o.bloom){ [[11, 0, "P"], [14, 0, "p"], [12, -1, "P"]].forEach(([x, y, c]) => { P(x, y, c); }); P(10, 0, "p"); P(15, 0, "P"); P(12, 0, "w"); }
  [[3, 9], [5, 11], [7, 9], [9, 12], [4, 12], [6, 13]].forEach(([x, y], i) => P(x, y, o.spots === "S" ? ((i + f) % 2 ? "S" : "B") : "B"));
  [3, 5, 9, 11].forEach(x => { R(x, 13, 1, 4, "A"); P(x, 16, "k"); });
  R(0, 9, 2, 2, "A");
}
function foxDraw({P, R, E}, f, o){
  const t = f ? -1 : 0;
  if (o.nine){
    for (let i = 0; i < 9; i++){
      const a = (118 + i * 12 + (f && i % 2 ? 5 : 0)) * Math.PI / 180;
      for (let L = 2; L <= 9; L++) P(9 + Math.cos(a) * L * 1.1, 8 - Math.sin(a) * L * .85, L > 6 ? "l" : (i % 2 ? "L" : "A"));
    }
  } else { E(3, 6 + t, 3.3, 2.4, "A"); E(1, 6 + t, 1.4, 1.2, "B"); }
  E(11, 8, 4.5, 2.4, "A"); E(16, 6, 2.6, 2.3, "A"); R(16, 8, 3, 1, "B"); P(19, 7, "k"); P(16, 5, "k");
  P(14, 3, "A"); P(15, 2, "A"); P(15, 3, "A"); P(17, 3, "A"); P(17, 2, "A");
  if (o.nine) P(17, 3, "L");
  [8, 10, 13, 15].forEach(x => R(x, 10, 1, 2, "D"));
}
function rabbitDraw({P, R, E}, f, o){
  E(6, 9, o.moon ? 4 : 5, 3.4, "A"); R(0, 8, 2, 2, "w");
  E(10, 6, 3, 2.6, "A"); R(8, 0, 2, 5, "A"); R(9, 1, 1, 3, "B"); R(11, 1, 2, 4, "A"); R(12, 2, 1, 2, "B");
  P(11, 6, "k"); P(13, 7, "B");
  if (o.moon){ E(14, 9.5, 2.7, 2.7, "M"); E(15.4, 8.6, 2.2, 2.2, "."); R(10, 9, 3, 2, "A"); }
  else { const d = f ? 1 : 0; R(13, 8 + d, 2, 1, "C"); P(15, 8 + d, "C"); P(15, 7 + d, "G"); P(16, 8 + d, "G"); }
  R(3, 11, 2, 2, "A"); R(8, 11, 2, 2, "A"); R(9, 12, 3, 1, "A");
}

