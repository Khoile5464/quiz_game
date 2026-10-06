/* ---------- gacha Đại dương: 3 máy × 10 sinh vật ---------- */
function crabDraw({P, R, E}, f, o){
  E(7, 6, 4.6, 2.6, "A");
  if (o.snow){ R(5, 3, 5, 1, "w"); R(6, 4, 3, 1, "w"); P(4, 4, "w"); P(10, 4, "w"); }
  R(5, 2, 1, 2, "B"); R(9, 2, 1, 2, "B"); P(5, 1, "k"); P(9, 1, "k");
  if (f === 2){ E(1.8, 2.5, 2, 2, "A"); E(12.2, 2.5, 2, 2, "A"); R(2, 4, 1, 3, "A"); R(12, 4, 1, 3, "A"); P(2, 1, "."); P(12, 1, "."); }
  else { E(1.5, 6.5, 1.8, 1.7, "A"); E(12.5, 6.5, 1.8, 1.7, "A"); P(3, 6, "A"); P(11, 6, "A"); P(1, 5, "."); P(12, 5, "."); }
  for (let k = 0; k < 3; k++){ P(3 + k * 1.2, 8 + ((k + f) % 2), "B"); P(8 + k * 1.5, 8 + ((k + f + 1) % 2), "B"); P(4 + k * 1.2, 8, "B"); P(9 + k * 1.5, 8, "B"); }
}
function otterShellDraw({P, R, E}, f){
  E(8, 6, 6.5, 2.8, "A"); E(8, 5.5, 5, 1.6, "B"); E(15, 5, 2.4, 2.2, "A"); E(16, 6, 1.5, 1, "B"); P(17, 6, "k"); P(15, 4, "k"); E(1, 7, 2.2, 1, "A");
  const u = f ? 2 : 0; E(8, 3 - u + 1, 2.4, 1.6, "S"); P(7, 3 - u + 1, "C"); P(9, 3 - u + 1, "C"); P(8, 2 - u + 1, "C");
  R(6, 4, 1, 2, "A"); R(10, 4, 1, 2, "A"); R(4, 1, 1, 2, "A"); R(12, 1, 1, 2, "A");
}
const RAINB = ["#ff5f6d", "#ffb347", "#ffe066", "#7ae582", "#5ac8fa", "#b388ff"];
const hslc = (h, s2 = 85, l = 62) => `hsl(${Math.round(h) % 360},${s2}%,${l}%)`;

const OCEAN_GACHA = [
  {id: "reef", name: "Máy Rạn San Hô", price: 3000, rates: [60, 28, 11.7, .3], pity: 20, icon: "🪸", sub: "Cá nhỏ, nhiều màu", map: "ocean",
   pal: {M: "#ff7a6a", N: "#ffd84a", "1": "#ff6b8b", "2": "#ffd84a", "3": "#7fd8ff", "4": "#a8f5cf"}, bg: ["#ffe8d8", "#d8f4ff"],
   animals: [
    {k: "o_clown", n: "Cá Hề Nhỏ", e: "🐠", r: 0, note: "Bơi vòng quanh, nhả bong bóng", W: 15, H: 9, snd: "blub", anim: 1, hab: "swim", speed: 1, fx: {aura: ["bub", "#eaffff", 30]},
     pal: {A: "#ff8a2a"},
     draw({P, R, E}, f){ E(8, 4.5, 5, 3.2, "A"); for (let y = 2; y <= 7; y++){ P(5, y, "k"); P(6, y, "w"); P(7, y, "w"); P(8, y, "k"); P(10, y, y > 2 && y < 7 ? "k" : "."); P(11, y, y > 2 && y < 7 ? "w" : "."); }
       R(6, 0, 4, 1, "A"); const t = f ? 1 : 0; E(2, 4.5 + t, 2, 2.6, "A"); P(0, 3 + t, "A"); P(0, 6 + t, "A"); P(12, 3, "k"); P(12, 2, "w"); P(14, 5, "A"); P(7, 8, "A"); }},
    {k: "o_crab", n: "Cua Đỏ Đi Ngang", e: "🦀", r: 0, note: "Giơ càng khi được chạm", W: 14, H: 10, snd: "snip", anim: 1, pose: 2, hab: "floor", speed: 1,
     pal: {A: "#e8434f", B: "#a82a38"}, draw: (c, f) => crabDraw(c, f, {})},
    {k: "o_star", n: "Sao Biển Cam", e: "⭐", r: 0, note: "Nằm yên, xoay một cánh khi chạm", W: 11, H: 9, snd: "pop", pose: 2, hab: "floor", speed: 1, slow: 1,
     pal: {A: "#ff9a3c", B: "#ffd08a"},
     draw({P, E}, f){ E(5, 4.5, 2, 1.7, "A"); for (let k = 0; k < 5; k++){ const a = -Math.PI / 2 + k * 2 * Math.PI / 5 + (k === 0 && f === 2 ? .45 : 0); for (let L = 1; L <= 5; L++){ const x = 5 + Math.cos(a) * L, y = 4.5 + Math.sin(a) * L * .88; P(x, y, L % 2 ? "A" : "B"); if (L < 4) P(x + (Math.abs(Math.cos(a)) < .5 ? 1 : 0), y + (Math.abs(Math.cos(a)) < .5 ? 0 : 1), "A"); } } P(5, 4, "B"); }},
    {k: "o_goby", n: "Cá Bống Vàng", e: "🐟", r: 0, note: "Mắt to, bơi chậm", W: 14, H: 8, snd: "blub", anim: 1, hab: "swim", slow: 1,
     pal: {A: "#ffd84a", B: "#f0a820"},
     draw({P, R, E}, f){ E(7, 4, 4.8, 2.7, "A"); E(1.5, 4 + (f ? 1 : 0), 1.8, 2.2, "B"); R(5, 0, 4, 1, "B"); E(10, 3, 2, 2, "w"); E(10.4, 3, 1, 1, "k"); P(12, 5, "B"); R(5, 6, 3, 1, "B"); }},
    {k: "o_puffer", n: "Cá Nóc Phồng Má", e: "🐡", r: 1, note: "Phồng tròn như bóng khi chạm", W: 14, H: 13, snd: "pop", pose: 2, anim: 1, hab: "swim", slow: 1,
     pal: {A: "#e8c860", B: "#fff3c0", D: "#a8832a"},
     draw({P, R, E}, f){ if (f === 2){ E(7, 6.5, 6, 5.6, "A"); E(7, 9, 4.5, 2.6, "B"); for (let a = 0; a < 360; a += 28){ P(7 + Math.cos(a * Math.PI / 180) * 7, 6.5 + Math.sin(a * Math.PI / 180) * 6.6, "D"); } P(10, 5, "k"); P(10, 4, "w"); P(12, 7, "D"); P(11, 8, "p"); P(2, 6, "A"); P(1, 6, "D"); R(6, 11, 2, 1, "D"); return; }
       E(7, 7, 5, 3.8, "A"); E(7, 9, 3.6, 1.8, "B"); E(1.8, 7 + (f ? 1 : 0), 1.8, 2, "A"); R(6, 3, 3, 1, "D"); P(5, 5, "D"); P(8, 6, "D"); P(10, 6, "k"); P(10, 5, "w"); P(12, 8, "D"); R(7, 11, 3, 1, "A"); }},
    {k: "o_seahorse", n: "Hải Mã Nhỏ", e: "🐴", r: 1, note: "Cuộn đuôi quanh một cọng rong", W: 10, H: 17, snd: "blub", anim: 1, hab: "swim", slow: 1,
     pal: {A: "#ffb347", B: "#e8761a", G: "#3ca85a"},
     draw({P, R, E}, f){ R(2, 5, 1, 12, "G"); P(1, 7 + f, "G"); P(3, 10, "G"); P(1, 13 - f, "G"); E(6, 3, 2.2, 2.2, "A"); R(8, 3, 2, 1, "A"); P(5, 0, "B"); P(6, 0, "B"); P(7, 1, "B"); P(6, 2, "k");
       E(5.5, 7.5, 2.4, 3.4, "A"); R(4, 6, 4, 1, "B"); R(4, 8, 4, 1, "B"); R(4, 10, 3, 1, "B"); [[5, 11], [5, 12], [4, 13], [3, 13], [2, 14], [3, 15], [4, 15], [4, 14]].forEach(([x, y]) => P(x, y, "A")); P(3, 14, "B"); }},
    {k: "o_squid", n: "Mực Con Đổi Màu", e: "🦑", r: 1, note: "Đổi màu theo ngón tay chạm", W: 17, H: 11, snd: "pop", anim: 1, hab: "swim", speed: 1, hue: "A",
     pal: {A: "#ff9ff3", B: "#ffffff"},
     draw({P, R, E}, f){ E(6, 5, 5.2, 2.7, "A"); P(0, 5, "A"); P(1, 3, "A"); P(1, 7, "A"); E(11, 5, 2.2, 2.4, "A"); E(11.5, 4.2, 1.3, 1.3, "w"); P(12, 4, "k");
       for (let y = 3; y <= 7; y++) R(13, y, 3 + ((y + f) % 2), 1, "A"); [[4, 4], [6, 6], [8, 4], [3, 6]].forEach(([x, y]) => P(x, y, "B")); }},
    {k: "o_mandarin", n: "Cá Mandarin Bảy Màu", e: "🐠", r: 2, note: "Thân nhiều màu, phát sáng nhẹ", W: 16, H: 10, snd: "chime", anim: 1, hab: "swim", slow: 1, glow: ["#7fe8ff", 8, 5, 9], fx: {aura: ["dot", "#aef6ff", 9]},
     pal: {A: "#2a7ad8", B: "#ff8a2a", G: "#4ae08a", Y: "#ffe066"},
     draw({P, R, E}, f){ E(8, 5, 5.6, 3.2, "A"); for (let x = 4; x <= 11; x += 3){ for (let y = 3; y <= 7; y++) P(x + (y % 2), y, "B"); P(x + 1, 4, "G"); P(x, 6, "G"); } E(13, 5, 2, 2.2, "B"); P(14, 4, "k"); P(14, 3, "w");
       E(2, 5 + (f ? 1 : 0), 2, 3, "B"); P(0, 4, "Y"); P(0, 6, "Y"); R(6, 1, 5, 2, "B"); P(8, 0, "Y"); R(7, 8, 3, 1, "B"); }},
    {k: "o_turtle", n: "Rùa Biển Xanh", e: "🐢", r: 2, note: "Bơi chậm, có vệt sáng sau mai", W: 20, H: 13, snd: "chime", anim: 1, hab: "swim", slow: 1, fx: {trail: ["dot", "#aef6ff"], aura: ["dot", "#ffe9a8", 8]},
     pal: {A: "#3a8a50", B: "#2a6a3a", C: "#8ab860", Y: "#ffe066"},
     draw({P, R, E}, f){ E(10, 6, 6.4, 4, "A"); R(7, 3, 6, 1, "B"); R(6, 6, 8, 1, "B"); R(7, 8, 6, 1, "B"); R(9, 2, 1, 7, "B"); E(17, 6, 2.3, 2, "C"); P(18, 5, "k"); P(19, 7, "B");
       if (f){ E(14, 10, 3.6, 1.4, "C"); R(12, 11, 4, 1, "C"); } else { E(14, 9.5, 3.6, 1.4, "C"); R(12, 10, 3, 2, "C"); } E(5, 9.5, 2.3, 1.3, "C"); P(2, 7, "C"); P(1, 8, "C"); P(8, 3, "Y"); P(11, 4, "Y"); }},
    {k: "o_dolphin", n: "Cá Heo Cầu Vồng", e: "🐬", r: 3, note: "Nhảy lên, xoay một vòng, để lại cầu vồng nước", W: 26, H: 14, snd: "dolphin", anim: 1, hab: "swim", speed: 2, jump: 1, fx: {aura: ["star", "#ffffff", 8]},
     pal: {A: "#6aa8ff", B: "#ffffff", "1": "#ff5f6d", "2": "#ffb347", "3": "#ffe066", "4": "#7ae582"},
     draw({P, R, E}, f){ E(12, 7, 9, 3.4, "A"); E(12, 8.6, 8, 2, "B"); E(19.5, 7.2, 3, 2.8, "A"); E(23, 8.3, 2.4, 1.1, "A"); P(24, 9, "k");
       for (let x = 4; x <= 20; x++){ const top = Math.round(7 - 3.4 * Math.sqrt(Math.max(0, 1 - ((x - 12) / 9) ** 2))); for (let i = 0; i < 4; i++) P(x, top + i, String(i + 1)); }
       P(20, 6, "k"); P(20, 5, "w"); P(11, 2, "A"); P(12, 1, "A"); P(12, 2, "A"); P(13, 2, "A"); P(13, 3, "A"); R(14, 10, 3, 1, "A"); E(3.5, 7, 3, 1.6, "A");
       const w = f ? 1 : 0; R(0, 2 + w, 3, 2, "A"); R(0, 9 - w, 3, 2, "A"); P(1, 4 + w, "A"); P(1, 8 - w, "A"); }},
   ]},
  {id: "ice", name: "Máy Biển Băng", price: 5000, rates: [45.4, 36, 18, .6], pity: 30, icon: "🧊", sub: "Thú vùng cực", map: "ocean",
   pal: {M: "#7fc8f8", N: "#ffffff", "1": "#ffffff", "2": "#bfe9ff", "3": "#a8a0ff", "4": "#4affc0"}, bg: ["#e8f6ff", "#c8e0ff"],
   animals: [
    {k: "o_seal", n: "Hải Cẩu Con", e: "🦭", r: 0, note: "Lăn tròn trên băng, kêu ụt ụt", W: 16, H: 10, snd: "ut", pose: 2, hab: "floor", speed: 1,
     pal: {A: "#e4ebf3", B: "#a8b4c4"},
     draw({P, R, E}, f){ if (f === 2){ E(8, 5.5, 5, 4.4, "A"); E(8, 6, 3, 2.5, "B"); P(6, 4, "k"); P(10, 4, "k"); P(8, 6, "k"); P(8, 7, "w"); return; }
       E(8, 6, 6.5, 3, "A"); E(14, 5, 2.7, 2.5, "A"); P(14, 4, "k"); P(15, 4, "w"); P(16, 6, "k"); P(15, 7, "w"); P(16, 7, "w"); R(10, 8, 3, 1, "B"); R(0, 6, 2, 3, "B"); [[5, 4], [8, 3], [3, 6]].forEach(([x, y]) => P(x, y, "B")); }},
    {k: "o_penguin", n: "Chim Cánh Cụt Con", e: "🐧", r: 0, note: "Lắc lư khi đi, trượt bụng", W: 12, H: 15, snd: "honk", pose: 2, anim: 1, hab: "floor", speed: 1,
     pal: {A: "#7a8498", B: "#ffffff", D: "#2f3550", O: "#ff9a3c"},
     draw({P, R, E}, f){ if (f === 2){ E(6, 12, 5.2, 2.3, "A"); E(6, 13, 4, 1.3, "B"); E(10, 11, 2, 2, "D"); P(11, 10, "w"); R(11, 12, 1, 1, "O"); R(2, 14, 2, 1, "O"); R(0, 12, 2, 1, "A"); return; }
       const s = f ? 1 : 0; E(5.5 + s, 9, 3.8, 5, "A"); E(5.5 + s, 10, 2.6, 4, "B"); E(5.5 + s, 3.5, 2.7, 2.7, "D"); R(7 + s, 4, 3, 1, "O"); P(5 + s, 3, "w"); P(7 + s, 3, "w"); P(7 + s, 3, "k");
       E(1.5 + s, 9.5, 1, 3, "A"); E(9.8 + s, 9.5, 1, 3, "A"); R(3 + s, 14, 3, 1, "O"); R(7 - s + 1, 14, 3, 1, "O"); }},
    {k: "o_otter", n: "Rái Cá Biển Ôm Sò", e: "🦦", r: 0, note: "Ngửa bụng, đập sò", W: 18, H: 10, snd: "snip", anim: 1, hab: "swim", slow: 1,
     pal: {A: "#8a5a35", B: "#d2a77a", S: "#ffd8e8", C: "#e8a0b8"}, draw: otterShellDraw},
    {k: "o_snowcrab", n: "Cua Tuyết Trắng", e: "🦀", r: 0, note: "Phủ tuyết trên mai", W: 14, H: 10, snd: "snip", anim: 1, pose: 2, hab: "floor", speed: 1,
     pal: {A: "#f2f6fb", B: "#a8bcd0"}, draw: (c, f) => crabDraw(c, f, {snow: 1})},
    {k: "o_walrus", n: "Hải Tượng Con Ngà Nhỏ", e: "🦭", r: 1, note: "Ngà nhỏ, kêu trầm", W: 19, H: 12, snd: "growl", hab: "floor", speed: 1,
     pal: {A: "#a88a78", B: "#d8b8a0", C: "#7a5e4e"},
     draw({P, R, E}){ E(9, 6.5, 7.5, 3.8, "A"); E(15, 5.5, 3.2, 3, "A"); E(16.5, 7, 2.2, 1.6, "B"); P(15, 4, "k"); P(18, 6, "k"); [[16, 8], [18, 8]].forEach(([x, y]) => { P(x, y, "w"); P(x, y + 1, "w"); P(x, y + 2, "w"); });
       R(6, 10, 3, 2, "A"); R(11, 10, 3, 2, "A"); R(0, 7, 2, 3, "C"); [[5, 4], [8, 3], [10, 4]].forEach(([x, y]) => P(x, y, "C")); P(15, 7, "C"); P(17, 7, "C"); }},
    {k: "o_beluga", n: "Cá Voi Beluga Cười", e: "🐳", r: 1, note: "Phun nước thành vòi nhỏ", W: 25, H: 13, snd: "whistle", anim: 1, fxTouch: "spout", hab: "swim", slow: 1, fx: {spout: [18, 1, 40]},
     pal: {A: "#fbfdff", B: "#b8c8dc", p: "#ffb3c7"},
     draw({P, R, E}, f){ E(11, 7, 9.5, 4, "A"); E(19.5, 5.5, 3.2, 3, "A"); P(22, 9, "k"); P(21, 9, "k"); P(23, 8, "k"); P(20, 7, "k"); P(21, 8, "p"); P(16, 2, "B"); E(14, 10.5, 2.6, 1.2, "B");
       E(3, 7, 3, 1.8, "A"); const w = f ? 1 : 0; R(0, 3 + w, 3, 3, "A"); R(0, 9 - w, 3, 3, "A"); }},
    {k: "o_orca", n: "Cá Heo Orca Con", e: "🐋", r: 1, note: "Bơi nhanh, nhảy khi vui", W: 23, H: 13, snd: "dolphin", anim: 1, hab: "swim", speed: 2, jump: 1,
     pal: {A: "#2f3550", B: "#ffffff", C: "#a8b0c4"},
     draw({P, R, E}, f){ E(11, 7, 8.5, 3.5, "A"); E(11, 9, 6, 1.6, "B"); E(18, 7, 3.4, 3, "A"); E(17.5, 5, 1.6, 1, "B"); P(18, 5, "k"); R(20, 8, 3, 1, "B");
       R(10, 1, 1, 4, "A"); R(11, 2, 1, 3, "A"); R(12, 3, 1, 2, "A"); P(9, 3, "C"); P(10, 3, "C"); E(14, 10.5, 2.4, 1, "A"); E(3, 7, 3, 1.6, "A"); const w = f ? 1 : 0; R(0, 3 + w, 3, 2, "A"); R(0, 9 - w, 3, 2, "A"); }},
    {k: "o_polarbear", n: "Gấu Bắc Cực Con Bơi", e: "🐻", r: 2, note: "Bơi ngửa, vẫy chân", W: 21, H: 12, snd: "growl", anim: 1, hab: "swim", slow: 1,
     pal: {A: "#fbf6ec", B: "#d8cdb8", D: "#2b1b3d"},
     draw({P, R, E}, f){ E(9, 7, 6.8, 3, "A"); E(9, 6.5, 5, 1.6, "B"); E(16, 6, 2.9, 2.7, "A"); E(18.5, 7, 1.6, 1.2, "A"); P(19, 6, "D"); P(16, 5, "D"); P(14, 3, "A"); P(14, 2, "A"); P(17, 3, "A");
       const u = f ? 1 : 0; R(5, 1 + u, 2, 4, "A"); R(8, 2 - u, 2, 3, "A"); R(12, 1 + u, 2, 4, "A"); P(5, 1 + u, "B"); P(12, 1 + u, "B"); E(2, 8, 2, 1.2, "A"); }},
    {k: "o_humpback", n: "Cá Voi Lưng Gù Hát", e: "🐋", r: 2, note: "Hát khi được chạm", W: 31, H: 15, snd: "whale", anim: 1, pose: 2, fxTouch: "notes", hab: "swim", slow: 1,
     pal: {A: "#3a5a8a", B: "#e8f0ff", C: "#2a4470", r: "#e8434f"},
     draw({P, R, E}, f){ E(14, 8, 12.5, 4.6, "A"); E(14, 10.8, 10.5, 2, "B"); for (let x = 6; x < 22; x += 2) P(x, 10, "C"); E(24, 8, 5.2, 3.8, "A"); [[26, 5], [28, 6], [24, 5]].forEach(([x, y]) => P(x, y, "B")); P(26, 7, "k");
       if (f === 2){ R(25, 10, 6, 2, "r"); R(25, 10, 6, 1, "C"); } else R(25, 10, 5, 1, "C");
       E(14, 12.5, 5, 1.5 + (f === 1 ? .5 : 0), "A"); P(12, 3, "A"); P(11, 4, "A"); E(3.5, 7, 5, 2.2, "A"); const w = f === 1 ? 1 : 0; R(0, 2 + w, 3, 3, "A"); R(0, 10 - w, 3, 3, "A"); }},
    {k: "o_narwhal", n: "Kỳ Lân Biển", e: "🦄", r: 3, note: "Sừng phát ra ánh cực quang, rơi tuyết lấp lánh", W: 28, H: 14, snd: "magic", anim: 1, hab: "swim", slow: 1, glow: ["#aef6ff", 25, 3, 8], fx: {aura: ["snow", "#ffffff", 4], trail: ["star", "#aef6ff"]},
     pal: {A: "#cfc8f8", B: "#fbfaff", C: "#8a82c8", "1": "#4affc0", "2": "#4ad8ff", "3": "#a8a0ff", "4": "#ff9ff3"},
     draw({P, R, E}, f){ E(11, 8, 8.5, 3.8, "A"); E(11, 10, 7, 1.8, "B"); E(18.5, 8, 3.4, 3.1, "A"); P(19, 7, "k"); P(19, 6, "w"); P(20, 9, "p"); [[6, 5], [9, 4], [12, 5], [8, 7]].forEach(([x, y]) => P(x, y, "C"));
       for (let i = 0; i < 9; i++){ const x = 21 + i * .85, y = 6 - i * .55; P(x, y, String((i + f) % 4 + 1)); P(x, y + 1, String((i + f) % 4 + 1)); }
       E(3, 8, 3, 1.7, "A"); const w = f ? 1 : 0; R(0, 4 + w, 3, 2, "A"); R(0, 10 - w, 3, 2, "A"); E(14, 11.5, 2.4, 1, "A"); P(10, 3, "A"); P(11, 3, "A"); P(11, 2, "A"); }},
   ]},
  {id: "deep", name: "Máy Biển Sâu", price: 10000, rates: [37, 37, 25, 1], pity: 40, icon: "🔮", sub: "Thú phát sáng, huyền bí", map: "ocean",
   pal: {M: "#2a2a7e", N: "#9ff0ff", "1": "#9ff0ff", "2": "#ff9ff3", "3": "#ffe066", "4": "#b388ff"}, bg: ["#d8d8ff", "#b8c8f0"],
   animals: [
    {k: "o_glowjelly", n: "Sứa Ánh Sáng", e: "🎐", r: 0, note: "Phát sáng khi trời tối trong game", W: 13, H: 16, snd: "chime", anim: 1, hab: "swim", slow: 1, glow: ["#9ff0ff", 6, 5, 11],
     pal: {A: "#8ae8ff", B: "#bff6ff", w: "#ffffff"},
     draw({P, R, E}, f){ const p = f ? 1 : 0; for (let dy = -4 + p; dy <= 0; dy++){ const w = Math.round((5 - p) * Math.sqrt(1 - (dy / (4 - p)) ** 2)); R(6 - w, 5 + dy, 2 * w + 1, 1, "A"); } R(3, 2 + p, 2, 1, "w");
       for (let t = 2; t <= 10; t += 2) for (let k = 0; k < 9; k++) P(t + Math.round(Math.sin(k / 1.6 + t + f * 2)), 6 + k, k % 3 ? "A" : "B"); }},
    {k: "o_lanternfish", n: "Cá Lồng Đèn Nhỏ", e: "🐟", r: 0, note: "Đèn trên đầu sáng nhấp nháy", W: 17, H: 11, snd: "blub", anim: 1, hab: "swim", speed: 1, glow: ["#ffe66a", 14, 3, 8],
     pal: {A: "#2a4a8a", B: "#4a78c8", Y: "#fff6b0", y: "#d9c870"},
     draw({P, R, E}, f){ E(7, 7, 5.6, 3, "A"); E(7, 8.5, 4, 1.4, "B"); E(1.5, 7 + (f ? 1 : 0), 1.8, 2.4, "A"); P(10, 6, "w"); P(10, 6, "w"); P(11, 6, "k"); P(12, 5, "A"); P(13, 4, "A"); P(14, 3, "A"); R(14, 1, 2, 2, f ? "Y" : "y"); P(8, 5, "B"); P(5, 6, "B"); }},
    {k: "o_dumbo", n: "Bạch Tuộc Dumbo", e: "🐙", r: 0, note: "Tai vẫy như cánh", W: 17, H: 14, snd: "pop", anim: 1, hab: "swim", slow: 1,
     pal: {A: "#ffb0d8", B: "#ff7ab8"},
     draw({P, R, E}, f){ const d = f ? -1 : 1; E(8.5, 5, 4.4, 3.9, "A"); E(3, 5 + d, 2.4, 1.7, "B"); E(14, 5 + d, 2.4, 1.7, "B"); P(7, 5, "k"); P(10, 5, "k"); P(8, 7, "B"); R(4, 9, 9, 2, "A");
       for (let x = 4; x <= 12; x += 2) R(x, 11, 1, 2 + ((x / 2 + f) % 2), "A"); P(5, 7, "B"); P(12, 7, "B"); }},
    {k: "o_nautilus", n: "Ốc Anh Vũ Xoắn", e: "🐚", r: 0, note: "Vỏ xoắn ốc có ánh ngọc", W: 16, H: 13, snd: "chime", anim: 1, hab: "swim", slow: 1, glow: ["#ffd8f8", 6, 5, 8],
     pal: {A: "#f5e9d8", B: "#b8763a", C: "#ff9a6c", p: "#ffb3e8", L: "#9ff0ff"},
     draw({P, R, E}, f){ for (let y = 0; y < 13; y++) for (let x = 0; x < 13; x++){ const dx = x - 6.5, dy = y - 6, d = dx * dx / 30 + dy * dy / 25; if (d <= 1.02) P(x, y, Math.sin(Math.atan2(dy, dx) * 3 + Math.sqrt(dx * dx + dy * dy) * 1.2) > .5 ? "B" : "A"); }
       P(3, 3, "w"); P(4, 3, "p"); P(3, 4, "L"); P(4, 2, "w"); R(10, 5, 4, 3, "C"); P(11, 5, "k"); const t = f ? 1 : 0; R(13, 4 + t, 3, 1, "C"); R(13, 8 - t, 3, 1, "C"); P(12, 9, "C"); }},
    {k: "o_manta", n: "Cá Đuối Manta Ánh Sao", e: "🐟", r: 1, note: "Lưng có đốm như sao", W: 27, H: 14, snd: "chime", anim: 1, hab: "swim", slow: 1, glow: ["#fff3a3", 13, 7, 11],
     pal: {A: "#2a3a6a", B: "#4a5a9a", S: "#fff3a3", w: "#ffffff"},
     draw({P, R, E}, f){ const s = f ? 1 : .8; for (let y = 0; y < 14; y++){ const dy = Math.abs(y - 6.5) / 6.5 / s; if (dy > 1) continue; const xr = Math.round(26 - dy * 16), xl = Math.round(5 + dy * 7); for (let x = xl; x <= xr; x++) P(x, y, "A"); }
       for (let x = 0; x < 6; x++) P(x, 6 + (x % 2), "A"); R(23, 3, 3, 1, "B"); R(23, 10, 3, 1, "B"); P(22, 5, "w"); P(22, 8, "w"); [[11, 4], [14, 6], [12, 9], [16, 8], [9, 6], [17, 5]].forEach(([x, y], i) => { if ((i + f) % 3) P(x, y, "S"); }); }},
    {k: "o_mola", n: "Cá Mặt Trăng Tròn", e: "🌕", r: 1, note: "Tròn dẹt, nổi lên mặt nước phơi nắng", W: 18, H: 16, snd: "pop", anim: 1, hab: "top", slow: 1,
     pal: {A: "#a8b4c4", B: "#8a96a8", C: "#d8e0ea"},
     draw({P, R, E}, f){ E(9, 8, 6.6, 6.2, "A"); E(9, 9, 4.5, 3.5, "C"); R(7, 0, 3, 3, "B"); R(6, 1, 2, 2, "B"); R(7, 13, 3, 3, "B"); R(6, 13, 2, 2, "B"); R(1, 4, 2, 8, "B"); R(0, 5 + (f ? 1 : 0), 1, 6, "B"); P(13, 6, "w"); P(13, 6, "k"); P(14, 6, "k"); P(15, 9, "k"); P(14, 9, "k"); [[6, 6], [8, 11], [10, 4], [5, 9]].forEach(([x, y]) => P(x, y, "B")); }},
    {k: "o_leafydragon", n: "Hải Long Lá", e: "🐉", r: 1, note: "Thân như lá rong, trôi nhẹ", W: 24, H: 17, snd: "blub", anim: 1, hab: "swim", slow: 1,
     pal: {A: "#c8a838", B: "#8aa838", G: "#4ab868", Y: "#ffe066"},
     draw({P, R, E}, f){ for (let i = 0; i <= 14; i++){ const x = 3 + i, y = 9 + Math.sin(i / 2.4) * 3; E(x, y, 1.6, 1.4, "A"); if (i % 3 === 0){ E(x, y - 3 + (f ? 1 : 0), 1.7, 1.2, "G"); E(x + 1, y + 3 - (f ? 1 : 0), 1.7, 1.2, "G"); P(x, y - 1, "B"); } }
       E(19.5, 6.8, 2, 1.8, "A"); R(21, 7, 3, 1, "A"); P(20, 6, "k"); P(19, 4, "G"); P(18, 4, "G"); E(3, 12, 1.5, 1.5, "G"); P(1, 11, "G"); }},
    {k: "o_whaleshark", n: "Cá Mập Voi Đốm Sao", e: "🦈", r: 2, note: "To nhưng hiền, đốm sáng", W: 32, H: 15, snd: "whale", anim: 1, hab: "swim", slow: 1, glow: ["#fff3a3", 15, 7, 13],
     pal: {A: "#3a5a78", B: "#dfe8f0", C: "#2a4560", S: "#fff3a3", w: "#ffffff"},
     draw({P, R, E}, f){ E(15, 8, 13, 4.4, "A"); E(15, 10.6, 11, 2, "B"); E(26, 8.5, 5.4, 3, "A"); R(27, 10, 5, 1, "C"); P(28, 7, "k"); R(21, 7, 1, 3, "C"); R(22, 7, 1, 3, "C");
       for (let j = 0; j < 3; j++) for (let i = 0; i < 9; i++) if ((i * 3 + j * 5 + f) % 4) P(5 + i * 2.5 + (j % 2), 4.5 + j * 1.8, (i + j) % 2 ? "S" : "w"); R(13, 1, 2, 3, "A"); P(14, 0, "A"); E(19, 12.8, 3, 1, "A");
       E(3, 8, 4, 2, "A"); const w = f ? 1 : 0; R(0, 2 + w, 2, 5, "A"); R(0, 9 - w, 2, 4, "A"); P(2, 6 + w, "A"); }},
    {k: "o_mermaid", n: "Nàng Tiên Cá Nhí", e: "🧜", r: 2, note: "Hát khẽ, tóc đổi màu", W: 18, H: 19, snd: "sing", anim: 1, hab: "swim", slow: 1, hue: "H", fx: {aura: ["note", "#ffb3e8", 22]},
     pal: {H: "#ff9ff3", S: "#ffd8b8", A: "#2ab8c8", B: "#7ae8f0", p: "#ffb3c7"},
     draw({P, R, E}, f){ E(8, 4.5, 3.8, 3.8, "H"); R(4, 5, 3, 9, "H"); E(9, 4.5, 2.5, 2.5, "S"); P(10, 4, "k"); P(11, 5, "p"); P(10, 6, "p"); E(9, 9, 2, 2.2, "S"); P(8, 8, "p"); P(10, 8, "p"); R(8, 7, 3, 1, "S");
       const u = f ? -1 : 0; R(11, 8 + u, 4, 1, "S"); P(15, 7 + u, "S"); R(5, 8, 3, 1, "S");
       E(8.5, 12.5, 2.4, 3, "A"); E(6.5, 15.5, 2.4, 2.2, "A"); [[8, 11], [9, 13], [7, 14], [6, 16]].forEach(([x, y]) => P(x, y, "B")); E(3, 17.5 + (f ? .5 : 0), 3, 1.6, "B"); P(0, 16, "B"); P(0, 18, "B"); }},
    {k: "o_pearlwhale", n: "Cá Voi Ngọc Trai", e: "🐳", r: 3, note: "Phun nước thành cầu vồng, ngậm một viên ngọc trai", W: 32, H: 17, snd: "whale", anim: 1, fxTouch: "rainbow", hab: "swim", slow: 1, glow: ["#ffffff", 28, 12, 12], fx: {aura: ["dot", "#ffffff", 6], spout: [23, 2, 50, 1]},
     pal: {A: "#e4e0ff", B: "#fbf8ff", p: "#ffb3e0", L: "#9fd8ff", C: "#c8c0f0", w: "#ffffff", Y: "#fff3a3"},
     draw({P, R, E}, f){ E(15, 9, 13, 5, "A"); E(15, 12, 11, 2.4, "B"); E(25, 9.5, 5.5, 4, "A"); P(27, 7, "k"); P(27, 6, "w"); P(29, 10, "p");
       for (let i = 0; i < 26; i++){ const x = 4 + (i * 7) % 24, y = 5 + (i * 5) % 8; if ((i + f) % 3) P(x, y, i % 2 ? "p" : "L"); }
       R(26, 12, 5, 1, "C"); E(29, 13, 2, 2, "w"); P(28, 12, "Y"); P(28, 13, "w"); E(14, 14, 5, 1.6, "A"); P(23, 3, "C"); P(22, 3, "C"); E(3.5, 9, 5, 2.4, "A");
       const w = f ? 1 : 0; R(0, 3 + w, 3, 3, "p"); R(0, 11 - w, 3, 3, "L"); P(3, 6 + w, "p"); P(3, 11 - w, "L"); }},
   ]},
];
OCEAN_GACHA.forEach(m => GACHA.push(m));

GACHA.forEach(m => { m.map = m.map || "farm"; });
const SPECIES_EXTRA = {};
GACHA.forEach((m, mi) => m.animals.forEach(an => {
  SPECIES_EXTRA[an.k] = {label: an.n, emoji: an.e, gacha: true, mi, map: m.map || "farm", rar: an.r, price: 0, sell: Math.floor(m.price * SELL_X[an.r]), feed: Math.round(m.price * FEED_X[an.r]), speed: an.speed || 1,
    W: an.W, H: an.H, pal: an.pal, draw: an.draw, fx: an.fx, snd: an.snd, note: an.note, anim: an.anim, pose: an.pose, slow: an.slow, fly: an.fly, hi: an.hi, big: an.big,
    hab: an.hab || "farm", jump: an.jump, fxTouch: an.fxTouch, glow: an.glow, hue: an.hue};
}));
Object.assign(SPECIES, SPECIES_EXTRA);

