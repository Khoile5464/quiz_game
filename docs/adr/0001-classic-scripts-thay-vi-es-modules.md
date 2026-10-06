# ADR-0001: Tách `index.html` thành script thường (không dùng ES module)

**Trạng thái:** Accepted · **Ngày:** 2026-10-06

## Bối cảnh
App ban đầu là một file `index.html` ~1 MB (HTML + CSS + JS + 586 câu hỏi + âm thanh base64). Khó đọc, khó review diff, khó sửa an toàn. README cam kết "không cần build, chạy offline, mở thẳng `index.html`".

## Quyết định
Tách thành `css/*.css` và `js/**/*.js`, nạp bằng `<link>` / `<script src>` thường, giữ nguyên thứ tự thực thi của file gốc. Các file chia sẻ phạm vi toàn cục.

## Phương án đã cân nhắc
| | A. Script thường (chọn) | B. ES modules | C. Bundler (Vite…) |
|---|---|---|---|
| Chạy bằng `file://` | Có | **Không** (CORS với module) | Chỉ sau khi build |
| Cần build / Node | Không | Không | Có |
| Tách biệt phạm vi | Yếu (toàn cục) | Tốt | Tốt |
| Rủi ro khi tách | Thấp (giữ nguyên ngữ nghĩa) | Cao (phải khai báo import/export cho ~300 định danh) | Cao |

## Hệ quả
- Dễ hơn: đọc/review từng khu vực, giữ cam kết offline, tách mà không đổi logic.
- Khó hơn: **thứ tự `<script>` trong `index.html` là hợp đồng ngầm** (file sau dùng biến của file trước; `app.js` phải cuối cùng vì gọi `renderHome()`). Dễ trùng tên toàn cục.
- Cần xem lại: bọc từng khu vực thành đối tượng/IIFE (`Farm`, `Quiz`…) rồi chuyển sang ES modules khi chấp nhận chạy qua server (ví dụ GitHub Pages).

## Việc tiếp theo
1. [ ] Bọc module để giảm biến toàn cục.
2. [ ] Chuyển `data/sounds.js` từ base64 sang tham chiếu `assets/sounds/*.mp3`.
3. [ ] Thêm kiểm thử tự động cho luồng quiz / gacha / lưu trữ.
