/* ---------- 30 thú map «Rừng nhiệt đới» (seed data) ----------
   rarity: C thường · R hiếm · E siêu hiếm · L huyền thoại; habitatLayer: ground = mặt đất · trunk = thân cây · canopy = tán/trời
   group chỉ để chia nhóm khi hiển thị sổ thú. weight: trọng số trong cùng rarity (mặc định bằng nhau). */
(function (root) {
  const P = (id, name, rarity, habitatLayer, group) => ({ id, mapId: "rainforest", name, rarity, habitatLayer, group, weight: 1 });
  const LOW = "Tầng thấp", CAN = "Tán rừng", SKY = "Trời rừng";
  const RAINFOREST_PETS = [
    P("r_brownsquirrel", "Sóc nâu", "C", "trunk", LOW), P("r_gecko", "Tắc kè", "C", "trunk", LOW), P("r_treefrog", "Ếch cây xanh", "C", "ground", LOW),
    P("r_forestdove", "Bồ câu rừng", "C", "canopy", LOW), P("r_fruitbat", "Dơi ăn quả", "C", "canopy", LOW),
    P("r_redeyefrog", "Ếch mắt đỏ", "R", "ground", LOW), P("r_chameleon", "Cắc kè hoa", "R", "trunk", LOW), P("r_hummingbird", "Chim ruồi", "R", "canopy", LOW),
    P("r_greenviper", "Rắn lục cây", "E", "trunk", LOW), P("r_poisonfrog", "Ếch phi tiêu xanh dương", "L", "ground", LOW),

    P("r_longtailmonkey", "Khỉ đuôi dài", "C", "trunk", CAN), P("r_woodpecker", "Chim gõ kiến", "C", "trunk", CAN), P("r_myna", "Sáo rừng", "C", "canopy", CAN),
    P("r_flyingsquirrel", "Sóc bay", "C", "canopy", CAN), P("r_greenparrot", "Vẹt xanh", "C", "canopy", CAN),
    P("r_sloth", "Lười ba ngón", "R", "trunk", CAN), P("r_gibbon", "Vượn tay trắng", "R", "trunk", CAN), P("r_tamarin", "Tamarin sư tử vàng", "R", "trunk", CAN),
    P("r_hornbill", "Chim hồng hoàng", "E", "canopy", CAN), P("r_cloudedleopard", "Báo gấm", "L", "trunk", CAN),

    P("r_toucan", "Toucan", "C", "canopy", SKY), P("r_greyparrot", "Vẹt xám", "C", "canopy", SKY), P("r_kingfisher", "Chim bói cá", "C", "canopy", SKY),
    P("r_bluemacaw", "Macaw xanh-vàng", "C", "canopy", SKY), P("r_junglowl", "Cú mèo rừng", "C", "canopy", SKY),
    P("r_redmacaw", "Macaw đỏ", "R", "canopy", SKY), P("r_quetzal", "Quetzal", "R", "canopy", SKY), P("r_peacock", "Chim công", "R", "ground", SKY),
    P("r_harpy", "Đại bàng Harpy", "E", "canopy", SKY), P("r_paradise", "Chim thiên đường", "L", "canopy", SKY),
  ];
  root.RAINFOREST_PETS = RAINFOREST_PETS;
  if (typeof module !== "undefined" && module.exports) module.exports = RAINFOREST_PETS;
})(typeof globalThis !== "undefined" ? globalThis : this);
