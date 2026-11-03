/* Sinh js/data/questions-mln122.js (môn MLN122 · Kinh tế chính trị Mác - Lênin, m = "122", c = 1–6 theo chương)
   từ data/mln122/questions.json (đề + đáp án gốc từ bộ Quizlet; c = chương theo Schedule môn; f = 1: đáp án tham chiếu chéo, giữ nguyên thứ tự)
   và data/mln122/notes/c*.json (giải thích theo số thứ tự câu trong questions.json, bắt đầu từ 1:
   e = vì sao đúng, w = vì sao sai theo chữ cái phương án, s = mục giáo trình ("3.1.2" hoặc "3.1.2|ghi chú thêm"), k = nghi vấn về đáp án của đề).
   Chạy lại mỗi khi sửa một trong hai nguồn:  node tools/build-mln122.js */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const src = JSON.parse(fs.readFileSync(path.join(root, "data/mln122/questions.json"), "utf8"));
const notesDir = path.join(root, "data/mln122/notes");
const notes = new Map(fs.readdirSync(notesDir).filter(f => /^c\d\.json$/.test(f)).sort()
  .flatMap(f => Object.entries(JSON.parse(fs.readFileSync(path.join(notesDir, f), "utf8")))).map(([n, x]) => [+n, x]));

const GT = "GT Kinh tế chính trị Mác-Lênin (Bộ GD&ĐT, 2021)";
const SEC = {
  "1.1":"Khái quát sự hình thành và phát triển của KTCT Mác - Lênin", "1.2":"Đối tượng, mục đích và phương pháp nghiên cứu", "1.3":"Chức năng của KTCT Mác - Lênin",
  "2.1.1":"Sản xuất hàng hóa", "2.1.2":"Hàng hóa", "2.1.3":"Tiền tệ", "2.1.4":"Dịch vụ và các quan hệ trao đổi đặc biệt",
  "2.2.1":"Khái niệm, phân loại và vai trò của thị trường", "2.2.2":"Nền kinh tế thị trường và một số quy luật chủ yếu", "2.2.3":"Vai trò của một số chủ thể tham gia thị trường",
  "3.1.1":"Nguồn gốc của giá trị thặng dư", "3.1.2":"Bản chất của giá trị thặng dư", "3.1.3":"Các phương pháp sản xuất giá trị thặng dư",
  "3.2":"Tích lũy tư bản", "3.3":"Các hình thức biểu hiện của giá trị thặng dư trong nền kinh tế thị trường",
  "4.1":"Cạnh tranh ở cấp độ độc quyền trong nền kinh tế thị trường", "4.2.1":"Lý luận của V.I. Lênin về đặc điểm kinh tế của độc quyền",
  "4.2.2":"Lý luận của V.I. Lênin về đặc điểm kinh tế của độc quyền nhà nước", "4.3.1":"Biểu hiện mới của độc quyền", "4.3.2":"Biểu hiện mới của độc quyền nhà nước",
  "4.3.3":"Vai trò lịch sử của chủ nghĩa tư bản",
  "5.1":"Kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam", "5.2":"Hoàn thiện thể chế kinh tế thị trường định hướng XHCN", "5.3.1":"Lợi ích kinh tế và quan hệ lợi ích kinh tế",
  "5.3.2":"Vai trò nhà nước trong bảo đảm hài hòa các quan hệ lợi ích",
  "6.1.1":"Khái quát về cách mạng công nghiệp và công nghiệp hóa", "6.1.2":"Tính tất yếu khách quan và nội dung của CNH, HĐH ở Việt Nam", "6.2":"Hội nhập kinh tế quốc tế của Việt Nam"};
// "3.1.2" → link giáo trình + "Ch.3, mục 3.1.2 (Bản chất của GTTD)"; phần sau "|" giữ nguyên
const srcOf = s => { const [k, more] = s.split("|"); if (!SEC[k]) throw new Error("Không có mục " + k);
  return `${GT}, Ch.${k[0]}, mục ${k} (${SEC[k]})` + (more ? `; ${more.trim()}` : ""); };

const L = "ABCDEF", errs = [], seen = new Set();
const rows = src.map((r, i) => {
  const n = i + 1, tag = `#${n} ${r.q.slice(0, 40)}`;
  if (!r.q || r.o.length < 2) errs.push(tag + ": thiếu đề hoặc phương án");
  if (!r.a.length || r.a.some(a => !(a >= 0 && a < r.o.length))) errs.push(tag + ": đáp án không hợp lệ");
  if (!(r.c >= 1 && r.c <= 6)) errs.push(tag + ": chương không hợp lệ");
  const k = r.q + "|" + r.o.join("|");
  if (seen.has(k)) errs.push(tag + ": trùng câu"); seen.add(k);
  const out = {q: r.q, o: r.o, a: r.a, m: "122", c: r.c, n, ...(r.f ? {f: 1} : {})}; // n: số thứ tự trong questions.json (câu chốt của Câu chuyện KTCT dùng n)
  const x = notes.get(n);
  if (!x){ errs.push(tag + ": thiếu ghi chú giải thích"); return out; }
  if (!x.e) errs.push(tag + ": thiếu e");
  // w theo chữ cái → mảng theo vị trí; phải giải thích đủ mọi phương án sai và không giải thích phương án đúng
  const w = r.o.map((_, j) => x.w?.[L[j]] || "");
  r.o.forEach((_, j) => { if (!r.a.includes(j) && !w[j]) errs.push(`${tag}: thiếu w.${L[j]}`); if (r.a.includes(j) && w[j]) errs.push(`${tag}: w.${L[j]} là đáp án đúng`); });
  for (const l of Object.keys(x.w || {})) if (L.indexOf(l) < 0 || L.indexOf(l) >= r.o.length) errs.push(`${tag}: w.${l} không có phương án`);
  try { out.s = srcOf(x.s || ""); } catch (e) { errs.push(tag + ": " + e.message); }
  Object.assign(out, {e: x.e, w}, x.k ? {k: x.k} : {});
  return out;
});
for (const n of notes.keys()) if (!(n >= 1 && n <= src.length)) errs.push(`ghi chú #${n}: không có câu`);
if (errs.length){ console.error(errs.join("\n")); process.exit(1); }

fs.writeFileSync(path.join(root, "js/data/questions-mln122.js"),
  `/* SINH TỰ ĐỘNG bởi tools/build-mln122.js — đừng sửa tay. Môn MLN122 (Kinh tế chính trị Mác - Lênin): m = "122", c = chương 1–6 */\nRAW.push(...[\n${rows.map(r => JSON.stringify(r)).join(",\n")}\n]);\n`);
const per = [1, 2, 3, 4, 5, 6].map(c => `Ch.${c}: ${src.filter(r => r.c === c).length}`);
console.log(`OK ${src.length} câu · ${per.join(" · ")} · đủ giải thích, ${rows.filter(r => r.k).length} câu có nghi vấn đáp án`);
