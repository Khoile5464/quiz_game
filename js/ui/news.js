/* ---------- thông báo cập nhật: hiện cho người dùng cũ những mục họ CHƯA xem ----------
   NEWS xếp từ cũ đến mới; S.seenNews lưu id mục mới nhất đã xem. Khi có tính năng mới, thêm một mục vào CUỐI NEWS:
   người đã xem bản trước chỉ thấy mục mới, người chưa xem gì thấy tất cả, người mới vào lần đầu không bị hỏi. */
const NEWS = [
  {id: "mln122", ic: "📚", t: "Môn MLN122 đã có trong app", go: "122", goText: "Thử MLN122 ngay ✦", li: [
    "<b>525 câu</b> chia 6 chương theo Schedule (Progress Test Ch.2–5, Cuối kỳ Ch.1–6)",
    "Có <b>giải thích</b> từng câu + <b>Study Guide</b> riêng",
    "Bấm chip <b>MLN111 / MLN122</b> ở trang chủ để đổi môn; tiến trình MLN111 giữ nguyên"]},
  {id: "neon-calm", ic: "🌃", t: "Neon City dịu mắt hơn", li: [
    "Bỏ chữ phát sáng, logo nhấp nháy; màu viền thống nhất, quầng sáng chỉ khi trỏ chuột",
    "Các nhãn tiếng Việt (Cửa hàng, Âm thanh…) hiện đủ dấu"]},
  {id: "story", ic: "📜", t: "Câu chuyện KTCT: học MLN122 qua truyện tương tác", go: "122", story: true, goText: "Thử Câu chuyện KTCT ✦", li: [
    "<b>6 hồi, 35 cảnh</b> theo 6 chương: tự thử, mô phỏng, rồi Athena mới gọi tên thuật ngữ",
    "Có khung «Theo giáo trình» và cảnh báo chỗ ẩn dụ không còn đúng",
    "Cuối mỗi cảnh có quiz chốt: đi vào ôn tập, nhận xu, mở thẻ thuật ngữ",
    "Chọn môn <b>MLN122</b> rồi bấm nút <b>📜 Câu chuyện KTCT</b> ở trang chủ"]},
  {id: "story-viz", ic: "🎨", t: "Câu chuyện KTCT có hình minh họa", go: "122", li: [
    "Sơ đồ, thanh chồng c + v + m và mốc thời gian ngay trong các cảnh chính",
    "Thứ tự các lựa chọn được xáo ngẫu nhiên mỗi lần, không còn đoán theo vị trí"]},
  {id: "multi-scope", ic: "☑", t: "Chọn nhiều chương một lúc", li: [
    "Bấm <b>✚ Tự chọn nhiều chương</b>, rồi tick bất kỳ chương nào muốn gộp lại",
    "Dùng được cho Học mới, Ôn tập, Giải đề, ở cả MLN111 lẫn MLN122"]},
  {id: "fix-wrong", ic: "🔁", t: "Làm lại câu sai đến khi đúng hết", li: [
    "Sau mỗi lượt Học mới, Ôn tập hoặc Ngôi đền, bấm <b>🔁 Làm lại câu sai</b>",
    "Câu sai lần nữa quay lại cuối hàng, xong khi đúng hết. Chỉ luyện thêm, không đổi thống kê hay xu"]},
  {id: "ipr102", ic: "⚖️", t: "Môn IPR102 · Quyền sở hữu trí tuệ đã có trong app", go: "ipr", goText: "Thử IPR102 ngay ✦", li: [
    "<b>372 câu</b> đã đối chiếu với đề gốc, chia 6 chương theo chủ đề: Tổng quan & điều ước · Bản quyền (2 chương) · Nhãn hiệu (2 chương) · Kiểu dáng & sáng chế",
    "Mỗi câu có <b>bản dịch tiếng Việt</b>: bấm nút <b>🇻🇳 Dịch</b> để hiện dưới đề khi đang làm, sau khi chọn luôn có khung dịch đầy đủ kèm đáp án",
    "Câu mà đáp án của đề có nghi vấn được gắn cảnh báo ⚠️ (27 câu)",
    "Bấm chip <b>IPR102</b> ở trang chủ; Giải đề và kho câu sai của môn này tách riêng"]},
  {id: "ipr102-explain", ic: "💡", t: "IPR102 có giải thích từng câu · app đổi tên Thành Quiz Game", go: "ipr", goText: "Xem IPR102 ✦", li: [
    "Cả <b>372 câu IPR102</b> có khung <b>💡 Vì sao đúng?</b> bằng tiếng Việt, rồi tới bản dịch đề",
    "Thanh chọn môn ở trang chủ to hơn, tách hẳn khỏi chip chương",
    "App đổi tên thành <b>Thành Quiz Game</b> (tiến trình cũ giữ nguyên)"]},
  {id: "run-rainforest", ic: "🏃", t: "Chạy rừng: map Rừng nhiệt đới + 30 thú mới", go: "111", goText: "Xem map Rừng ✦", li: [
    "Nhân vật tự chạy, mỗi chướng ngại là một câu hỏi <b>45 giây</b> (câu bạn đã học, ưu tiên câu hay sai)",
    "Đúng thì nhảy qua, sai/hết giờ thì vấp ngã; có <b>khiên</b> thì chạy tiếp",
    "Sau 3–5 câu đúng có <b>hộp bí mật</b>: khiên, điểm ×2 hoặc một con thú Rừng nhiệt đới — đúng liên tiếp càng nhiều càng dễ ra thú hiếm",
    "Bấm <b>🏃 Chạy rừng</b> ở trang chủ hoặc tab 🌴 Rừng trong nông trại. Thú cũ của bạn giữ nguyên"]},
];
const newsUnseen = () => { const i = NEWS.findIndex(n => n.id === S.seenNews); return NEWS.slice(i + 1); }; // seenNews lạ hoặc rỗng → i = -1 → tất cả
function closeNews(){ $("newsModal").classList.add("hidden"); S.seenNews = NEWS[NEWS.length - 1].id; save(); }
function showNews(){
  const items = newsUnseen();
  if (!items.length) return;
  const returning = S.answered > 0 || S.farm.animals.length > 0; // người mới vào lần đầu thì không cần thông báo
  if (!returning){ S.seenNews = NEWS[NEWS.length - 1].id; save(); return; }
  $("newsBody").innerHTML = items.map(n => `<div class="news-item"><h4>${n.ic} ${n.t}</h4><ul>${n.li.map(x => `<li>${x}</li>`).join("")}</ul></div>`).join("");
  const go = [...items].reverse().find(n => n.go); // thông báo mới nhất có nút «thử ngay»
  $("newsGo").classList.toggle("hidden", !go);
  $("newsGo").dataset.go = go ? go.go : "";
  $("newsGo").dataset.story = go && go.story ? "1" : "";
  $("newsGo").textContent = go ? go.goText : "";
  $("newsModal").classList.remove("hidden");
}
$("newsOk").onclick = closeNews;
$("newsGo").onclick = () => { const g = $("newsGo").dataset.go, story = $("newsGo").dataset.story; closeNews(); if (g){ setSubject(g); if (story && typeof Story !== "undefined") Story.open(); } };
$("newsModal").addEventListener("click", e => { if (e.target === $("newsModal")) closeNews(); });
