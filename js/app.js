/* ---------- events ---------- */
$("startBtn").onclick = () => startSession("new");
$("reviewBtn").onclick = () => startSession("review");
$("templeBtn").onclick = () => startSession("temple");
$("giaideBtn").onclick = () => startSession("giaide");
$("onsaiBtn").onclick = () => startSession("onsai");
$("onsaiAgain").onclick = () => startSession("onsai");
$("giaideReset").onclick = () => { const g = giaideLeft(); if (g && !confirm(`Bỏ tiến độ đang làm (câu ${g.i + 1}/${g.ids.length}) và giải đề lại từ đầu theo phạm vi "${scopeLabel(scope)}"?`)) return; startSession("giaide", true); };
$("againBtn").onclick = () => startSession(lastMode);
$("homeBtn").onclick = () => { renderHome(); show("home"); };
$("nextBtn").onclick = next;
$("quitBtn").onclick = quit;
$("quitX").onclick = quit;
$("resetBtn").onclick = () => {
  if (!confirm("Xoá toàn bộ tiến trình học? Không thể hoàn tác đâu nha 🥺")) return;
  VDB.clear().catch(() => {}); for (const k in vUrl){ URL.revokeObjectURL(vUrl[k]); delete vUrl[k]; }
  const {theme, yt, ytVol, ytLoop, sfx: sfxCfg} = S; S = normFull(Object.assign(fresh(), {theme, yt, ytVol, ytLoop, sfx: sfxCfg})); save(); renderHome(); TV.render(); toast("Đã xoá, bắt đầu lại từ đầu ✦");
};
const blobToUrl = b => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(b); });
$("exportBtn").onclick = async () => {
  S.lastBackup = Date.now(); save(); renderBackupHint();
  const out = Object.assign({}, S), voices = {};
  for (const an of S.farm.animals) if (an.voice){ try{ const b = await VDB.get(an.id); if (b) voices[an.id] = await blobToUrl(b); }catch(e){} }
  const nv = Object.keys(voices).length; if (nv) out.voices = voices;
  const a = el("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], {type:"application/json"}));
  a.download = `mln111-progress-${today()}.json`; a.click(); URL.revokeObjectURL(a.href);
  if (nv) toast(`💾 Đã sao lưu kèm ${nv} giọng ghi âm`);
};
$("importBtn").onclick = () => $("importFile").click();
$("importFile").onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  try {
    const d = JSON.parse(await f.text()); if (!d.stats) throw 0;
    const voices = d.voices || {}; delete d.voices;
    S = normFull(Object.assign(fresh(), d)); S.lastBackup = Date.now(); save();
    try{
      for (const id in voices){ if (vUrl[id]){ URL.revokeObjectURL(vUrl[id]); delete vUrl[id]; } await VDB.put(id, await (await fetch(voices[id])).blob()); }
    }catch(err){ toast("Khôi phục xong, nhưng không nạp được giọng ghi âm 🥲"); }
    checkVoices(); renderHome(); const nv = Object.keys(voices).length; toast(nv ? `Khôi phục tiến trình và ${nv} giọng ghi âm 💾` : "Khôi phục tiến trình thành công 💾");
  }
  catch { toast("File không hợp lệ 🥺"); }
  e.target.value = "";
};
addEventListener("keydown", e => {
  if ($("quiz").classList.contains("hidden") || !run || e.target.closest?.("input,textarea,select")) return;
  if (e.ctrlKey || e.metaKey || e.altKey || document.querySelector(".brag")) return; // Ctrl+A/D… không phải chọn đáp án; popup danh hiệu đang mở thì không điều khiển quiz phía sau
  if (e.key === "Enter"){
    e.preventDefault();
    // Enter chỉ để chốt câu nhiều đáp án / sang câu tiếp; không bỏ qua câu chưa trả lời (tránh bấm đúp hoặc giữ Enter làm mất câu mới)
    if (!e.repeat && !$("nextBtn").disabled && (run.answered || run.qs[run.i].a.length > 1)) next();
    return;
  }
  if (e.repeat) return;
  const k = e.key.toUpperCase();
  let pos = "12345".indexOf(k); if (pos < 0) pos = LETTERS.indexOf(k);
  if (pos >= 0 && pos < run.order.length) choose(run.order[pos]);
});

/* mở app ở nhiều tab: tab khác vừa lưu (vd đang giải đề, vừa sai một câu) thì nạp lại S ngay,
   để kho câu sai, nút trang chủ và lượt ôn đang mở cập nhật tức thì, và tab này không ghi đè dữ liệu cũ lên */
let syncT = 0;
addEventListener("storage", e => {
  if (e.key !== KEY || e.newValue === null) return;
  try { S = normFull(JSON.parse(e.newValue)); } catch { return; }
  syncOnsaiRun(); updKho();
  clearTimeout(syncT); syncT = setTimeout(() => { if (!$("home").classList.contains("hidden")) renderHome(); }, 150);
});

$("themeBtn").onclick = () => { S.theme = isNight() ? "day" : "night"; save(); applyTheme(S.theme); };
$("lofiBtn").onclick = () => Lofi.toggle();
applyTheme(S.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day"));
renderHome();
