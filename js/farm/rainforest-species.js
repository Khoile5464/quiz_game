/* ---------- map «Rừng nhiệt đới»: 30 thú pixel (đăng ký vào SPECIES) ----------
   Nguồn dữ liệu (tên, rarity, tầng) ở js/run/rainforest-data.js; file này chỉ thêm hình vẽ + thuộc tính hiển thị.
   Thú KHÔNG bán trong cửa hàng và KHÔNG có gacha: chỉ nhận từ hộp bí mật của «Chạy rừng». Cần nạp sau gacha-ocean.js (mkSprite, SPECIES) và trước farm-scene.js (cleanFarm) */

/* ----- các khuôn vẽ dùng chung (nhìn nghiêng, quay sang phải) ----- */
function rfBird({P, R, E}, f, o){
  const L = o.tail || 3, bx = L + 5, by = o.by || 7, br = o.br || 5, bh = o.bh || 3.6, hr = o.hr || 2.6;
  for (let i = 0; i < L; i++) R(bx - br + 1 - i, by + 1 + (o.drop ? (i >> 1) : 0), 1, o.tw || 2, o.tailCol || "A");
  if (o.streamer) for (let i = 0; i < o.streamer; i++){ P(bx - br - i, by + 3 + (i >> 1), "D"); P(bx - br - i, by + 4 + (i >> 1) + (f && i % 2 ? 1 : 0), "D"); }
  E(bx, by, br, bh, "A"); E(bx + 1, by + bh * .45, br * .68, bh * .55, "B");
  const hx = bx + br - 0.5, hy = by - bh + 0.5;
  E(hx, hy, hr, hr * .95, o.headCol || "A");
  if (o.crest) for (let i = 0; i < o.crest; i++){ P(hx - 1 + i, hy - hr - 0.5, "D"); P(hx - 1 + i, hy - hr - 1.5 - (i % 2), "D"); }
  if (o.cap) E(hx - 0.5, hy - hr * .6, hr * .9, hr * .5, "D");
  if (o.ring) E(hx + 1, hy - .3, 1.5, 1.5, "w");
  P(Math.round(hx + 1), Math.round(hy - 0.5), "k");
  const bl = o.beak || 2, bhh = o.beakH || 1, bxs = Math.round(hx + hr - 0.5), bys = Math.round(hy);
  R(bxs, bys, bl, bhh, o.beakCol || "C"); if (o.beakTip) R(bxs + bl - 1, bys, 1, bhh, o.beakTip);
  if (o.hook) P(bxs + bl - 1, bys + bhh, o.beakCol || "C");
  if (o.casque) R(bxs - 1, bys - 2, bl - 1, 2, "C");
  const wy = f ? by - 2.5 : by + 0.4;
  E(bx - 1, wy, o.wr || 3.4, o.wh || 1.7, "W"); if (o.wtip) P(Math.round(bx - 1 - (o.wr || 3.4)), Math.round(wy + (f ? 0 : 1)), o.wtip);
  if (!o.noLegs){ R(bx - 1, by + bh, 1, 2, "C"); R(bx + 2, by + bh, 1, 2, "C"); }
}
function rfFrog({P, R, E}, f, o){
  E(6.5, 6, 5.2, 3, "A"); E(8, 6.6, 3.4, 1.7, "B"); E(10, 4.5, 2.6, 2.1, "A");
  E(8.6, 2.6, 1.3, 1.3, o.eye || "w"); E(11.4, 2.6, 1.3, 1.3, o.eye || "w"); P(9, 2, "k"); P(12, 2, "k");
  E(3.2, 7.5, 2.6, 1.8, "A"); R(1, 8, 4, 1, "A"); R(3, 9, 4, 1, "C"); R(9, 8, 3, 1, "A"); R(11, 9, 3, 1, "C");
  if (o.spots) for (let i = 0; i < 6; i++) P(3 + (i * 7) % 8, 4 + (i * 3) % 4, o.spots);
  if (o.stripe) { R(4, 4, 6, 1, o.stripe); R(2, 6, 3, 1, o.stripe); }
  if (f) E(11.3, 6.2, 1.2, 1, "B");
}
function rfMonkey({P, R, E}, f, o){
  const tl = o.tail == null ? 7 : o.tail;
  for (let i = 0; i < tl; i++) P(5 - (i < 3 ? i : 3) , 11 - i + (i > 2 ? 0 : 0) , "D");
  if (tl) { for (let i = 0; i < tl; i++) P(3 - Math.min(i, 3) + (i > 3 ? i - 3 : 0), 12 - Math.min(i, 5) - (i > 3 ? i - 3 : 0), o.tailCol || "A"); }
  E(8, 11, 3.6, 4.2, "A"); E(9, 11.5, 2.2, 3, "B");
  if (o.mane) { E(9.5, 5.5, 4.6, 4.4, "D"); }
  E(9.5, 5.5, 3, 2.8, "A"); E(10.6, 6.2, 2, 1.7, o.face || "B");
  if (!o.mane) { P(7, 4, "A"); P(7, 5, "B"); }
  P(10, 5, "k"); P(12, 5, "k");
  const sw = f ? 1 : 0;
  R(11, 9 + sw, 3, 1, o.hand || "A"); P(14, 9 + sw, o.hand || "A");
  R(5, 14, 3, 2, o.foot || "A"); R(10, 14, 3, 2, o.foot || "A");
  if (o.whiteBrow) R(8, 3, 4, 1, "w");
}
function rfSloth({P, R, E}, f){
  R(0, 3, 14, 1, "D"); // cành cây
  E(8, 8, 4.4, 3.4, "A"); E(8, 9, 2.6, 2, "B");
  E(13, 7, 2.6, 2.4, "A"); E(13.5, 7.5, 1.8, 1.5, "w"); R(12, 6, 3, 1, "D"); P(12, 7, "k"); P(14, 7, "k"); P(13, 9, "D");
  R(5, 4, 1, 4, "A"); R(10, 4, 1, 4, "A"); P(5, 3, "w"); P(10, 3, "w"); P(4, 3, "w"); P(11, 3, "w");
  R(6, 11, 1, 3 + (f ? 1 : 0), "A"); R(10, 11, 1, 3, "A");
  P(6, 12, "g"); P(10, 12, "g");
}
function rfSquirrel2({P, R, E}, f, o){ // sóc bay: bay lượn, có màng
  E(11, 8, 4.6, 3, "A"); E(11, 9, 3.2, 1.8, "B");
  E(5, 8, 2.8, 4.6 - (f ? 0.6 : 0), "M"); E(5, 8, 1.6, 3.2, "A");
  E(16, 5, 2.6, 2.5, "A"); P(14, 2, "A"); P(14, 3, "A"); P(17, 3, "k"); R(18, 6, 2, 1, "B"); P(19, 5, "D");
  E(1.5, 9, 3, 1.4, "D"); E(7, 12.5, 1.5, 1, "A"); E(13, 12.5, 1.5, 1, "A");
}
function rfLizard({P, R, E}, f, o){
  if (o.cham){ // cắc kè hoa: thân dẹt, đuôi cuộn, mắt lồi
    E(8, 7, 4.5, 3.4, "A"); E(8, 8, 3, 1.8, "B"); R(5, 3, 7, 1, "C"); for (let x = 5; x < 12; x += 2) P(x, 2, "C");
    E(13, 5, 2.6, 2.4, "A"); E(14, 4.4, 1.4, 1.4, "D"); P(14, 4, "k"); P(15, 6, "A"); R(14, 7, 2, 1, "B");
    for (let a = 0; a < 7; a++) P(4 - Math.round(2.4 * Math.cos(a / 2.4)), 9 - Math.round(2.4 * Math.sin(a / 2.4)) + 1 + (a > 4 ? 1 : 0), "A");
    E(1.5, 10, 1.6, 1.6, "A"); P(1, 10, "B");
    R(6, 10, 2, 3, "A"); R(10, 10, 2, 3, "A"); P(6, 13, "D"); P(11, 13, "D");
    for (let i = 0; i < 6; i++) P(5 + (i * 3) % 7, 5 + (i % 3), "D");
  } else { // tắc kè
    E(10, 5, 5.4, 2.4, "A"); E(10, 6, 4, 1.2, "B"); E(16, 4.5, 2.4, 2, "A"); P(17, 3, "k"); P(18, 5, "A"); P(18, 6, "D");
    for (let i = 0; i < 9; i++) P(4 - (i >> 1), 5 + Math.round(Math.sin(i / 1.6 + (f ? 1 : 0)) * 1.2), "A");
    [[8, 8], [13, 8], [8, 2], [13, 2]].forEach(([x, y]) => { R(x, y, 1, 2, "A"); P(x - 1, y + (y > 4 ? 2 : -1), "C"); P(x + 1, y + (y > 4 ? 2 : -1), "C"); });
    for (let i = 0; i < 7; i++) P(7 + i, 4 + (i % 2), "D");
  }
}
function rfSnake({P, R, E}, f){
  R(0, 8, 20, 1, "D");
  const pts = []; for (let i = 0; i < 18; i++) pts.push([2 + i, 6 + Math.round(2.4 * Math.sin(i / 1.9 + (f ? .9 : 0)))]);
  pts.forEach(([x, y], i) => { P(x, y, i % 3 === 0 ? "C" : "A"); P(x, y + 1, i % 3 === 0 ? "C" : "A"); P(x, y - 1, "A"); });
  const [hx, hy] = pts[pts.length - 1]; E(hx + 1, hy, 2.2, 1.8, "A"); P(hx + 2, hy - 1, "k"); if (f) { P(hx + 4, hy, "r"); P(hx + 5, hy - 1, "r"); P(hx + 5, hy + 1, "r"); }
}
function rfBat({P, R, E}, f){
  E(10, 7, 2.4, 3, "A"); E(10, 8, 1.4, 1.8, "B"); E(10, 3.8, 2, 1.8, "A"); P(8, 1, "A"); P(8, 2, "A"); P(12, 1, "A"); P(12, 2, "A"); P(9, 4, "k"); P(11, 4, "k"); P(10, 5, "B");
  const w = f ? 1 : 0;
  for (let i = 0; i < 7; i++){ const yy = 6 - (i >> 1) * (f ? 1 : 0) + (i > 4 ? 2 : 0); R(2 + (6 - i), yy + w, 1, 2 + (i >> 1), "W"); R(13 + i, yy + w, 1, 2 + (i >> 1), "W"); }
  R(2, 5 + w, 14, 1, "W");
}
function rfCat({P, R, E}, f, o){
  E(12, 7, 7, 3.2, "A"); E(12, 8.4, 5, 1.6, "B");
  E(21, 4.4, 3, 2.7, "A"); P(19, 1, "A"); P(19, 2, "A"); P(22, 1, "A"); P(22, 2, "A"); E(23.5, 6, 1.7, 1.1, "B"); P(22, 4, "k"); P(24, 5, "k"); P(24, 6, "D");
  for (let i = 0; i < 12; i++) P(5 - (i >> 1), 6 + Math.round(Math.sin(i / 2.2 + (f ? 1 : 0)) * 1.5) - (i > 7 ? 1 : 0), "A");
  [[8, 3], [11, 5], [14, 3], [16, 6], [9, 8], [13, 9]].forEach(([x, y], i) => { E(x, y, 1.5, 1, "D"); P(x, y, "A"); });
  [[7, 10], [10, 10], [15, 10], [18, 10]].forEach(([x], i) => { R(x, 10, 2, 3, "A"); P(x + 1, 12, "B"); });
}
function rfPeacock({P, R, E}, f){
  for (let a = 8; a <= 172; a += 6){ const r = 11 + ((a / 6 | 0) % 2 ? 1 : 0), x = 11 + Math.round(Math.cos(a * Math.PI / 180) * r * -1), y = 13 - Math.round(Math.sin(a * Math.PI / 180) * r);
    P(x, y, "A"); P(x, y + 1, "A"); if ((a / 6 | 0) % 2 === 0){ P(x, y, f ? "C" : "D"); P(x, y + 1, "w"); } }
  E(11, 12, 3.4, 2.6, "A"); E(11, 12.6, 2, 1.6, "B"); R(14, 6, 2, 6, "A"); R(14, 6, 1, 6, "B"); E(15.5, 5, 1.7, 1.5, "A"); P(16, 4, "k"); P(17, 5, "C");
  P(15, 2, "C"); P(15, 1, "D"); P(16, 2, "C"); P(16, 1, "D"); R(10, 14, 1, 2, "C"); R(12, 14, 1, 2, "C");
}
function rfWoodpecker({P, R, E}, f){ // bám thân cây, đứng thẳng
  R(0, 0, 3, 17, "D"); for (let y = 1; y < 17; y += 3) R(0, y, 1, 1, "B");
  E(6, 9, 2.6, 4.6, "A"); E(5.5, 10, 1.4, 3, "B"); E(7, 3.6, 2.4, 2.3, "A"); E(6.5, 2, 2, 1.3, "C"); P(8, 3, "k"); P(7, 2, "w");
  R(9, 3 + (f ? 1 : 0), 3, 1, "Y"); R(3, 11, 2, 5, "W"); R(8, 8, 1, 2, "w"); R(3, 14, 1, 3, "k");
  P(4, 5, "W"); P(4, 6, "W"); P(4, 7, "W");
}
function rfBigBird(c, f, o){ rfBird(c, f, o); }

/* ----- bảng 30 loài: [id, emoji, W, H, snd, palette, hàm vẽ, thuộc tính thêm] ----- */
const rfSpec = (id, e, W, H, snd, pal, draw, extra) => Object.assign({id, e, W, H, snd, pal, draw}, extra || {});
const RF_DRAW = [
  rfSpec("r_brownsquirrel", "🐿️", 14, 14, "squeak", {A: "#a9683a", B: "#f0d2a8", N: "#6f4524", D: "#4a2c16"}, (c, f) => squirrelDraw(c, f, {}), {speed: 2}),
  rfSpec("r_gecko", "🦎", 20, 11, "chirp", {A: "#8fbf5a", B: "#d8e8a0", C: "#e8f08a", D: "#e67a3a"}, (c, f) => rfLizard(c, f, {}), {speed: 2}),
  rfSpec("r_treefrog", "🐸", 14, 11, "blub", {A: "#5ad46a", B: "#e8ffd0", C: "#3fa84e"}, (c, f) => rfFrog(c, f, {}), {speed: 1, jump: 1}),
  rfSpec("r_forestdove", "🕊️", 17, 14, "chirp", {A: "#a9a9c4", B: "#e6e2f4", C: "#e8789a", W: "#8a8aa8", D: "#c4a8e8"}, (c, f) => rfBird(c, f, {tail: 4, beak: 2, ring: 0, headCol: "A"}), {fly: 1, speed: 2}),
  rfSpec("r_fruitbat", "🦇", 20, 12, "squeak", {A: "#6b4a3a", B: "#a8826a", W: "#4e3328"}, (c, f) => rfBat(c, f), {fly: 1, speed: 2}),

  rfSpec("r_redeyefrog", "🐸", 14, 11, "blub", {A: "#4ee068", B: "#ffe7a8", C: "#ff9a3c", D: "#2a8a40"}, (c, f) => rfFrog(c, f, {eye: "#ff3b3b", stripe: "#3b9bff"}), {speed: 1, jump: 1}),
  rfSpec("r_chameleon", "🦎", 18, 15, "chirp", {A: "#6bd45a", B: "#c8f08a", C: "#ff9a3c", D: "#2f9a4a"}, (c, f) => rfLizard(c, f, {cham: 1}), {slow: 1, speed: 1, fx: {aura: ["dot", "#ffd84a", 12]}}),
  rfSpec("r_hummingbird", "🐦", 17, 13, "chime", {A: "#2fd4a0", B: "#fff3c4", C: "#2b2b3d", W: "#7fe8d0", D: "#e8434f"}, (c, f) => rfBird(c, f, {tail: 3, br: 3, bh: 2.4, hr: 2, beak: 6, beakH: 1, beakCol: "C", wr: 3, wh: 2.2, by: 6, cap: 1}), {fly: 1, speed: 3, anim: 1, fx: {trail: ["dot", "#aaf5e4"]}}),
  rfSpec("r_greenviper", "🐍", 20, 12, "snip", {A: "#58d83f", B: "#f0ff9a", C: "#a8ff5a", D: "#6b4a2a"}, (c, f) => rfSnake(c, f), {slow: 1, speed: 1, fx: {aura: ["star", "#c8ff7a", 8]}}),
  rfSpec("r_poisonfrog", "🐸", 14, 11, "blub", {A: "#2a6bff", B: "#bcd4ff", C: "#1a3fb4", D: "#0a1a6a"}, (c, f) => rfFrog(c, f, {spots: "k", eye: "w"}), {speed: 1, jump: 1, fx: {aura: ["star", "#8fb8ff", 5]}, glow: ["#5a8aff", 6, 4, 9]}),

  rfSpec("r_longtailmonkey", "🐒", 16, 17, "squeak", {A: "#9a6a3a", B: "#e8c49a", D: "#5a3a1a"}, (c, f) => rfMonkey(c, f, {tail: 7}), {speed: 1}),
  rfSpec("r_woodpecker", "🐦", 12, 17, "chirp", {A: "#2b2b3d", B: "#f4efe8", C: "#e8434f", W: "#2b2b3d", D: "#7a5a3a", Y: "#ffd84a"}, (c, f) => rfWoodpecker(c, f), {speed: 1, anim: 1}),
  rfSpec("r_myna", "🐦", 18, 13, "chirp", {A: "#4a3a3a", B: "#6a5a5a", C: "#ffd84a", W: "#3a2a2a", D: "#ffd84a"}, (c, f) => rfBird(c, f, {tail: 3, beak: 2, ring: 0, beakCol: "C"}), {fly: 1, speed: 2}),
  rfSpec("r_flyingsquirrel", "🐿️", 21, 14, "squeak", {A: "#b8a08a", B: "#f4ecdc", M: "#d8c4ac", D: "#7a6a5a"}, (c, f) => rfSquirrel2(c, f, {}), {fly: 1, speed: 2, anim: 1}),
  rfSpec("r_greenparrot", "🦜", 20, 14, "chirp", {A: "#3fd45a", B: "#a8f08a", C: "#ff5a3c", W: "#2aa84a", D: "#3b9bff"}, (c, f) => rfBird(c, f, {tail: 6, beak: 2, hook: 1, ring: 1, beakCol: "C", tailCol: "D"}), {fly: 1, speed: 2}),
  rfSpec("r_sloth", "🦥", 16, 15, "squeak", {A: "#b09a7a", B: "#d8c8a8", D: "#4a3a2a", g: "#e8e0d0"}, (c, f) => rfSloth(c, f), {slow: 1, speed: 1}),
  rfSpec("r_gibbon", "🐵", 16, 17, "squeak", {A: "#4a3a3a", B: "#d8b89a", D: "#2a1a1a"}, (c, f) => rfMonkey(c, f, {tail: 0, hand: "w", foot: "w", face: "B", whiteBrow: 1}), {speed: 1, anim: 1}),
  rfSpec("r_tamarin", "🐵", 16, 17, "squeak", {A: "#ff9a2a", B: "#ffd84a", D: "#e86a1a"}, (c, f) => rfMonkey(c, f, {tail: 7, mane: 1, face: "k"}), {speed: 1, fx: {aura: ["dot", "#ffd84a", 8]}}),
  rfSpec("r_hornbill", "🐦", 22, 15, "honk", {A: "#2b2b3d", B: "#f4efe8", C: "#ffb02a", W: "#1b1b2d", D: "#ffd84a"}, (c, f) => rfBird(c, f, {tail: 5, beak: 7, beakH: 2, beakCol: "C", casque: 1, br: 5.4, bh: 4, hr: 2.8, tailCol: "B"}), {fly: 1, speed: 2, fx: {aura: ["star", "#ffd84a", 7]}, glow: ["#ffd84a", 14, 4, 9]}),
  rfSpec("r_cloudedleopard", "🐆", 26, 14, "growl", {A: "#d4b070", B: "#f0e0b8", D: "#3a2a1a"}, (c, f) => rfCat(c, f, {}), {speed: 1, big: 1, anim: 1, fx: {aura: ["star", "#ffe066", 6]}}),

  rfSpec("r_toucan", "🐦", 20, 14, "honk", {A: "#2b2b3d", B: "#fffdf5", C: "#ffb02a", W: "#1b1b2d", D: "#ff5a3c"}, (c, f) => rfBird(c, f, {tail: 3, beak: 8, beakH: 3, beakCol: "C", beakTip: "D", br: 5, bh: 3.8, hr: 2.6}), {fly: 1, speed: 2}),
  rfSpec("r_greyparrot", "🦜", 20, 14, "chirp", {A: "#aab0bc", B: "#d8dce4", C: "#2b2b3d", W: "#8a909c", D: "#e8434f"}, (c, f) => rfBird(c, f, {tail: 5, beak: 2, hook: 1, ring: 1, beakCol: "C", tailCol: "D"}), {fly: 1, speed: 2}),
  rfSpec("r_kingfisher", "🐦", 20, 13, "chirp", {A: "#2f8fe8", B: "#ff9a3c", C: "#2b2b3d", W: "#1a6ac8", D: "#9ff0ff"}, (c, f) => rfBird(c, f, {tail: 2, beak: 7, beakH: 1, beakCol: "C", br: 4.4, bh: 3.2, hr: 3, cap: 1}), {fly: 1, speed: 3}),
  rfSpec("r_bluemacaw", "🦜", 24, 14, "chirp", {A: "#2f8fff", B: "#ffd84a", C: "#2b2b3d", W: "#1f6ae8", D: "#3fd45a"}, (c, f) => rfBird(c, f, {tail: 9, beak: 3, hook: 1, ring: 1, beakCol: "C", tailCol: "A", br: 5.4, bh: 3.8}), {fly: 1, speed: 2}),
  rfSpec("r_junglowl", "🦉", 12, 14, "hoot", {A: "#8a6a4a", B: "#e8d4b0", Y: "#ffd84a", D: "#5a3f2a"}, (c, f) => owlDraw(c, f, {eye: "Y"}), {anim: 1, speed: 1, pose: 2}),
  rfSpec("r_redmacaw", "🦜", 24, 14, "chirp", {A: "#ff3b3b", B: "#ffd84a", C: "#f4efe8", W: "#3b6bff", D: "#ffd84a"}, (c, f) => rfBird(c, f, {tail: 9, beak: 3, hook: 1, ring: 1, beakCol: "C", tailCol: "W", br: 5.4, bh: 3.8}), {fly: 1, speed: 2, fx: {aura: ["dot", "#ff8a8a", 8]}}),
  rfSpec("r_quetzal", "🐦", 26, 17, "chime", {A: "#2fd47a", B: "#ff3b4a", C: "#ffd84a", W: "#1fa85a", D: "#9ff5c8"}, (c, f) => rfBird(c, f, {tail: 6, streamer: 7, beak: 2, beakCol: "C", crest: 3, br: 4.4, bh: 3.4}), {fly: 1, speed: 2, fx: {trail: ["dot", "#9ff5c8"]}}),
  rfSpec("r_peacock", "🦚", 24, 17, "chime", {A: "#1f9ae8", B: "#8fe8ff", C: "#ffd84a", D: "#2fd47a", w: "#ffd84a"}, (c, f) => rfPeacock(c, f), {speed: 1, anim: 1, fx: {aura: ["star", "#8fe8ff", 8]}}),
  rfSpec("r_harpy", "🦅", 24, 18, "growl", {A: "#6a6a7a", B: "#f4efe8", C: "#ffd84a", W: "#3a3a4a", D: "#2b2b3d"}, (c, f) => rfBird(c, f, {tail: 6, beak: 3, hook: 1, crest: 4, beakCol: "C", ring: 1, br: 6, bh: 4.6, hr: 3, wr: 4, wh: 2.2}), {fly: 1, speed: 2, big: 1, fx: {aura: ["star", "#c8c8ff", 7]}, glow: ["#c8c8ff", 17, 5, 10]}),
  rfSpec("r_paradise", "🐦", 28, 18, "magic", {A: "#ffb02a", B: "#2fd47a", C: "#ffd84a", W: "#ff5a3c", D: "#ff7ac8"}, (c, f) => rfBird(c, f, {tail: 4, streamer: 10, beak: 2, crest: 3, beakCol: "C", br: 4.6, bh: 3.4, headCol: "B"}), {fly: 1, speed: 2, big: 1, anim: 1, fx: {trail: ["star", "#ff7ac8"], aura: ["star", "#ffd84a", 5]}, glow: ["#ffd84a", 14, 6, 10]}),
];

const RF_SELL = [30, 80, 200, 500], RF_FEED = [4, 8, 14, 25], RF_LAYER = {ground: "ground", trunk: "trunk", canopy: "canopy"};
const RF_RAR = {C: 0, R: 1, E: 2, L: 3};
const RF_SPECIES = {};
RAINFOREST_PETS.forEach(p => {
  const d = RF_DRAW.find(x => x.id === p.id);
  RF_SPECIES[p.id] = {label: p.name, emoji: d.e, gacha: true /* ẩn khỏi cửa hàng; không có gacha cho map này */, rf: true, map: "rainforest", rar: RF_RAR[p.rarity], price: 0,
    sell: RF_SELL[RF_RAR[p.rarity]], feed: RF_FEED[RF_RAR[p.rarity]], speed: d.speed || 1, W: d.W, H: d.H, pal: d.pal, draw: d.draw, snd: d.snd, anim: 1, hab: RF_LAYER[p.habitatLayer],
    layer: p.habitatLayer, group: p.group, note: `${p.group} · ${RAR[RF_RAR[p.rarity]]}`, fly: d.fly, slow: d.slow, big: d.big, jump: d.jump, fx: d.fx, glow: d.glow, pose: d.pose};
});
Object.assign(SPECIES, RF_SPECIES);
