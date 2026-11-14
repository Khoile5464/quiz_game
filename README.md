# MLN111 ♡ Quiz Y2K

Web app ôn trắc nghiệm MLN111 (không cần build, chạy offline).

- Học mới 30 câu chưa làm · Đền ôn tập theo mức ghi nhớ · Ngôi đền huyền thoại (100 câu, HighScore)
- **Giải đề**: làm lần lượt toàn bộ câu trong phạm vi; tiến độ tự lưu để làm tiếp
- **📕 Ôn câu sai**: câu sai khi giải đề vào kho ngay; ôn lại theo thứ tự đã sai, đúng thì gỡ khỏi kho, sai thì giữ cho lượt sau
- **Trích Study Guide** sau mỗi câu, ở mọi chế độ: thẻ kiến thức liên quan, dòng sát ý được tô sáng, bấm để mở đúng thẻ
- **🧭 Hành trình DVLS**: phần riêng 134 câu Chương 3 (5 phần, nhiều kiểu câu), chọn bằng chip phạm vi
- **Hai môn**: chip **MLN111 · Triết học** / **MLN122 · KTCT Mác-Lênin** ở trang chủ; mỗi môn có phạm vi chương, Giải đề và kho câu sai riêng (xu, nông trại, huy hiệu dùng chung). MLN122: 525 câu chia 6 chương theo Schedule môn, đủ giải thích đáp án + Study Guide riêng (`study-guide-mln122.html`)
- **Chọn nhiều chương**: chip **✚ Tự chọn nhiều chương** cho tick bất kỳ chương nào để học mới, ôn tập, giải đề; danh sách nhớ riêng từng môn
- **📜 Câu chuyện KTCT** (chỉ MLN122): học qua truyện có tương tác. Mỗi cảnh: tình huống → tự thử (chọn, xếp, mô phỏng) → «Athena gọi tên» (bảng dịch truyện ↔ thuật ngữ + khung «Theo giáo trình» lấy từ Study Guide + cảnh báo chỗ ẩn dụ sai) → quiz chốt bằng câu trong ngân hàng đề (đi vào ôn tập như thường). Có hình minh họa (sơ đồ, thanh chồng, mốc thời gian) và lựa chọn xáo ngẫu nhiên mỗi lần. Đủ 6 hồi theo 6 chương (35 cảnh, phủ 72/72 thẻ Study Guide, 235 câu chốt)
- Nông trại, gacha, huy hiệu; tiến trình lưu trong trình duyệt (có Sao lưu/Khôi phục `.json`)

## Cấu trúc
```
index.html          # chỉ còn khung HTML, nạp css/ và js/
study-guide-mln122.html # Study Guide môn MLN122 (cùng khuôn, neo thẻ: study-guide-mln122.html#c3a-0)
study-guide.html    # Study Guide ôn thi (mở từ khung trích sau mỗi câu, neo tới từng thẻ: study-guide.html#tc-0)
tools/build-guide.js # sinh js/data/guide.js + guide-mln122.js từ hai trang Study Guide — chạy lại sau khi sửa Study Guide
tools/build-mln122.js # sinh js/data/questions-mln122.js từ data/mln122/questions.json (chương c = 1–6, f = giữ thứ tự đáp án) + data/mln122/notes/c1–c6.json (giải thích e/w/s/k theo số câu) — báo lỗi nếu thiếu giải thích
tools/test-story.js  # kiểm tra công thức mô phỏng (đối chiếu ví dụ số trong slide) + độ phủ thẻ Study Guide và câu chốt của từng hồi — chạy sau khi sửa truyện
tools/build-dvls.js  # sinh js/data/questions-dvls.js từ data/hanh-trinh-duy-vat-lich-su.md + data/research_notes/Hành trình DVLS/ (có kiểm tra đủ giải thích)
css/                # giao diện, tách theo khu vực (base, farm, home, quiz, result, theme, tv, neon-city…); responsive.css nạp cuối cùng
js/
  data/             # questions.js (586 câu), questions-dvls.js (134 câu Hành trình DVLS, sinh tự động), questions-mln122.js (525 câu môn MLN122, sinh tự động), guide-mln122.js (thẻ Study Guide MLN122, sinh tự động), sounds.js (âm thanh meme dạng base64), guide.js (thẻ Study Guide, sinh tự động)
  core/             # config, storage (localStorage + chuẩn hoá), dates
  story/            # formulas (công thức mô phỏng, thuần tính toán), story (trình đọc cảnh + tương tác + mô phỏng); nội dung ở js/data/story-mln122.js
  quiz/             # selection (học mới / ôn tập / đền / giải đề), guide-match (ghép câu ↔ thẻ Study Guide), session (luồng làm bài)
  farm/             # nông trại, bản đồ đại dương, gacha, chạm/bế thú (farm-input), giọng ghi âm
  progress/         # huy hiệu
  audio/            # sfx, bảng âm thanh, lofi
  ui/               # news (thông báo cập nhật: mỗi người chỉ thấy các mục chưa xem; có tính năng mới thì thêm một mục vào cuối NEWS), fx, theme, city, tv, home, bảng dung lượng
  app.js            # gắn sự kiện và khởi động
assets/sounds/      # file âm thanh gốc
data/               # nguồn câu hỏi đã làm sạch + ghi chú giải thích đáp án
.nojekyll           # để GitHub Pages phục vụ nguyên trạng
docs/adr/           # các quyết định kiến trúc
```

Các file JS là script thường (không dùng ES module) và dùng chung phạm vi toàn cục, nên vẫn mở trực tiếp bằng `file://`, không cần build. **Thứ tự `<script>` trong `index.html` quan trọng** — file sau dùng biến của file trước.

## Chạy / triển khai
Mở `index.html` bằng trình duyệt. GitHub Pages: Settings → Pages → Deploy from branch → `main` / `(root)`.

Phiên bản hiện tại: v0.3.23
