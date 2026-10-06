/* ---------- nhắc sao lưu + xem dung lượng ---------- */
const DAY_MS = 864e5;
let backupNagged = false;
const backupDue = () => (S.answered > 0 || S.farm.animals.length > 0) && Date.now() - (S.lastBackup || S.firstUse) > 7 * DAY_MS;
function renderBackupHint(){
  const due = backupDue() || saveBad, b = $("exportBtn");
  b.textContent = due ? "💾 Sao lưu ❗" : "💾 Sao lưu"; b.classList.toggle("due", due);
  if (backupDue() && !backupNagged){
    backupNagged = true; const ref = S.lastBackup || S.firstUse, d = Math.floor((Date.now() - ref) / DAY_MS);
    setTimeout(() => toast(S.lastBackup ? `💾 Đã ${d} ngày bạn chưa sao lưu. Bấm "Sao lưu" để giữ dữ liệu an toàn nhé!` : `💾 Bạn chưa sao lưu lần nào (đã ${d} ngày). Bấm "Sao lưu" để giữ dữ liệu an toàn nhé!`), 1500);
  }
}
const fmtB = n => n >= 1048576 ? (n / 1048576).toFixed(1).replace(".", ",") + " MB" : Math.max(1, Math.round(n / 1024)) + " KB";
async function openStorage(){
  clearTimeout(gT); clearInterval(gAnim); gb.onclick = null; gb.className = "gbox";
  gb.replaceChildren(el("h3", "", "📊 Dung lượng lưu trữ"), el("p", "gnote", "Đang đọc…")); gm.classList.remove("hidden");
  const LS_MAX = 5e6;
  const lsChars = (localStorage.getItem(KEY) || "").length;
  let vBytes = 0, vCount = 0; try{ const all = await VDB.all(); vCount = all.length; vBytes = all.reduce((t, b) => t + (b && b.size || 0), 0); }catch(e){}
  let usage = 0, quota = 0, persisted = null;
  try{ if (navigator.storage && navigator.storage.estimate){ const e = await navigator.storage.estimate(); usage = e.usage || 0; quota = e.quota || 0; } }catch(e){}
  try{ if (navigator.storage && navigator.storage.persisted) persisted = await navigator.storage.persisted(); }catch(e){}
  const row = (title, sub, pct) => { const r = el("div", "srow"), bar = el("div", "sbar"), i = el("i"); i.style.width = Math.min(100, Math.max(2, pct)) + "%"; if (pct > 80) i.className = "warn"; bar.append(i); r.append(el("div", "", title), bar, el("small", "", sub)); return r; };
  const rows = [row(`Tiến trình học · ${fmtB(lsChars * 2)}`, `Chiếm khoảng ${Math.round(lsChars / LS_MAX * 100)}% giới hạn ~5 triệu ký tự của trình duyệt. Chỗ này không thể xin thêm.`, lsChars / LS_MAX * 100)];
  rows.push(row(`Giọng ghi âm · ${vCount} giọng · ${fmtB(vBytes)}`, quota ? `Nằm trong kho lưu lớn của trình duyệt (còn rất nhiều chỗ).` : "Không đọc được hạn mức của trình duyệt.", quota ? vBytes / quota * 100 : 2));
  if (quota) rows.push(row(`Tổng trang này đã dùng · ${fmtB(usage)} / ${fmtB(quota)}`, "Hạn mức do trình duyệt tự quyết theo dung lượng ổ đĩa còn trống.", usage / quota * 100));
  const ref = S.lastBackup, d = ref ? Math.floor((Date.now() - ref) / DAY_MS) : null;
  const info = el("p", "gnote", `${persisted === true ? "🔒 Trình duyệt đã đồng ý giữ dữ liệu ổn định." : persisted === false ? "⚠️ Dữ liệu có thể bị trình duyệt dọn khi máy đầy." : ""} ${ref ? `Sao lưu gần nhất: ${d === 0 ? "hôm nay" : d + " ngày trước"}.` : "Bạn chưa sao lưu lần nào."}`.trim());
  const act = el("div", "gact");
  const bk = el("button", "btn", "💾 Sao lưu ngay"); bk.onclick = () => { closeG(); $("exportBtn").onclick(); };
  act.append(bk);
  if (persisted === false && navigator.storage && navigator.storage.persist){ const pb = el("button", "btn blue", "🔒 Xin giữ ổn định"); pb.onclick = async () => { try{ await navigator.storage.persist(); }catch(e){} openStorage(); }; act.append(pb); }
  const cl = el("button", "btn lav", "Đóng"); cl.onclick = closeG; act.append(cl);
  gb.replaceChildren(el("h3", "", "📊 Dung lượng lưu trữ"), ...rows, info, act);
  cl.focus({preventScroll: true});
}
$("storageBtn").onclick = openStorage;

