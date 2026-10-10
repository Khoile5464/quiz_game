# MLN111 ♡ Quiz Y2K

Web app ôn trắc nghiệm MLN111 (không cần build, chạy offline).

- Học mới 30 câu chưa làm · Đền ôn tập theo mức ghi nhớ · Ngôi đền huyền thoại (100 câu, HighScore)
- **Giải đề**: làm lần lượt toàn bộ câu trong phạm vi; tiến độ tự lưu để làm tiếp
- **📕 Ôn câu sai**: câu sai khi giải đề vào kho ngay; ôn lại theo thứ tự đã sai, đúng thì gỡ khỏi kho, sai thì giữ cho lượt sau
- **Trích Study Guide** sau mỗi câu, ở mọi chế độ: thẻ kiến thức liên quan, dòng sát ý được tô sáng, bấm để mở đúng thẻ
- **🧭 Hành trình DVLS**: phần riêng 134 câu Chương 3 (5 phần, nhiều kiểu câu), chọn bằng chip phạm vi
- Nông trại, gacha, huy hiệu; tiến trình lưu trong trình duyệt (có Sao lưu/Khôi phục `.json`)

## Cấu trúc
```
index.html          # chỉ còn khung HTML, nạp css/ và js/
study-guide.html    # Study Guide ôn thi (mở từ khung trích sau mỗi câu, neo tới từng thẻ: study-guide.html#tc-0)
tools/build-guide.js # sinh js/data/guide.js từ study-guide.html — chạy lại sau khi sửa Study Guide
tools/build-dvls.js  # sinh js/data/questions-dvls.js từ data/hanh-trinh-duy-vat-lich-su.md + data/research_notes/Hành trình DVLS/ (có kiểm tra đủ giải thích)
css/                # giao diện, tách theo khu vực (base, farm, home, quiz, result, theme, tv, neon-city…); responsive.css nạp cuối cùng
js/
  data/             # questions.js (586 câu), questions-dvls.js (134 câu Hành trình DVLS, sinh tự động), sounds.js (âm thanh meme dạng base64), guide.js (thẻ Study Guide, sinh tự động)
  core/             # config, storage (localStorage + chuẩn hoá), dates
  quiz/             # selection (học mới / ôn tập / đền / giải đề), guide-match (ghép câu ↔ thẻ Study Guide), session (luồng làm bài)
  farm/             # nông trại, bản đồ đại dương, gacha, chạm/bế thú (farm-input), giọng ghi âm
  progress/         # huy hiệu
  audio/            # sfx, bảng âm thanh, lofi
  ui/               # fx, theme, city, tv, home, bảng dung lượng
  app.js            # gắn sự kiện và khởi động
assets/sounds/      # file âm thanh gốc
data/               # nguồn câu hỏi đã làm sạch + ghi chú giải thích đáp án
.nojekyll           # để GitHub Pages phục vụ nguyên trạng
docs/adr/           # các quyết định kiến trúc
```

Các file JS là script thường (không dùng ES module) và dùng chung phạm vi toàn cục, nên vẫn mở trực tiếp bằng `file://`, không cần build. **Thứ tự `<script>` trong `index.html` quan trọng** — file sau dùng biến của file trước.

## Chạy / triển khai
Mở `index.html` bằng trình duyệt. GitHub Pages: Settings → Pages → Deploy from branch → `main` / `(root)`.

Phiên bản hiện tại: v0.3.10
