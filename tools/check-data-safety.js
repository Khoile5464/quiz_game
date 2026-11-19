/* Chốt chặn «cập nhật không được làm mất tiến trình người dùng».
   Tiến trình lưu theo id câu hỏi (js/core/config.js): id băm của (đề + phương án), hoặc q.id cố định kèm q.alt = id băm cũ.
   Nếu sửa chữ một câu đã phát hành, id đổi → mọi tiến trình của câu đó mất. Script này so với data/ids-snapshot.json
   (mọi id từng phát hành) và BÁO LỖI nếu id nào không còn xuất hiện (cả dạng id lẫn alt).
   Mỗi bản phát hành mới cũng phải: không đổi KEY (js/core/storage.js), không xoá/đổi tên loài thú đã có (SPECIES) — thú loài lạ được cất ở farm.hold chứ không bị xoá.
   Chạy trước mỗi lần phát hành:   node tools/check-data-safety.js
   Sau khi THÊM câu/môn mới:       node tools/check-data-safety.js --update   (chỉ thêm id, không bao giờ xoá) */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
const ctx = vm.createContext({}); vm.runInContext("var RAW = [];", ctx);
for (const f of fs.readdirSync(path.join(root, "js/data")).filter(f => /^questions.*\.js$/.test(f)).sort((a, b) => (a === "questions.js" ? -1 : b === "questions.js" ? 1 : a.localeCompare(b)))) // questions.js khai báo RAW nên chạy trước
  vm.runInContext(fs.readFileSync(path.join(root, "js/data", f), "utf8").replace(/^const RAW/m, "var RAW"), ctx, {filename: f});
const RAW = vm.runInContext("RAW", ctx);
const cur = new Map(); // id (hoặc alt) → nhãn
for (const r of RAW) {
  const h = hash(r.q + "|" + r.o.join("|")), id = r.id || h, tag = `${r.m || "111"}:${r.n || ""} ${r.q.slice(0, 40)}`;
  if (!cur.has(id)) cur.set(id, tag); // câu giống hệt giữa hai môn dùng chung id (sẵn có từ trước) nên không coi là lỗi
  if (id !== h && !cur.has(h)) cur.set(h, tag);
}
const snapPath = path.join(root, "data/ids-snapshot.json");
const snap = fs.existsSync(snapPath) ? JSON.parse(fs.readFileSync(snapPath, "utf8")) : {};
const lost = Object.keys(snap).filter(id => !cur.has(id));
if (lost.length) { console.error(`MẤT TIẾN TRÌNH: ${lost.length} id câu hỏi đã phát hành không còn:\n` + lost.slice(0, 20).map(id => "  " + id + "  " + snap[id]).join("\n") + "\nKhôi phục chữ câu cũ, hoặc đặt id cố định = id cũ và alt = id băm mới."); process.exit(1); }
const added = [...cur].filter(([id]) => !(id in snap));
if (process.argv.includes("--update")) { for (const [id, tag] of added) snap[id] = tag; fs.writeFileSync(snapPath, JSON.stringify(snap, null, 0)); console.log(`Đã cập nhật snapshot: +${added.length}, tổng ${Object.keys(snap).length}`); }
else console.log(`OK ${Object.keys(snap).length} id đã phát hành đều còn${added.length ? ` · ${added.length} id mới chưa vào snapshot (chạy --update)` : ""}`);
