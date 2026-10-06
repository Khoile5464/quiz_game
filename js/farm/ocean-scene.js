/* ---------- map Đại dương Olympus ---------- */
let curMap = "farm";
try{ if (localStorage.getItem("mln111_map") === "ocean") curMap = "ocean"; }catch(e){}
const OCEAN_NEED = 50;
const rndO = (s => () => (s = s * 16807 % 2147483647) / 2147483647)(777);
let oceanCache = null, oceanNight = null;
const oBub = [], OPL = [];
const OCEAN_VENTS = [[30, 88], [100, 94], [152, 96], [64, 100]];
for (let i = 0; i < 24; i++) OPL.push({x: rndO() * FW, y: 14 + rndO() * 74, s: rndO() * 6});

function makeOcean(night){
  const c = document.createElement("canvas"); c.width = FW; c.height = FH;
  const g = c.getContext("2d");
  const r = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), w, h); };
  const ell = (cx, cy, rx, ry, col, half) => { for (let y = Math.floor(cy - ry); y <= (half ? cy : Math.ceil(cy + ry)); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++){ const dx = (x - cx) / rx, dy = (y - cy) / ry; if (dx * dx + dy * dy <= 1.02) r(x, y, 1, 1, col); } };
  const line = (x0, y0, x1, y1, col) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1; for (let i = 0; i <= n; i++) r(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, 1, 1, col); };
  const hs = i => ((i * 2654435761) >>> 0) % 100;
  const FLOOR = 94, sandTop = x => FLOOR + Math.round(2 * Math.sin(x / 9) + 1.5 * Math.sin(x / 4));
  ["#8ff0ff", "#7ce6fa", "#6adaf2", "#58cdea", "#47bfe0", "#38afd4", "#2c9ec8", "#228cba", "#1a7aac", "#15689a", "#115788", "#0e4876", "#0b3b66", "#082f56"].forEach((col, i) => r(0, i * 8, FW, 8, col));
  for (let x = 0; x < FW; x++){ const h = 10 + Math.round(6 * Math.sin(x / 21) + 3 * Math.sin(x / 8)); r(x, 90 - h, 1, h + 12, "#2a8db0"); r(x, 90 - h, 1, 1, "#4aa8c8"); }
  for (let x = 0; x < FW; x++){ const t = sandTop(x); r(x, t, 1, FH - t, "#ecd9a6"); r(x, t, 1, 1, "#f7ecc4"); }
  for (let x = 2; x < FW; x += 7){ r(x, 101 + (x % 3), 4, 1, "#d6c08a"); r(x + 3, 105, 3, 1, "#d6c08a"); }
  [[48, 99, 5], [120, 100, 4], [186, 101, 5]].forEach(([x, y, rad]) => { ell(x, y, rad, rad * .7, "#5b7a8a", 1); r(x - 2, y - 3, 2, 1, "#8fb0c0"); });

  /* tàu cổ Hy Lạp chìm */
  const ship = (x0, yb) => {
    const W = 56;
    for (let i = 0; i < W; i++){
      const u = (i - W / 2) / (W / 2), tilt = (i - W / 2) * .2, broken = i >= 30 && i <= 40 || hs(i) < 8;
      let top = Math.round(yb - 12 - 8 * u * u + tilt + (broken ? 5 : 0)), bot = Math.round(yb + 2 - 7 * Math.abs(u) ** 3 + tilt);
      for (let y = top; y <= bot; y++) r(x0 + i, y, 1, 1, y % 3 === 0 ? "#5e3d22" : "#7a5232");
      if (!broken){ r(x0 + i, top + 2, 1, 2, "#b0452e"); r(x0 + i, top, 1, 1, "#9a6a40"); }
      else if (i % 4 === 0) line(x0 + i, top, x0 + i, top - 5, "#4a2f1a");
      if (hs(i + 50) < 9) r(x0 + i, top + 5 + hs(i) % 4, 1, 1, "#4faa5a");
    }
    const bx = x0 + W - 10, by = Math.round(yb - 12 - 8 * ((W - 10 - W / 2) / (W / 2)) ** 2 + (W - 10 - W / 2) * .2) + 5;
    r(bx - 1, by - 1, 4, 4, "#fffdf5"); r(bx, by, 2, 2, "#2b6fd0"); r(bx, by, 1, 1, "#2b1b3d");
    const mx = x0 + 24, my = Math.round(yb - 12 - 8 * ((24 - W / 2) / (W / 2)) ** 2 + (24 - W / 2) * .2);
    line(mx, my, mx - 8, my - 28, "#6b4a30"); line(mx + 1, my, mx - 7, my - 28, "#6b4a30");
    line(mx - 14, my - 22, mx + 2, my - 25, "#6b4a30");
    for (let i = 0; i < 12; i++){ const h = 9 + hs(i + 7) % 7; r(mx - 13 + i, my - 22 + Math.round(i * .15), 1, h, i === 5 || i === 6 ? "#b0452e" : "#d9ccb0"); }
    line(x0 + 14, Math.round(yb - 6), x0 + 4, Math.round(yb + 8), "#6b4a30"); line(x0 + 20, Math.round(yb - 5), x0 + 12, Math.round(yb + 9), "#6b4a30");
    ell(x0 + 38, yb + 7, 27, 5, "#ecd9a6"); ell(x0 + 8, yb + 8, 12, 4, "#ecd9a6");
    [[x0 + 60, FLOOR + 6], [x0 + 63, FLOOR + 8], [x0 + 58, FLOOR + 9]].forEach(([x, y]) => r(x, y, 2, 1, "#ffd84a"));
    r(x0 + 56, FLOOR - 1, 5, 6, "#c4663a"); r(x0 + 57, FLOOR - 3, 3, 2, "#c4663a"); r(x0 + 56, FLOOR + 1, 5, 1, "#2b1b3d");
  };
  /* san hô */
  const branch = (x, y, col, col2, seed) => {
    let s = seed; const rr = () => (s = s * 16807 % 2147483647) / 2147483647;
    const grow = (bx, by, len, ang, d) => {
      const ex = bx + Math.cos(ang) * len, ey = by - Math.sin(ang) * len; line(bx, by, ex, ey, d > 1 ? col : col2);
      if (d > 0){ grow(ex, ey, len * .72, ang + .5 + rr() * .3, d - 1); grow(ex, ey, len * .72, ang - .5 - rr() * .3, d - 1); if (d > 1) grow(ex, ey, len * .6, ang + (rr() - .5) * .3, d - 1); }
      else r(ex, ey, 1, 1, "#fff3c0");
    };
    r(x - 1, y - 4, 3, 5, col); grow(x, y - 4, 9, Math.PI / 2, 3);
  };
  const brain = (x, y, rx, ry, col, dk) => {
    ell(x, y, rx, ry, col, 1);
    for (let yy = y - ry; yy <= y; yy++) for (let xx = x - rx; xx <= x + rx; xx++) if (((xx - x) / rx) ** 2 + ((yy - y) / ry) ** 2 <= .9 && Math.sin(xx * 1.1 + Math.sin(yy * 1.3) * 2) + Math.cos(yy * 2.1) > 1.05) r(xx, yy, 1, 1, dk);
    r(x - rx + 2, y - ry + 1, 2, 1, "#fff3c0");
  };
  const fan = (x, y, L, col, col2) => {
    for (let a = -70; a <= 70; a += 4){ const ar = a * Math.PI / 180; line(x, y, x + Math.sin(ar) * L, y - Math.cos(ar) * L, col); }
    for (let q = 4; q < L; q += 3) for (let a = -70; a <= 70; a += 3){ const ar = a * Math.PI / 180; r(x + Math.sin(ar) * q, y - Math.cos(ar) * q, 1, 1, col2); }
    r(x - 1, y - 3, 3, 4, col);
  };
  const tubes = (x, y, cols, dark) => {
    [[0, 12, 4], [4, 17, 5], [9, 10, 4], [13, 14, 4], [17, 9, 3]].forEach(([dx, h, w], i) => {
      r(x + dx, y - h, w, h, cols[i % cols.length]); r(x + dx + w - 1, y - h, 1, h, "rgba(0,0,0,.18)"); r(x + dx, y - h + 1, 1, h - 1, "rgba(255,255,255,.3)");
      ell(x + dx + (w - 1) / 2, y - h, w / 2, 1, dark);
    });
  };
  /* tượng thần biển dễ thương */
  const statue = (cx, yb) => {
    const S1 = "#9db4c0", S2 = "#7f98a6", S3 = "#c4d6de", GOLD = "#d9b24a", MOS = "#5aa86a";
    r(cx + 12, yb - 48, 2, 41, "#c9a74a"); r(cx + 9, yb - 53, 1, 6, GOLD); r(cx + 12, yb - 55, 2, 8, GOLD); r(cx + 16, yb - 53, 1, 6, GOLD); r(cx + 9, yb - 47, 8, 2, GOLD);
    r(cx - 13, yb - 6, 26, 6, S2); r(cx - 12, yb - 9, 24, 3, S1); r(cx - 13, yb - 6, 26, 1, S3);
    for (let k = 0; k < 5; k++){ r(cx - 10 + k * 5, yb - 4, 3, 1, "#6a8494"); r(cx - 10 + k * 5, yb - 4, 1, 3, "#6a8494"); }
    ell(cx, yb - 16, 7, 8, S1); r(cx + 2, yb - 22, 5, 13, S2); ell(cx - 8, yb - 16, 2, 5, S1); ell(cx + 9, yb - 20, 2, 4, S1);
    for (let k = 0; k < 3; k++) r(cx - 4 + k * 3, yb - 14 + (k % 2), 2, 1, S2);
    ell(cx, yb - 31, 8, 8, S3); ell(cx, yb - 37, 8, 3, S1);
    r(cx - 6, yb - 41, 12, 2, GOLD); r(cx - 5, yb - 44, 2, 3, GOLD); r(cx - 1, yb - 46, 2, 5, GOLD); r(cx + 3, yb - 44, 2, 3, GOLD);
    ell(cx, yb - 24, 7, 5, S1); r(cx - 3, yb - 25, 1, 3, S2); r(cx + 2, yb - 25, 1, 3, S2); r(cx - 1, yb - 22, 2, 3, S2);
    r(cx - 5, yb - 28, 4, 1, S1); r(cx + 1, yb - 28, 4, 1, S1);
    r(cx - 4, yb - 33, 2, 3, "#2b3a4a"); r(cx + 2, yb - 33, 2, 3, "#2b3a4a"); r(cx - 4, yb - 33, 1, 1, "#fff"); r(cx + 2, yb - 33, 1, 1, "#fff");
    r(cx - 7, yb - 29, 2, 1, "#f0a0b0"); r(cx + 5, yb - 29, 2, 1, "#f0a0b0"); r(cx - 1, yb - 31, 2, 2, S2);
    [[-6, -36], [4, -38], [-9, -19], [7, -9], [-11, -8], [10, -14]].forEach(([dx, dy]) => { r(cx + dx, yb + dy, 2, 1, MOS); r(cx + dx, yb + dy + 1, 1, 1, MOS); });
    r(cx - 15, yb - 2, 3, 2, "#e8a0b0"); r(cx + 13, yb - 3, 2, 3, "#ffd8a0");
  };

  ship(2, FLOOR + 3);
  tubes(70, FLOOR + 6, ["#ffd84a", "#ff7a9a", "#ffb03a"], "#6a1f3a");
  branch(94, FLOOR + 5, "#ff8a3c", "#ffc06a", 11);
  brain(114, FLOOR + 6, 10, 7, "#e8a85a", "#a8702c");
  fan(129, FLOOR + 4, 14, "#9b3fd0", "#d9a0ff");
  statue(152, FLOOR + 3);
  branch(181, FLOOR + 6, "#ff6f9a", "#ffb0c8", 23);
  fan(190, FLOOR + 7, 11, "#d03f8a", "#ffa0d0");
  brain(40, 103, 6, 4, "#f0c070", "#b08038"); tubes(98, 106, ["#ff7a9a", "#ffd84a"], "#6a1f3a"); branch(150, 106, "#ffa05a", "#ffd09a", 41);
  r(76, 103, 3, 1, "#ff8a5a"); r(77, 102, 1, 3, "#ff8a5a");
  if (night){ g.fillStyle = "rgba(4,8,44,.5)"; g.fillRect(0, 0, FW, FH); }
  return c;
}

function oceanStep(){
  if (Math.random() < .3){ const v = OCEAN_VENTS[Math.floor(Math.random() * OCEAN_VENTS.length)]; oBub.push({x: v[0] + Math.random() * 4, y: v[1], s: 1 + Math.floor(Math.random() * 3), ph: Math.random() * 6}); }
  for (let i = oBub.length - 1; i >= 0; i--){ const b = oBub[i]; b.y -= .45 + b.s * .12; b.x += Math.sin(ftick / 5 + b.ph) * .25; if (b.y < 9) oBub.splice(i, 1); }
}

function drawOcean(){
  const night = isNight();
  if (!oceanCache || oceanNight !== night){ oceanCache = makeOcean(night); oceanNight = night; }
  cx.drawImage(oceanCache, 0, 0);
  const olist = herd().sort((p, q) => rt(p).y - rt(q).y);
  const R = (x, y, w, h, c) => { cx.fillStyle = c; cx.fillRect(Math.round(x), Math.round(y), w, h); };
  const disc = (x, y, rad, col) => { cx.fillStyle = col; for (let dy = -rad; dy <= rad; dy++){ const w = Math.round(Math.sqrt(rad * rad - dy * dy)); cx.fillRect(Math.round(x) - w, Math.round(y) + dy, 2 * w + 1, 1); } };
  /* tia nắng (hoặc ánh trăng) xuyên mặt nước */
  [[18, 9, 0], [52, 7, 1.3], [92, 10, 2.1], [128, 8, 3.4], [160, 9, 4.2], [188, 7, 5.1]].forEach(([x0, w, ph]) => {
    const dr = x0 + 6 * Math.sin(ftick / 45 + ph), a = (night ? .06 : .14) * (.7 + .3 * Math.sin(ftick / 20 + ph * 2));
    cx.fillStyle = night ? "#a8c0ff" : "#fff9c4";
    for (let y = 8; y < 92; y++){ cx.globalAlpha = a * (1 - (y - 8) / 100); cx.fillRect(Math.round(dr + (y - 8) * .42), y, Math.round(w + (y - 8) * .14), 1); }
  });
  cx.globalAlpha = 1;
  /* rong biển đung đưa */
  [[66, 97, 30], [90, 98, 26], [126, 97, 34], [174, 99, 28], [188, 98, 32]].forEach(([bx, by, H]) => {
    for (let k = 0; k < H; k += 2){ const x = bx + Math.round(Math.sin(ftick / 7 + k / 5 + bx) * 2.4 * (k / H)); R(x, by - k, 2, 2, night ? (k % 4 ? "#14543a" : "#1d6f4e") : (k % 4 ? "#2fa05a" : "#43bf70")); }
  });
  /* hạt phù du + ánh vàng trên tàu */
  cx.globalAlpha = night ? .75 : .5;
  for (const p of OPL) R((p.x + ftick * .08) % FW, p.y + Math.sin(ftick / 15 + p.s) * 2, 1, 1, night ? "#9ff0ff" : "#eaffff");
  cx.globalAlpha = 1;
  [[63, 100], [66, 102], [60, 103]].forEach(([x, y], i) => { if ((ftick + i * 5) % 24 < 3) R(x, y - 1, 1, 3, "#fff6b0"); });
  if (night){ cx.globalAlpha = .55 + .25 * Math.sin(ftick / 8); R(148, 65, 2, 3, "#aef6ff"); R(154, 65, 2, 3, "#aef6ff"); cx.globalAlpha = 1; }
  for (const a of olist) paintAnimal(a, R, night);
  paintParts(R);
  /* bong bóng */
  for (const b of oBub){
    const x = Math.round(b.x), y = Math.round(b.y), col = night ? "#bfe9ff" : "#eaffff";
    cx.globalAlpha = .85;
    if (b.s === 1) R(x, y, 1, 1, col);
    else if (b.s === 2){ R(x, y, 3, 1, col); R(x, y + 2, 3, 1, col); R(x, y + 1, 1, 1, col); R(x + 2, y + 1, 1, 1, col); R(x + 1, y + 1, 1, 1, "#ffffff"); }
    else { R(x + 1, y, 3, 1, col); R(x + 1, y + 4, 3, 1, col); R(x, y + 1, 1, 3, col); R(x + 4, y + 1, 1, 3, col); R(x + 1, y + 1, 1, 1, "#ffffff"); }
    cx.globalAlpha = 1;
  }
  /* mặt nước trên cùng + bóng nước */
  for (let y = 0; y < 10; y++){ cx.globalAlpha = .85 - y * .08; R(0, y, FW, 1, night ? "#3a4fa0" : "#effffe"); }
  cx.globalAlpha = 1;
  for (let x = 0; x < FW; x++){
    const wy = 5 + Math.round(1.5 * Math.sin(x / 5 + ftick / 4) + Math.sin(x / 12 - ftick / 7));
    R(x, wy, 1, 1, night ? "#a8c4ff" : "#ffffff"); cx.globalAlpha = .5; R(x, wy + 1, 1, 1, night ? "#6a8ad8" : "#bff6ff"); cx.globalAlpha = 1;
  }
  for (let k = 0; k < 9; k++) R((k * 29 + ftick * 1.3) % FW, 1 + (k * 7) % 5, 2, 1, night ? "#cfe0ff" : "#ffffff");
  [[5, 40, 0], [6, 105, 2], [4, 155, 4]].forEach(([rad, x0, ph]) => {
    const x = (x0 + ftick * .12) % (FW + 20) - 10, y = 14 + 2 * Math.sin(ftick / 10 + ph);
    cx.globalAlpha = .18; disc(x, y, rad, "#ffffff"); cx.globalAlpha = .6;
    for (let a = 0; a < 360; a += 30) R(x + Math.cos(a * Math.PI / 180) * rad, y + Math.sin(a * Math.PI / 180) * rad, 1, 1, "#ffffff");
    cx.globalAlpha = .95; R(x - rad + 2, y - rad + 2, 2, 1, "#ffffff"); R(x - rad + 2, y - rad + 3, 1, 1, "#ffffff"); cx.globalAlpha = 1;
  });
  if (night){ cx.globalAlpha = .4; cx.fillStyle = "#cfe0ff"; for (let k = 0; k < 5; k++) cx.fillRect(150 + ((k * 13 + ftick) % 24), 2 + k % 3, 3, 1); cx.globalAlpha = 1; }
  drawTags(olist);
}

