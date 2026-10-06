const NAMES = ["Zeus","Hera","Athena","Apollo","Artemis","Hermes","Demeter","Dionysus","Poseidon","Hestia","Ares","Eros","Nike","Pan","Orpheus","Icarus","Hector","Achilles","Helen","Odysseus","Socrates","Plato","Aristotle","Homer"];
cleanFarm(S);
const PAL = {k:"#2b1b3d",w:"#fffdf5",y:"#ffd84a",o:"#ff9a3c",r:"#e8434f",p:"#ffb3c7",P:"#e0719a",b:"#8a5a35",B:"#5a3820",t:"#e8c49a",g:"#c9c3b5"};
const SPR = {
  chicken: {
    baby: ["....yy..","...yyky.",".yyyyyoo","yyyyyyy.",".yyyyyy.","..yyyy..","...o.o.."],
    adult: ["......rr....",".....wwkwoo.",".....wwwwr..","..wwwwwwww..",".wwwwwwwwww.","wwwwwwwwwww.","wwwggwwwwww.",".wwwwwwwwww.","..wwwwwwww..","....y..y....","...yy.yy...."],
  },
  pig: {
    baby: ["......Pp..",".pppppppp.","pppppppkPP","ppppppppPP",".pppppppp.",".pp..pp..."],
    adult: ["..........Pp....","..pppppppppppp..",".pppppppppppppp.","pppppppppppppkPP","ppppppppppppppPP",".pppppppppppppp.",".pppppppppppppp.","..pppppppppppp..","..pp..pp..pp..pp","..PP..PP..PP..PP"],
  },
  dog: {
    adult: ["..........BB..","Bttttttttt.Bt.","tttttttttttttt","tttttttttttkbb","ttttttttttttbb","tttttttttttbbb",".tttttttttbPPb",".tttttttttt...",".tt.tt...tt.tt",".bb.bb...bb.bb"],
  },
  cow: {
    baby: [".......bb.",".wwwwwwwww","wwbbwwwwkw","wwbbwwwwww","wwwwwwwwtt",".wwwwbbww.",".ww..ww...",".kk..kk..."],
    adult: ["..............tw..","..wwwwwwwwwwwwww..",".wwbbbwwwwwwwwwww.","wwwbbbwwwbbwwwwkw.","wwwwwwwwwbbwwwwwww","wwbbwwwwwwwwwwwwtt",".wwwwwwwwwwwwwwwtt",".wwwwwwwwwwwww....",".ww..ww.....ww..ww",".kk..kk.....kk..kk"],
  },
};
const sprCache = {};
function sprOf(a, fr = 0){
  const sp = SPECIES[a.t], stage = stageOf(a.f), key = a.t + stage + "_" + fr;
  if (sprCache[key]) return sprCache[key];
  const rows = sp.draw ? mkSprite(sp.W, sp.H, c => sp.draw(c, fr)) : SPR[a.t][SPR[a.t].baby && stage === 0 ? "baby" : "adult"], widen = stage === 2 ? 1 : stage === 3 ? 2 : 0;
  const w0 = rows[0].length, c0 = Math.floor(w0 * .4), c1 = Math.floor(w0 * .6);
  const out = rows.map(r => { let s = ""; for (let c = 0; c < w0; c++) s += r[c].repeat(c >= c0 && c < c1 ? 1 + widen : 1); return s; });
  return sprCache[key] = {rows: out, w: out[0].length, h: out.length, pal: sp.pal};
}
const hashOf = a => a.id.charCodeAt(1) + a.id.charCodeAt(2);
function frameOf(a){ const sp = SPECIES[a.t]; if (!sp.draw || rt(a).sleep) return 0; if (rt(a).pose > 0 && sp.pose) return sp.pose; return sp.anim ? ((ftick / 3 | 0) + hashOf(a)) & 1 : 0; }
const altOf = a => { const m = rt(a), sp = SPECIES[a.t]; return (sp.fly && !m.sleep ? 10 + Math.round(3 * Math.sin(ftick / 3 + hashOf(a))) : 0) + (m.drag && sp.map !== "ocean" ? 5 : 0) + (m.jump > 0 ? Math.round(Math.min(26, Math.max(0, m.y - sprOf(a).h - 12)) * Math.sin(Math.PI * (1 - m.jump / 14))) : 0); };
const bobOf = (a, m) => m.hop > 0 ? (SPECIES[a.t].hi ? -6 : -3) : 0;

const FW = 192, FH = 108, cv = $("farmCv"), cx = cv.getContext("2d");
const rnd = (s => () => (s = s * 16807 % 2147483647) / 2147483647)(20240);
const FLOWERS = Array.from({length: 34}, () => [Math.floor(rnd() * FW), 58 + Math.floor(rnd() * 40), rnd() < .5 ? "#ff9fd0" : "#fff3a3"]);
const TUFTS = Array.from({length: 70}, () => [Math.floor(rnd() * FW), 58 + Math.floor(rnd() * 42)]);
const STARS = Array.from({length: 28}, () => [Math.floor(rnd() * FW), Math.floor(rnd() * 36)]);
let bgCache = null, bgNight = null, ftick = 0, flash = 0;
const parts = [], rtMap = {};

function makeBg(night){
  const c = document.createElement("canvas"); c.width = FW; c.height = FH;
  const g = c.getContext("2d");
  const r = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  const disc = (x, y, rad, col) => { for (let dy = -rad; dy <= rad; dy++){ const w = Math.round(Math.sqrt(rad * rad - dy * dy)); r(x - w, y + dy, 2 * w + 1, 1, col); } };
  const sky = night ? ["#120c3a","#1b1352","#2a1d6e","#3b2a86","#4d3a9c","#6a52b0"] : ["#6fc7f5","#82d0f7","#97dafa","#ade3fc","#c3ecfd","#d9f4ff"];
  sky.forEach((col, i) => r(0, i * 8, FW, 8, col));
  if (night){ STARS.forEach(([x, y]) => r(x, y, 1, 1, "#fffbd0")); disc(162, 16, 6, "#fffbd0"); disc(165, 14, 5, sky[1]); }
  else { disc(162, 15, 7, "#fff0a0"); disc(162, 15, 5, "#ffe066"); }
  for (let x = 0; x < FW; x++){
    const h1 = 10 + Math.round(5 * Math.sin(x / 23) + 3 * Math.sin(x / 9));
    r(x, 46 - h1, 1, h1, night ? "#3a3a7a" : "#b7c99a");
    const h2 = 4 + Math.round(3 * Math.sin(x / 14 + 2));
    r(x, 46 - h2, 1, h2, night ? "#2f2f68" : "#9dbb7c");
  }
  r(0, 46, FW, 10, "#2c93d8"); for (let y = 47; y < 56; y += 3) r(0, y, FW, 1, "#4fb0ea");
  r(0, 56, FW, 52, "#7ccf6a"); r(0, 80, FW, 28, "#72c460");
  TUFTS.forEach(([x, y]) => { r(x, y, 1, 2, "#5fae4e"); r(x + 2, y + 1, 1, 1, "#5fae4e"); });
  // đền Parthenon (nhỏ) bên trái
  r(4, 60, 72, 2, "#d9ceb4"); r(6, 58, 68, 2, "#efe6d2");
  r(8, 40, 64, 4, "#e8dcc0"); r(8, 43, 64, 1, "#c9bd9e");
  for (let i = 0; i < 6; i++){ const x = 11 + i * 11; r(x - 1, 44, 6, 1, "#efe6d2"); r(x, 45, 4, 13, "#fbf5e6"); r(x + 3, 45, 1, 13, "#d9ceb4"); r(x + 1, 45, 1, 13, "#efe6d2"); }
  for (let i = 0; i < 9; i++){ r(8 + i * 3, 40 - i, 64 - i * 6, 1, "#f4ecd8"); }
  r(8, 40, 64, 1, "#c9bd9e"); r(30, 36, 20, 3, "#d9784a"); r(34, 34, 12, 2, "#d9784a"); r(38, 32, 4, 2, "#d9784a");
  // ô liu, bách
  r(167, 54, 3, 10, "#7a5a3a"); disc(168, 49, 7, "#8fae6e"); disc(162, 53, 5, "#7f9e60"); disc(175, 53, 5, "#7f9e60"); r(165, 46, 4, 2, "#b5cd96");
  r(100, 56, 3, 8, "#6b4a30");
  for (let y = -10; y <= 10; y++){ const w = Math.round(3 * Math.sqrt(1 - (y / 10) ** 2)); r(102 - w, 47 + y, 2 * w + 1, 1, "#3f7a4a"); }
  // hàng rào + amphora
  r(0, 66, FW, 1, "#d9ceb4"); for (let x = 0; x < FW; x += 12){ r(x, 62, 2, 6, "#efe6d2"); r(x, 62, 2, 1, "#c9bd9e"); }
  const amph = (x, y) => { r(x, y - 6, 5, 6, "#c4663a"); r(x + 1, y - 8, 3, 2, "#c4663a"); r(x, y - 9, 5, 1, "#a04e28"); r(x - 1, y - 7, 1, 3, "#a04e28"); r(x + 5, y - 7, 1, 3, "#a04e28"); r(x, y - 4, 5, 1, "#2b1b3d"); };
  amph(84, 66); amph(180, 98);
  FLOWERS.forEach(([x, y, col]) => { r(x, y, 1, 1, col); r(x, y + 1, 1, 1, "#4f9a44"); });
  // nền đá + hoa văn mê cung Hy Lạp
  r(0, 100, FW, 8, "#e8dcc0"); r(0, 100, FW, 1, "#c9bd9e");
  for (let x = 1; x < FW; x += 8){ r(x, 102, 6, 1, "#c4663a"); r(x, 102, 1, 5, "#c4663a"); r(x, 106, 6, 1, "#c4663a"); r(x + 5, 104, 1, 3, "#c4663a"); r(x + 2, 104, 4, 1, "#c4663a"); }
  return c;
}

