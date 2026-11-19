/* Safari (iPhone/iPad/Mac) tự xoá localStorage + IndexedDB của trang web sau ~7 ngày dùng Safari mà không chạm vào trang (ITP),
   riêng web app đã «Thêm vào Màn hình chính» thì được miễn. Người dùng Safari nên cài app ra màn hình chính và sao lưu.
   Hiện thanh nhắc nhỏ ở trang chủ (chỉ Safari, chưa cài), tắt được; nhắc lại sau 14 ngày nếu chưa cài. */
(() => {
  const ua = navigator.userAgent, ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const safari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS|Android/.test(ua);
  const standalone = navigator.standalone === true || (matchMedia && matchMedia("(display-mode: standalone)").matches);
  if (standalone || !(ios || safari)) return;
  const K = "tqg_pwa_hint", DAY = 864e5;
  try{ const t = +localStorage.getItem(K); if (t && Date.now() - t < 14 * DAY) return; }catch(e){}
  const bar = document.createElement("div"); bar.className = "pwa-hint";
  const msg = document.createElement("div");
  msg.innerHTML = ios
    ? "📲 <b>Dùng Safari?</b> Safari tự xoá tiến trình và thú nông trại nếu ~7 ngày không mở. Hãy bấm <b>Chia sẻ ⬆</b> rồi <b>Thêm vào Màn hình chính</b> để giữ dữ liệu. App trên màn hình chính có kho riêng: <b>Sao lưu</b> ở đây trước, rồi mở app mới bấm <b>Khôi phục</b>."
    : "📲 <b>Dùng Safari?</b> Safari có thể xoá tiến trình nếu ~7 ngày không mở trang. Hãy <b>Sao lưu</b> thỉnh thoảng (hoặc Thêm vào Dock: Tệp → Thêm vào Dock) để giữ dữ liệu.";
  const row = document.createElement("div"); row.className = "pwa-row";
  const b1 = document.createElement("button"); b1.type = "button"; b1.className = "btn small blue"; b1.textContent = "💾 Sao lưu ngay";
  b1.onclick = () => { const x = document.getElementById("exportBtn"); if (x) x.click(); };
  const b2 = document.createElement("button"); b2.type = "button"; b2.className = "btn small lav"; b2.textContent = "Để sau";
  b2.onclick = () => { try{ localStorage.setItem(K, String(Date.now())); }catch(e){} bar.remove(); };
  row.append(b1, b2); bar.append(msg, row);
  const home = document.getElementById("home"); (home ? home : document.body).prepend(bar);
})();
