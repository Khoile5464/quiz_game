/* Sinh dữ liệu thẻ Study Guide cho app từ dữ liệu S + TRAPS trong <script> của trang:
   study-guide.html → js/data/guide.js (GUIDE, MLN111) · study-guide-mln122.html → js/data/guide-mln122.js (GUIDE122, MLN122).
   Chạy lại mỗi khi sửa một Study Guide:  node tools/build-guide.js */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");

for (const [page, file, name] of [["study-guide.html", "guide.js", "GUIDE"], ["study-guide-mln122.html", "guide-mln122.js", "GUIDE122"]]){
  const html = fs.readFileSync(path.join(root, page), "utf8");
  const a = html.indexOf("const S=["), b = html.indexOf("/* ---------- render");
  if (a < 0 || b < a) throw new Error("Không tìm thấy dữ liệu S/TRAPS trong " + page);
  const {S, TRAPS} = new Function(html.slice(a, b) + ";return {S, TRAPS};")();

  const secs = S.map(s => {
    const cards = s.cards.map(([t, b], j) => ({t, b, k: `${s.id}-${j}`}));
    // bảng (VD: 3 quy luật) → một thẻ riêng, neo về đầu chương
    if (s.table) cards.push({t: s.table.h.join(" · "), b: s.table.r.map(r => r.join(" — ")), k: s.id});
    return {id: s.id, ic: s.ic, t: s.t, cards};
  });
  secs.push({id: "traps", ic: "🪤", t: "Bẫy hay gặp & mẹo nhớ", cards: TRAPS.map(([t, d]) => ({t, b: [d], k: "traps"}))});

  const out = `/* SINH TỰ ĐỘNG bởi tools/build-guide.js từ ${page} — đừng sửa tay */\nconst ${name} = ` + JSON.stringify(secs) + ";\n";
  fs.writeFileSync(path.join(root, "js/data", file), out);
  console.log(`${file}: ${secs.length} mục, ${secs.reduce((n, s) => n + s.cards.length, 0)} thẻ`);
}
