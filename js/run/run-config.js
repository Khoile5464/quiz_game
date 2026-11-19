/* ---------- CẤU HÌNH «Endless Run Quiz» — mọi con số cân bằng nằm ở ĐÂY, không hard-code nơi khác ----------
   Chạy được cả trong trình duyệt (globalThis.RUN_CONFIG) lẫn Node (module.exports) để unit test dùng cùng một bản. */
(function (root) {
  const RUN_CONFIG = {
    mapId: "rainforest",
    maxAnimalsPerMap: 30,         // sức chứa chuồng mỗi map (khớp MAX_ANIMALS của app)

    /* thời gian & chống gian lận */
    questionTimeMs: 20000,        // hạn trả lời mỗi câu (server tự đo)
    graceMs: 1500,                // dung sai mạng; đến muộn hơn questionTimeMs + graceMs luôn bị tính SAI
    runIdleTimeoutMs: 90000,      // im lặng quá mức này thì run hết hạn (tránh run treo)
    pauseMaxMs: 30000,            // mất mạng giữa run: dừng đồng hồ tối đa ngần này cho mỗi câu, quá thì kết thúc run

    /* secret box */
    boxEveryCorrect: [3, 5],      // sau mỗi 3–5 câu ĐÚNG (bốc lại sau mỗi lần xuất hiện hộp)
    boxOutcomeWeights: { shield: 28, scoreBoost: 27, pet: 45 },
    scoreBoostQuestions: 5,       // x2 điểm trong N câu kế tiếp
    scoreBoostFactor: 2,
    /* trọng số rarity C/R/E/L của pet theo bậc streak đúng liên tiếp trong run hiện tại (lấy bậc có minStreak lớn nhất ≤ streak) */
    rarityWeightsByStreakTier: [
      { minStreak: 1,  weights: { C: 70, R: 22, E: 7,  L: 1 } },
      { minStreak: 10, weights: { C: 50, R: 30, E: 15, L: 5 } },
      { minStreak: 20, weights: { C: 30, R: 35, E: 25, L: 10 } },
    ],
    pityLegendary: 20,            // chắc chắn ra Legendary sau tối đa ngần này lần ra pet (bộ đếm riêng mỗi tài khoản, mỗi map)
    maxPetsPerRun: 3,             // chống cày: tối đa pet mỗi run
    maxPetsPerDay: 8,             // ... và mỗi ngày
    duplicatePolicy: "allow",     // "allow": cho sở hữu nhiều bản · "coin": thú đã có thì quy đổi thành xu
    duplicateCoin: { C: 20, R: 60, E: 150, L: 400 },
    farmFullPolicy: "coin",       // chuồng Rừng đầy (MAX_ANIMALS) thì quy đổi pet thành xu (duplicateCoin)

    /* điểm & xu */
    scorePerCorrect: 100,
    shieldOverflowScore: 300,     // nhặt khiên khi đang có khiên → quy đổi thành điểm
    coinPerCorrect: [10, 13],     // xu mỗi câu đúng, trước khi nhân combo
    comboThreshold: 3,            // từ streak này xu nhân theo streak
    comboMultCap: 10,

    /* nguồn câu hỏi: chỉ câu đã học (n > 0), KHÔNG có câu mới. weak = vừa sai / đang nhớ (box 0–1), mid = box 2–3, strong = box 4–5 */
    reviewMixRatio: { weak: 0.6, mid: 0.3, strong: 0.1 },
    minLearnedQuestions: 8,       // dưới mức này (và runPoolTarget = 0) thì chưa cho chạy
    runPoolTarget: 40,            // đã học < ngần này câu của môn thì trộn thêm câu CHƯA học (càng học ít càng nhiều câu mới, tối thiểu 35%) để không lặp mãi vài câu; đủ thì chỉ ôn câu đã học. Đặt 0 để CHỈ ôn câu đã học
    runRecentMemory: 60,          // nhớ ngần này câu vừa hỏi (qua nhiều ván) để không gặp lại ngay

    /* tốc độ chạy (chỉ hiệu ứng hình ảnh, tăng nhẹ theo số câu đúng) */
    runSpeedBase: 1.0, runSpeedPerCorrect: 0.015, runSpeedMax: 1.6,

    /* app cũ: giữ gacha của map Nông trại / Đại dương (đặt false để ẩn toàn bộ gacha, pet chỉ đến từ Chạy rừng) */
    legacyGachaEnabled: true,
  };
  root.RUN_CONFIG = RUN_CONFIG;
  if (typeof module !== "undefined" && module.exports) module.exports = RUN_CONFIG;
})(typeof globalThis !== "undefined" ? globalThis : this);
