# Research Synthesis: Đối chiếu «Hành trình Duy vật lịch sử»

**Phương pháp:** đối chiếu từng câu với toàn văn Giáo trình Triết học Mác-Lênin (Bộ GD&ĐT, 2019/2021), Chương 3, cùng ngân hàng 586 câu đề cương đã kiểm chứng trước đó | **Mẫu:** 134 câu (5 phần)
**Ngày:** 2026-10-10 | **Nguồn:** `data/hanh-trinh-duy-vat-lich-su.md` → `data/research_notes/Hành trình DVLS/p1–p5.json` → `js/data/questions-dvls.js` (`node tools/build-dvls.js`)

## Tóm tắt

132/134 câu khớp giáo trình. 2 câu phải sửa đề vì đối chiếu thấy có hai đáp án cùng đúng hoặc ghi sai nguồn (IV.4, II.7), và 1 câu bỏ nhãn «xét theo cấp độ» không có trong giáo trình (IV.5). 6 câu Sắp xếp được chuyển thành trắc nghiệm 4 phương án thứ tự. Mỗi câu có giải thích «vì sao đúng», lý do sai cho **từng** phương án và nguồn theo mục giáo trình. Study Guide được bổ sung 5 thẻ mới, 3 mục «bẫy» và mở rộng 14 thẻ cũ. Sau đó chế độ Giải đề ghép được thẻ kiến thức cho cả 134/134 câu; trước khi bổ sung có 7 câu không có thẻ nào và 15 câu chỉ ghép yếu.

## Các chủ đề phát hiện

### 1. Nhãn «trình độ» và «cấp độ» của ý thức xã hội: đề tự tạo phân biệt mà giáo trình không có
**Mức độ:** 2 câu (IV.4, IV.5); liên quan câu 413 và câu 18 của đề cũ
**Bằng chứng:** giáo trình chỉ ghi «Tùy thuộc vào góc độ xem xét, người ta thường chia ý thức xã hội thành ý thức xã hội thông thường và ý thức lý luận, tâm lý xã hội và hệ tư tưởng xã hội». Ở mục tính giai cấp, giáo trình lại viết «ở **trình độ** tâm lý xã hội… ở **trình độ** hệ tư tưởng».
**Hệ quả:** câu IV.4 gốc coi «tâm lý xã hội và hệ tư tưởng» là phương án sai vì cho rằng đó là «cấp độ», nhưng theo giáo trình thì phương án này cũng đúng, mà đề cũ (câu 413) cũng chọn nó. Đã sửa đề IV.4 thành tiêu chí «đã hệ thống hóa hay chưa» và thay phương án gây tranh cãi. Đã thêm bẫy «Hai cách chia ý thức xã hội» vào Study Guide.

### 2. «Đặc trưng quan trọng nhất của dân tộc»: đúng ý nhưng ghi sai nguồn
**Mức độ:** 1 câu (II.7)
**Bằng chứng:** giáo trình Triết gọi lãnh thổ là «đặc trưng quan trọng không thể thiếu được», còn kinh tế là «tác nhân cơ bản» hình thành dân tộc. Cụm «quan trọng nhất» thuộc giáo trình CNXH khoa học.
**Hệ quả:** giữ đáp án (kinh tế) nhưng bỏ chữ «Theo giáo trình» khỏi đề, thêm cảnh báo ⚠️ về bẫy lãnh thổ.

### 3. Lệch giữa giáo trình và đề cũ, cần nhắc khi học
- **Đặc trưng nhà nước:** giáo trình (theo Ăngghen) nêu 3 đặc trưng, nhưng đề cũ (câu 474) chọn 5. Câu III.3 hỏi đặc trưng KHÔNG thuộc nhà nước nên không bị ảnh hưởng; đã gắn cảnh báo và sửa thẻ «Nhà nước» (bỏ dòng «5 đặc trưng, 2 chức năng»).
- **Đấu tranh giai cấp:** giáo trình gọi là «một động lực trực tiếp và quan trọng» (II.4), còn đề cũ dùng «một trong những động lực». Hai cách nói không mâu thuẫn; Study Guide đã ghi cả hai.
- **Yếu tố động nhất:** mục lực lượng sản xuất ghi công cụ lao động (I.5), nhưng mục quần chúng nhân dân có câu gọi quần chúng lao động là «yếu tố động nhất». Đã ghi chú trong lý do sai của I.5.

### 4. Nội dung thời sự và văn kiện nằm ngoài giáo trình
**Mức độ:** khoảng 20 câu (Hiến pháp 2013, Đại hội VI/IX, chuyển đổi số, AI, kinh tế nền tảng…)
Các câu này được kiểm theo văn bản gốc (Hiến pháp 2013 Điều 2 khoản 1 và 3; Đại hội VI «bệnh chủ quan duy ý chí»; Đại hội IX về «bỏ qua»). Câu V.9 (lãnh tụ: tất yếu và ngẫu nhiên) dẫn thêm thư của Ăngghen gửi W. Borgius (1894), vì giáo trình chỉ viết «lãnh tụ là sản phẩm của thời đại».

### 5. Đặc điểm cấu trúc đề
- 6 câu Sắp xếp chỉ có thứ tự đúng nên đã sinh thêm 3 hoán vị dễ nhầm. Các mục được đánh số (1)–(4) để không trùng với chữ cái A–D của phương án.
- Phần lớn câu Tìm lỗi/Tình huống có đáp án A. App xáo phương án nên không lộ quy luật này. Câu Đúng/Sai giữ thứ tự Đúng → Sai.
- Nhiều phương án nhiễu quá lộ («cung hoàng đạo», «tự động thay đổi»). Vẫn giữ vì mục tiêu là ôn khái niệm, nhưng các câu này dễ hơn đề thi thật.

## Insight → Việc đã làm

| Insight | Việc đã làm | Tác động | Công sức |
|---|---|---|---|
| Study Guide thiếu Dân tộc, Giai cấp–dân tộc, Hình thái YTXH, Tình thế CM, Con người ở VN | Thêm 5 thẻ + 3 bẫy, mở rộng 14 thẻ; câu không có thẻ: 7 → 0 | Cao | TB |
| IV.4 có 2 đáp án cùng đúng | Sửa đề + cảnh báo + bẫy trong Study Guide | Cao | Thấp |
| Đề cũ và giáo trình lệch nhau (5 vs 3 đặc trưng NN) | Ghi rõ ở thẻ Nhà nước và bẫy | TB | Thấp |
| Sắp xếp không có phương án | Chuyển thành trắc nghiệm thứ tự | TB | Thấp |

## Câu hỏi còn mở
- Đề thi thật dùng giáo trình Triết hay trộn cả Lý luận NN&PL? Điều này quyết định đáp án «3 hay 5 đặc trưng».
- Có muốn kiểu câu Sắp xếp kéo thả thật (UI riêng) thay cho trắc nghiệm thứ tự không?

## Ghi chú phương pháp
Toàn văn giáo trình lấy từ bản PDF (fbs.upt.edu.vn), trích văn bản bằng `pdftotext` để tra nguyên văn từng luận điểm. Mức độ ghép Study Guide được đo bằng chính `Guide.match` của app (TF-IDF). Hạn chế: chưa đối chiếu toàn văn giáo trình CNXH khoa học (chỉ dùng cho II.7) và văn kiện Đại hội (dùng trích dẫn phổ biến).
