/* Kiểm tra phần «Câu chuyện KTCT» (MLN122):
   1. công thức mô phỏng (js/story/formulas.js) khớp các ví dụ số trong slide bài giảng;
   2. độ phủ: mỗi thẻ Study Guide của hồi đã có cảnh dạy, mỗi câu quiz chốt tồn tại và đúng chương.
   Chạy:  node tools/test-story.js */
const fs = require("fs"), path = require("path"), assert = require("assert");
const root = path.join(__dirname, "..");
const M = require(path.join(root, "js/story/formulas.js"));
const near = (a, b, msg) => assert(Math.abs(a - b) < 1e-9, `${msg}: ${a} ≠ ${b}`);
let ok = 0; const t = (name, fn) => { fn(); ok++; console.log("  ✓ " + name); };

console.log("Công thức");
t("Xưởng sợi (slide Session 8): 20 kg, W = 30$, k = 27$, m = 3$, m′ = 100%", () => {
  const d = M.millDay();
  near(d.kg, 20, "kg"); near(d.c, 24, "c"); near(d.v, 3, "v"); near(d.W, 30, "W"); near(d.k, 27, "k"); near(d.m, 3, "m");
  near(d.rate, 1, "m′"); near(d.t, 6, "t"); near(d.tSurplus, 6, "t′"); near(d.newValue, 6, "v + m"); near(d.mExcess, 0, "siêu ngạch");
});
t("m′ = m/v = t′/t", () => { const d = M.millDay({hours: 10}); near(d.rate, M.surplusRateByTime(d.tSurplus, d.t), "m′"); });
t("GTTD tuyệt đối: kéo dài ngày 12 → 14 h, t không đổi, m tăng 1$", () => {
  const a = M.millDay(), b = M.millDay({hours: 14}); near(b.t, a.t, "t"); near(b.m - a.m, 1, "Δm");
});
t("GTTD tương đối: NSLĐ ngành tư liệu sinh hoạt ×1,5 → giá trị SLĐ 2$, t = 4 h, m′ = 200%", () => {
  const d = M.millDay({wageGoods: 1.5}); near(d.lpv, 2, "giá trị SLĐ"); near(d.t, 4, "t"); near(d.rate, 2, "m′");
});
t("GTTD siêu ngạch: máy tốt gấp đôi, bán theo giá trị xã hội → m siêu ngạch = 6$", () => {
  const d = M.millDay({tech: 2}); near(d.mExcess, 6, "m siêu ngạch"); near(d.mNormal, 3, "m bình thường");
});
t("Trả công dưới giá trị SLĐ bị đánh dấu", () => { assert(M.millDay({wage: 2}).belowValue); assert(!M.millDay().belowValue); });
t("Lợi nhuận bình quân (slide Session 11): 80c+20v, 70c+30v, 60c+40v, m′ = 100% → p̄′ = 30%, giá cả SX = 130", () => {
  const r = M.averageProfit([{c: 80, v: 20}, {c: 70, v: 30}, {c: 60, v: 40}], 1);
  near(r.avg, .3, "p̄′"); r.rows.forEach(x => near(x.price, 130, "giá cả sản xuất"));
  near(r.rows[0].value, 120, "giá trị ngành cơ khí"); near(r.rows[2].p1, .4, "p′ ngành da");
});
t("Công thức rời: W = c+v+m, M = m′·V, p′ = p/(c+v), n = CH/ch", () => {
  near(M.valueOf(24, 3, 3), 30, "W"); near(M.surplusMass(2, 5000), 10000, "M"); near(M.profitRate(20, 80, 20), .2, "p′"); near(M.turnover(12, 3), 4, "n");
});
t("Tích lũy: tư bản hóa 60% m, đầu tư với c/v = 12 → c/v toàn xưởng tăng từ 8", () => {
  const r = M.accumulate({c: 24, v: 3, m: 3, share: .6, organic: 12}); near(r.consumed, 1.2, "tiêu dùng"); near(r.c + r.v, 28.8, "tư bản"); assert(r.organic > 8, "c/v phải tăng");
});

t("Chợ vải: TGLĐXHCN 2 h/tấm; dệt 3 h lỗ 1, dệt 1 h lãi 1; khớp ngày 8 h ra 4 tấm, 2 đồng/tấm", () => {
  near(M.weaverSale({myHours: 3}).gain, -1, "dệt chậm"); near(M.weaverSale({myHours: 1}).gain, 1, "dệt nhanh"); assert(!M.weaverSale({myHours: 3}).meets);
  near(M.laborDay().unit, M.weaverSale().value, "giá trị 1 tấm ở hai phần mô phỏng");
});
t("NSLĐ ×2: số SP ×2, giá trị 1 SP giảm một nửa, tổng giá trị không đổi", () => {
  const a = M.laborDay(), b = M.laborDay({productivity: 2}); near(b.units, 2 * a.units, "SP"); near(b.unit, a.unit / 2, "giá trị 1 SP"); near(b.total, a.total, "tổng");
});
t("Cường độ ×1,5: số SP ×1,5, giá trị 1 SP không đổi, tổng giá trị ×1,5", () => {
  const a = M.laborDay(), b = M.laborDay({intensity: 1.5}); near(b.unit, a.unit, "giá trị 1 SP"); near(b.total, 1.5 * a.total, "tổng");
});
t("Tăng đồng thời NSLĐ và cường độ ×2: SP ×4, giá trị 1 SP giảm 2 lần, tổng ×2 (câu #53)", () => {
  const a = M.laborDay(), b = M.laborDay({productivity: 2, intensity: 2}); near(b.units, 4 * a.units, "SP"); near(b.unit, a.unit / 2, "1 SP"); near(b.total, 2 * a.total, "tổng");
});
t("Lao động phức tạp ×2 tạo giá trị gấp đôi trong cùng thời gian", () => near(M.laborDay({complexity: 2}).total, 2 * M.laborDay().total, "tổng"));
t("Cung = cầu → giá cả = giá trị; cung < cầu → giá cả > giá trị", () => {
  near(M.marketPrice(10, 50, 50), 10, "cân bằng"); assert(M.marketPrice(10, 60, 40) > 10); assert(M.marketPrice(10, 40, 60) < 10);
});
t("Lưu thông tiền: tổng giá cả 1.000, V = 5 → cần 200; phát hành 400 → mức giá ×2", () => {
  near(M.moneyNeeded(1000, 5), 200, "M"); near(M.priceLevel(400, M.moneyNeeded(1000, 5)), 2, "mức giá");
});

t("Cạnh tranh tự do: số xưởng giảm, tổng thị phần giữ 100, xưởng lớn nhất lớn thêm", () => {
  let s = [30, 25, 20, 15, 10]; for (let i = 0; i < 6; i++) s = M.competeYear(s);
  near(s.reduce((a, b) => a + b, 0), 100, "tổng thị phần"); assert(s.filter(x => x > 0).length < 5, "phải có xưởng bị thâu tóm"); assert(Math.max(...s) > 30);
});
t("Không có độc quyền (thị phần 0) thì giá = giá trị, không có lợi nhuận độc quyền", () => {
  const r = M.monopoly({share: 0}); near(r.sellP, 30, "giá bán"); near(r.buyP, 30, "giá mua"); near(r.extra, 0, "LN độc quyền");
});
t("Giá cả độc quyền chỉ phân phối lại: LN độc quyền cao = phần người mua + người bán nguyên liệu mất", () => {
  const r = M.monopoly({share: .8}); assert(r.sellP > 30 && r.buyP < 30); near(r.extra, r.fromBuyers + r.fromSuppliers, "phân phối lại");
});

console.log("Độ phủ nội dung");
const html = fs.readFileSync(path.join(root, "study-guide-mln122.html"), "utf8");
const {S: GUIDE} = new Function(html.slice(html.indexOf("const S=["), html.indexOf("/* ---------- render")) + ";return {S};")();
global.window = global; new Function(fs.readFileSync(path.join(root, "js/data/story-mln122.js"), "utf8") + ";global.STORY=STORY;")();
const qs = JSON.parse(fs.readFileSync(path.join(root, "data/mln122/questions.json"), "utf8"));
const errs = [];
for (const act of STORY.acts.filter(a => a.scenes.length)){
  const keys = new Set(), gate = [];
  for (const sc of act.scenes) for (const s of sc.steps){ if (s.type === "term") s.guide.forEach(k => keys.add(k)); if (s.type === "gate") gate.push(...s.qs); }
  const need = GUIDE.filter(s => act.guide.includes(s.id)).flatMap(s => s.cards.map((_, j) => `${s.id}-${j}`));
  const miss = need.filter(k => !keys.has(k));
  const tables = GUIDE.filter(s => act.guide.includes(s.id) && s.table).map(s => s.id); // bảng của một mục cũng là thẻ (neo về đầu mục)
  for (const k of keys) if (!need.includes(k) && !tables.includes(k)) errs.push(`${act.id}: thẻ ${k} không thuộc chương của hồi`);
  for (const n of gate){ const q = qs[n - 1]; if (!q) errs.push(`${act.id}: không có câu #${n}`); else if (q.c !== act.chapter) errs.push(`${act.id}: câu #${n} thuộc chương ${q.c}`); }
  const chapterQs = qs.filter(q => q.c === act.chapter).length;
  console.log(`  ${act.title}: ${act.scenes.length} cảnh · thẻ Study Guide ${need.length - miss.length}/${need.length} · ${gate.length} câu chốt (chương có ${chapterQs} câu)`);
  if (miss.length) errs.push(`${act.id}: thẻ chưa có cảnh dạy: ${miss.join(", ")}`);
}
if (errs.length){ console.error(errs.map(e => "  ✗ " + e).join("\n")); process.exit(1); }
console.log(`OK ${ok} kiểm tra công thức, độ phủ đủ.`);
