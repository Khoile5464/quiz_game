/* Bản sao tiến trình thứ hai trong IndexedDB + xin trình duyệt «lưu bền».
   Lý do: tiến trình nằm trong localStorage; có trình duyệt/trình dọn dẹp xoá localStorage (Safari xoá sau ~7 ngày không dùng,
   «xoá dữ liệu trang», chế độ tiết kiệm bộ nhớ…) nên người dùng không hay sao lưu .json sẽ mất hết. Mỗi lần save() ta chép một bản
   sang IndexedDB; mở app mà localStorage trống nhưng bản sao còn thì tự khôi phục. Không bao giờ ghi đè bản sao bằng dữ liệu trống. */
const Mirror = (() => {
  const DB = "tqg_mirror", ST = "kv";
  let dbp = null, timer = 0;
  const open = () => dbp || (dbp = new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(ST);
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  }));
  const put = (k, v) => open().then(db => new Promise((res, rej) => { const t = db.transaction(ST, "readwrite"); t.objectStore(ST).put(v, k); t.oncomplete = res; t.onerror = () => rej(t.error); }));
  const get = k => open().then(db => new Promise((res, rej) => { const r = db.transaction(ST).objectStore(ST).get(k); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
  const del = k => open().then(db => new Promise((res, rej) => { const t = db.transaction(ST, "readwrite"); t.objectStore(ST).delete(k); t.oncomplete = res; t.onerror = () => rej(t.error); }));
  const hasProgress = s => !!s && (s.answered > 0 || s.xp > 0 || (s.farm && s.farm.animals && s.farm.animals.length > 0) || Object.keys(s.stats || {}).length > 0);
  const queue = () => { clearTimeout(timer); timer = setTimeout(() => { if (hasProgress(S)) put("progress", JSON.stringify(S)).catch(() => {}); }, 1200); };
  const clear = () => { clearTimeout(timer); return del("progress").catch(() => {}); };
  async function boot(){
    try{ if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); }catch(e){} // xin «lưu bền»: trình duyệt không tự dọn khi thiếu bộ nhớ
    try{
      if (typeof indexedDB === "undefined") return;
      if (hasProgress(S)){ queue(); return; }
      const raw = await get("progress"); if (!raw) return;
      const d = JSON.parse(raw); if (!hasProgress(d)) return;
      S = normFull(Object.assign(fresh(), d)); save();
      if (typeof renderHome === "function") renderHome();
      if (typeof toast === "function") toast("♻️ Đã khôi phục tiến trình từ bản sao trong trình duyệt");
    }catch(e){}
  }
  setTimeout(boot, 0);
  return {queue, clear};
})();
