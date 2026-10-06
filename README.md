# MLN111 ♡ Quiz Y2K

Web app ôn trắc nghiệm MLN111 (không cần build, chạy offline).

- Học mới 30 câu chưa làm · Đền ôn tập theo mức ghi nhớ · Ngôi đền huyền thoại (100 câu, HighScore)
- Nông trại, gacha, huy hiệu; tiến trình lưu trong trình duyệt (có Sao lưu/Khôi phục `.json`)

## Cấu trúc
```
index.html          # chỉ còn khung HTML, nạp css/ và js/
css/                # giao diện, tách theo khu vực (base, farm, home, quiz, result, theme, tv, neon-city…); responsive.css nạp cuối cùng
js/
  data/             # questions.js (586 câu), sounds.js (âm thanh meme dạng base64)
  core/             # config, storage (localStorage + chuẩn hoá), dates
  quiz/             # selection (học mới / ôn tập / đền), session (luồng làm bài)
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

Phiên bản hiện tại: v0.3.5
