/* ---------- giọng ghi âm cho từng con (IndexedDB) ---------- */
const VDB = (() => {
  let p;
  const open = () => p || (p = new Promise((res, rej) => { try{ const r = indexedDB.open("mln111_voice", 1); r.onupgradeneeded = () => r.result.createObjectStore("v"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }catch(e){ rej(e); } }));
  const tx = (mode, fn) => open().then(db => new Promise((res, rej) => { const t = db.transaction("v", mode), q = fn(t.objectStore("v")); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); }));
  return {get: id => tx("readonly", s => s.get(id)), put: (id, b) => tx("readwrite", s => s.put(b, id)), del: id => tx("readwrite", s => s.delete(id)), all: () => tx("readonly", s => s.getAll()), clear: () => tx("readwrite", s => s.clear())};
})();
const vUrl = {};
async function voiceUrl(id){ if (vUrl[id]) return vUrl[id]; const b = await VDB.get(id); return b ? (vUrl[id] = URL.createObjectURL(b)) : null; }
function playUrl(url, pitch){
  const c = SFX(); if (!c.fx || !c.vol) return;
  const au = new Audio(url); au.volume = Math.min(1, c.vol / 70);
  au.preservesPitch = au.mozPreservesPitch = au.webkitPreservesPitch = false; au.playbackRate = pitch || 1;
  au.play().catch(() => {});
}
async function animalVoice(a){
  if (!a.voice){ animalSnd(a.t); return; }
  let url = null, ok = true; try{ url = await voiceUrl(a.id); }catch(e){ ok = false; }
  if (!url){
    if (ok){ a.voice = false; save(); renderSel(); toast(`🎙️ Giọng của ${a.name} không còn trên trình duyệt này, hãy ghi lại nha`); }
    animalSnd(a.t); return;
  }
  playUrl(url, a.vp);
}
/* phát hiện giọng bị mất (đổi địa chỉ web, xoá dữ liệu trang, khôi phục từ file sao lưu cũ) và báo thay vì im lặng */
async function checkVoices(){
  let lost = 0, have = 0;
  for (const a of S.farm.animals.filter(x => x.voice)){
    try{ if (await VDB.get(a.id)){ have++; voiceUrl(a.id).catch(() => {}); } else { a.voice = false; lost++; } }catch(e){}
  }
  if (lost){ save(); renderSel(); setTimeout(() => toast(`🎙️ ${lost} giọng ghi âm không còn trên trình duyệt này. Ghi lại, hoặc khôi phục từ file sao lưu có kèm giọng`), 1200); }
  if (have) try{ navigator.storage && navigator.storage.persist && navigator.storage.persist(); }catch(e){}
}
function voiceDrop(id){ VDB.del(id).catch(() => {}); if (vUrl[id]){ URL.revokeObjectURL(vUrl[id]); delete vUrl[id]; } }
checkVoices();

function openVoice(a){
  clearTimeout(gT); clearInterval(gAnim); gb.onclick = null; gb.className = "gbox";
  let blob = null, url = null, rec = null, stream = null, tick = 0, recording = false, pitch = a.vp || 1;
  const bar = el("div", "vbar"), fill = el("i"); bar.append(fill);
  const recBtn = el("button", "btn"), playBtn = el("button", "btn blue", "▶ Nghe thử"), saveBtn = el("button", "btn", "💾 Lưu giọng"), delBtn = el("button", "btn lav", "🗑 Xoá giọng"), closeBtn = el("button", "btn lav", "Đóng");
  const pl = el("span", "", ""), sl = el("input"); sl.type = "range"; sl.min = ".6"; sl.max = "1.8"; sl.step = ".05"; sl.value = pitch; sl.setAttribute("aria-label", "Cao độ giọng");
  const sync = () => {
    recBtn.textContent = recording ? "■ Dừng" : blob ? "● Ghi lại" : "● Bắt đầu ghi";
    playBtn.disabled = !blob || recording; saveBtn.disabled = recording || !(blob || (a.voice && pitch !== (a.vp || 1))); delBtn.disabled = !a.voice || recording;
    pl.textContent = `Cao độ ×${pitch.toFixed(2)}`;
  };
  sl.oninput = () => { pitch = +sl.value; sync(); };
  const stopRec = () => { if (rec && rec.state === "recording") rec.stop(); };
  recBtn.onclick = async () => {
    if (recording){ stopRec(); return; }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder){ toast("Địa chỉ này chưa cho ghi âm (cần https hoặc localhost) 🥲"); return; }
    try{ stream = await navigator.mediaDevices.getUserMedia({audio: true}); }catch(e){ toast("Chưa được cấp quyền micro 🥲"); return; }
    const chunks = []; rec = new MediaRecorder(stream);
    rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    rec.onstop = () => {
      stream.getTracks().forEach(t => t.stop()); clearInterval(tick); recording = false; fill.style.width = "0";
      if (chunks.length){ blob = new Blob(chunks, {type: rec.mimeType || "audio/webm"}); if (url) URL.revokeObjectURL(url); url = URL.createObjectURL(blob); }
      sync(); if (url) playUrl(url, pitch);
    };
    rec.start(); recording = true; const t0 = performance.now(); sync();
    tick = setInterval(() => { const p = (performance.now() - t0) / 3000; fill.style.width = Math.min(100, p * 100) + "%"; if (p >= 1) stopRec(); }, 50);
  };
  playBtn.onclick = () => { if (url) playUrl(url, pitch); };
  saveBtn.onclick = async () => {
    try{
      if (blob){ await VDB.put(a.id, blob); if (vUrl[a.id]) URL.revokeObjectURL(vUrl[a.id]); vUrl[a.id] = URL.createObjectURL(blob); }
      a.voice = true; a.vp = pitch; save(); try{ navigator.storage && navigator.storage.persist && navigator.storage.persist(); }catch(e){} toast(`🎙️ Đã lưu giọng cho ${a.name}`); renderSel(); closeG();
    }catch(e){ toast("Không lưu được giọng (trình duyệt chặn bộ nhớ) 🥲"); }
  };
  delBtn.onclick = () => { voiceDrop(a.id); a.voice = false; a.vp = 1; save(); toast("Đã xoá giọng, quay về tiếng mặc định"); renderSel(); closeG(); };
  closeBtn.onclick = closeG;
  gCleanup = () => { stopRec(); if (stream) stream.getTracks().forEach(t => t.stop()); clearInterval(tick); if (url) URL.revokeObjectURL(url); };
  if (a.voice) voiceUrl(a.id).then(u => { if (u && !blob){ fetch(u).then(r => r.blob()).then(b => { blob = b; url = URL.createObjectURL(b); sync(); }); } }).catch(() => {});
  const row = el("div", "vrow"); row.append(pl, sl);
  const act = el("div", "gact"); act.append(recBtn, playBtn, saveBtn); const act2 = el("div", "gact"); act2.append(delBtn, closeBtn);
  gb.replaceChildren(el("h3", "", `🎙️ Giọng của ${a.name}`), el("p", "gnote", "Ghi âm tối đa 3 giây · giọng chỉ lưu trên máy này. Bấm vào bé sẽ nghe lại giọng bạn."), bar, act, row, act2);
  sync(); gm.classList.remove("hidden"); recBtn.focus({preventScroll: true});
}
$("voiceSel").onclick = () => { const a = S.farm.animals.find(x => x.id === selId); if (a) openVoice(a); };
