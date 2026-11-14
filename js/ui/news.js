/* ---------- thông báo cập nhật: hiện cho người dùng cũ những mục họ CHƯA xem ----------
   NEWS xếp từ cũ đến mới; S.seenNews lưu id mục mới nhất đã xem. Khi có tính năng mới, thêm một mục vào CUỐI NEWS:
   người đã xem bản trước chỉ thấy mục mới, người chưa xem gì thấy tất cả, người mới vào lần đầu không bị hỏi. */
const NEWS = [
  {id: "mln122", ic: "📚", t: "Môn MLN122 đã có trong app", li: [
    "<b>525 câu</b> chia 6 chương theo Schedule (Progress Test Ch.2–5, Cuối kỳ Ch.1–6)",
    "Có <b>giải thích</b> từng câu + <b>Study Guide</b> riêng",
    "Bấm chip <b>MLN111 / MLN122</b> ở trang chủ để đổi môn; tiến trình MLN111 giữ nguyên"]},
  {id: "neon-calm", ic: "🌃", t: "Neon City dịu mắt hơn", li: [
    "Bỏ chữ phát sáng, logo nhấp nháy; màu viền thống nhất, quầng sáng chỉ khi trỏ chuột",
    "Các nhãn tiếng Việt (Cửa hàng, Âm thanh…) hiện đủ dấu"]},
  {id: "story", ic: "📜", t: "Câu chuyện KTCT: học MLN122 qua truyện tương tác", go: "122", li: [
    "<b>6 hồi, 35 cảnh</b> theo 6 chương: tự thử, mô phỏng, rồi Athena mới gọi tên thuật ngữ",
    "Có khung «Theo giáo trình» và cảnh báo chỗ ẩn dụ không còn đúng",
    "Cuối mỗi cảnh có quiz chốt: đi vào ôn tập, nhận xu, mở thẻ thuật ngữ",
    "Chọn môn <b>MLN122</b> rồi bấm nút <b>📜 Câu chuyện KTCT</b> ở trang chủ"]},
  {id: "story-viz", ic: "🎨", t: "Câu chuyện KTCT có hình minh họa", go: "122", li: [
    "Sơ đồ, thanh chồng c + v + m và mốc thời gian ngay trong các cảnh chính",
    "Thứ tự các lựa chọn được xáo ngẫu nhiên mỗi lần, không còn đoán theo vị trí"]},
];
const newsUnseen = () => { const i = NEWS.findIndex(n => n.id === S.seenNews); return NEWS.slice(i + 1); }; // seenNews lạ hoặc rỗng → i = -1 → tất cả
function closeNews(){ $("newsModal").classList.add("hidden"); S.seenNews = NEWS[NEWS.length - 1].id; save(); }
function showNews(){
  const items = newsUnseen();
  if (!items.length) return;
  const returning = S.answered > 0 || S.farm.animals.length > 0; // người mới vào lần đầu thì không cần thông báo
  if (!returning){ S.seenNews = NEWS[NEWS.length - 1].id; save(); return; }
  $("newsBody").innerHTML = items.map(n => `<div class="news-item"><h4>${n.ic} ${n.t}</h4><ul>${n.li.map(x => `<li>${x}</li>`).join("")}</ul></div>`).join("");
  const go = items.find(n => n.go);
  $("newsGo").classList.toggle("hidden", !go);
  $("newsGo").dataset.go = go ? go.go : "";
  $("newsGo").textContent = items.some(n => n.id === "story") ? "Thử Câu chuyện KTCT ✦" : "Thử MLN122 ngay ✦";
  $("newsModal").classList.remove("hidden");
}
$("newsOk").onclick = closeNews;
$("newsGo").onclick = () => { const g = $("newsGo").dataset.go; closeNews(); if (g){ setSubject(g); if (typeof Story !== "undefined") Story.open(); } };
$("newsModal").addEventListener("click", e => { if (e.target === $("newsModal")) closeNews(); });
