/* Sinh js/data/questions-dvls.js (phần riêng «Hành trình Duy vật lịch sử», c = 5)
   từ data/hanh-trinh-duy-vat-lich-su.md (đề + đáp án gốc) và data/research_notes/Hành trình DVLS/p*.json
   (giải thích đã đối chiếu giáo trình: e, w theo chữ cái phương án, s, v, k; "fix" = sửa đề/phương án/đáp án).
   Chạy lại mỗi khi sửa một trong hai nguồn:  node tools/build-dvls.js */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const md = fs.readFileSync(path.join(root, "data/hanh-trinh-duy-vat-lich-su.md"), "utf8").replace(/\r/g, "");
const notesDir = path.join(root, "data/research_notes/Hành trình DVLS");
const notes = new Map(fs.readdirSync(notesDir).filter(f => /^p\d\.json$/.test(f)).sort()
  .flatMap(f => JSON.parse(fs.readFileSync(path.join(notesDir, f), "utf8"))).map(n => [n.id, n]));

const GT = "[GT Triết học Mác-Lênin (Bộ GD&ĐT, 2021)](https://fbs.upt.edu.vn/wp-content/uploads/2021/06/GT-Triet-hoc-Mac-Lenin-Khong-chuyen-7.pdf)";
const SEC = {"I.1":"Sản xuất vật chất là cơ sở của sự tồn tại và phát triển xã hội","I.2":"Biện chứng giữa lực lượng sản xuất và quan hệ sản xuất",
  "I.3":"Biện chứng giữa cơ sở hạ tầng và kiến trúc thượng tầng","I.4":"Sự phát triển các hình thái kinh tế - xã hội là quá trình lịch sử - tự nhiên",
  "II.1":"Vấn đề giai cấp và đấu tranh giai cấp","II.2":"Dân tộc","II.3":"Mối quan hệ giai cấp - dân tộc - nhân loại","III.1":"Nhà nước","III.2":"Cách mạng xã hội",
  "IV.1":"Tồn tại xã hội","IV.2":"Ý thức xã hội và kết cấu của ý thức xã hội","V.1":"Khái niệm con người và bản chất con người",
  "V.2":"Hiện tượng tha hóa con người và vấn đề giải phóng con người","V.3":"Cá nhân và xã hội; quần chúng nhân dân và lãnh tụ","V.4":"Vấn đề con người trong sự nghiệp cách mạng ở Việt Nam"};
// "§I.2" → "Ch.3, mục I.2 (tên mục)"; "§IV.2 (d. …)" giữ chú thích riêng. Nguồn có § thì gắn link giáo trình ở đầu.
const src = s => { let any = false;
  const t = s.replace(/§([IV]+\.\d)(\s*\([^)]*\))?/g, (_, k, own) => { any = true; if (!SEC[k]) throw new Error("Không có mục " + k); return `Ch.3, mục ${k}` + (own || ` (${SEC[k]})`); });
  return any ? `${GT}, ${t}` : t.replace(/^Ch\.\d/, m => `${GT}, ${m}`); };

const PART = ["", "I", "II", "III", "IV", "V"], L = "ABCDEF";
const out = [], errs = [];
let part = 0;
for (const b of md.split(/\n(?=## Phần |### Câu )/)){
  if (b.startsWith("## Phần")){ part++; continue; }
  const m = b.match(/^### Câu ([IVX]+\.\d+) \*\((.+?)\)\*/); if (!m) continue;
  const [, id, type] = m, n = notes.get(id);
  if (!n){ errs.push(id + ": thiếu ghi chú"); continue; }
  const body = b.split("\n").slice(1).join("\n");
  const [pre, rest] = body.split("**Đáp án:**"), ans = rest.split("**Giải thích:**")[0].trim();
  const o = [], ql = [];
  for (const l of pre.trim().split("\n")){ const x = l.match(/^- ([A-F])\. (.*)$/); x ? o.push(x[2].trim()) : ql.push(l.replace(/\s+$/, "")); }
  let q = ql.join("\n").trim(), a, f;
  if (type === "Đúng/Sai"){ o.push("Đúng", "Sai"); a = ans.startsWith("Đúng") ? 0 : 1; f = 1; }
  else if (type !== "Sắp xếp") a = L.indexOf(ans[0]);
  if (n.fix){ q = n.fix.q ?? q; if (n.fix.o) o.splice(0, o.length, ...n.fix.o); a = n.fix.a ?? a; }
  if (!(a >= 0 && a < o.length)) errs.push(id + ": đáp án không hợp lệ");
  // w theo chữ cái → mảng theo vị trí; phải giải thích đủ mọi phương án sai và không giải thích phương án đúng
  const w = o.map((_, i) => n.w[L[i]] || "");
  o.forEach((_, i) => { if (i === a && w[i]) errs.push(`${id}: có giải thích «sai» cho đáp án đúng ${L[i]}`); if (i !== a && !w[i]) errs.push(`${id}: thiếu lý do sai cho ${L[i]}`); });
  const r = {q, o, a: [a], e: n.e, w, s: src(n.s), c: 5, v: n.v, id: "dv-" + id, p: part, t: type};
  if (n.k) r.k = n.k;
  if (f) r.f = 1;
  out.push(r);
}
for (const id of notes.keys()) if (!out.some(r => r.id === "dv-" + id)) errs.push(id + ": ghi chú thừa (không có câu trong .md)");
if (errs.length){ console.error(errs.join("\n")); process.exit(1); }

const head = "/* SINH TỰ ĐỘNG bởi tools/build-dvls.js — đừng sửa tay. Phần riêng «Hành trình Duy vật lịch sử» (c = 5, p = Phần I–V, t = loại câu) */\n";
fs.writeFileSync(path.join(root, "js/data/questions-dvls.js"), head + "RAW.push(...[\n" + out.map(r => JSON.stringify(r)).join(",\n") + "\n]);\n");
const by = k => Object.entries(out.reduce((m, r) => (m[r[k]] = (m[r[k]] || 0) + 1, m), {})).map(([x, c]) => `${k === "p" ? "Phần " + PART[x] : x} ${c}`).join(" · ");
console.log(`questions-dvls.js: ${out.length} câu\n  ${by("p")}\n  ${by("t")}\n  ${by("v")}`);
