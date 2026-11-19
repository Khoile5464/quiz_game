# Chạy rừng — Endless Run Quiz

Mode chơi để nhận thú map **Rừng nhiệt đới** (30 thú). Nhân vật tự chạy, mỗi chướng ngại là một câu trắc nghiệm 45 giây; đúng thì nhảy qua, sai/hết giờ thì vấp ngã (có khiên thì chạy tiếp). Sau mỗi 3–5 câu đúng có hộp bí mật: khiên · điểm ×2 · thú.

## Kiến trúc ngắn
```
 run-ui.js / run-scene.js     giao diện + cảnh pixel (KHÔNG quyết định thưởng)
          │  chỉ gọi qua
 run-local.js  RunAPI.post("/run/start" …)   ← bề mặt REST-like, trả {ok,data|error}
          │
 run-server.js createRunServer({config, pets, questions, store, clock, today, rng})   ← MỌI luật nằm ở đây, không đụng DOM
          ├─ questions = AppQuestionProvider (run-local.js): chỉ câu đã học, trộn theo mức ghi nhớ; recordAnswer() = đúng công thức submit() của quiz
          └─ store     = LocalStore: tx() chạy trên bản sao S rồi commit nguyên khối (lỗi → không commit gì)
 run-config.js (RUN_CONFIG, mọi con số cân bằng) · rainforest-data.js (30 thú) · rainforest-species.js / rainforest-map.js (hình + map)
```
`run-server.js`, `run-config.js`, `rainforest-data.js` là UMD, chạy y nguyên trong Node: `node tools/test-run-server.js` (28 test).

## Danh sách giả định
1. **App hiện không có backend** (GitHub Pages + localStorage). «Server» chạy cùng trang với client nên **không chống được người cố tình mở DevTools sửa dữ liệu của chính họ**. Toàn bộ luật server-authoritative đã tách riêng, có hợp đồng API và test; chuyển lên backend thật chỉ cần viết lại `store` + `RunAPI` (schema ở `docs/run-schema.sql`).
2. Một người dùng cục bộ (không đăng nhập). «Pity theo tài khoản / qua nhiều phiên» = lưu bền trong S (đã test bằng nhiều server mới dùng chung một store).
3. **Gacha**: map Nông trại/Đại dương nằm NGOÀI phạm vi nên giữ nguyên gacha ở đó; map Rừng KHÔNG có gacha (thú chỉ từ hộp bí mật). Muốn thay hẳn gacha cũ: `legacyGachaEnabled: false` trong run-config.js.
4. Đồng hồ đo bằng `performance.now()` (đơn điệu, đổi giờ hệ thống không ảnh hưởng); giới hạn pet/ngày theo ngày dương lịch của máy. Mở lại app thì run còn treo bị kết thúc (đồng hồ reset theo trang) và hộp chưa mở được mở nốt để không mất thưởng.
5. Nguồn câu hỏi: câu **đã học** (n>0), đáp án đơn, của môn đang chọn; không có câu mới. Kho cạn thì cho lặp (run vô tận), chỉ tránh lặp ngay câu vừa hỏi. Cần ≥ `minLearnedQuestions` (8) câu.
6. Server xáo thứ tự lựa chọn (trừ câu có phương án tham chiếu chéo như «A và B» → giữ thứ tự), id lựa chọn ngẫu nhiên mỗi lần. Đáp án đúng chỉ lộ **sau khi chấm** (`correctChoiceId`) để người chơi học.
7. Đồng hồ câu kế tiếp bắt đầu từ lúc server phát câu; với câu đến sau hộp bí mật thì từ lúc mở hộp (animation mở hộp không ăn giờ). Animation nhảy/vấp (~1 giây) có tính vào 45 giây.
8. Thêm ngoài danh sách API tối thiểu: `POST /run/pause` và `/run/resume` (để server cũng dừng đồng hồ khi mất mạng ≤ 30 giây). Mở hộp lặp lại trả đúng kết quả cũ. Chuồng Rừng đầy (30 con) hoặc `duplicatePolicy:"coin"` thì pet đổi thành xu.
9. Dữ liệu cũ an toàn: chỉ thêm trường mới (`S.rf`, `S.farm.pity.rainforest`, loài `r_*`); không đổi KEY, không đổi id câu hỏi.

## API
| Gọi | Trả |
|---|---|
| `POST /run/start` | `{runId, firstQuestion{token,index,text,options[{id,text}],deadlineMs}}` |
| `POST /run/answer {runId,token,choiceId}` | `{correct, timedOut, correctChoiceId, shieldUsed, runOver, score, coinDelta, streak, shield, boostLeft, nextQuestion?, secretBox?{boxId}, summary?}` |
| `POST /run/box/open {runId,boxId}` | `{result: shield / scoreBoost / pet{petId,rarity,isNew,userPetId}, nextQuestion?, runOver, score…}` |
| `POST /run/end {runId}` | tổng kết `{score, correctCount, answered, coins, bestStreak, pets[], shieldsUsed, boxesOpened, status}` |
| `POST /run/pause`, `/run/resume` | tạm dừng mất mạng (tối đa `pauseMaxMs` mỗi câu) |
| `GET /farm/rainforest` | `{owned, pity, pityMax, dayPets, maxPetsPerDay, slots{used,max}, userPets[]}` |

Mã lỗi (`error.code`): `RUN_NOT_FOUND`, `RUN_OVER`, `TOKEN_INVALID`, `TOKEN_EXPIRED`, `DUPLICATE_SUBMIT` (kèm `replay` = kết quả cũ, không thưởng thêm), `INVALID_CHOICE`, `BOX_NOT_FOUND`, `NOT_ENOUGH_QUESTIONS`, `NO_QUESTION`, `NOT_PAUSED`.

## Hướng dẫn cân bằng (`js/run/run-config.js`)
- **Thú mỗi câu đúng** ≈ tỉ lệ pet ÷ trung bình `boxEveryCorrect` = 0,45 ÷ 4 ≈ **0,11 thú/câu đúng** (khoảng 1 thú mỗi 9 câu đúng). Chạy 20 câu đúng ≈ 5 hộp ≈ 2,2 thú; `maxPetsPerRun = 3` là trần.
- Muốn thú dễ/khó ra hơn: chỉnh `boxOutcomeWeights.pet` và `boxEveryCorrect`. Muốn khiên nhiều hơn: tăng `shield`.
- **Rarity theo streak** (`rarityWeightsByStreakTier`): streak 1–9 → Legendary 1% · 10–19 → 5% · từ 20 → 10%. Pity `pityLegendary = 20` đảm bảo Legendary sau tối đa 20 thú (bộ đếm riêng, lưu bền); Legendary ra tự nhiên cũng reset bộ đếm.
- **Chống cày**: `maxPetsPerRun`, `maxPetsPerDay`. Hết hạn mức thì hộp chỉ ra khiên/tăng điểm.
- **Xu**: `coinPerCorrect` × combo (streak ≥ `comboThreshold`, tối đa `comboMultCap`). Streak 10 ≈ 100–130 xu/câu: hạ `comboMultCap` nếu xu lạm phát so với giá bán thú (`RF_SELL` trong rainforest-species.js).
- **Độ khó giờ**: `questionTimeMs`, `graceMs` (dung sai mạng), `runIdleTimeoutMs`, `pauseMaxMs`.
- **Điểm**: `scorePerCorrect`, `scoreBoostFactor`, `scoreBoostQuestions`, `shieldOverflowScore`.
- Sau khi chỉnh, chạy `node tools/test-run-server.js` (test thống kê rarity bám theo trọng số cấu hình).

## Kiểm thử đã có
`node tools/test-run-server.js`: hết giờ + grace (kể cả client đổi giờ), replay token, token lạ/cũ, lựa chọn sai không tiêu token, không lộ đáp án trước khi chấm, khiên (đỡ 1 lần, hết giờ cũng đỡ, nhặt thừa → điểm), chu kỳ hộp 3–5, mở hộp lặp, boost ×2, rarity theo bậc streak (thống kê), pity qua nhiều run & nhiều phiên, giới hạn pet/run & /ngày, thú trùng/chuồng đầy → xu, transaction rollback + idempotent, kết quả trả client là bản sao, không có API xin pet, run treo hết hạn (được COMMIT), tạm dừng mất mạng, xu/combo.

## Nguồn câu hỏi trong ván (chống lặp)
Môn đang chọn quyết định kho câu. Kho ôn chỉ gồm câu đã học nên nếu bạn mới học ít (ví dụ 10–20 câu) thì chạy vài chục câu là lặp lại. Vì vậy:
- Đã học **< `runPoolTarget` (40)** câu của môn: trộn thêm câu **chưa học** của môn. Học càng ít thì tỉ lệ câu mới càng cao (tối thiểu 35%); phần còn lại vẫn ưu tiên câu hay sai theo `reviewMixRatio`.
- Đã học **≥ 40** câu: chỉ ôn câu đã học như thiết kế gốc (ưu tiên vừa sai/đang nhớ, ít câu đã rất chắc).
- Trong một ván **không bao giờ lặp** một câu cho đến khi cả kho cạn. Câu vừa hỏi ở các ván gần đây (`runRecentMemory` = 60, nhớ qua nhiều ván) bị hạ ưu tiên nên ván sau không gặp lại ngay.
- Chỉ lấy câu đáp án đơn; 66 câu «A và B» của IPR102 giữ nguyên thứ tự phương án; có nút **🇻🇳 Dịch** nếu môn có bản dịch (IPR102).
Đặt `runPoolTarget: 0` để quay về kiểu chỉ ôn câu đã học (cần ≥ `minLearnedQuestions`).
