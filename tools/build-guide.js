/* Sinh js/data/guide.js từ study-guide.html (dữ liệu S + TRAPS trong <script> của trang).
   Chạy lại mỗi khi sửa Study Guide:  node tools/build-guide.js */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "study-guide.html"), "utf8");
const a = html.indexOf("const S=["), b = html.indexOf("/* ---------- render");
if (a < 0 || b < a) throw new Error("Không tìm thấy dữ liệu S/TRAPS trong study-guide.html");
const {S, TRAPS} = new Function(html.slice(a, b) + ";return {S, TRAPS};")();

const secs = S.map(s => {
  const cards = s.cards.map(([t, b], j) => ({t, b, k: `${s.id}-${j}`}));
  // bảng (VD: 3 quy luật) → một thẻ riêng, neo về đầu chương
  if (s.table) cards.push({t: s.table.h.join(" · "), b: s.table.r.map(r => r.join(" — ")), k: s.id});
  return {id: s.id, ic: s.ic, t: s.t, cards};
});
secs.push({id: "traps", ic: "🪤", t: "Bẫy hay gặp & mẹo nhớ", cards: TRAPS.map(([t, d]) => ({t, b: [d], k: "traps"}))});

const out = "/* SINH TỰ ĐỘNG bởi tools/build-guide.js từ study-guide.html — đừng sửa tay */\nconst GUIDE = " + JSON.stringify(secs) + ";\n";
fs.writeFileSync(path.join(root, "js/data/guide.js"), out);
console.log(`guide.js: ${secs.length} mục, ${secs.reduce((n, s) => n + s.cards.length, 0)} thẻ`);
