/* ---------- thông báo cập nhật: hiện một lần cho người dùng cũ khi quay lại sau bản có tính năng mới ---------- */
const NEWS_VER = "mln122"; // đổi khoá này khi có bản cập nhật mới cần thông báo
function closeNews(){ $("newsModal").classList.add("hidden"); S.seenNews = NEWS_VER; save(); }
function showNews(){
  if (S.seenNews === NEWS_VER) return;
  const returning = S.answered > 0 || S.farm.animals.length > 0; // người mới vào lần đầu thì không cần thông báo
  if (!returning){ S.seenNews = NEWS_VER; save(); return; }
  $("newsModal").classList.remove("hidden");
}
$("newsOk").onclick = closeNews;
$("newsGo").onclick = () => { closeNews(); setSubject("122"); };
$("newsModal").addEventListener("click", e => { if (e.target === $("newsModal")) closeNews(); });
