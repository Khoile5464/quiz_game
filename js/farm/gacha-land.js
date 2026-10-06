/* ---------- gacha: 3 máy × 10 thú ---------- */
const GACHA = [
  {id: "farm", name: "Máy Nông Trại", price: 1000, rates: [60, 27, 10, 3], icon: "🌾", sub: "Thú quen thuộc, dễ thương",
   pal: {M: "#ffb347", N: "#e8434f", "1": "#ff6b8b", "2": "#ffd84a", "3": "#7fd8ff", "4": "#a8f5cf"}, bg: ["#fff5d6", "#d9f5c4"],
   animals: [
    {k: "g_duck", n: "Vịt Con Lạch Bạch", e: "🦆", r: 0, note: "Đi lạch bạch, kêu quạc quạc", W: 15, H: 12, snd: "quack", anim: 1,
     pal: {A: "#ffd84a", B: "#f2b930", C: "#ff9a3c"},
     draw({P, R, E}, f){ E(6, 6.5, 5, 3, "A"); P(0, 4, "A"); P(1, 4, "A"); P(0, 5, "A"); E(5, 7, 3, 1.5, "B"); E(11, 3, 2.7, 2.7, "A"); R(13, 3, 2, 1, "C"); P(11, 2, "k");
       const s = f ? 1 : 0; P(5 + s, 9, "C"); P(5 + s, 10, "C"); P(4 + s, 11, "C"); P(8 - s, 9, "C"); P(8 - s, 10, "C"); P(9 - s, 11, "C"); }},
    {k: "g_rabbit", n: "Thỏ Con Nhai Cà Rốt", e: "🐰", r: 0, note: "Nhai liên tục khi để yên", W: 17, H: 13, snd: "squeak", anim: 1, speed: 2,
     pal: {A: "#d8c4b0", B: "#ffb3c7", C: "#ff9a3c", G: "#5ac86a"}, draw: (c, f) => rabbitDraw(c, f, {})},
    {k: "g_sheep", n: "Cừu Bông Ngủ Gật", e: "🐑", r: 0, note: "Ngáy khi không ai chạm", W: 14, H: 12, snd: "baa", fx: {idle: "zzz"},
     pal: {A: "#fffdf5", B: "#c9c3b5", D: "#5a4a5a"},
     draw({P, R, E}){ E(5, 6, 4.5, 3.3, "A"); E(8, 6, 3.5, 3.2, "A"); E(3, 5, 2.5, 2.5, "A"); E(7, 3.5, 3, 2.2, "A"); E(11, 6.5, 2.2, 2.4, "D"); P(9, 4, "D"); P(9, 5, "D"); P(12, 6, "B"); P(11, 6, "B"); P(13, 7, "D");
       [3, 6, 8, 10].forEach(x => R(x, 9, 1, 3, "D")); }},
    {k: "g_cat", n: "Mèo Mướp Lười", e: "🐱", r: 0, note: "Nằm dài, kêu meo", W: 16, H: 9, snd: "meow", anim: 1, speed: 1,
     pal: {A: "#f0a050", B: "#fff0d8", C: "#b86a2a"},
     draw({P, R, E}, f){ E(7, 5.5, 6, 2.6, "A"); [3, 5, 7, 9].forEach(x => { P(x, 3, "C"); P(x, 4, "C"); }); E(13, 4.5, 2.8, 2.5, "A"); P(11, 1, "A"); P(11, 2, "A"); P(14, 1, "A"); P(14, 2, "A");
       E(14.5, 5.5, 1.3, 1, "B"); P(12, 4, "k"); P(14, 4, "k"); P(15, 5, "P"); R(11, 7, 4, 1, "B"); E(1, 5, 1.5, 1, "A"); P(0, 4 - (f ? 1 : 0), "C"); P(0, 3 - (f ? 1 : 0), "C"); }},
    {k: "g_goat", n: "Dê Con Râu Dài", e: "🐐", r: 1, note: "Nhảy cao khi được vuốt", W: 16, H: 14, snd: "baa", hi: 1,
     pal: {A: "#f4f0e4", B: "#8a5a35", C: "#d9d0bc"},
     draw({P, R, E}){ E(6, 8, 5, 3, "A"); P(0, 6, "A"); P(0, 5, "A"); E(11, 5, 2.5, 2.5, "A"); P(11, 2, "B"); P(10, 1, "B"); P(9, 0, "B"); P(8, 0, "B"); P(9, 5, "C"); P(8, 5, "C"); P(12, 4, "k"); R(13, 6, 2, 1, "C"); P(14, 5, "k"); R(13, 7, 1, 4, "C"); P(13, 11, "w");
       [3, 5, 8, 10].forEach(x => { R(x, 10, 1, 4, "A"); P(x, 13, "k"); }); }},
    {k: "g_donkey", n: "Lừa Con Tai To", e: "🐴", r: 1, note: "Tai động đậy", W: 17, H: 15, snd: "heehaw", anim: 1,
     pal: {A: "#9a9aa8", B: "#d8d8e0", P: "#ffb3c7"},
     draw({P, R, E}, f){ E(7, 9, 5.5, 3, "A"); E(7, 10.5, 4, 1.5, "B"); R(0, 8, 1, 3, "A"); E(13, 7, 3, 3, "A"); E(15, 8.5, 1.8, 1.5, "B"); P(13, 6, "k"); P(16, 8, "k");
       const o = f ? 1 : 0; R(10 + o, 1, 2, 5, "A"); R(11 + o, 2, 1, 3, "P"); R(13 + o, 1, 2, 5, "A"); R(13 + o, 2, 1, 3, "P");
       [3, 5, 9, 11].forEach(x => { R(x, 12, 1, 3, "A"); P(x, 14, "k"); }); }},
    {k: "g_guinea", n: "Chuột Lang Tròn Vo", e: "🐹", r: 1, note: "Tròn như quả bóng, kêu chít chít", W: 12, H: 10, snd: "squeak", anim: 1,
     pal: {A: "#d98c4a", B: "#fff0d8", P: "#ffb3c7"},
     draw({P, R, E}, f){ E(6, 5.5, 5.5, 4, "A"); E(8.5, 6.5, 2.2, 2.2, "B"); R(8, 1, 2, 2, "P"); P(9, 4, "k"); P(11, 6, "P"); const s = f ? 1 : 0; R(3 + s, 9, 2, 1, "B"); R(8 - s, 9, 2, 1, "B"); }},
    {k: "g_rooster", n: "Gà Trống Cầu Vồng", e: "🐓", r: 2, note: "Đuôi nhiều màu, gáy rất to", W: 16, H: 15, snd: "crow", anim: 1,
     pal: {A: "#fff6e0", B: "#ff9a3c", "1": "#e8434f", "2": "#ff9a3c", "3": "#ffd84a", "4": "#5ac86a", "5": "#4aa8ff", "6": "#a870ff"},
     draw({P, R, E}, f){ for (let i = 0; i < 6; i++) for (let a = 95; a <= 200; a += 3){ const r = 8 - i * .95, ar = (a + (f ? 4 : 0)) * Math.PI / 180; P(6 + Math.cos(ar) * r * .8, 10 - Math.sin(ar) * r * 1.15, String(i + 1)); }
       E(8, 10, 4.5, 3.5, "A"); E(8, 10, 2.5, 1.5, "B"); E(11, 5, 2.3, 2.4, "A"); R(10, 1, 3, 2, "1"); P(11, 0, "1"); P(13, 5, "B"); P(14, 5, "B"); P(13, 7, "1"); P(12, 4, "k"); R(7, 13, 1, 2, "B"); R(10, 13, 1, 2, "B"); }},
    {k: "g_cow", n: "Bò Sữa Hoa Hướng Dương", e: "🐄", r: 2, note: "Có hoa trên đầu", W: 17, H: 16, snd: "cow", anim: 1,
     pal: {A: "#fffdf5", B: "#5a3820", C: "#e8c49a", Y: "#ffd84a", D: "#8a5a35"},
     draw({P, R, E}, f){ E(7, 10, 5.5, 3.5, "A"); E(5, 9, 1.5, 1.5, "B"); E(9, 11, 1.5, 1, "B"); R(0, 8, 1, 3, "A"); E(13, 7, 2.8, 2.6, "A"); R(14, 8, 3, 2, "C"); P(13, 6, "k"); P(11, 4, "C");
       const s = f ? 1 : 0; E(12 + s, 3, 2.8, 2.8, "Y"); E(12 + s, 3, 1.2, 1.2, "D"); [3, 5, 9, 11].forEach(x => { R(x, 13, 1, 3, "A"); P(x, 15, "k"); }); }},
    {k: "g_unicorn", n: "Kỳ Lân Nhỏ", e: "🦄", r: 3, note: "Sừng phát sáng, rơi sao khi đi", W: 17, H: 17, snd: "magic", anim: 1, fx: {trail: ["star", "#fff3a3"], aura: ["dot", "#ffe9a8", 8]},
     pal: {A: "#fffdf5", B: "#ffb3c7", C: "#c9a0ff", Y: "#ffe066"},
     draw({P, R, E}, f){ E(7, 11, 5, 3, "A"); R(10, 6, 3, 6, "A"); E(13, 6, 2.6, 2.6, "A"); E(15, 8, 1.4, 1, "B"); P(14, 5, "k");
       P(13, 3, "Y"); P(14, 2, "Y"); P(14, 1, "Y"); P(15, 0, "Y"); if (f){ P(13, 1, "w"); P(16, 1, "w"); P(15, 2, "w"); }
       P(11, 3, "A"); P(11, 4, "A"); for (let y = 4; y <= 10; y++) P(9 + (y % 2), y, y % 2 ? "C" : "B");
       E(1.5, 12, 1.5, 3, "B"); P(1, 14, "C"); [3, 5, 9, 11].forEach(x => { R(x, 13, 1, 4, "A"); P(x, 16, "Y"); }); }},
   ]},
  {id: "forest", name: "Máy Rừng Xanh", price: 3000, rates: [40, 35, 15, 10], icon: "🌲", sub: "Thú rừng hoang dã",
   pal: {M: "#2f8a55", N: "#8a5a35", "1": "#ffd84a", "2": "#ff9a3c", "3": "#a8f5cf", "4": "#fffdf5"}, bg: ["#dff5d0", "#b9e6c8"],
   animals: [
    {k: "g_hedgehog", n: "Nhím Con Tròn Xoe", e: "🦔", r: 0, note: "Cuộn tròn khi bị chạm", W: 14, H: 9, snd: "squeak", pose: 2,
     pal: {A: "#6b4a35", B: "#9a7a5a", C: "#e8c49a"},
     draw({P, R, E}, f){ if (f === 2){ E(6.5, 4.5, 4.5, 4, "A"); for (let a = 0; a < 360; a += 24) P(6.5 + Math.cos(a * Math.PI / 180) * 5.2, 4.5 + Math.sin(a * Math.PI / 180) * 4.7, "B"); return; }
       E(5, 5, 5, 3.5, "A"); for (let x = 1; x <= 9; x += 2){ P(x, 1 + ((x >> 1) % 2), "B"); P(x + 1, 2, "B"); } E(10, 6, 2.8, 2.2, "C"); P(13, 6, "k"); P(11, 5, "k"); [3, 6, 10].forEach(x => P(x, 8, "C")); }},
    {k: "g_squirrel", n: "Sóc Nâu Giấu Hạt", e: "🐿️", r: 0, note: "Ôm hạt dẻ", W: 14, H: 14, snd: "squeak", anim: 1,
     pal: {A: "#b9693a", B: "#f2d9b0", N: "#8a5a35", D: "#5a3820"}, draw: (c, f) => squirrelDraw(c, f, {})},
    {k: "g_frog", n: "Ếch Xanh Mắt Lồi", e: "🐸", r: 0, note: "Nhảy, kêu ộp ộp", W: 14, H: 11, snd: "ribbit", pose: 2, hi: 1,
     pal: {A: "#5ac86a", B: "#b8f0a8", D: "#2f8a45"},
     draw({P, R, E}, f){ E(7, 7, 5.5, 3, "A"); E(7, 8.5, 3.5, 1.5, "B"); E(4, 3, 1.9, 1.9, "A"); E(10, 3, 1.9, 1.9, "A"); E(4, 3, 1.2, 1.2, "w"); E(10, 3, 1.2, 1.2, "w"); P(5, 3, "k"); P(11, 3, "k");
       if (f === 2){ R(3, 6, 9, 2, "r"); R(3, 6, 9, 1, "D"); } else R(2, 6, 10, 1, "D"); E(2, 8.5, 2.2, 1.5, "A"); R(10, 9, 3, 2, "A"); R(2, 9, 2, 2, "D"); }},
    {k: "g_owl", n: "Cú Mèo Mắt To", e: "🦉", r: 0, note: "Xoay đầu theo ngón tay", W: 12, H: 14, snd: "hoot", pose: 2, anim: 1,
     pal: {A: "#a07848", B: "#e8d0a0", Y: "#ffd84a", D: "#7a5a30"}, draw: (c, f) => owlDraw(c, f, {})},
    {k: "g_fox", n: "Cáo Đỏ Đuôi Xù", e: "🦊", r: 1, note: "Vẫy đuôi to", W: 20, H: 12, snd: "yip", anim: 1, speed: 2,
     pal: {A: "#e8702a", B: "#fffdf5", D: "#5a3820"}, draw: (c, f) => foxDraw(c, f, {})},
    {k: "g_koala", n: "Koala Ôm Cây", e: "🐨", r: 1, note: "Ôm một cây nhỏ, hay ngủ", W: 14, H: 16, snd: "snore", fx: {idle: "zzz"}, speed: 1,
     pal: {A: "#a8a8b8", B: "#d8d8e0", P: "#ffb3c7", T: "#8a5a35", G: "#5ac86a", U: "#6b4a30"},
     draw({P, R, E}){ R(11, 0, 3, 16, "T"); R(11, 3, 1, 12, "U"); E(10, 1, 2, 1, "G"); E(13, 2, 1.5, 1, "G"); E(6, 11, 3.5, 4, "A"); E(7, 11.5, 2, 3, "B"); E(6, 6, 3, 2.8, "A"); E(3, 4, 1.8, 1.8, "A"); E(9, 4, 1.8, 1.8, "A"); P(3, 4, "P"); P(9, 4, "P"); R(7, 6, 2, 2, "k"); P(5, 5, "k"); P(8, 5, "k"); R(8, 9, 4, 2, "A"); R(9, 13, 3, 1, "A"); }},
    {k: "g_otter", n: "Rái Cá Nắm Tay", e: "🦦", r: 1, note: "Ngửa bụng, ôm viên đá", W: 18, H: 10, snd: "chirp", anim: 1,
     pal: {A: "#8a5a35", B: "#d2a77a", G: "#c9c3b5"},
     draw({P, R, E}, f){ E(8, 6, 6.5, 2.8, "A"); E(8, 5.5, 5, 1.6, "B"); E(15, 5, 2.4, 2.2, "A"); E(16, 6, 1.5, 1, "B"); P(17, 6, "k"); P(15, 4, "k"); E(1, 7, 2.2, 1, "A"); const u = f ? 1 : 0;
       E(8, 3.5 - u, 2, 1.5, "G"); R(6, 4, 1, 2, "A"); R(10, 4, 1, 2, "A"); R(4, 1, 1, 2, "A"); R(12, 1, 1, 2, "A"); }},
    {k: "g_panda", n: "Gấu Trúc Ăn Tre", e: "🐼", r: 2, note: "Ngồi gặm tre", W: 14, H: 14, snd: "chirp", anim: 1,
     pal: {A: "#fffdf5", D: "#2b1b3d", G: "#5ac86a", H: "#2f8a45"},
     draw({P, R, E}, f){ E(7, 9.5, 4.5, 4, "A"); E(3, 11.5, 1.8, 2, "D"); E(11, 11.5, 1.8, 2, "D"); const d = f ? 1 : 0; R(9, 6 + d, 1, 7, "G"); P(9, 8 + d, "H"); P(9, 11 + d, "H"); E(4, 8.5, 1.5, 2.5, "D"); E(10, 8.5, 1.5, 2.5, "D");
       E(7, 4, 3.8, 3, "A"); E(3.5, 1.3, 1.5, 1.5, "D"); E(10.5, 1.3, 1.5, 1.5, "D"); R(4, 3, 2, 3, "D"); R(8, 3, 2, 3, "D"); P(5, 4, "w"); P(9, 4, "w"); P(7, 5, "D"); }},
    {k: "g_deer", n: "Hươu Sao Đốm Vàng", e: "🦌", r: 2, note: "Đốm lấp lánh", W: 17, H: 17, snd: "chime", anim: 1, fx: {aura: ["star", "#ffe066", 9]},
     pal: {A: "#c88a4a", B: "#fff3d6", S: "#ffe066", E: "#8a5a35"}, draw: (c, f) => deerDraw(c, f, {spots: "S"})},
    {k: "g_tiger", n: "Hổ Trắng Mắt Xanh", e: "🐯", r: 3, note: "Gầm nhỏ, lông trắng sáng", W: 19, H: 12, snd: "growl", pose: 2, fx: {aura: ["star", "#d7f5ff", 8]},
     pal: {A: "#fffdf5", D: "#3a4a6a", L: "#4aa8ff", P: "#ffb3c7"},
     draw({P, R, E}, f){ E(8, 7, 6.5, 3, "A"); [4, 6, 8, 10].forEach(x => { P(x, 4, "D"); P(x, 5, "D"); P(x + 1, 9, "D"); }); E(14, 5, 3, 2.8, "A"); P(12, 2, "A"); P(12, 3, "A"); P(16, 2, "A"); P(16, 3, "A"); P(12, 6, "D"); P(12, 7, "D"); P(13, 4, "D");
       P(15, 4, "L"); P(16, 4, "L"); P(17, 6, "P"); if (f === 2){ R(15, 7, 4, 2, "k"); R(16, 7, 2, 1, "r"); } else R(16, 7, 2, 1, "k"); R(0, 5, 3, 1, "A"); P(1, 5, "D"); P(2, 5, "A"); [4, 7, 11, 13].forEach(x => R(x, 9, 2, 3, "A")); }},
   ]},
  {id: "magic", name: "Máy Huyền Ảo", price: 5000, rates: [25, 35, 25, 15], icon: "✨", sub: "Thú thần thoại & phép thuật",
   pal: {M: "#7a4fd8", N: "#ffd84a", "1": "#ffd84a", "2": "#ff8fd0", "3": "#7fd8ff", "4": "#fffdf5"}, bg: ["#efe2ff", "#cfe9ff"],
   animals: [
    {k: "g_luckycat", n: "Mèo Béo Thần Tài", e: "😸", r: 0, note: "Vẫy tay chào", W: 14, H: 15, snd: "meow", anim: 1,
     pal: {A: "#fff0d8", R: "#e8434f", Y: "#ffd84a", C: "#ffb06a"},
     draw({P, R, E}, f){ E(6, 10, 4.5, 4, "A"); E(6, 4.5, 4, 3, "A"); P(2, 1, "A"); P(2, 2, "A"); P(3, 2, "A"); P(10, 1, "A"); P(10, 2, "A"); P(9, 2, "A"); P(2, 2, "C"); P(10, 2, "C"); P(4, 4, "k"); P(8, 4, "k"); P(6, 5, "C"); R(3, 7, 7, 1, "R"); P(6, 8, "Y"); E(6, 11, 1.8, 1.8, "Y");
       if (f) R(11, 3, 2, 6, "A"); else R(10, 9, 2, 3, "A"); R(3, 13, 3, 2, "A"); R(7, 13, 3, 2, "A"); }},
    {k: "g_moonrabbit", n: "Thỏ Ngọc Ôm Trăng", e: "🐇", r: 0, note: "Ôm trăng nhỏ phát sáng", W: 17, H: 13, snd: "chime", fx: {aura: ["dot", "#fff3a3", 7]}, speed: 1,
     pal: {A: "#f4efe8", B: "#ffb3c7", M: "#fff3a3", C: "#ff9a3c", G: "#5ac86a"}, draw: (c, f) => rabbitDraw(c, f, {moon: 1})},
    {k: "g_turtle", n: "Rùa Vàng Đội Lá Sen", e: "🐢", r: 0, note: "Đi chậm, lá sen trên mai", W: 16, H: 12, snd: "chime", anim: 1, slow: 1,
     pal: {A: "#f0c040", B: "#c99a20", C: "#e8b030", G: "#5ac86a", L: "#ffb3c7"},
     draw({P, R, E}, f){ E(7, 7, 5.5, 3.3, "A"); R(3, 7, 9, 1, "B"); R(7, 5, 1, 5, "B"); E(13, 8, 2, 1.8, "C"); P(14, 7, "k"); R(3, 10, 2, 2, "C"); R(9, 10, 2, 2, "C"); P(1, 9, "C"); const s = f ? 1 : 0;
       E(7 + s, 3.2, 4.5, 1.2, "G"); P(7 + s, 1, "L"); P(7 + s, 2, "L"); P(6 + s, 2, "L"); P(8 + s, 2, "L"); }},
    {k: "g_moth", n: "Bướm Đêm Lấp Lánh", e: "🦋", r: 0, note: "Bay quanh nông trại", W: 17, H: 12, snd: "chirp", anim: 1, fly: 1, speed: 2, fx: {trail: ["dot", "#fff3a3"], aura: ["dot", "#b58cff", 6]},
     pal: {A: "#b58cff", B: "#7fd8ff", C: "#fff3a3", D: "#4a2b7a"},
     draw({P, R, E}, f){ if (f){ E(6.5, 5, 2.2, 4, "A"); E(10.5, 5, 2.2, 4, "A"); E(6.5, 8, 1.4, 2, "B"); E(10.5, 8, 1.4, 2, "B"); }
       else { E(4, 5, 3.8, 3.2, "A"); E(13, 5, 3.8, 3.2, "A"); E(5, 8.5, 2.6, 2, "B"); E(12, 8.5, 2.6, 2, "B"); P(3, 4, "C"); P(14, 4, "C"); P(5, 7, "C"); P(12, 7, "C"); }
       R(8, 3, 1, 8, "D"); P(8, 2, "D"); P(7, 0, "D"); P(7, 1, "D"); P(9, 0, "D"); P(9, 1, "D"); }},
    {k: "g_galaxyowl", n: "Cú Ngân Hà", e: "🦉", r: 1, note: "Lông như bầu trời sao", W: 12, H: 14, snd: "hoot", pose: 2, anim: 1, fx: {aura: ["star", "#fff3a3", 7]},
     pal: {A: "#2a2a6e", B: "#4a3a9e", Y: "#ffe066", D: "#1a1a4e"}, draw: (c, f) => owlDraw(c, f, {eye: "Y", stars: 1})},
    {k: "g_firesquirrel", n: "Sóc Lửa Tí Hon", e: "🐿️", r: 1, note: "Đuôi có lửa nhỏ, không cháy gì", W: 14, H: 14, snd: "squeak", anim: 1, fx: {aura: ["ember", "#ff8a3c", 5]},
     pal: {A: "#e8502a", B: "#ffd0a0", N: "#8a5a35", D: "#5a3820"}, draw: (c, f) => squirrelDraw(c, f, {fire: 1})},
    {k: "g_magnoliadeer", n: "Nai Hoa Mộc Lan", e: "🦌", r: 1, note: "Sừng nở hoa", W: 17, H: 17, snd: "chime", anim: 1, fx: {aura: ["dot", "#ffb3c7", 8]},
     pal: {A: "#f6e8d8", B: "#fffdf5", E: "#b08a6a", P: "#ff8fd0", p: "#ffd0e8"}, draw: (c, f) => deerDraw(c, f, {bloom: 1})},
    {k: "g_ninefox", n: "Cáo Chín Đuôi", e: "🦊", r: 2, note: "Chín đuôi phát sáng xanh", W: 21, H: 13, snd: "magic", anim: 1, speed: 1, fx: {aura: ["star", "#9cf5ff", 7]},
     pal: {A: "#f4f8ff", B: "#fffdf5", D: "#6a7ab0", L: "#4ad8ff", l: "#c4f8ff"}, draw: (c, f) => foxDraw(c, f, {nine: 1})},
    {k: "g_phoenix", n: "Phượng Hoàng Con", e: "🐦", r: 2, note: "Lông vàng cam, rơi tàn lửa nhỏ", W: 17, H: 15, snd: "chirp", anim: 1, fx: {trail: ["ember", "#ff8a3c"], aura: ["ember", "#ffd84a", 4]},
     pal: {A: "#ffb02a", B: "#ff5a2c", C: "#ffe066", D: "#e8434f"},
     draw({P, R, E}, f){ for (let i = 0; i < 3; i++) for (let t = 0; t < 8; t++) P(4 - t * .6 - i, 10 + t * .4 + i * .8, ["D", "B", "C"][i]);
       E(8, 9, 4, 3.5, "A"); E(12, 4.5, 2.3, 2.4, "A"); P(10, 1, "B"); P(11, 0, "C"); P(12, 1, "B"); P(11, 1, "C"); P(14, 5, "B"); P(15, 5, "B"); P(13, 4, "k");
       if (f) E(7, 6, 2, 2.6, "B"); else E(7, 9.5, 2.6, 2, "B"); R(8, 12, 1, 3, "B"); R(11, 12, 1, 3, "B"); }},
    {k: "g_dragon", n: "Rồng Vàng Ôm Ngọc", e: "🐉", r: 3, note: "Hiệu ứng lớn khi chạm", W: 24, H: 17, snd: "dragon", big: 1, anim: 1, fx: {aura: ["star", "#ffe066", 6]},
     pal: {A: "#f0c040", B: "#fff0b0", C: "#e8434f", D: "#c99a20", Z: "#8ae8ff"},
     draw({P, R, E}, f){ E(9, 9, 6.5, 4, "A"); E(10, 10.5, 5, 2, "B"); E(2.5, 12, 2.5, 1.5, "A"); E(0.5, 9.5 - (f ? 1 : 0), 1.5, 1.4, "C"); E(17, 5.5, 3.3, 3, "A"); E(20.5, 7, 2.4, 1.6, "A"); P(21, 6, "D"); P(22, 8, "D"); P(19, 4, "k"); P(18, 3, "k");
       P(16, 1, "C"); P(16, 2, "C"); P(17, 0, "C"); P(14, 1, "C"); P(14, 2, "C"); for (let x = 5; x <= 13; x++) P(x, 5 - (x % 2), "C"); E(6, 5, 2, 2.4, "C"); R(22, 8, 2, 1, "w");
       R(5, 13, 3, 4, "A"); R(14, 13, 2, 4, "A"); E(11, 14.5, 1.9, 1.9, "Z"); P(10, 13, "w"); if (f){ P(8, 15, "w"); P(14, 11, "w"); } }},
   ]},
];

/* biểu tượng máy gacha pixel */
function machineRows(m){
  return mkSprite(16, 22, ({P, R, E}) => {
    E(8, 6, 6.5, 6, "Z"); E(5, 5, 1.6, 1.6, "1"); E(9, 4, 1.6, 1.6, "2"); E(7, 8, 1.6, 1.6, "3"); E(11, 7, 1.6, 1.6, "4"); E(4, 9, 1.4, 1.4, "4"); E(8, 11, 1.4, 1.4, "1");
    R(5, 0, 6, 1, "N"); R(1, 12, 14, 9, "M"); R(1, 12, 14, 1, "N"); R(1, 20, 14, 1, "N"); E(8, 16, 2, 2, "N"); P(8, 16, "k"); R(7, 14, 2, 1, "k"); R(5, 19, 6, 2, "k");
  });
}
