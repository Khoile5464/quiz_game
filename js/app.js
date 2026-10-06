/* ---------- events ---------- */
$("startBtn").onclick = () => startSession("new");
$("reviewBtn").onclick = () => startSession("review");
$("templeBtn").onclick = () => startSession("temple");
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
  if (e.key === "Enter"){ e.preventDefault(); if (!$("nextBtn").disabled) next(); return; }
  const k = e.key.toUpperCase();
  let pos = "12345".indexOf(k); if (pos < 0) pos = LETTERS.indexOf(k);
  if (pos >= 0 && pos < run.order.length) choose(run.order[pos]);
});

$("themeBtn").onclick = () => { S.theme = isNight() ? "day" : "night"; save(); applyTheme(S.theme); };
$("lofiBtn").onclick = () => Lofi.toggle();
applyTheme(S.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day"));
renderHome();
