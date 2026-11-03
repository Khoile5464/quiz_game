/* Nội dung «Câu chuyện KTCT» (MLN122). Chỉ là DỮ LIỆU, engine ở js/story/story.js.
   Ba lớp tách bạch:
   - kiến thức: bước "term" trỏ tới thẻ Study Guide (guide: ["c3a-0", …]) → khung «Theo giáo trình» lấy nguyên văn từ study-guide-mln122.html;
   - truyện: bước "say" chỉ tạo tình huống, không định nghĩa;
   - tương tác: "choice" | "sort" | "order" | "sim" để người chơi tự phát hiện, rồi bước "term" mới gọi tên thuật ngữ.
   Bước "gate" là quiz chốt, dùng câu trong ngân hàng đề MLN122 (số thứ tự trong data/mln122/questions.json).
   Kiểm tra độ phủ:  node tools/test-story.js */
const STORY = {
  cast: {
    athena: {ic: "🦉", name: "Athena"},
    heph: {ic: "🔨", name: "Hephaestus"},
    hermes: {ic: "🪽", name: "Hermes"},
    demeter: {ic: "🌾", name: "Demeter"},
    lyra: {ic: "🧵", name: "Lyra (thợ dệt)"},
    pan: {ic: "🐐", name: "Pan (người chăn dê)"},
    ares: {ic: "⚔️", name: "Ares (chủ xưởng đối thủ)"},
    plutus: {ic: "🏦", name: "Plutus (chủ ngân hàng)"},
    zeus: {ic: "⚡", name: "Zeus (Hội đồng Olympus)"},
    lac: {ic: "👵", name: "Bà Lạc (trưởng làng)"},
    hong: {ic: "🧑‍🌾", name: "Chú Hồng (hợp tác xã)"},
    mai: {ic: "👩‍💼", name: "Chị Mai (chủ doanh nghiệp)"},
    tung: {ic: "👷", name: "Anh Tùng (công nhân)"},
    you: {ic: "🙋", name: "Bạn"},
  },
  acts: [
    {id: "a1", chapter: 1, title: "Hồi 1 · Cuốn sổ của Athena", sub: "Đối tượng, phương pháp, chức năng KTCT", guide: ["c1"], reward: 150, scenes: [
      {id: "s1", title: "Thư viện những cuốn sổ kinh tế", sub: "Thuật ngữ KTCT và các trường phái trước Mác", steps: [
        {type: "say", who: "athena", text: "Trước khi xuống chợ, xuống xưởng, ta dẫn cháu vào thư viện của ta. Mỗi kệ là một cuốn sổ của những người từng tìm hiểu vì sao xã hội giàu lên."},
        {type: "say", who: "athena", text: "Cuốn sổ đầu tiên có chữ «kinh tế chính trị» trên bìa là của A. Montchrétien, viết năm 1615. Hơn một thế kỷ sau, A. Smith mới sắp các khái niệm thành một môn khoa học có hệ thống."},
        {type: "order", prompt: "Xếp các kệ sách theo đúng thứ tự lịch sử:", items: ["Tư tưởng kinh tế cổ đại, trung đại (Aristoteles, Xenophon)", "Chủ nghĩa trọng thương (TK XV – cuối XVII)", "Chủ nghĩa trọng nông (TK XVII – nửa đầu XVIII)", "KTCT tư sản cổ điển Anh (Petty → Smith → Ricardo)", "KTCT Mác – Lênin (những năm 40 TK XIX)"]},
        {type: "sort", prompt: "Mỗi người viết sổ thuộc kệ nào?", bins: ["Cổ đại", "Trọng thương", "Trọng nông", "Cổ điển Anh", "Mác – Lênin"], items: [["Aristoteles (3 loại thương nghiệp)", 0], ["Thomas Mun", 1], ["F. Quesnay", 2], ["William Petty", 3], ["David Ricardo", 3], ["V.I. Lênin", 4]]},
        {type: "choice", prompt: "Trọng thương và trọng nông khác nhau ở trọng tâm nghiên cứu thế nào?", options: [
          {t: "Trọng thương: lưu thông (của cải là tiền, vàng bạc); trọng nông: sản xuất nông nghiệp", ok: true, fb: "Đúng. Trọng thương là tư tưởng kinh tế đầu tiên của giai cấp tư sản; trọng nông chuyển trọng tâm sang sản xuất."},
          {t: "Trọng thương: sản xuất; trọng nông: lưu thông", fb: "Đảo ngược rồi."},
          {t: "Cả hai đều nghiên cứu tiền lương", fb: "Không phải trọng tâm của hai trường phái này."}]},
        {type: "term", guide: ["c1-0", "c1-1", "c1-2"], trans: [["Cuốn sổ năm 1615", "Thuật ngữ «kinh tế chính trị» (A. Montchrétien)"], ["Smith sắp thành môn học", "A. Smith đưa KTCT thành khoa học có hệ thống"], ["Petty mở kệ, Ricardo khép kệ", "KTCT tư sản cổ điển Anh (theo C. Mác)"], ["Cuốn sổ dày nhất của Mác", "Bộ «Tư bản»; học thuyết GTTD là «hòn đá tảng»"]], caveat: "Thư viện của Athena là cách kể; các mốc năm và đại biểu lấy theo Study Guide, slide Session 1 và ngân hàng đề. Mốc thời gian của trường phái cổ điển Anh ở đề và giáo trình có chỗ ghi khác nhau, xem cảnh báo ở câu hỏi liên quan."},
        {type: "gate", qs: [102, 100, 128, 57, 59, 333, 354, 181]}]},
      {id: "s2", title: "Môn này nghiên cứu cái gì?", sub: "Đối tượng, mục đích nghiên cứu, quy luật kinh tế", steps: [
        {type: "say", who: "heph", text: "Ta chỉ muốn biết cách làm máy kéo sợi chạy nhanh hơn. Môn kinh tế chính trị có dạy cái đó không?"},
        {type: "sort", prompt: "Câu hỏi nào thuộc đối tượng của KTCT Mác – Lênin?", bins: ["Thuộc đối tượng KTCT", "Không thuộc (khoa học khác)"], items: [["Sợi làm ra chia cho chủ xưởng và thợ dệt thế nào?", 0], ["Lắp bánh răng máy kéo sợi ra sao?", 1], ["Quan hệ giữa người bán và người mua ở chợ", 0], ["Sợi bền đến mức nào?", 1], ["Vì sao chủ xưởng thuê, còn thợ thì làm thuê?", 0]]},
        {type: "order", prompt: "KTCT nghiên cứu quan hệ giữa người với người trong bốn khâu của tái sản xuất xã hội. Xếp đúng thứ tự:", items: ["Sản xuất", "Phân phối", "Trao đổi", "Tiêu dùng"]},
        {type: "choice", prompt: "Hội đồng Olympus ra lệnh «giá vải phải rẻ một nửa». Quy luật giá trị có biến mất không?", options: [
          {t: "Có, vì lệnh của Hội đồng mạnh hơn", fb: "Quy luật kinh tế khách quan, không mất đi theo mệnh lệnh."},
          {t: "Không. Quy luật kinh tế là khách quan; chính sách là chủ quan, chỉ đúng khi vận dụng đúng quy luật", ok: true, fb: "Đúng. Quy luật và chính sách khác nhau nhưng có quan hệ: chính sách tốt dựa trên quy luật."},
          {t: "Có, nếu dân đồng ý", fb: "Quy luật không phụ thuộc ý chí con người."}]},
        {type: "term", guide: ["c1-3", "c1-4"], trans: [["Chia sợi giữa chủ và thợ, quan hệ người bán – người mua", "Đối tượng: quan hệ xã hội của sản xuất và trao đổi (quan hệ giữa người với người)"], ["Lắp máy, độ bền sợi", "Thuộc khoa học kỹ thuật, không phải đối tượng KTCT"], ["Bốn khâu", "Sản xuất – phân phối – trao đổi – tiêu dùng"], ["Lệnh của Hội đồng không xóa được quy luật", "Quy luật kinh tế khách quan; chính sách kinh tế là chủ quan"]], caveat: "KTCT không bỏ qua kỹ thuật: nó xét quan hệ sản xuất trong liên hệ với trình độ LLSX, chỉ là không lấy kỹ thuật làm đối tượng nghiên cứu."},
        {type: "gate", qs: [123, 124, 139, 377, 334, 498, 161, 499]}]},
      {id: "s3", title: "Kính lọc của Athena", sub: "Phương pháp trừu tượng hóa khoa học, 4 chức năng", steps: [
        {type: "say", who: "athena", text: "Phiên chợ ồn ào trăm thứ chuyện. Muốn hiểu vì sao một tấm vải đổi được hai con dê, cháu phải đeo kính lọc của ta: gạt bỏ cái ngẫu nhiên, giữ lại cái bản chất."},
        {type: "sort", prompt: "Đeo kính lọc vào. Chi tiết nào giữ lại, chi tiết nào gạt bỏ khi tìm quy luật trao đổi?", bins: ["Giữ lại (bản chất)", "Gạt bỏ (ngẫu nhiên)"], items: [["Mỗi tấm vải cần trung bình 2 giờ lao động", 0], ["Hôm nay trời mưa nên chợ vắng", 1], ["Người bán đang vui nên bớt giá", 1], ["Vải và dê đều là sản phẩm của lao động", 0], ["Tấm vải màu đỏ", 1]]},
        {type: "say", who: "athena", text: "Cách làm vừa rồi là phương pháp đặc thù, quan trọng nhất của môn học: trừu tượng hóa khoa học."},
        {type: "sort", prompt: "Học xong môn này, cháu làm được gì? Xếp đúng chức năng:", bins: ["Nhận thức", "Thực tiễn", "Tư tưởng", "Phương pháp luận"], items: [["Hiểu vì sao có giá trị thặng dư, vì sao có độc quyền", 0], ["Góp ý chính sách thuế cho làng dựa trên quy luật", 1], ["Có niềm tin, lý tưởng vào một xã hội công bằng hơn", 2], ["Làm nền tảng để học kinh tế học, quản trị, tài chính", 3]]},
        {type: "term", guide: ["c1-5", "c1-6"], trans: [["Kính lọc gạt bỏ cái ngẫu nhiên", "Phương pháp trừu tượng hóa khoa học"], ["Hiểu bản chất", "Chức năng nhận thức"], ["Vận dụng quy luật vào chính sách, hành vi", "Chức năng thực tiễn"], ["Niềm tin, lý tưởng", "Chức năng tư tưởng"], ["Nền tảng cho môn khác", "Chức năng phương pháp luận"]], caveat: "«Chức năng giáo dục», «dự báo», «khoa học» không nằm trong 4 chức năng; đề rất hay cài các phương án này."},
        {type: "gate", qs: [50, 22, 125, 329, 343, 385, 281]}]},
      {id: "s4", title: "Mọi thứ bắt đầu từ sản xuất", sub: "Sản xuất vật chất và các yếu tố của nó", steps: [
        {type: "say", who: "lyra", text: "Để dệt một tấm vải tôi cần sức của mình, sợi lanh, khung cửi, cái giỏ đựng sợi, và cả con đường để chở vải ra chợ."},
        {type: "sort", prompt: "Xếp mỗi thứ Lyra cần vào đúng yếu tố của quá trình sản xuất:", bins: ["Sức lao động", "Đối tượng lao động", "Tư liệu lao động"], items: [["Sức khỏe, tay nghề của Lyra", 0], ["Sợi lanh", 1], ["Khung cửi (công cụ lao động)", 2], ["Giỏ đựng sợi", 2], ["Con đường chở vải ra chợ", 2]]},
        {type: "choice", prompt: "Trong tư liệu lao động, bộ phận nào quyết định năng suất lao động?", options: [
          {t: "Giỏ đựng sợi", fb: "Vật chứa đựng chỉ hỗ trợ."},
          {t: "Công cụ lao động (khung cửi)", ok: true, fb: "Đúng. Công cụ lao động quyết định năng suất, là thước đo trình độ chinh phục tự nhiên."},
          {t: "Con đường", fb: "Kết cấu hạ tầng là điều kiện chung."}]},
        {type: "order", prompt: "Xã hội loài người đã đi qua các phương thức sản xuất. Xếp đúng thứ tự:", items: ["Cộng sản nguyên thủy", "Chiếm hữu nô lệ", "Phong kiến", "Tư bản chủ nghĩa", "Cộng sản chủ nghĩa"]},
        {type: "term", guide: ["c1-7"], trans: [["Sức của Lyra", "Sức lao động"], ["Sợi lanh", "Đối tượng lao động"], ["Khung cửi, giỏ, con đường", "Tư liệu lao động (công cụ, vật chứa đựng, kết cấu hạ tầng)"], ["Khung cửi quyết định dệt nhanh hay chậm", "Công cụ lao động quyết định năng suất lao động"]], caveat: "Ngày nay LLSX còn gồm cả khoa học công nghệ; truyện chỉ dừng ở một khung cửi cho dễ hình dung."},
        {type: "gate", qs: [512, 137, 365, 289, 284, 60, 74, 244]}]}]},
    {id: "a2", chapter: 2, title: "Hồi 2 · Phiên chợ dưới chân núi", sub: "Hàng hóa, tiền tệ, thị trường", guide: ["c2a", "c2b", "c2c"], reward: 150, scenes: [
      {id: "s1", title: "Ai cũng tự làm lấy mọi thứ", sub: "Sản xuất hàng hóa, phân công lao động xã hội", steps: [
        {type: "say", who: "athena", text: "Thuở trước, mỗi nhà dưới chân núi tự trồng lúa, tự dệt vải, tự nặn nồi. Làm ra là để nhà mình dùng."},
        {type: "say", who: "pan", text: "Tôi chăn dê giỏi, Lyra dệt giỏi, Hephaestus rèn giỏi. Sao không mỗi người làm một việc rồi đổi cho nhau?"},
        {type: "order", prompt: "Làng chuyên môn hóa dần qua ba bước lớn. Xếp đúng thứ tự lịch sử:", items: ["Chăn nuôi tách khỏi trồng trọt (Pan chỉ chăn dê)", "Thủ công nghiệp tách khỏi nông nghiệp (Hephaestus chỉ rèn)", "Thương nghiệp xuất hiện (Hermes chỉ đi buôn)"]},
        {type: "choice", prompt: "Giả sử cả làng góp chung một kho, ai cần gì cứ lấy. Vải của Lyra có cần đem ra chợ bán không?", options: [
          {t: "Vẫn phải bán, vì đã có phân công lao động", fb: "Có phân công mà sản phẩm thuộc về của chung thì chỉ cần phân phối, không cần mua bán."},
          {t: "Không. Phải có thêm điều kiện: mỗi người làm chủ sản phẩm của mình", ok: true, fb: "Đúng. Phân công lao động xã hội + tách biệt về kinh tế thì sản phẩm mới phải đem trao đổi, mua bán."},
          {t: "Có, vì vải của Lyra đẹp", fb: "Đẹp là giá trị sử dụng, không phải lý do kinh tế khiến phải mua bán."}]},
        {type: "term", guide: ["c2a-0", "c2a-1"], trans: [["Mỗi nhà tự làm để tự dùng", "Kinh tế tự nhiên (tự cung tự cấp)"], ["Pan chăn dê, Lyra dệt, Hephaestus rèn", "Phân công lao động xã hội"], ["Ai làm ra thì người đó làm chủ", "Sự tách biệt về mặt kinh tế giữa các chủ thể"], ["Làm ra để đem đổi, đem bán", "Sản xuất hàng hóa"]], caveat: "Truyện đặt các nhân vật vào cùng một thời cho gọn. Thực tế ba lần phân công lớn trải qua hàng nghìn năm, và sản xuất hàng hóa ra đời từ chế độ chiếm hữu nô lệ."},
        {type: "gate", qs: [27, 37, 11, 13, 14, 309]}]},
      {id: "s2", title: "Tấm vải có hai mặt", sub: "Hai thuộc tính của hàng hóa, tính hai mặt của lao động", steps: [
        {type: "say", who: "lyra", text: "Tấm vải của tôi giữ ấm, người mua cần cái đó. Nhưng ra chợ, ai cũng hỏi: tấm vải này đáng bao nhiêu?"},
        {type: "sort", prompt: "Câu nào nói về công dụng của tấm vải, câu nào nói về cái làm nó đổi được với hàng khác?", bins: ["Giá trị sử dụng", "Giá trị"], items: [["Tấm vải giữ ấm", 0], ["Tấm vải đổi được 2 con dê", 1], ["Công sức dệt kết tinh trong tấm vải", 1], ["Vải bền, đẹp, hợp mốt", 0], ["Kỹ thuật càng phát triển, vải càng có thêm công dụng mới", 0]]},
        {type: "sort", prompt: "Lao động của Lyra cũng có hai mặt. Xếp cho đúng:", bins: ["Lao động cụ thể", "Lao động trừu tượng"], items: [["Lyra dùng khung cửi, sợi lanh, thao tác dệt riêng", 0], ["Hephaestus dùng búa, đe để rèn dao", 0], ["Sức óc, sức cơ bắp hao phí nói chung của cả hai người", 1], ["Cái chung giúp so sánh được vải với dao", 1]]},
        {type: "choice", prompt: "Vì sao tấm vải vừa có giá trị sử dụng vừa có giá trị?", options: [
          {t: "Vì người mua cần và người bán muốn lãi", fb: "Đó là động cơ mua bán, chưa giải thích được bản chất hai thuộc tính."},
          {t: "Vì lao động dệt ra nó vừa là lao động cụ thể, vừa là lao động trừu tượng", ok: true, fb: "Đúng. Lao động cụ thể tạo giá trị sử dụng, lao động trừu tượng tạo giá trị. Đây là phát hiện riêng của C. Mác."},
          {t: "Vì có lao động giản đơn và lao động phức tạp", fb: "Giản đơn – phức tạp ảnh hưởng tới lượng giá trị, không giải thích hai thuộc tính."}]},
        {type: "term", guide: ["c2a-2", "c2a-3"], trans: [["Tấm vải giữ ấm", "Giá trị sử dụng (công dụng, cho người mua)"], ["Công sức dệt kết tinh trong vải", "Giá trị (lao động xã hội kết tinh)"], ["Đổi được 2 con dê", "Giá trị trao đổi (hình thức biểu hiện của giá trị)"], ["Thao tác dệt riêng của Lyra", "Lao động cụ thể"], ["Hao phí sức lực nói chung", "Lao động trừu tượng"]], caveat: "«1 tấm vải = 2 con dê» chỉ là tỷ lệ minh họa, không phải số liệu giáo trình."},
        {type: "gate", qs: [400, 261, 75, 279, 458, 483, 270]}]},
      {id: "s3", title: "Ai dệt chậm thì lỗ", sub: "Lượng giá trị, thời gian lao động xã hội cần thiết, NSLĐ, cường độ", steps: [
        {type: "say", who: "hermes", text: "Ở chợ, phần lớn vải do những thợ mất khoảng 2 giờ một tấm làm ra. Tấm nào cũng bán cùng một giá, không ai hỏi bạn dệt mất bao lâu."},
        {type: "sim", mode: "market", prompt: "Hoàn thành 3 nhiệm vụ. Quy ước minh họa: 1 giờ lao động giản đơn = 1 đồng giá trị.", missions: [
          {id: "slow", t: "Dệt chậm hơn mức chung của chợ để thấy chuyện gì xảy ra", check: d => d.myHours > 2, done: "Bán theo giá trị xã hội nên dệt chậm thì lỗ."},
          {id: "prod", t: "Làm giá trị 1 tấm vải giảm mà tổng giá trị trong ngày không đổi", check: d => d.productivity > 1 && d.intensity === 1, done: "Tăng năng suất lao động."},
          {id: "int", t: "Làm tổng giá trị trong ngày tăng mà giá trị 1 tấm không đổi", check: d => d.intensity > 1 && d.productivity === 1 && d.complexity === 1, done: "Tăng cường độ lao động (làm khẩn trương hơn)."}]},
        {type: "choice", prompt: "Cả chợ cùng dùng khung cửi mới, mỗi tấm chỉ còn mất 1 giờ. Giá trị một tấm vải bây giờ là bao nhiêu?", options: [
          {t: "Vẫn 2 đồng, như trước", fb: "Giá trị đo bằng thời gian lao động xã hội cần thiết HIỆN TẠI, không phải thời gian cũ."},
          {t: "Còn 1 đồng, vì thời gian lao động xã hội cần thiết đã còn 1 giờ", ok: true, fb: "Đúng. Năng suất lao động tăng thì lượng giá trị một đơn vị hàng hóa giảm."},
          {t: "Tăng lên vì khung cửi mới đắt tiền", fb: "Giá khung cửi chỉ chuyển dần vào vải; phần lao động sống mới là cái giảm mạnh."}]},
        {type: "term", guide: ["c2a-4", "c2a"], trans: [["2 giờ của phần lớn thợ dệt", "Thời gian lao động xã hội cần thiết"], ["Thời gian riêng của bạn", "Hao phí lao động cá biệt → giá trị cá biệt"], ["Khung cửi tốt hơn, dệt nhanh hơn", "Tăng năng suất lao động"], ["Làm khẩn trương hơn", "Tăng cường độ lao động"], ["Thợ học nghề lâu năm", "Lao động phức tạp (bội số của lao động giản đơn)"]], caveat: "«1 giờ = 1 đồng» chỉ là quy ước để tính nhẩm. Giá trị không đo bằng tiền mà bằng thời gian lao động xã hội cần thiết; tiền chỉ là thước đo biểu hiện nó."},
        {type: "gate", qs: [308, 52, 41, 111, 203, 266, 252]}]},
      {id: "s4", title: "Dê, vỏ sò và vàng", sub: "Các hình thái giá trị, bản chất và chức năng của tiền", steps: [
        {type: "say", who: "pan", text: "Tôi muốn đổi dê lấy vải, nhưng Lyra lại đang cần dao chứ không cần dê!"},
        {type: "order", prompt: "Làng tìm cách đổi chác dễ hơn qua bốn giai đoạn. Xếp đúng thứ tự:", items: ["Giản đơn, ngẫu nhiên: 1 con dê = 2 tấm vải", "Mở rộng: 1 con dê = 2 tấm vải = 1 con dao = 10 cân lúa", "Chung: mọi thứ đều đem đổi ra một vật chung (dê)", "Tiền: mọi thứ đều đổi ra vàng"]},
        {type: "say", who: "hermes", text: "Từ khi vàng làm vật ngang giá chung cố định, tôi buôn bán dễ hẳn. Nhưng vàng làm được nhiều việc lắm đấy."},
        {type: "sort", prompt: "Mỗi tình huống là chức năng nào của tiền?", bins: ["Thước đo giá trị", "Phương tiện lưu thông", "Phương tiện cất trữ", "Phương tiện thanh toán", "Tiền tệ thế giới"], items: [["Treo bảng: tấm vải giá 2 đồng", 0], ["Trả 2 đồng, cầm vải về ngay", 1], ["Demeter chôn vàng dưới gốc ô liu để dành", 2], ["Mua chịu, cuối mùa mới trả", 3], ["Hermes trả vàng cho thương nhân xứ Ai Cập", 4]]},
        {type: "term", guide: ["c2b-0", "c2b-1"], trans: [["Dê, rồi vàng làm vật đổi chung", "Vật ngang giá chung → hình thái tiền"], ["Vàng, thứ ai cũng nhận", "Tiền: hàng hóa đặc biệt làm vật ngang giá chung"], ["Năm việc vàng làm được", "5 chức năng của tiền"]], caveat: "Dê làm vật ngang giá chung chỉ là ví dụ; lịch sử từng dùng nhiều vật khác nhau trước khi cố định ở vàng, bạc."},
        {type: "gate", qs: [185, 62, 341, 127, 167, 290]}]},
      {id: "s5", title: "Hermes in tiền giấy", sub: "Quy luật lưu thông tiền tệ, lạm phát, dịch vụ", steps: [
        {type: "say", who: "hermes", text: "Vàng nặng quá, tôi phát tiền giấy cho tiện. In càng nhiều thì làng càng giàu, đúng không?"},
        {type: "sim", mode: "money", prompt: "Chợ có tổng giá cả hàng hóa 1.000 đồng, mỗi đồng tiền quay 5 vòng một mùa. Kéo lượng tiền phát hành và xem giá cả."},
        {type: "choice", prompt: "Giá cả tăng phi mã. Lyra nên giữ của cải dưới dạng nào?", options: [
          {t: "Giữ thật nhiều tiền giấy", fb: "Tiền giấy mất giá mỗi ngày."},
          {t: "Đổi ra hàng hóa hoặc vàng để cất giữ", ok: true, fb: "Đúng. Hàng hóa và vàng giữ được giá trị khi tiền mất giá."},
          {t: "Cho Hermes vay lấy lãi", fb: "Lãi thường không theo kịp tốc độ mất giá của tiền."}]},
        {type: "say", who: "lyra", text: "Tôi còn nhận dạy dệt cho lũ trẻ. Thứ tôi bán là một buổi dạy: dạy xong là dùng xong, không cất vào kho được."},
        {type: "term", guide: ["c2b-2", "c2b-3"], trans: [["Lượng tiền vừa đủ cho chợ", "Quy luật lưu thông tiền tệ M = P·Q / V"], ["In quá nhiều, giá cả tăng", "Lạm phát (sức mua của tiền giảm)"], ["Buổi dạy dệt của Lyra", "Dịch vụ: hàng hóa vô hình, không cất trữ được"]], caveat: "Mô phỏng giữ nguyên lượng hàng và tốc độ quay vòng của tiền để thấy riêng tác động của lượng tiền; thực tế lạm phát có nhiều nguyên nhân khác."},
        {type: "gate", qs: [347, 48, 386, 110, 364]}]},
      {id: "s6", title: "Phiên chợ lớn", sub: "Thị trường, cung – cầu, giá cả và giá trị, cạnh tranh", steps: [
        {type: "say", who: "athena", text: "Chợ không chỉ là bãi đất họp mỗi sáng. Nó là toàn bộ những quan hệ mua bán giữa mọi người trong làng và cả với làng bên."},
        {type: "sim", mode: "supply", prompt: "Mỗi tấm vải có giá trị 2 đồng (như ở Cảnh 3). Người có tiền muốn mua 50 tấm. Kéo số vải đem ra chợ và xem giá bán."},
        {type: "sort", prompt: "Hermes chia các loại chợ. Mỗi cặp được chia theo tiêu chí nào?", bins: ["Theo đối tượng trao đổi", "Theo phạm vi"], items: [["Chợ hàng hóa – chợ dịch vụ", 0], ["Chợ trong làng – chợ với xứ khác", 1]]},
        {type: "choice", prompt: "Hai thợ dệt cùng bán vải trong một chợ, cạnh tranh nhau. Điều này dẫn tới gì?", options: [
          {t: "Hình thành một mức giá trị chung cho vải ở chợ đó", ok: true, fb: "Đúng. Cạnh tranh trong nội bộ ngành hình thành giá trị thị trường; cạnh tranh buộc người sản xuất luôn năng động, nhạy bén."},
          {t: "Ai bán rẻ hơn thì vải có giá trị thấp hơn mãi mãi", fb: "Giá trị do hao phí lao động xã hội quyết định, không do một người bán rẻ."},
          {t: "Không ảnh hưởng gì", fb: "Cạnh tranh là quy luật của KTTT, nó có tác động rõ rệt."}]},
        {type: "term", guide: ["c2c-0", "c2c-3"], trans: [["Bãi đất họp chợ", "Thị trường theo nghĩa hẹp"], ["Mọi quan hệ mua bán", "Thị trường theo nghĩa rộng: tổng hòa các quan hệ kinh tế"], ["Người có tiền muốn mua", "Cầu (nhu cầu có khả năng thanh toán)"], ["Vải đem ra chợ", "Cung"], ["Giá bán lên xuống quanh 2 đồng", "Giá cả xoay quanh giá trị"]], caveat: "Thanh kéo dùng một công thức minh họa để thấy chiều tăng giảm; giáo trình không đưa ra công thức định lượng cho cung – cầu."},
        {type: "gate", qs: [444, 433, 404, 438, 79, 86, 525]}]},
      {id: "s7", title: "Bàn tay vô hình và hội đồng làng", sub: "Kinh tế thị trường, quy luật giá trị, các chủ thể", steps: [
        {type: "say", who: "hermes", text: "Lạ thật: chẳng ai ra lệnh mà chợ vẫn đủ vải, đủ dê, đủ dao."},
        {type: "sort", prompt: "Quy luật giá trị tác động lên làng theo ba cách. Xếp mỗi chuyện vào đúng tác động:", bins: ["Điều tiết sản xuất, lưu thông", "Kích thích cải tiến kỹ thuật", "Phân hóa người sản xuất"], items: [["Vải đang lãi, nhiều nhà chuyển sang dệt vải", 0], ["Lyra mua khung cửi mới để dệt nhanh hơn", 1], ["Thợ dệt chậm phá sản, thợ nhanh giàu lên", 2], ["Vải từ làng thừa được chở sang làng thiếu", 0]]},
        {type: "sort", prompt: "Ai giữ vai trò gì ở chợ?", bins: ["Người sản xuất", "Người tiêu dùng", "Trung gian", "Nhà nước"], items: [["Lyra dệt vải", 0], ["Pan mua vải may áo", 1], ["Hermes nhận bán hộ, kết nối hai bên", 2], ["Hội đồng làng đặt luật cân đo, chống hàng giả", 3]]},
        {type: "choice", prompt: "Nếu để chợ hoàn toàn tự do, không ai quản, điều gì dễ xảy ra?", options: [
          {t: "Mọi thứ tự hoàn hảo nhờ bàn tay vô hình", fb: "Thị trường có ưu thế lớn nhưng cũng có khuyết tật không tự khắc phục được."},
          {t: "Rừng bị chặt cạn, kẻ giàu người nghèo cách xa, dễ có khủng hoảng", ok: true, fb: "Đúng. Đó là các khuyết tật của KTTT, cần vai trò của nhà nước."},
          {t: "Không ai còn muốn sản xuất nữa", fb: "Ngược lại, thị trường tạo động lực sáng tạo rất mạnh."}]},
        {type: "term", guide: ["c2c-1", "c2c-2", "c2c-4"], trans: [["Chợ vận hành không cần ai ra lệnh", "Kinh tế thị trường (vận hành theo cơ chế thị trường)"], ["«Bàn tay vô hình»", "Ví von của A. Smith về cơ chế thị trường"], ["Ba cách quy luật giá trị tác động lên làng", "3 tác động của quy luật giá trị"], ["Lyra, Pan, Hermes, hội đồng làng", "Các chủ thể: người sản xuất, người tiêu dùng, trung gian, nhà nước"]], caveat: "«Hội đồng làng» chỉ minh họa vai trò nhà nước. Trong KTTT hiện đại, nhà nước quản lý bằng pháp luật, chính sách, không trực tiếp quyết định giá của mọi món hàng."},
        {type: "gate", qs: [515, 288, 459, 117, 40, 360]}]}]},
    {id: "a3", chapter: 3, title: "Hồi 3 · Xưởng sợi của Hephaestus", sub: "Giá trị thặng dư trong nền kinh tế thị trường", guide: ["c3a", "c3b", "c3c"], reward: 150, scenes: [
      {id: "s1", title: "Đồng vàng biết đẻ?", sub: "Công thức chung của tư bản, hàng hóa sức lao động", steps: [
        {type: "say", who: "heph", text: "Ta có 100 đồng vàng. Ta muốn cuối năm có nhiều hơn 100. Ngươi làm quản lý xưởng sợi cho ta nhé."},
        {type: "say", who: "hermes", text: "Dễ thôi! Mua rẻ bán đắt là xong. Tôi mua bông của Demeter 100 đồng, bán lại cho ông 110 đồng."},
        {type: "choice", prompt: "Nếu ai cũng «mua rẻ bán đắt» với nhau, tổng số vàng của cả Olympus có tăng lên không?", options: [
          {t: "Có, vì ai cũng lãi", fb: "Hermes lãi 10 thì ông Hephaestus mất đúng 10. Vàng chỉ đổi chỗ, tổng không đổi."},
          {t: "Không, người này lãi thì người kia lỗ đúng bằng chừng ấy", ok: true, fb: "Chính xác. Trao đổi (lưu thông) chỉ chuyển giá trị từ tay này sang tay khác, không sinh thêm giá trị."},
          {t: "Có, nếu bán cho người nước ngoài", fb: "Phía nước ngoài lỗ đúng phần mình lãi. Xét chung, trao đổi vẫn không tạo ra giá trị mới."}]},
        {type: "say", who: "athena", text: "Vậy phần vàng dôi ra phải đến từ một món hàng đặc biệt: món hàng mà khi dùng nó, nó tạo ra giá trị lớn hơn chính giá trị của nó. Ở Olympus, món hàng đó là sức làm việc của Lyra và các thợ dệt."},
        {type: "choice", prompt: "Vì sao Lyra phải bán sức làm việc của mình cho xưởng?", options: [
          {t: "Vì Lyra là nô lệ của Hephaestus", fb: "Nô lệ bị bán cả con người. Lyra tự do, cô chỉ bán sức lao động trong một thời gian."},
          {t: "Vì Lyra tự do nhưng không có khung dệt, không có bông để tự làm ra sợi", ok: true, fb: "Đúng hai điều kiện: tự do về thân thể và không có đủ tư liệu sản xuất."},
          {t: "Vì Lyra thích làm thuê", fb: "Sở thích không phải điều kiện kinh tế. Hãy nghĩ tới tư liệu sản xuất."}]},
        {type: "term", guide: ["c3a-0", "c3a-1"], trans: [["100 đồng vàng muốn thành nhiều hơn", "T – H – T′ (công thức chung của tư bản)"], ["Hermes mua rẻ bán đắt", "Lưu thông không tạo ra giá trị thặng dư"], ["Sức làm việc của Lyra", "Hàng hóa sức lao động"]], caveat: "Hermes trong truyện chỉ minh họa lưu thông. Tư bản thương nghiệp vẫn có lợi nhuận, nhưng đó là phần giá trị thặng dư do sản xuất tạo ra được chia lại (xem Cảnh 8)."},
        {type: "gate", qs: [183, 221, 253, 178]}]},
      {id: "s2", title: "Một ngày ở xưởng sợi", sub: "Sự sản xuất giá trị thặng dư", steps: [
        {type: "say", who: "athena", text: "Ghi chép một ngày 12 giờ của Lyra: dùng hết 20 đồng bông, máy hao mòn 4 đồng, làm ra 20 kg sợi. Mỗi giờ lao động tạo thêm 0,5 đồng giá trị mới. Xưởng trả Lyra 3 đồng một ngày."},
        {type: "sim", mode: "day", prompt: "Kéo thanh giờ làm và xem giá trị sinh ra. Đến giờ thứ mấy thì Lyra đã làm ra đủ 3 đồng tiền công của mình?", lock: ["workers", "tech", "wageGoods", "wage"], goal: {key: "hours", eq: 12}},
        {type: "choice", prompt: "Cả ngày Lyra tạo ra 6 đồng giá trị mới, xưởng trả cô 3 đồng. 3 đồng còn lại thuộc về ai?", options: [
          {t: "Thuộc về Lyra, trả vào cuối tháng", fb: "Cô đã nhận đủ giá trị sức lao động (3 đồng). Phần còn lại không được trả."},
          {t: "Hephaestus chiếm không, dù đã trả Lyra đúng giá trị sức lao động", ok: true, fb: "Đúng. Không cần trả thiếu, vẫn có phần giá trị dôi ra: đó là giá trị thặng dư."},
          {t: "Tiền mua máy mới", fb: "Máy chỉ chuyển giá trị cũ của nó (4 đồng) sang sợi, không nhận phần giá trị mới."}]},
        {type: "term", guide: ["c3a-2"], trans: [["6 giờ đầu: Lyra làm ra đủ tiền công", "Thời gian lao động tất yếu (t)"], ["6 giờ sau: làm không công", "Thời gian lao động thặng dư (t′)"], ["3 đồng dôi ra", "Giá trị thặng dư (m)"]], caveat: "Con số 12 giờ, 0,5 đồng/giờ là ví dụ trong slide để dễ tính. Thực tế giá trị mới đo bằng thời gian lao động xã hội cần thiết, không cố định theo một xưởng."},
        {type: "gate", qs: [218, 278, 491, 296]}]},
      {id: "s3", title: "Chiếc máy không biết đòi lương", sub: "Tư bản bất biến, tư bản khả biến, cố định, lưu động", steps: [
        {type: "say", who: "heph", text: "Ta bỏ vàng ra mua nhiều thứ. Thứ nào làm vàng của ta sinh sôi? Sắp xếp giúp ta."},
        {type: "sort", prompt: "Xếp từng khoản vào đúng cột: phần nào chỉ chuyển nguyên giá trị sang sợi, phần nào tăng thêm giá trị?", bins: ["Chuyển nguyên giá trị (c)", "Tạo ra giá trị mới, tăng lượng (v)"], items: [["Bông", 0], ["Khung dệt, máy kéo sợi", 0], ["Nhà xưởng", 0], ["Tiền công trả thợ dệt", 1], ["Dầu, điện chạy máy", 0]]},
        {type: "sort", prompt: "Giờ xếp theo cách giá trị chảy vào sản phẩm: chuyển dần qua nhiều năm hay chuyển hết trong một chu kỳ?", bins: ["Chuyển dần (cố định)", "Chuyển hết một lần (lưu động)"], items: [["Khung dệt, máy kéo sợi", 0], ["Nhà xưởng", 0], ["Bông", 1], ["Tiền công trả thợ dệt", 1], ["Dầu, điện chạy máy", 1]]},
        {type: "say", who: "athena", text: "Hai cách xếp, hai câu hỏi khác nhau. Cách thứ nhất hỏi: cái gì tạo ra giá trị thặng dư? Cách thứ hai hỏi: giá trị chảy vào sản phẩm nhanh hay chậm? Máy tân tiến cũng bị hao mòn vô hình khi có máy mới rẻ hơn."},
        {type: "term", guide: ["c3a-3", "c3a-6"], trans: [["Khoản chỉ chuyển nguyên giá trị", "Tư bản bất biến (c)"], ["Tiền công trả thợ", "Tư bản khả biến (v)"], ["Máy, nhà xưởng chuyển dần", "Tư bản cố định"], ["Bông, điện, tiền công chuyển hết", "Tư bản lưu động"]], caveat: "Tiền công nằm ở CẢ v (theo vai trò tạo GTTD) lẫn tư bản lưu động (theo cách chuyển giá trị). Hai cách chia không trùng nhau, đề thi rất hay hỏi căn cứ phân chia."},
        {type: "gate", qs: [264, 276, 172, 247, 497, 460]}]},
      {id: "s4", title: "Ba cách để có thêm vàng", sub: "GTTD tuyệt đối, tương đối, siêu ngạch; m′ và M", steps: [
        {type: "say", who: "heph", text: "Ta muốn nhiều giá trị thặng dư hơn nữa. Ngươi thử ba cách, mỗi cách một nhiệm vụ."},
        {type: "sim", mode: "methods", prompt: "Hoàn thành 3 nhiệm vụ trong mô phỏng. Để ý cột t (thời gian tất yếu) và m′ thay đổi thế nào.", missions: [
          {id: "abs", t: "Tăng m mà KHÔNG đổi công nghệ và giá cả sinh hoạt", check: d => d.hours > 12 && d.tech === 1 && d.wageGoods === 1, done: "Kéo dài ngày lao động: t giữ nguyên, t′ dài ra."},
          {id: "rel", t: "Giữ ngày 12 giờ mà m′ vẫn tăng", check: d => d.hours === 12 && d.wageGoods > 1 && d.tech === 1, done: "Cả ngành làm ra đồ sinh hoạt rẻ hơn, giá trị sức lao động giảm, t ngắn lại."},
          {id: "exc", t: "Làm ra phần giá trị thặng dư «siêu ngạch» mà xưởng khác chưa có", check: d => d.tech > 1, done: "Máy của bạn đi trước cả ngành: giá trị cá biệt thấp hơn giá trị xã hội, bán theo giá xã hội nên có thêm phần siêu ngạch."}]},
        {type: "choice", prompt: "Khi mọi xưởng đều sắm máy mới giống bạn, phần siêu ngạch sẽ ra sao?", options: [
          {t: "Còn mãi vì bạn sắm trước", fb: "Khi máy mới phổ biến, nó trở thành điều kiện trung bình của xã hội."},
          {t: "Mất đi, vì năng suất cá biệt đã thành năng suất xã hội", ok: true, fb: "Đúng. Siêu ngạch chỉ tạm thời, cuộc đua công nghệ vì thế không bao giờ dừng."},
          {t: "Chuyển sang cho công nhân", fb: "Không. Hãy nghĩ về giá trị xã hội khi cả ngành có cùng năng suất."}]},
        {type: "term", guide: ["c3a-8", "c3a-7"], trans: [["Kéo dài ngày làm", "GTTD tuyệt đối"], ["Đồ sinh hoạt rẻ đi, t ngắn lại", "GTTD tương đối"], ["Máy đi trước cả ngành", "GTTD siêu ngạch (biến tướng của GTTD tương đối)"], ["m chia v", "Tỷ suất GTTD m′ = m/v (trình độ bóc lột)"], ["m′ nhân tổng V", "Khối lượng GTTD M = m′·V (quy mô bóc lột)"]], caveat: "Thanh «ngày làm» cho kéo tới 16 giờ để thấy hiệu ứng; thực tế ngày lao động bị giới hạn bởi thể chất, đạo đức và luật pháp."},
        {type: "gate", qs: [95, 96, 318, 189, 327, 191]}]},
      {id: "s5", title: "Tiền công và vòng quay của vàng", sub: "Tiền công, tuần hoàn, chu chuyển", steps: [
        {type: "say", who: "lyra", text: "Tháng này tôi được tăng tiền công lên 4 đồng một ngày, nhưng giá bánh mì lại gấp đôi. Tôi giàu hơn hay nghèo đi?"},
        {type: "choice", prompt: "Lyra nên nhìn vào con số nào để biết đời sống thật?", options: [
          {t: "Số đồng nhận được (4 đồng)", fb: "Đó là tiền công danh nghĩa, chưa tính giá cả."},
          {t: "Lượng bánh mì, hàng hóa mua được bằng số tiền đó", ok: true, fb: "Đó là tiền công thực tế. Lyra đang nghèo đi dù số tiền tăng."},
          {t: "Số giờ làm mỗi ngày", fb: "Số giờ làm liên quan GTTD tuyệt đối, không đo đời sống trực tiếp."}]},
        {type: "order", prompt: "Xếp lại hành trình một vòng của 100 đồng vàng trong xưởng:", items: ["Có tiền (tư bản tiền tệ)", "Mua bông, máy, thuê thợ (T – H)", "Sản xuất trong xưởng (tư bản sản xuất)", "Có kho sợi (tư bản hàng hóa)", "Bán sợi thu tiền nhiều hơn (H′ – T′)"]},
        {type: "say", who: "athena", text: "Một vòng như vậy lặp đi lặp lại thì gọi là chu chuyển. Một năm vàng quay được 4 vòng, mỗi vòng 3 tháng, thì tốc độ chu chuyển n = 12/3 = 4."},
        {type: "term", guide: ["c3a-4", "c3a-5", "c3a-6"], trans: [["4 đồng Lyra nhận", "Tiền công danh nghĩa"], ["Lượng bánh mì mua được", "Tiền công thực tế"], ["Một vòng tiền → hàng → sản xuất → hàng → tiền", "Tuần hoàn tư bản (3 giai đoạn, 3 hình thái)"], ["Vòng lặp tính theo năm", "Chu chuyển tư bản, n = CH/ch"]], caveat: "Truyện trả công theo ngày (theo thời gian). Tiền công theo sản phẩm cũng là hình thức cơ bản, tính theo số lượng và chất lượng sản phẩm."},
        {type: "gate", qs: [228, 33, 169, 232, 154, 432]}]},
      {id: "s6", title: "Cuối năm: tiêu hay tích lũy?", sub: "Tích lũy tư bản, tích tụ và tập trung", steps: [
        {type: "say", who: "heph", text: "Năm nay xưởng thu được giá trị thặng dư. Ta tiêu hết cho yến tiệc, hay dùng một phần mua thêm máy, thuê thêm thợ?"},
        {type: "sim", mode: "accum", prompt: "Chọn tỷ lệ tích lũy và cách đầu tư, rồi bấm «Sang năm» vài lần. Theo dõi quy mô tư bản và c/v.", goal: {years: 3}},
        {type: "sort", prompt: "Hai xưởng to lên theo hai cách. Cách nào làm tăng tổng tư bản của cả Olympus?", bins: ["Tích tụ (tăng tổng tư bản xã hội)", "Tập trung (không tăng tổng tư bản xã hội)"], items: [["Xưởng dùng GTTD của mình mua thêm máy", 0], ["Xưởng Hephaestus mua lại xưởng của Ares", 1], ["Hai xưởng nhỏ sáp nhập thành một", 1], ["Tái đầu tư lợi nhuận mỗi năm", 0]]},
        {type: "say", who: "lyra", text: "Xưởng mua thêm máy nhanh hơn thuê thêm người. Vài bạn tôi bị cho nghỉ việc..."},
        {type: "term", guide: ["c3b-0", "c3b-1", "c3b-2", "c3b-3"], trans: [["Lặp lại sản xuất với quy mô to hơn", "Tái sản xuất mở rộng"], ["Biến một phần GTTD thành tư bản phụ thêm", "Tích lũy tư bản (nguồn gốc duy nhất: GTTD)"], ["Máy tăng nhanh hơn người", "Cấu tạo hữu cơ c/v tăng"], ["Bạn của Lyra mất việc", "Nhân khẩu thừa tương đối (thất nghiệp)"]], caveat: "Mô phỏng giữ m′ cố định cho dễ theo dõi. Thực tế m′, năng suất và giá cả đều thay đổi khi tích lũy."},
        {type: "gate", qs: [194, 180, 174, 317, 241, 381]}]},
      {id: "s7", title: "Lợi nhuận đeo mặt nạ", sub: "Chi phí sản xuất, lợi nhuận, lợi nhuận bình quân", steps: [
        {type: "say", who: "heph", text: "Sổ sách của ta chỉ ghi: bỏ ra 27 đồng, thu về 30 đồng, lãi 3. Ta thấy lãi do CẢ 27 đồng vốn sinh ra, máy cũng có công!"},
        {type: "choice", prompt: "Vì sao nhìn sổ sách thì tưởng máy móc cũng «đẻ» ra lãi?", options: [
          {t: "Vì chi phí k = c + v gộp chung máy và tiền công, xóa nhòa khác biệt giữa c và v", ok: true, fb: "Đúng. Khi gộp chung, phần dôi ra (m) trông như con đẻ của toàn bộ vốn: đó là lợi nhuận."},
          {t: "Vì máy móc thật sự tạo ra giá trị mới", fb: "Máy chỉ chuyển giá trị của nó sang sản phẩm (Cảnh 3)."},
          {t: "Vì Hephaestus ghi sai sổ", fb: "Sổ không sai. Cái che giấu nằm ở cách tính chi phí."}]},
        {type: "sim", mode: "avgprofit", prompt: "Ba ngành ở Olympus có cùng m′ = 100% nhưng cấu tạo khác nhau. Bấm «Cho vốn chạy» để tư bản rời ngành lãi thấp sang ngành lãi cao."},
        {type: "term", guide: ["c3c-0", "c3c-1", "c3c-2"], trans: [["27 đồng bỏ ra", "Chi phí sản xuất TBCN k = c + v"], ["3 đồng lãi như do cả vốn đẻ ra", "Lợi nhuận p (hình thức biến tướng của m)"], ["Lãi trên vốn", "Tỷ suất lợi nhuận p′ = m/(c+v), luôn nhỏ hơn m′"], ["Vốn chạy qua lại giữa các ngành", "Cạnh tranh giữa các ngành → lợi nhuận bình quân, giá cả sản xuất"]], caveat: "Trong mô phỏng vốn di chuyển tức thì; thực tế quá trình bình quân hóa diễn ra qua thời gian dài và không bao giờ tuyệt đối."},
        {type: "gate", qs: [368, 184, 366, 287, 382]}]},
      {id: "s8", title: "Ai chia phần giá trị thặng dư?", sub: "Tư bản thương nghiệp, cho vay, địa tô", steps: [
        {type: "say", who: "hermes", text: "Tôi không dệt sợi, chỉ bán giúp. Vậy mà Hephaestus vẫn để tôi lấy một phần lãi."},
        {type: "say", who: "demeter", text: "Còn ta cho thuê ruộng trồng bông. Ruộng màu mỡ, gần chợ thì ta lấy nhiều hơn; ruộng xấu nhất cũng phải trả ta."},
        {type: "sort", prompt: "Ghép mỗi người với phần thu nhập của họ:", bins: ["Lợi nhuận thương nghiệp", "Lợi tức", "Địa tô"], items: [["Hermes bán sợi thay xưởng", 0], ["Ngân hàng Plutus cho xưởng vay vàng", 1], ["Demeter cho thuê ruộng bông", 2], ["Ruộng gần chợ nộp nhiều hơn", 2]]},
        {type: "choice", prompt: "Phần mà Hermes, Plutus, Demeter nhận được, suy cho cùng từ đâu ra?", options: [
          {t: "Do buôn bán, cho vay, đất đai tự tạo ra", fb: "Lưu thông, tiền cho vay, đất không tự tạo giá trị mới."},
          {t: "Đều là một phần giá trị thặng dư do công nhân tạo ra trong sản xuất", ok: true, fb: "Chính xác. Họ chia nhau giá trị thặng dư dưới các hình thức khác nhau."},
          {t: "Do nhà nước cấp", fb: "Không. Hãy quay về nguồn gốc của giá trị mới."}]},
        {type: "term", guide: ["c3c-3", "c3c-4", "c3c-5"], trans: [["Hermes bán thay xưởng", "Tư bản thương nghiệp, lợi nhuận thương nghiệp"], ["Plutus cho vay vàng", "Tư bản cho vay, lợi tức z (0 < z′ < p̄′)"], ["Demeter cho thuê ruộng", "Địa tô TBCN (chênh lệch I, II, tuyệt đối)"]], caveat: "Plutus là thần của cải trong thần thoại, ở đây chỉ dùng làm tên ngân hàng cho dễ nhớ."},
        {type: "gate", qs: [516, 430, 224, 10, 337]}]}]},
    {id: "a4", chapter: 4, title: "Hồi 4 · Liên minh các xưởng", sub: "Cạnh tranh và độc quyền", guide: ["c4a", "c4b", "c4c"], reward: 150, scenes: [
      {id: "s1", title: "Cuộc đua giữa các xưởng", sub: "Từ tự do cạnh tranh đến độc quyền", steps: [
        {type: "say", who: "athena", text: "Xưởng của Hephaestus ngày càng lớn. Ở Olympus giờ có 5 xưởng sợi, mỗi xưởng một phần thị trường, ai cũng muốn bán được nhiều hơn."},
        {type: "say", who: "ares", text: "Ta sẽ hạ giá, mua máy lớn hơn, nuốt dần mấy xưởng nhỏ. Thắng làm vua!"},
        {type: "sim", mode: "compete", prompt: "Bấm «Một năm cạnh tranh» vài lần. Theo dõi số xưởng và thị phần của xưởng lớn nhất."},
        {type: "sort", prompt: "Vì sao các xưởng lớn dần thành độc quyền? Xếp mỗi chuyện vào đúng nguyên nhân:", bins: ["LLSX phát triển", "Cạnh tranh", "Khủng hoảng & tín dụng"], items: [["Máy kéo sợi khổng lồ chỉ xưởng rất lớn mới đủ vốn mua", 0], ["Xưởng nhỏ hoặc hợp lại, hoặc bị loại", 1], ["Năm mất mùa bông, xưởng yếu phá sản hàng loạt", 2], ["Ngân hàng cho xưởng lớn vay để thôn tính xưởng nhỏ", 2]]},
        {type: "term", guide: ["c4a-0"], trans: [["Ares nuốt dần xưởng nhỏ", "Tích tụ và tập trung sản xuất"], ["Còn vài xưởng khổng lồ chi phối thị trường", "Độc quyền"], ["«Thắng làm vua» rồi lại không còn ai để đua", "Lênin: tự do cạnh tranh đẻ ra tập trung sản xuất, tập trung sản xuất tới mức nhất định dẫn tới độc quyền"]], caveat: "Mô phỏng cho xưởng nhỏ nhất mất thị phần đều đặn mỗi năm cho gọn. Thực tế tích tụ, tập trung diễn ra không đều, gắn với khủng hoảng 1873 và cuối TK XIX – đầu TK XX."},
        {type: "gate", qs: [114, 220, 345, 158, 436, 523, 493]}]},
      {id: "s2", title: "Bắt tay nhau: từ Cartel đến Trust", sub: "Các hình thức tổ chức độc quyền", steps: [
        {type: "say", who: "heph", text: "Thay vì đánh nhau đến chết, ta và Ares bắt tay. Nhưng bắt tay chặt tới mức nào?"},
        {type: "sim", mode: "forms", prompt: "Lần lượt nâng liên minh lên. Mỗi nấc, xem các xưởng thành viên còn giữ quyền gì."},
        {type: "order", prompt: "Xếp các hình thức tổ chức độc quyền từ thấp đến cao:", items: ["Cartel", "Syndicate", "Trust", "Consortium"]},
        {type: "sort", prompt: "Liên kết theo chiều nào?", bins: ["Liên kết ngang (cùng ngành)", "Liên kết dọc (nhiều ngành)"], items: [["Các xưởng sợi bắt tay nhau", 0], ["Ngân hàng, mỏ sắt, xưởng sợi, hãng tàu cùng một khối", 1], ["Hai xưởng dệt sáp nhập", 0]]},
        {type: "term", guide: ["c4b-0"], trans: [["Chỉ thỏa thuận giá, ai vẫn sản xuất, bán hàng riêng", "Cartel (thấp nhất, lỏng lẻo)"], ["Một ban chung lo mua, bán", "Syndicate (mất độc lập lưu thông)"], ["Gộp hẳn thành một công ty, chủ xưởng thành cổ đông", "Trust (thống nhất sản xuất và lưu thông)"], ["Khối nhiều ngành, ngân hàng đứng đầu", "Consortium (liên kết dọc, cao nhất)"]], caveat: "Ví dụ đặt Trust ở Olympus cho dễ nhớ; giáo trình ghi Syndicate phổ biến ở Pháp, Trust ở Mỹ, Cartel ở châu Âu cuối TK XIX."},
        {type: "gate", qs: [321, 332, 411, 456, 505, 378, 177, 322]}]},
      {id: "s3", title: "Giá do liên minh định", sub: "Giá cả và lợi nhuận độc quyền, tác động của độc quyền", steps: [
        {type: "say", who: "ares", text: "Giờ liên minh của ta nắm phần lớn thị trường. Bán sợi đắt hơn, mua bông của nông dân rẻ hơn. Lãi to!"},
        {type: "sim", mode: "monopoly", prompt: "Kéo thị phần của liên minh và xem giá bán, giá mua bông, lợi nhuận độc quyền. Để ý hai dòng cuối: ai trả phần lãi thêm này?"},
        {type: "choice", prompt: "Liên minh lãi thêm rất nhiều. Phần lãi thêm đó do đâu mà có?", options: [
          {t: "Độc quyền tự tạo ra giá trị mới", fb: "Độc quyền không làm ra thêm sợi. Giá trị vẫn do lao động tạo ra."},
          {t: "Lấy từ người mua phải trả đắt và nông dân phải bán rẻ, cộng lao động không công của công nhân", ok: true, fb: "Đúng. Giá cả độc quyền chỉ phân phối lại giá trị, nó không xóa bỏ quy luật giá trị."},
          {t: "Do Hội đồng Olympus cấp", fb: "Không. Hãy nhìn bảng: ai mất đúng bằng phần liên minh được?"}]},
        {type: "sort", prompt: "Tác động nào của độc quyền là tích cực, tác động nào tiêu cực?", bins: ["Tích cực", "Tiêu cực"], items: [["Đủ vốn mở phòng nghiên cứu máy dệt mới", 0], ["Người mua phải trả giá đắt", 1], ["Có thể giữ máy cũ, kìm hãm đổi mới vì không còn đối thủ", 1], ["Năng suất lao động tăng nhờ quy mô lớn", 0], ["Giàu nghèo cách xa thêm", 1]]},
        {type: "term", guide: ["c4a-2", "c4a-1"], trans: [["Bán đắt, mua rẻ", "Giá cả độc quyền"], ["Lãi to của liên minh", "Lợi nhuận độc quyền cao"], ["Người mua, nông dân mất đúng phần đó", "Phân phối lại giá trị, quy luật giá trị vẫn hoạt động"]], caveat: "Công thức giá trong mô phỏng chỉ minh họa chiều tăng giảm, không phải công thức giáo trình. Giáo trình chỉ nêu bản chất: giá cả độc quyền = chi phí sản xuất + lợi nhuận độc quyền cao."},
        {type: "gate", qs: [99, 4, 182, 156, 479]}]},
      {id: "s4", title: "Cạnh tranh không biến mất", sub: "Cạnh tranh trong trạng thái độc quyền", steps: [
        {type: "say", who: "heph", text: "Ta tưởng lập liên minh xong là hết cạnh tranh. Ai ngờ còn mệt hơn!"},
        {type: "sort", prompt: "Xếp mỗi cuộc giành giật vào đúng loại cạnh tranh mới xuất hiện:", bins: ["Độc quyền ↔ xưởng ngoài độc quyền", "Giữa các tổ chức độc quyền", "Trong nội bộ tổ chức độc quyền"], items: [["Liên minh cắt nguồn bông của một xưởng nhỏ đứng ngoài", 0], ["Liên minh sợi Olympus đấu với liên minh sợi Atlantis", 1], ["Hephaestus và Ares giành nhau tỷ lệ cổ phần khống chế", 2], ["Các thành viên tranh nhau phần chia lợi nhuận", 2]]},
        {type: "choice", prompt: "Vì sao độc quyền không thủ tiêu được cạnh tranh?", options: [
          {t: "Vì cạnh tranh là quy luật khách quan của kinh tế hàng hóa", ok: true, fb: "Đúng. Độc quyền sinh ra từ cạnh tranh và tồn tại cùng nó, làm cạnh tranh gay gắt hơn."},
          {t: "Vì luật pháp bắt phải cạnh tranh", fb: "Luật chống độc quyền có, nhưng lý do gốc là tính khách quan của quy luật."},
          {t: "Vì các xưởng không biết lập liên minh", fb: "Họ đã lập rồi, mà cạnh tranh vẫn còn."}]},
        {type: "term", guide: ["c4a-3"], trans: [["Liên minh chèn ép xưởng đứng ngoài", "Cạnh tranh giữa tổ chức độc quyền và xí nghiệp ngoài độc quyền"], ["Liên minh đấu liên minh", "Cạnh tranh giữa các tổ chức độc quyền"], ["Thành viên giành cổ phần", "Cạnh tranh trong nội bộ tổ chức độc quyền"]], caveat: "«Atlantis» là tên đặt cho ví dụ, không phải nội dung giáo trình."},
        {type: "gate", qs: [15, 429, 487]}]},
      {id: "s5", title: "Plutus nắm cả xưởng lẫn biển", sub: "Tư bản tài chính, xuất khẩu tư bản, phân chia thế giới", steps: [
        {type: "say", who: "plutus", text: "Xưởng nào cũng vay tiền ngân hàng của ta. Ta mua cổ phần, cử người vào ban quản trị. Chẳng mấy chốc ta nói gì các xưởng cũng nghe."},
        {type: "order", prompt: "Plutus nắm quyền qua các tầng công ty. Xếp từ trên xuống:", items: ["Plutus giữ cổ phần khống chế công ty mẹ", "Công ty mẹ giữ cổ phần khống chế các công ty con", "Công ty con giữ cổ phần khống chế các công ty cháu"]},
        {type: "say", who: "plutus", text: "Olympus chật rồi. Ta đem vốn sang xứ khác: xây xưởng ở đó, cho vua xứ đó vay tiền."},
        {type: "sort", prompt: "Xếp các việc Plutus làm ở xứ khác:", bins: ["Xuất khẩu hàng hóa", "Đầu tư trực tiếp", "Đầu tư gián tiếp"], items: [["Chở sợi sang bán", 0], ["Xây xưởng dệt, tự quản lý ở xứ Ai Cập", 1], ["Cho vua xứ Ai Cập vay lấy lãi", 2], ["Mua cổ phiếu, trái phiếu của hãng tàu nước ngoài", 2]]},
        {type: "term", guide: ["c4b-1", "c4b-2", "c4b-3", "c4b"], trans: [["Ngân hàng và xưởng hòa làm một", "Tư bản tài chính (Lênin)"], ["Công ty mẹ, con, cháu", "Chế độ tham dự"], ["Đem vốn sang xứ khác để thu GTTD", "Xuất khẩu tư bản (đặc điểm của CNTB độc quyền)"], ["Các khối chia nhau thị trường, thuộc địa", "Phân chia thế giới về kinh tế và lãnh thổ"]], caveat: "Truyện rút gọn: tư bản tài chính hình thành khi tích tụ, tập trung diễn ra cả trong công nghiệp lẫn ngân hàng, rồi hai bên xâm nhập lẫn nhau."},
        {type: "gate", qs: [51, 93, 463, 112, 166, 197, 413, 64]}]},
      {id: "s6", title: "Hội đồng Olympus vào cuộc", sub: "Độc quyền nhà nước", steps: [
        {type: "say", who: "zeus", text: "Cầu cảng, đường sá, đê điều tốn vô kể mà lâu thu hồi vốn. Hội đồng Olympus sẽ bỏ tiền làm."},
        {type: "say", who: "plutus", text: "Tốt quá. Nhân tiện, người của ta sẽ ngồi trong Hội đồng, còn người của Hội đồng sẽ làm cố vấn cho ngân hàng."},
        {type: "sort", prompt: "Mỗi chuyện thể hiện đặc điểm nào của độc quyền nhà nước?", bins: ["Kết hợp nhân sự", "Sở hữu nhà nước", "Công cụ điều tiết kinh tế"], items: [["Người của Plutus ngồi trong Hội đồng", 0], ["Hội đồng làm chủ cầu cảng, đường sá", 1], ["Hội đồng đặt thuế, lãi suất có lợi cho các liên minh", 2], ["Quan chức về hưu làm giám đốc tập đoàn", 0]]},
        {type: "choice", prompt: "Trong cơ chế này, ai phụ thuộc vào ai?", options: [
          {t: "Liên minh độc quyền phụ thuộc Hội đồng", fb: "Bề ngoài có vẻ vậy, nhưng bản chất ngược lại."},
          {t: "Hội đồng (nhà nước tư sản) phụ thuộc các liên minh độc quyền, phục vụ lợi ích của họ", ok: true, fb: "Đúng. Độc quyền nhà nước là kết hợp sức mạnh độc quyền tư nhân với nhà nước, nhằm duy trì và phát triển CNTB."},
          {t: "Hai bên độc lập hoàn toàn", fb: "Kết hợp nhân sự cho thấy hai bên đan xen chặt chẽ."}]},
        {type: "term", guide: ["c4a-4", "c4b-4"], trans: [["Hội đồng làm cầu cảng, đường sá", "Nhà nước đầu tư ngành vốn lớn, lãi thấp"], ["Người của Plutus trong Hội đồng", "Kết hợp nhân sự"], ["Hội đồng dùng thuế, lãi suất", "Độc quyền nhà nước thành công cụ điều tiết kinh tế"], ["Hội đồng phục vụ các liên minh", "Bản chất: nấc thang mới của CNTB độc quyền"]], caveat: "Zeus và «Hội đồng Olympus» chỉ minh họa nhà nước tư sản trong CNTB độc quyền nhà nước; không áp sang nhà nước XHCN ở Hồi 5."},
        {type: "gate", qs: [78, 159, 421, 23, 190, 35, 5, 398, 238]}]},
      {id: "s7", title: "Olympus thời nay", sub: "Biểu hiện mới của độc quyền, vai trò lịch sử của CNTB", steps: [
        {type: "say", who: "athena", text: "Ngày nay các liên minh mọc chi nhánh khắp nơi, nhưng xưởng nhỏ nhanh nhạy cũng sống khỏe bên cạnh. Plutus không cần giữ hết cổ phần: cổ đông nhỏ ủy nhiệm cho ngân hàng bỏ phiếu thay."},
        {type: "sort", prompt: "Nhìn lại cả hành trình của CNTB. Xếp mỗi ý vào đúng cột:", bins: ["Vai trò tích cực", "Giới hạn"], items: [["Lực lượng sản xuất phát triển vượt bậc", 0], ["Chuyển sản xuất nhỏ thành sản xuất lớn hiện đại", 0], ["Xã hội hóa sản xuất", 0], ["Sản xuất chủ yếu vì lợi ích thiểu số tư sản", 1], ["Gây chiến tranh, xung đột", 1], ["Phân hóa giàu nghèo ngày càng sâu", 1]]},
        {type: "choice", prompt: "Kho sợi đầy ắp mà người dân không đủ tiền mua, xưởng phải đóng cửa. Đó là khủng hoảng gì?", options: [
          {t: "Khủng hoảng thừa so với nhu cầu của xã hội", fb: "Người dân vẫn cần vải, chỉ là không có tiền mua."},
          {t: "Khủng hoảng sản xuất «thừa» so với sức mua có hạn của xã hội", ok: true, fb: "Đúng. Đó là bản chất khủng hoảng kinh tế TBCN, mang tính khách quan, chu kỳ, bắt nguồn từ mâu thuẫn cơ bản."},
          {t: "Khủng hoảng thiếu", fb: "Hàng đầy kho, không phải thiếu."}]},
        {type: "term", guide: ["c4c-0", "c4c-1", "c4c-2", "c4c-3"], trans: [["Chi nhánh khắp nơi", "Công ty độc quyền xuyên quốc gia"], ["Xưởng nhỏ nhanh nhạy sống khỏe", "Phát triển doanh nghiệp vừa và nhỏ"], ["Cổ đông nhỏ ủy nhiệm cho ngân hàng", "Chế độ ủy nhiệm bổ sung cho chế độ tham dự"], ["Kho đầy mà dân không mua nổi", "Khủng hoảng sản xuất thừa"], ["Mâu thuẫn sâu xa", "Xã hội hóa LLSX ↔ chiếm hữu tư nhân TBCN về TLSX"]], caveat: "Truyện chỉ chọn vài biểu hiện tiêu biểu. Kết luận «CNTB không tồn tại vĩnh viễn» là kết luận lý luận từ quy luật QHSX phù hợp LLSX, không phải dự đoán thời điểm."},
        {type: "gate", qs: [34, 361, 520, 160, 204, 211, 31, 422]}]}]},
    {id: "a5", chapter: 5, title: "Hồi 5 · Làng Lạc Hồng đổi mới", sub: "KTTT định hướng XHCN, thể chế, lợi ích kinh tế", guide: ["c5a", "c5b", "c5c"], reward: 150, scenes: [
      {id: "s1", title: "Từ kho chung đến phiên chợ", sub: "Khái niệm và tính tất yếu của KTTT định hướng XHCN", steps: [
        {type: "say", who: "athena", text: "Rời Olympus, ta tới làng Lạc Hồng. Ở đây người ta không chọn con đường của Hephaestus và Plutus, mà cũng không quay về kho chung ngày xưa."},
        {type: "say", who: "lac", text: "Hồi trước, cái gì cũng phân phối theo tem phiếu, làm nhiều làm ít như nhau, nên chẳng ai muốn làm thêm. Từ khi đổi mới, làng cho mọi người được sản xuất, mua bán, nhưng vẫn giữ mục tiêu chung."},
        {type: "order", prompt: "Xếp các mốc tư duy của Đảng về kinh tế thị trường theo thời gian:", items: ["Đại hội VI (1986): đổi mới, xóa bỏ cơ chế tập trung quan liêu bao cấp", "Đại hội IX (2001): KTTT định hướng XHCN là mô hình kinh tế tổng quát thời kỳ quá độ", "Đại hội XI (2011): nền kinh tế nhiều thành phần, vận hành theo cơ chế thị trường, có sự quản lý của Nhà nước, dưới sự lãnh đạo của Đảng"]},
        {type: "choice", prompt: "Vì sao làng Lạc Hồng phát triển KTTT là tất yếu khách quan?", options: [
          {t: "Vì KTTT là sản phẩm riêng của CNTB, phải học theo", fb: "KTTT là thành tựu chung của nhân loại, không phải sản phẩm riêng của CNTB."},
          {t: "Vì phù hợp xu hướng phát triển, KTTT có tính ưu việt thúc đẩy LLSX, và hợp nguyện vọng dân giàu, nước mạnh", ok: true, fb: "Đúng ba lý do giáo trình nêu."},
          {t: "Vì làng bị nước ngoài ép", fb: "Không phải lý do kinh tế khách quan."}]},
        {type: "term", guide: ["c5a-0", "c5a-1"], trans: [["Làng vừa cho mua bán tự do, vừa giữ mục tiêu chung", "KTTT định hướng XHCN: vận hành theo quy luật thị trường, hướng tới XHCN, Nhà nước pháp quyền XHCN điều tiết, Đảng lãnh đạo"], ["Không theo đường Olympus, không quay về kho chung", "Vừa có tính phổ biến của KTTT, vừa có tính đặc thù"], ["Ba lý do làng chọn con đường này", "Tính tất yếu khách quan"]], caveat: "Làng Lạc Hồng là hình ảnh thu nhỏ cho dễ hình dung; KTTT định hướng XHCN là mô hình của cả nền kinh tế quốc dân. Các mốc Đại hội lấy theo đáp án trong ngân hàng đề và Study Guide."},
        {type: "gate", qs: [98, 135, 387, 480, 39, 193, 467, 118]}]},
      {id: "s2", title: "Năm đặc trưng của con đường riêng", sub: "Đặc trưng của KTTT định hướng XHCN, tăng trưởng", steps: [
        {type: "say", who: "hong", text: "Làng có hợp tác xã của tôi, doanh nghiệp của chị Mai, cửa hàng nhà nước, cả một xưởng của người nước ngoài. Nhiều kiểu chủ cùng làm ăn."},
        {type: "sort", prompt: "Mỗi điều ở làng Lạc Hồng thuộc đặc trưng nào?", bins: ["Mục tiêu", "Sở hữu & thành phần", "Quản lý", "Phân phối", "Tăng trưởng gắn công bằng"], items: [["Dân giàu, nước mạnh, dân chủ, công bằng, văn minh", 0], ["Hợp tác xã, doanh nghiệp tư nhân, doanh nghiệp nhà nước cùng tồn tại", 1], ["Nhà nước pháp quyền quản lý, Đảng lãnh đạo, nhân dân làm chủ", 2], ["Làm nhiều hưởng nhiều, có thêm phúc lợi cho người khó khăn", 3], ["Xây trường, trạm y tế ngay khi làng vừa khá lên", 4]]},
        {type: "choice", prompt: "Trong làng, thành phần nào giữ vai trò chủ đạo, thành phần nào là động lực quan trọng?", options: [
          {t: "Kinh tế tư nhân chủ đạo, kinh tế nhà nước là động lực", fb: "Đảo vai trò rồi."},
          {t: "Kinh tế nhà nước giữ vai trò chủ đạo, kinh tế tư nhân là một động lực quan trọng", ok: true, fb: "Đúng (Nghị quyết TW5 khóa XII khẳng định kinh tế tư nhân là một động lực quan trọng)."},
          {t: "Kinh tế có vốn nước ngoài giữ vai trò chủ đạo", fb: "Đó là bộ phận quan trọng, không giữ vai trò chủ đạo."}]},
        {type: "term", guide: ["c5a-2", "c5a-3"], trans: [["Mục tiêu chung của làng", "Dân giàu, nước mạnh, dân chủ, công bằng, văn minh"], ["Nhiều kiểu chủ cùng làm ăn", "Nhiều hình thức sở hữu, nhiều thành phần kinh tế"], ["Làm nhiều hưởng nhiều + phúc lợi", "Phân phối theo lao động, hiệu quả kinh tế, đóng góp vốn và qua phúc lợi"], ["Làng khá lên thì xây trường ngay", "Tăng trưởng kinh tế gắn với tiến bộ và công bằng xã hội trong từng bước"]], caveat: "«Cửa hàng nhà nước» trong làng chỉ minh họa; kinh tế nhà nước giữ vai trò chủ đạo ở tầm nền kinh tế (ngành then chốt, công cụ điều tiết), không phải ở từng làng."},
        {type: "gate", qs: [67, 157, 312, 291, 222, 375, 165, 373]}]},
      {id: "s3", title: "Luật chơi của làng", sub: "Thể chế và hoàn thiện thể chế KTTT định hướng XHCN", steps: [
        {type: "say", who: "mai", text: "Tôi muốn mở rộng xưởng, nhưng không rõ đất của ai, vay vốn ở đâu, tranh chấp thì ai phân xử."},
        {type: "say", who: "athena", text: "Chị Mai đang thiếu «luật chơi»: những quy tắc, luật pháp, bộ máy và cơ chế vận hành điều chỉnh hành vi của mọi người. Đó là thể chế."},
        {type: "sort", prompt: "Thể chế được phân loại theo nhiều cách. Xếp đúng:", bins: ["Theo lĩnh vực cốt lõi của xã hội", "Theo cấu trúc tổ chức tham gia xã hội"], items: [["Thể chế chính trị", 0], ["Thể chế kinh tế", 0], ["Thể chế xã hội", 0], ["Thể chế công – thể chế tư", 1]]},
        {type: "choice", prompt: "Vì sao làng phải hoàn thiện thể chế KTTT định hướng XHCN?", options: [
          {t: "Vì thể chế đã quá nhiều yếu tố thị trường", fb: "Ngược lại: thể chế còn THIẾU các yếu tố thị trường và các loại thị trường."},
          {t: "Vì thể chế còn chưa đồng bộ, chưa đầy đủ, kém hiệu lực, thiếu các yếu tố thị trường", ok: true, fb: "Đúng ba lý do giáo trình nêu."},
          {t: "Vì Đảng lãnh đạo", fb: "Sự lãnh đạo của Đảng là đặc trưng, không phải lý do phải hoàn thiện thể chế."}]},
        {type: "sort", prompt: "Mỗi việc làng làm thuộc nội dung hoàn thiện thể chế nào?", bins: ["Về sở hữu, thành phần kinh tế", "Yếu tố & các loại thị trường", "Gắn tăng trưởng với công bằng", "Hội nhập", "Năng lực hệ thống chính trị"], items: [["Cấp sổ đỏ, thể chế hóa quyền tài sản", 0], ["Lập sàn giao dịch, luật chứng khoán minh bạch", 1], ["Xây hệ thống an sinh đi cùng tăng trưởng", 2], ["Sửa luật cho khớp cam kết thương mại quốc tế", 3], ["Nâng hiệu lực quản lý của chính quyền", 4]]},
        {type: "term", guide: ["c5b-0", "c5b-1", "c5b-2"], trans: [["Luật chơi của làng", "Thể chế: quy tắc, luật pháp, bộ máy, cơ chế vận hành"], ["Luật chơi còn thiếu, còn vênh", "Thể chế chưa đồng bộ, chưa đầy đủ, kém hiệu lực"], ["Năm việc làng làm", "Năm nhóm nội dung hoàn thiện thể chế"]], caveat: "Ví dụ «sổ đỏ», «sàn giao dịch» là minh họa đời thường cho từng nhóm nội dung, không phải danh sách chính thức trong giáo trình."},
        {type: "gate", qs: [168, 58, 164, 213, 71, 116, 20, 494]}]},
      {id: "s4", title: "Ai được gì?", sub: "Lợi ích kinh tế, quan hệ lợi ích, sở hữu", steps: [
        {type: "say", who: "tung", text: "Tôi đi làm ở xưởng chị Mai vì cần tiền lương nuôi con. Chị Mai mở xưởng vì muốn có lãi. Cả hai đều vì cái lợi của mình."},
        {type: "sort", prompt: "Mỗi chủ thể quan tâm trước hết tới lợi ích nào?", bins: ["Lợi nhuận", "Tiền công, thu nhập", "Thuế, ổn định, phúc lợi chung"], items: [["Chị Mai, chủ doanh nghiệp", 0], ["Anh Tùng, công nhân", 1], ["Chính quyền làng, cộng đồng", 2]]},
        {type: "choice", prompt: "Xưởng càng phát đạt thì anh Tùng càng có việc làm; nhưng chị Mai muốn trả lương thấp còn anh Tùng muốn lương cao. Quan hệ lợi ích của hai người là gì?", options: [
          {t: "Chỉ thống nhất", fb: "Họ vẫn mâu thuẫn ở chuyện chia phần."},
          {t: "Vừa thống nhất, vừa mâu thuẫn", ok: true, fb: "Đúng. Các quan hệ lợi ích kinh tế vừa thống nhất vừa mâu thuẫn."},
          {t: "Chỉ mâu thuẫn", fb: "Họ cùng có lợi khi xưởng phát triển."}]},
        {type: "sort", prompt: "Điều gì quyết định lợi ích mỗi người nhận được nhiều hay ít? Xếp đúng nhân tố:", bins: ["Trình độ LLSX", "Địa vị trong QHSX", "Chính sách phân phối", "Hội nhập quốc tế"], items: [["Làng có máy móc hiện đại, làm ra nhiều của cải hơn", 0], ["Người làm chủ xưởng hay người làm thuê", 1], ["Thuế thu nhập, trợ cấp của nhà nước", 2], ["Hàng của làng bán được ra nước ngoài", 3]]},
        {type: "term", guide: ["c5c-0", "c5c-1", "c5c-3"], trans: [["Lương của Tùng, lãi của Mai", "Lợi ích kinh tế: lợi ích vật chất thu được từ hoạt động kinh tế"], ["Vì cái lợi mà đi làm, mở xưởng", "Lợi ích kinh tế là động lực trực tiếp; phản ánh mục đích và động cơ của các quan hệ"], ["Cùng lợi mà vẫn giằng co", "Quan hệ lợi ích vừa thống nhất vừa mâu thuẫn"], ["Ai làm chủ xưởng", "Sở hữu, do trình độ LLSX quy định trực tiếp"]], caveat: "Truyện chỉ nêu hai người để dễ thấy. Giáo trình còn nêu quan hệ giữa những người sử dụng lao động với nhau, giữa những người lao động, giữa cá nhân – nhóm – xã hội."},
        {type: "gate", qs: [501, 518, 43, 481, 506, 350, 521, 286]}]},
      {id: "s5", title: "Bà trưởng làng giữ thăng bằng", sub: "Vai trò Nhà nước trong bảo đảm hài hòa các quan hệ lợi ích", steps: [
        {type: "say", who: "lac", text: "Làm trưởng làng khó nhất là giữ cho ai cũng có phần, mà làng vẫn đi lên. Cháu thử ngồi ghế của bà xem."},
        {type: "balance", prompt: "Bốn tình huống, mỗi lần chọn một cách xử lý. Theo dõi ba thanh lợi ích. Con số chỉ minh họa chiều tác động.", groups: ["Người lao động", "Doanh nghiệp", "Xã hội & môi trường"], done: "Cả ba thanh đều đi lên: Nhà nước điều hòa các lợi ích chứ không triệt tiêu bên nào.", rounds: [
          {sit: "Nhà đầu tư ngại vào làng vì đường xấu, thủ tục rườm rà, luật không rõ.", role: "Bảo vệ lợi ích hợp pháp, tạo môi trường thuận lợi", options: [
            {t: "Làm đường, giữ ổn định, ban hành luật rõ ràng, thông thoáng", ok: true, eff: [5, 15, 10], fb: "Đúng vai trò thứ nhất: tạo môi trường thuận lợi (ổn định chính trị, pháp luật, kết cấu hạ tầng)."},
            {t: "Đánh thuế thật cao lên doanh nghiệp mới vào", eff: [0, -20, 5], fb: "Doanh nghiệp bị thiệt, làng mất động lực đầu tư."},
            {t: "Kệ thị trường tự lo", eff: [-5, -5, -10], fb: "Hạ tầng, pháp luật là việc thị trường không tự làm được."}]},
          {sit: "Doanh nghiệp lãi lớn nhưng lương công nhân thấp, giàu nghèo cách xa.", role: "Điều hòa lợi ích cá nhân – doanh nghiệp – xã hội", options: [
            {t: "Cấm doanh nghiệp có lãi cao", eff: [5, -30, -10], fb: "Triệt tiêu lợi ích doanh nghiệp thì mất động lực sản xuất."},
            {t: "Lương tối thiểu, thuế thu nhập, quỹ phúc lợi", ok: true, eff: [15, -5, 10], fb: "Đúng vai trò thứ hai: điều hòa lợi ích, trước hết bằng chính sách phân phối thu nhập."},
            {t: "Giữ lương thấp để thu hút đầu tư", eff: [-15, 10, -10], fb: "Người lao động bị thiệt, phân hóa tăng."}]},
          {sit: "Một nhóm cán bộ móc ngoặc với một doanh nghiệp để thắng thầu, rồi cho xả thải ra sông.", role: "Kiểm soát, ngăn ngừa quan hệ lợi ích tiêu cực", options: [
            {t: "Bỏ qua vì doanh nghiệp đóng thuế nhiều", eff: [-5, 10, -25], fb: "Lợi ích nhóm làm hại cả cộng đồng."},
            {t: "Cấm luôn mọi doanh nghiệp tư nhân", eff: [-10, -30, 0], fb: "Phạt cả người làm ăn chân chính."},
            {t: "Đấu thầu công khai, xử lý tham nhũng, phạt xả thải", ok: true, eff: [5, 5, 20], fb: "Đúng vai trò thứ ba: kiểm soát, ngăn ngừa các quan hệ lợi ích tiêu cực."}]},
          {sit: "Công nhân đình công đòi tăng lương, chủ doanh nghiệp dọa đóng cửa.", role: "Giải quyết mâu thuẫn trong quan hệ lợi ích", options: [
            {t: "Đứng về phía doanh nghiệp, cấm đình công", eff: [-20, 5, -10], fb: "Mâu thuẫn bị đè xuống chứ không được giải quyết."},
            {t: "Để hai bên tự giải quyết dù kéo dài", eff: [-10, -10, -10], fb: "Cả ba bên cùng thiệt khi mâu thuẫn kéo dài."},
            {t: "Tổ chức đối thoại, hòa giải theo luật lao động, kịp thời", ok: true, eff: [10, 5, 5], fb: "Đúng vai trò thứ tư: giải quyết kịp thời mâu thuẫn trong quan hệ lợi ích."}]}]},
        {type: "term", guide: ["c5c-2"], trans: [["Làm đường, luật rõ ràng", "Bảo vệ lợi ích hợp pháp, tạo môi trường thuận lợi"], ["Lương tối thiểu, thuế, phúc lợi", "Điều hòa lợi ích cá nhân – doanh nghiệp – xã hội"], ["Xử lý móc ngoặc, xả thải", "Kiểm soát, ngăn ngừa quan hệ lợi ích tiêu cực"], ["Đối thoại khi đình công", "Giải quyết mâu thuẫn trong quan hệ lợi ích"]], caveat: "Bà trưởng làng là hình ảnh thu nhỏ của Nhà nước. Các con số trên thanh chỉ để thấy chiều tác động, không có trong giáo trình. Khác Zeus ở Hồi 4: ở đây Nhà nước pháp quyền XHCN điều hòa lợi ích của nhân dân, không phục vụ một nhóm độc quyền."},
        {type: "gate", qs: [355, 346, 474, 492, 519, 471]}]}]},
    {id: "a6", chapter: 6, title: "Hồi 6 · Con đường ra biển lớn", sub: "CNH, HĐH và hội nhập kinh tế quốc tế", guide: ["c6a", "c6b"], reward: 150, scenes: [
      {id: "s1", title: "Bốn lần thế giới đổi máy", sub: "Các cuộc cách mạng công nghiệp và vai trò của chúng", steps: [
        {type: "say", who: "heph", text: "Ta đã rèn đủ loại máy qua mấy trăm năm. Mỗi lần có loại máy mới, cả thế giới thay đổi theo. Cháu xếp giúp ta xem máy nào thuộc thời nào."},
        {type: "sort", prompt: "Xếp mỗi phát minh, đặc trưng vào đúng cuộc cách mạng công nghiệp:", bins: ["Lần 1", "Lần 2", "Lần 3", "Lần 4"], items: [["Máy hơi nước, thoi bay của John Kay, ngành dệt ở Anh", 0], ["Điện, động cơ điện, dây chuyền sản xuất hàng loạt", 1], ["Máy tính, công nghệ thông tin, tự động hóa", 2], ["Trí tuệ nhân tạo, Internet vạn vật, dữ liệu lớn", 3], ["Được nhắc lần đầu ở hội chợ Hannover (Đức) năm 2011", 3]]},
        {type: "order", prompt: "C. Mác khái quát cuộc cách mạng công nghiệp lần thứ nhất qua ba giai đoạn. Xếp đúng thứ tự:", items: ["Hiệp tác giản đơn", "Công trường thủ công", "Đại công nghiệp cơ khí"]},
        {type: "choice", prompt: "Đâu KHÔNG phải vai trò của cách mạng công nghiệp mà giáo trình nêu?", options: [
          {t: "Thúc đẩy lực lượng sản xuất phát triển", fb: "Đây là vai trò thứ nhất."},
          {t: "Thúc đẩy hoàn thiện quan hệ sản xuất", fb: "Đây là vai trò thứ hai."},
          {t: "Thúc đẩy các quan hệ sản xuất mới ra đời", ok: true, fb: "Đúng. Giáo trình nói «hoàn thiện» QHSX và «đổi mới phương thức quản trị phát triển», không nói làm QHSX mới ra đời."},
          {t: "Thúc đẩy đổi mới phương thức quản trị phát triển", fb: "Đây là vai trò thứ ba."}]},
        {type: "term", guide: ["c6a-0", "c6a"], trans: [["Mỗi lần có loại máy mới", "Cách mạng công nghiệp: bước nhảy vọt về chất của tư liệu lao động"], ["Bốn thời của máy", "CMCN lần 1, 2, 3, 4 (cơ giới hóa → điện – cơ khí → tự động hóa, CNTT → AI, IoT, Big data)"], ["Ba bước Mác khái quát", "Hiệp tác giản đơn → công trường thủ công → đại công nghiệp"]], caveat: "Hephaestus «rèn máy suốt mấy trăm năm» chỉ là cách kể; mốc thời gian và nơi khởi phát của từng cuộc CMCN xem ở bảng trong khung bên trên."},
        {type: "gate", qs: [16, 44, 173, 120, 141, 8, 90, 121]}]},
      {id: "s2", title: "Ba con đường công nghiệp hóa", sub: "Các mô hình CNH tiêu biểu trên thế giới", steps: [
        {type: "say", who: "athena", text: "Các nước đi trước đã công nghiệp hóa theo những cách rất khác nhau. Lạc Hồng nên học gì, tránh gì?"},
        {type: "sort", prompt: "Xếp mỗi đặc điểm vào đúng mô hình công nghiệp hóa:", bins: ["Cổ điển (Anh…)", "Kiểu Liên Xô (cũ)", "Nhật Bản & NICs"], items: [["Bắt đầu từ công nghiệp nhẹ (dệt), kéo dài 60 – 80 năm", 0], ["Vốn từ bóc lột lao động, cướp bóc thuộc địa", 0], ["Ưu tiên công nghiệp nặng, kế hoạch hóa tập trung, từ những năm 1930", 1], ["Rút ngắn còn 20 – 30 năm nhờ nhập khẩu, chuyển giao công nghệ", 2], ["Hàn Quốc, Singapore, Đài Loan, Hồng Kông", 2]]},
        {type: "choice", prompt: "Mô hình Liên Xô từng xây dựng cơ sở vật chất lớn rất nhanh. Vì sao về sau lại trì trệ?", options: [
          {t: "Vì công nghiệp hóa quá nhanh", fb: "Tốc độ nhanh từng là thành tựu, không phải nguyên nhân chủ yếu."},
          {t: "Vì duy trì quá lâu cơ chế kế hoạch hóa tập trung mệnh lệnh", ok: true, fb: "Đúng. Cơ chế đó kìm hãm động lực phát triển."},
          {t: "Vì thiếu tài nguyên", fb: "Liên Xô rất giàu tài nguyên."}]},
        {type: "term", guide: ["c6a-1"], trans: [["Con đường của Anh", "Mô hình CNH cổ điển"], ["Con đường ưu tiên công nghiệp nặng", "Mô hình CNH kiểu Liên Xô (cũ)"], ["Con đường rút ngắn nhờ công nghệ nhập khẩu", "Mô hình Nhật Bản và các nước công nghiệp mới (NICs)"]], caveat: "Giáo trình nêu ba mô hình tiêu biểu; thực tế mỗi nước còn có những biến thể riêng."},
        {type: "gate", qs: [21, 28, 97, 507, 46, 72, 148, 420]}]},
      {id: "s3", title: "Lạc Hồng lên đường công nghiệp hóa", sub: "Tính tất yếu, đặc trưng và nội dung CNH, HĐH ở Việt Nam", steps: [
        {type: "say", who: "lac", text: "Làng ta còn nhiều việc làm bằng tay, năng suất thấp, đi sau các làng khác cả chục năm. Không công nghiệp hóa thì không theo kịp."},
        {type: "choice", prompt: "Lý do nào KHÔNG nằm trong tính tất yếu của CNH, HĐH ở Việt Nam?", options: [
          {t: "Xây dựng cơ sở vật chất – kỹ thuật của CNXH", fb: "Đây là một lý do."},
          {t: "Rút ngắn khoảng cách tụt hậu với các nước", fb: "Đây là một lý do."},
          {t: "Tạo năng suất lao động xã hội cao", fb: "Đây là một lý do."},
          {t: "Do yêu cầu của thể chế chính trị", ok: true, fb: "Đúng. Đây không phải lý do được giáo trình nêu."}]},
        {type: "sort", prompt: "Điều nào là đặc trưng của CNH, HĐH ở Việt Nam, điều nào không?", bins: ["Là đặc trưng", "Không phải"], items: [["Theo định hướng XHCN", 0], ["Gắn với phát triển kinh tế tri thức", 0], ["Trong điều kiện KTTT định hướng XHCN", 0], ["Trong bối cảnh toàn cầu hóa, hội nhập", 0], ["Gắn liền với ưu tiên công nghiệp nặng", 1]]},
        {type: "say", who: "tung", text: "Lớp trẻ trong làng giờ học lập trình, làm sản phẩm số ngay trên máy tính. Thứ làm ra giá trị nhiều nhất là hiểu biết, không phải cơ bắp."},
        {type: "term", guide: ["c6a-2"], trans: [["Làng làm bằng tay, đi sau chục năm", "Tính tất yếu của CNH, HĐH"], ["Bốn điều làm nên con đường riêng", "4 đặc trưng CNH, HĐH ở Việt Nam"], ["Hiểu biết làm ra giá trị nhiều nhất", "Kinh tế tri thức (Đại hội IX, X nhấn mạnh)"], ["Không đi lại từng bước của nước khác", "CNH rút ngắn: coi trọng giáo dục, KH–CN làm nền tảng và động lực"]], caveat: "Ưu tiên công nghiệp nặng là cách của mô hình Liên Xô, không phải đặc trưng CNH ở Việt Nam hiện nay; đề thi rất hay đặt bẫy ở chỗ này."},
        {type: "gate", qs: [155, 69, 395, 103, 113, 126, 524, 18]}]},
      {id: "s4", title: "Ra biển lớn", sub: "Hội nhập kinh tế quốc tế: khái niệm, tác động, mốc", steps: [
        {type: "say", who: "hermes", text: "Thuyền buôn của ta ghé Lạc Hồng. Muốn bán vải ra khắp thế giới thì phải vào các hội buôn chung, theo luật chung."},
        {type: "order", prompt: "Xếp các mốc Việt Nam tham gia các tổ chức kinh tế quốc tế:", items: ["Gia nhập ASEAN (1995)", "Tham gia sáng lập ASEM (1996)", "Gia nhập APEC (1998)", "Thành viên chính thức WTO (2007)"]},
        {type: "balance", prompt: "Bà Lạc giao cho cháu bốn quyết định về hội nhập. Theo dõi ba thanh. Con số chỉ minh họa chiều tác động.", groups: ["Xuất khẩu & việc làm", "Doanh nghiệp trong nước", "Tự chủ kinh tế"], done: "Hội nhập chủ động, tích cực mà vẫn giữ tự chủ: cả ba thanh cùng đi lên.", rounds: [
          {sit: "Một hiệp định thương mại tự do mời Lạc Hồng tham gia.", role: "Chủ động, tích cực hội nhập", options: [
            {t: "Từ chối, đóng cửa cho an toàn", eff: [-15, 0, -5], fb: "Đứng ngoài xu thế khách quan thì tụt hậu, mất thị trường."},
            {t: "Ký, đồng thời sửa luật và chuẩn bị cho doanh nghiệp", ok: true, eff: [15, 5, 5], fb: "Đúng: hội nhập là xu thế tất yếu, cần chủ động chuẩn bị."},
            {t: "Ký vội, chưa chuẩn bị gì", eff: [10, -20, -10], fb: "Doanh nghiệp chưa sẵn sàng sẽ thua ngay trên sân nhà."}]},
          {sit: "Hàng ngoại giá rẻ tràn vào, xưởng dệt trong làng lao đao.", role: "Nâng cao năng lực cạnh tranh", options: [
            {t: "Hỗ trợ đổi mới công nghệ, đào tạo, xây thương hiệu", ok: true, eff: [5, 15, 10], fb: "Đúng: cạnh tranh gay gắt là thách thức, đáp lại bằng nâng năng lực cạnh tranh."},
            {t: "Dựng rào cản cấm nhập khẩu trái cam kết", eff: [0, 5, -15], fb: "Vi phạm cam kết, dễ bị trả đũa, mất uy tín."},
            {t: "Bỏ mặc doanh nghiệp tự xoay xở", eff: [-10, -20, -10], fb: "Nhiều doanh nghiệp phá sản, mất việc làm."}]},
          {sit: "Một tập đoàn nước ngoài muốn đặt nhà máy công nghệ cũ, gây ô nhiễm.", role: "Thu hút đầu tư có chọn lọc", options: [
            {t: "Nhận hết vì có việc làm", eff: [10, -5, -20], fb: "Nguy cơ thành «bãi thải công nghiệp», hại môi trường."},
            {t: "Cấm mọi vốn đầu tư nước ngoài", eff: [-15, -5, -5], fb: "Mất vốn, công nghệ, kinh nghiệm quản lý mà hội nhập mang lại."},
            {t: "Chọn lọc, ưu tiên công nghệ cao, sạch", ok: true, eff: [5, 5, 15], fb: "Đúng: tận dụng vốn, công nghệ nhưng tránh tác động tiêu cực."}]},
          {sit: "Gần hết vải của làng chỉ bán cho một khách hàng lớn duy nhất.", role: "Đa phương hóa, đa dạng hóa, giữ độc lập tự chủ", options: [
            {t: "Tìm thêm nhiều thị trường, nhiều đối tác", ok: true, eff: [10, 5, 15], fb: "Đúng: đa phương hóa, đa dạng hóa quan hệ, không để bị lệ thuộc."},
            {t: "Dồn hết hàng cho khách lớn vì đơn hàng ổn định", eff: [5, 0, -20], fb: "Lệ thuộc một thị trường, rủi ro rất lớn khi họ đổi ý."},
            {t: "Thôi xuất khẩu, chỉ bán trong làng", eff: [-15, -5, 0], fb: "Thu hẹp thị trường, đi ngược hội nhập."}]}]},
        {type: "term", guide: ["c6b-0", "c6b-1", "c6b-2"], trans: [["Vào hội buôn chung, theo luật chung", "Hội nhập kinh tế quốc tế: gắn kết kinh tế quốc gia với thế giới, chia sẻ lợi ích, tuân thủ chuẩn mực chung"], ["Hàng ngoại tràn vào, nhà máy cũ xin vào", "Tác động tiêu cực: cạnh tranh gay gắt, phụ thuộc, nguy cơ bãi thải công nghiệp"], ["Bán vải khắp thế giới, có vốn, công nghệ mới", "Tác động tích cực: mở rộng thị trường, thu hút vốn, công nghệ"], ["Không lệ thuộc một khách hàng", "Xây dựng nền kinh tế độc lập, tự chủ gắn với chủ động hội nhập"]], caveat: "Bốn tình huống là ví dụ dựng cho dễ hiểu; các mốc ASEAN, ASEM, APEC, WTO lấy theo ngân hàng đề và Study Guide."},
        {type: "gate", qs: [19, 91, 486, 106, 68, 513, 323, 388]}]}]},
  ],
};
if (typeof module !== "undefined") module.exports = STORY;
