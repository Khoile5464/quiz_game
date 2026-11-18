/* Sinh js/data/questions-ipr102.js (môn IPR102 · Quyền sở hữu trí tuệ, m = "ipr", c = 1–6 theo chương)
   và data/ipr102/IPR102_VI.md (bản dịch tiếng Việt của cả đề) từ:
   - data/ipr102/questions.json: đề gốc tiếng Anh đã đối chiếu với PDF (q, o, a = chỉ số đáp án đúng, c = chương, f = 1: có phương án tham chiếu chéo như "A và B", "All are correct" → giữ nguyên thứ tự)
   - data/ipr102/notes/e*.jsonl: lời giải «Vì sao đúng» từng câu (n, e)
   - data/ipr102/vi/p*.jsonl: bản dịch từng câu (n, q, o; k = lưu ý khi đáp án của đề có nghi vấn)
   Chạy lại mỗi khi sửa một trong hai nguồn:  node tools/build-ipr102.js */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const src = JSON.parse(fs.readFileSync(path.join(root, "data/ipr102/questions.json"), "utf8"));
const viDir = path.join(root, "data/ipr102/vi");
const vi = new Map();
for (const f of fs.readdirSync(viDir).filter(f => /^p\d+\.jsonl$/.test(f)).sort())
  for (const l of fs.readFileSync(path.join(viDir, f), "utf8").split("\n").filter(l => l.trim())) { const r = JSON.parse(l); vi.set(r.n, r); }

const notes = new Map(); // data/ipr102/notes/e*.jsonl: {n, e = vì sao đúng}
const noteDir = path.join(root, "data/ipr102/notes");
for (const f of fs.readdirSync(noteDir).filter(f => /^e\d+\.jsonl$/.test(f)).sort())
  for (const l of fs.readFileSync(path.join(noteDir, f), "utf8").split(String.fromCharCode(10)).filter(l => l.trim())) { const r = JSON.parse(l); if (notes.has(r.n)) throw new Error("trùng lời giải #" + r.n); notes.set(r.n, r.e); }

const CH = {1: "Tổng quan, điều ước quốc tế & chuyển giao", 2: "Bản quyền: đối tượng, quyền & thời hạn", 3: "Bản quyền: vi phạm & ngoại lệ",
  4: "Nhãn hiệu: đăng ký & phân loại", 5: "Passing off, tên miền & xâm phạm nhãn hiệu", 6: "Kiểu dáng & sáng chế"};
const L = "ABCDEF", errs = [], seen = new Set();
const rows = src.map(r => {
  const tag = `#${r.n} ${r.q.slice(0, 40)}`, v = vi.get(r.n);
  if (!r.q || r.o.length < 2) errs.push(tag + ": thiếu đề hoặc phương án");
  if (!r.a.length || r.a.some(a => !(a >= 0 && a < r.o.length))) errs.push(tag + ": đáp án không hợp lệ");
  if (!CH[r.c]) errs.push(tag + ": chương không hợp lệ");
  const k = r.q + "|" + r.o.join("|"); if (seen.has(k)) errs.push(tag + ": trùng câu"); seen.add(k);
  if (!v) { errs.push(tag + ": thiếu bản dịch"); return null; }
  if (!v.q) errs.push(tag + ": bản dịch thiếu đề");
  const e = notes.get(r.n); if (!e || e.length < 20) errs.push(tag + ": thiếu lời giải thích (e)");
  if (v.o.length !== r.o.length || v.o.some(x => !x)) errs.push(tag + `: bản dịch có ${v.o.length} phương án, đề gốc ${r.o.length}`);
  return {q: r.q, o: r.o, a: r.a, m: "ipr", c: r.c, n: r.n, ...(r.f ? {f: 1} : {}), e, vi: {q: v.q, o: v.o}, ...(v.k ? {k: v.k} : {})};
});
for (const n of notes.keys()) if (!src.some(r => r.n === n)) errs.push(`lời giải #${n}: không có câu`);
for (const n of vi.keys()) if (!src.some(r => r.n === n)) errs.push(`bản dịch #${n}: không có câu`);
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }

fs.writeFileSync(path.join(root, "js/data/questions-ipr102.js"),
  `/* SINH TỰ ĐỘNG bởi tools/build-ipr102.js — đừng sửa tay. Môn IPR102 (Quyền sở hữu trí tuệ): m = "ipr", c = chương 1–6, vi = bản dịch tiếng Việt (đừng dùng v: đã là nhãn kiểm chứng ở bộ câu MLN111) */\nRAW.push(...[\n${rows.map(r => JSON.stringify(r)).join(",\n")}\n]);\n`);

/* bản dịch tiếng Việt dạng markdown, giữ số thứ tự câu của IPR102.md */
const ranges = ns => { const out = []; for (let i = 0; i < ns.length; i++) { let j = i; while (ns[j + 1] === ns[j] + 1) j++; out.push(j > i + 1 ? `${ns[i]}–${ns[j]}` : ns.slice(i, j + 1).join(", ")); i = j; } return out.join(", "); };
const md = ["# QUIZ IPR102 – QUYỀN SỞ HỮU TRÍ TUỆ (BẢN DỊCH TIẾNG VIỆT)", "",
  "> Bản dịch tiếng Việt của `IPR102.md` (372 câu trắc nghiệm, nguồn Quizlet của Đan Chú Bé: https://quizlet.com/_h8x9l). Giữ nguyên số thứ tự câu, thứ tự và chữ cái phương án so với bản tiếng Anh.",
  "> Thuật ngữ then chốt giữ kèm tiếng Anh trong ngoặc ở lần đầu cần thiết (design right, passing off, fair dealing, paternity right…).",
  "> Dòng 💡 giải thích vì sao đáp án đúng. Dòng ⚠️ ghi chú những câu mà đáp án của đề có nghi vấn hoặc mâu thuẫn với câu khác; đáp án vẫn giữ đúng như đề gốc.", "",
  "## Phân chương học tập", "", "| Chương | Nội dung | Số câu | Các câu |", "|---|---|---|---|"];
for (const c of Object.keys(CH)) { const ns = src.filter(r => r.c == c).map(r => r.n); md.push(`| Ch.${c} | ${CH[c]} | ${ns.length} | ${ranges(ns)} |`); }
md.push("", "---", "");
for (let i = 0; i < src.length; i++) {
  const r = src[i], v = vi.get(r.n);
  md.push(`**${r.n}. ${v.q}**`, ...v.o.map((t, j) => `- ${L[j]}. ${t}`), `- **Đáp án: ${r.a.map(j => `${L[j]}. ${v.o[j]}`).join(" | ")}**`);
  md.push("", `> 💡 ${rows[i].e}`);
  if (v.k) md.push("", `> ⚠️ ${v.k}`);
  md.push("");
}
fs.writeFileSync(path.join(root, "data/ipr102/IPR102_VI.md"), md.join("\n"));
const per = Object.keys(CH).map(c => `Ch.${c}: ${src.filter(r => r.c == c).length}`);
console.log(`OK ${src.length} câu · ${per.join(" · ")} · ${rows.filter(r => r.f).length} câu giữ thứ tự đáp án · ${rows.filter(r => r.k).length} câu có lưu ý đáp án`);
