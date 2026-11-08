# Graph Report - quiz_game  (2026-11-08)

## Corpus Check
- Large corpus: 98 files · ~679,382 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 536 nodes · 737 edges · 53 communities (35 shown, 18 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 86 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Bang dap an cau 101-586 / Bay dao vai tro va tuyet
- Cau Sap xep chuyen thanh trac nghiem thu tu / Dac 
- Bay hay gap va meo nho (MLN122) / Ch.1 Doi tuong, 
- session.js / BAD / BAD_TOPIC / badFor() / choose()
- farm-loop.js / addParts() / colAt() / countMap() /
- selection.js / applySubject() / boxOf() / giaideLe
- Cặp phạm trù cái chung - cái riêng - cái đơn nhất 
- farm-scene.js / altOf() / bobOf() / cv / cx / FLOW
- Giai thich dap an MLN111 cau 1-20 (19/20 on dinh) 
- Section Cau chuyen KTCT (ktct_story.exe) / Cau chu
- sprites.js / deerDraw() / FEED_X / foxDraw() / mkS
- storage.js / cleanFarm() / D / fresh() / load() / 
- sfx.js / animalSnd() / beep() / blip() / coinSnd()
- farm-ui.js / buyAnimal() / checkUnlocks() / feedOn
- Duy tâm về lịch sử (anh hùng tạo thời thế) / Bản t
- gacha.js / animRows() / CAP_ROWS / closeG() / gb /
- Bỏ qua chế độ tư bản chủ nghĩa (Việt Nam) / Chuỗi 
- Cách mạng công nghiệp lần thứ tư / Cách mạng xã hộ
- Bundler (Vite) (bi loai) / ADR-0001: script thuong
- config.js / ALLQ / el() / hash() / pick() / Q
- Bản chất con người là tổng hòa các quan hệ xã hội 
- voice.js / animalVoice() / checkVoices() / openVoi
- Thị tộc, bộ lạc, bộ tộc / Dân tộc / Đấu tranh giai
- ocean-scene.js / drawOcean() / makeOcean() / oBub 
- Cấp độ ý thức xã hội (tâm lý xã hội và hệ tư tưởng
- Chức năng của nhà nước / Nhà nước pháp quyền XHCN 
- gacha-ocean.js / crabDraw() / hslc() / OCEAN_GACHA
- Bệnh chủ quan duy ý chí / Nhà nước và cách mạng / 
- farm-input.js / endDrag() / fpos() / hitAnimal() /
- guide-match.js / Guide / makeGuide() / build() / f
- Nguồn gốc lý luận và cấu trúc của chủ nghĩa Mác-Lê
- dates.js / dkey() / liveStreak() / today() / yeste
- badges.js / badgeEl() / BADGES / checkBadges() / s
- fx.js / burst() / NIGHT_QUOTES / QUOTES / toast()
- news.js / closeNews() / NEWS / newsUnseen() / show
- storage-panel.js / backupDue() / fmtB() / openStor
- Nguon goc cua y thuc / Van dong (phuong thuc ton t
- sound-panel.js / render() / tv.js / TV
- gacha-land.js / GACHA / machineRows()
- lofi.js / Lofi
- guide.js / GUIDE
- guide-mln122.js / GUIDE122
- questions.js / RAW
- sounds.js / MEMES
- story-mln122.js / STORY
- formulas.js / StoryMath
- story.js / Story
- city.js / City

## God Nodes (most connected - your core abstractions)
1. `MLN111 Study Guide (HTML)` - 14 edges
2. `submit()` - 13 edges
3. `renderFarmUI()` - 10 edges
4. `renderScope()` - 10 edges
5. `farmStep()` - 9 edges
6. `renderQ()` - 9 edges
7. `Phep bien chung duy vat (chapter)` - 9 edges
8. `MLN122 Study Guide (HTML)` - 9 edges
9. `Giai ma 586 dap an Triet hoc Mac-Lenin (report)` - 9 edges
10. `Giai cấp` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Bien chung duy vat (giai thich cau hoi)` --semantically_similar_to--> `Phep bien chung duy vat (chapter)`  [INFERRED] [semantically similar]
  data/reports/Giải thích đáp án MLN111.md → study-guide.html
- `Bay dao vai tro va tuyet doi hoa` --semantically_similar_to--> `Bay hay gap va meo nho (MLN111)`  [INFERRED] [semantically similar]
  data/reports/Giải thích đáp án MLN111.md → study-guide.html
- `Giao trinh Triet hoc Mac-Lenin (Bo GD&DT)` --conceptually_related_to--> `MLN111 Study Guide (HTML)`  [AMBIGUOUS]
  data/reports/Giải thích đáp án MLN111.md → study-guide.html
- `Nhan thuc luan: thuc tien la quan diem thu nhat va co ban` --semantically_similar_to--> `Ly luan nhan thuc (chapter)`  [INFERRED] [semantically similar]
  data/reports/Giải thích đáp án MLN111.md → study-guide.html
- `Phuong an nhieu gay nham (cau 13, 33, 40, 59, 74, 86)` --semantically_similar_to--> `Luc luong san xuat (LLSX)`  [INFERRED] [semantically similar]
  data/reports/Giải thích đáp án MLN111.md → study-guide.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Che do hoc trong app quiz** — readme_mln111_quiz_y2k, readme_giai_de_mode, readme_on_cau_sai, readme_trich_study_guide, index_html_quiz_section [EXTRACTED 1.00]
- **Chuỗi lập luận duy vật lịch sử về hình thái kinh tế - xã hội** — data_hanh_trinh_duy_vat_lich_su_luc_luong_san_xuat, data_hanh_trinh_duy_vat_lich_su_quan_he_san_xuat, data_hanh_trinh_duy_vat_lich_su_phuong_thuc_san_xuat, data_hanh_trinh_duy_vat_lich_su_quy_luat_qhsx_phu_hop_llsx, data_hanh_trinh_duy_vat_lich_su_co_so_ha_tang, data_hanh_trinh_duy_vat_lich_su_kien_truc_thuong_tang, data_hanh_trinh_duy_vat_lich_su_ton_tai_xa_hoi, data_hanh_trinh_duy_vat_lich_su_y_thuc_xa_hoi [EXTRACTED 1.00]
- **Ba quy luat phep bien chung duy vat** — study_guide_bien_chung, study_guide_quy_luat_mau_thuan, study_guide_quy_luat_luong_chat, study_guide_quy_luat_phu_dinh [EXTRACTED 1.00]
- **Quy trinh kiem chung dap an MLN111 va DVLS** — data_reports_doi_chieu_hanh_trinh_dvls_verification, data_research_notes_giai_thich_dap_an_mln111_q001_020_summary, data_research_notes_giai_thich_dap_an_mln111_q021_040_summary, data_research_notes_giai_thich_dap_an_mln111_q041_060_summary, data_research_notes_giai_thich_dap_an_mln111_q061_080_summary, data_research_notes_giai_thich_dap_an_mln111_q081_100_summary [INFERRED 0.75]
- **Kien truc script thuong khong dung module** — docs_adr_0001_classic_scripts_thay_vi_es_modules_decision, docs_adr_0001_classic_scripts_thay_vi_es_modules_global_scope_contract, readme_thu_tu_script_html, index_html_app_shell [INFERRED 0.85]
- **Cách mạng xã hội và tình thế cách mạng** — data_hanh_trinh_duy_vat_lich_su_cach_mang_xa_hoi, data_hanh_trinh_duy_vat_lich_su_tinh_the_cach_mang, data_hanh_trinh_duy_vat_lich_su_nhan_to_chu_quan_cach_mang, data_hanh_trinh_duy_vat_lich_su_cai_cach_dao_chinh, data_hanh_trinh_duy_vat_lich_su_van_de_co_ban_cach_mang, data_hanh_trinh_duy_vat_lich_su_chu_quan_duy_y_chi [INFERRED 0.85]
- **Cap quyet dinh - tac dong tro lai trong duy vat lich su** — study_guide_llsx, study_guide_qhsx, study_guide_quy_luat_qhsx_llsx, study_guide_ha_tang_thuong_tang, study_guide_ton_tai_xa_hoi, study_guide_y_thuc_xa_hoi [INFERRED 0.85]
- **Chuoi lap luan gia tri thang du** — study_guide_mln122_suc_lao_dong, study_guide_mln122_gia_tri_thang_du, study_guide_mln122_tich_luy_tai_san_xuat, study_guide_mln122_loi_nhuan_binh_quan, study_guide_mln122_dia_to_tbcn [INFERRED 0.85]
- **Giai cấp, dân tộc và nhà nước** — data_hanh_trinh_duy_vat_lich_su_giai_cap, data_hanh_trinh_duy_vat_lich_su_dau_tranh_giai_cap, data_hanh_trinh_duy_vat_lich_su_dan_toc, data_hanh_trinh_duy_vat_lich_su_van_de_giai_cap_dan_toc, data_hanh_trinh_duy_vat_lich_su_nha_nuoc, data_hanh_trinh_duy_vat_lich_su_nha_nuoc_vo_san [INFERRED 0.85]

## Communities (53 total, 18 thin omitted)

### Community 0 - "Bang dap an cau 101-586 / Bay dao vai tro va tuyet"
Cohesion: 0.07
Nodes (46): Bang dap an cau 101-586, Bay dao vai tro va tuyet doi hoa, Bien chung duy vat (giai thich cau hoi), Giai ma 586 dap an Triet hoc Mac-Lenin (report), Duy vat lich su: san xuat vat chat quyet dinh, xet den cung, Giao trinh Triet hoc Mac-Lenin (Bo GD&DT), Cau nghi van (12, 93, 96), Nhan thuc luan: thuc tien la quan diem thu nhat va co ban (+38 more)

### Community 1 - "Cau Sap xep chuyen thanh trac nghiem thu tu / Dac "
Cohesion: 0.05
Nodes (35): Cau Sap xep chuyen thanh trac nghiem thu tu, Dac trung nha nuoc: 3 (Angghen) va 5 (de cu cau 474), Dac trung dan toc: lanh tho va kinh te (II.7), Giao trinh Triet hoc Mac-Lenin (Bo GD&DT), Nhan trinh do va cap do cua y thuc xa hoi (IV.4, IV.5), Bao cao doi chieu Hanh trinh DVLS (132/134 khop), Section quiz (qCount, combo, explain, nextBtn), Giai de (lam tuan tu, luu tien do) (+27 more)

### Community 2 - "Bay hay gap va meo nho (MLN122) / Ch.1 Doi tuong, "
Cohesion: 0.10
Nodes (31): Bay hay gap va meo nho (MLN122), Ch.1 Doi tuong, phuong phap, chuc nang KTCT, Ch.2 Hang hoa, tien te, thi truong, Ch.3 Gia tri thang du, Ch.4 Canh tranh va doc quyen, Ch.5 KTTT dinh huong XHCN, Ch.6 CMCN, CNH-HDH, hoi nhap, Cach mang cong nghiep (4 lan) (+23 more)

### Community 3 - "session.js / BAD / BAD_TOPIC / badFor() / choose()"
Cohesion: 0.17
Nodes (26): BAD, BAD_TOPIC, badFor(), choose(), comboFx(), comboMult(), explainEl(), finish() (+18 more)

### Community 4 - "farm-loop.js / addParts() / colAt() / countMap() /"
Cohesion: 0.16
Nodes (21): addParts(), colAt(), countMap(), discAt(), drawFarm(), drawTags(), farmStep(), HEART (+13 more)

### Community 5 - "selection.js / applySubject() / boxOf() / giaideLe"
Cohesion: 0.19
Nodes (20): applySubject(), boxOf(), giaideLeft(), inScope(), learned(), newPool(), onsaiLeft(), pickGiaide() (+12 more)

### Community 6 - "Cặp phạm trù cái chung - cái riêng - cái đơn nhất "
Cohesion: 0.10
Nodes (21): Cặp phạm trù cái chung - cái riêng - cái đơn nhất, Cặp phạm trù khả năng - hiện thực, Cặp phạm trù nguyên nhân - kết quả, Cặp phạm trù nội dung - hình thức, Cặp phạm trù tất nhiên - ngẫu nhiên, Chân lý và tiêu chuẩn thực tiễn, Lơxíp và Đêmôcrit, Quiz MLN111 - Triết học Mác-Lênin (586 câu) (+13 more)

### Community 7 - "farm-scene.js / altOf() / bobOf() / cv / cx / FLOW"
Cohesion: 0.14
Nodes (16): altOf(), cv, cx, FLOWERS, frameOf(), hashOf(), NAMES, PAL (+8 more)

### Community 8 - "Giai thich dap an MLN111 cau 1-20 (19/20 on dinh) "
Cohesion: 0.11
Nodes (18): Giai thich dap an MLN111 cau 1-20 (19/20 on dinh), Thuyet kha tri va kha tri luan (cau 12), Cong cu lao dong la yeu to dong nhat (cau 40), Giai thich dap an MLN111 cau 21-40 (20/20 dung), Y thuc xa hoi lac hau, vuot truoc, tac dong tro lai (cau 23, 38), Nha nuoc la san pham cua mau thuan giai cap (cau 50), San xuat va tai san xuat doi song la nhan to quyet dinh (cau 45, 56), Giai thich dap an MLN111 cau 41-60 (20/20 on dinh) (+10 more)

### Community 9 - "Section Cau chuyen KTCT (ktct_story.exe) / Cau chu"
Cohesion: 0.13
Nodes (16): Section Cau chuyen KTCT (ktct_story.exe), Cau chuyen KTCT (truyen tuong tac, MLN122), Mon MLN122 (525 cau, 6 chuong), tools/test-story.js, errs, fs, notes, notesDir (+8 more)

### Community 10 - "sprites.js / deerDraw() / FEED_X / foxDraw() / mkS"
Cohesion: 0.13
Nodes (7): FEED_X, PEN, RAR, RAR_COL, SELL_X, SPECIES, STAGE_NAME

### Community 11 - "storage.js / cleanFarm() / D / fresh() / load() / "
Cohesion: 0.26
Nodes (10): cleanFarm(), D, fresh(), load(), norm(), normFull(), normGiaide(), normOnsai() (+2 more)

### Community 12 - "sfx.js / animalSnd() / beep() / blip() / coinSnd()"
Cohesion: 0.27
Nodes (12): animalSnd(), beep(), blip(), coinSnd(), gachaSnd(), HOVER_STYLES, memeAudio, osc() (+4 more)

### Community 13 - "farm-ui.js / buyAnimal() / checkUnlocks() / feedOn"
Cohesion: 0.33
Nodes (11): buyAnimal(), feedOne(), newAnimal(), oceanOpen(), renderFarmUI(), renderGacha(), renderMaps(), renderSel() (+3 more)

### Community 14 - "Duy tâm về lịch sử (anh hùng tạo thời thế) / Bản t"
Cohesion: 0.20
Nodes (12): Duy tâm về lịch sử (anh hùng tạo thời thế), Bản thảo kinh tế - triết học 1844, C. Mác, Con người là nguồn lực và trung tâm của phát triển (Đảng CSVN), Hệ tư tưởng Đức, Vai trò của lãnh tụ, Lời tựa Góp phần phê phán khoa kinh tế chính trị (1859), Luận cương về Phoiơbắc (1845) (+4 more)

### Community 15 - "gacha.js / animRows() / CAP_ROWS / closeG() / gb /"
Cohesion: 0.27
Nodes (10): animRows(), CAP_ROWS, gb, gBadges, gm, openDex(), pullGacha(), rollRarity() (+2 more)

### Community 16 - "Bỏ qua chế độ tư bản chủ nghĩa (Việt Nam) / Chuỗi "
Cohesion: 0.20
Nodes (11): Bỏ qua chế độ tư bản chủ nghĩa (Việt Nam), Chuỗi hình thái kinh tế - xã hội, Cơ sở hạ tầng, Các hình thái ý thức xã hội, Kiến trúc thượng tầng, Phương thức sản xuất, Quan hệ sản xuất, Tồn tại xã hội (+3 more)

### Community 17 - "Cách mạng công nghiệp lần thứ tư / Cách mạng xã hộ"
Cohesion: 0.24
Nodes (11): Cách mạng công nghiệp lần thứ tư, Cách mạng xã hội, Cải cách và đảo chính so với cách mạng xã hội, Đổi mới thể chế và quản lý theo công nghệ mới, Khoa học và công nghệ là lực lượng sản xuất trực tiếp, Lực lượng sản xuất, Quy luật quan hệ sản xuất phù hợp trình độ lực lượng sản xuất, Vấn đề chính quyền nhà nước trong cách mạng (+3 more)

### Community 18 - "Bundler (Vite) (bi loai) / ADR-0001: script thuong"
Cohesion: 0.22
Nodes (10): Bundler (Vite) (bi loai), ADR-0001: script thuong thay vi ES modules, ES modules (bi loai), Hop dong pham vi toan cuc va thu tu script, Boc IIFE/namespace (Farm, Quiz) de giam bien toan cuc, index.html khung ung dung (home, story, quiz, result), Bang nong trai Olympus va gacha, Modal thong bao cap nhat (newsModal) (+2 more)

### Community 19 - "config.js / ALLQ / el() / hash() / pick() / Q"
Cohesion: 0.22
Nodes (5): ALLQ, Q, SUBJ_TXT, SUBJECTS, subjOf()

### Community 20 - "Bản chất con người là tổng hòa các quan hệ xã hội "
Cohesion: 0.25
Nodes (9): Bản chất con người là tổng hòa các quan hệ xã hội, G.W.F. Hêghen, L. Phoiơbắc, Ngân hàng câu hỏi Hành trình Duy vật lịch sử (134 câu, 5 phần), Hạn chế quan niệm con người của Phoiơbắc, Tha hóa lao động, Quan điểm mácxít về con người, Lãnh tụ và quần chúng nhân dân (+1 more)

### Community 21 - "voice.js / animalVoice() / checkVoices() / openVoi"
Cohesion: 0.39
Nodes (8): animalVoice(), checkVoices(), openVoice(), playUrl(), VDB, voiceDrop(), voiceUrl(), vUrl

### Community 22 - "Thị tộc, bộ lạc, bộ tộc / Dân tộc / Đấu tranh giai"
Cohesion: 0.29
Nodes (8): Thị tộc, bộ lạc, bộ tộc, Dân tộc, Đấu tranh giai cấp, Giai cấp, Giai cấp cơ bản, Nguồn gốc ra đời của giai cấp, Quan hệ sở hữu tư liệu sản xuất, Mối quan hệ giai cấp - dân tộc

### Community 23 - "ocean-scene.js / drawOcean() / makeOcean() / oBub "
Cohesion: 0.29
Nodes (6): drawOcean(), makeOcean(), oBub, OCEAN_VENTS, OPL, rndO

### Community 24 - "Cấp độ ý thức xã hội (tâm lý xã hội và hệ tư tưởng"
Cohesion: 0.33
Nodes (7): Cấp độ ý thức xã hội (tâm lý xã hội và hệ tư tưởng), Hệ tư tưởng, Tâm lý xã hội, Tính độc lập tương đối của ý thức xã hội, Tính giai cấp của ý thức xã hội, Tính kế thừa của ý thức xã hội, Ý thức xã hội và quan hệ với tồn tại xã hội

### Community 25 - "Chức năng của nhà nước / Nhà nước pháp quyền XHCN "
Cohesion: 0.29
Nodes (7): Chức năng của nhà nước, Nhà nước pháp quyền XHCN (Hiến pháp 2013), Phân công, phối hợp, kiểm soát quyền lực, Nhà nước và bản chất giai cấp, Nhà nước vô sản (kiểu mới), Giai cấp và đấu tranh giai cấp (tóm tắt), Nhà nước - bản chất và chức năng (tóm tắt)

### Community 26 - "gacha-ocean.js / crabDraw() / hslc() / OCEAN_GACHA"
Cohesion: 0.29
Nodes (3): OCEAN_GACHA, RAINB, SPECIES_EXTRA

### Community 27 - "Bệnh chủ quan duy ý chí / Nhà nước và cách mạng / "
Cohesion: 0.33
Nodes (6): Bệnh chủ quan duy ý chí, Nhà nước và cách mạng, Nhân tố chủ quan của cách mạng, Sáng kiến vĩ đại (1919), Tình thế cách mạng, V.I. Lênin

### Community 28 - "farm-input.js / endDrag() / fpos() / hitAnimal() /"
Cohesion: 0.47
Nodes (3): endDrag(), petAnimal(), wakeUp()

### Community 29 - "guide-match.js / Guide / makeGuide() / build() / f"
Cohesion: 0.60
Nodes (5): Guide, makeGuide(), build(), feats(), match()

### Community 30 - "Nguồn gốc lý luận và cấu trúc của chủ nghĩa Mác-Lê"
Cohesion: 0.40
Nodes (5): Nguồn gốc lý luận và cấu trúc của chủ nghĩa Mác-Lênin, Chủ nghĩa xã hội không tưởng, Nguồn gốc và định nghĩa triết học, Triết học Trung cổ và thời Phục hưng, Xanh-ximông

### Community 31 - "dates.js / dkey() / liveStreak() / today() / yeste"
Cohesion: 0.80
Nodes (4): dkey(), liveStreak(), today(), yesterday()

### Community 34 - "news.js / closeNews() / NEWS / newsUnseen() / show"
Cohesion: 0.50
Nodes (3): NEWS, newsUnseen(), showNews()

### Community 35 - "storage-panel.js / backupDue() / fmtB() / openStor"
Cohesion: 0.60
Nodes (4): backupDue(), fmtB(), openStorage(), renderBackupHint()

### Community 36 - "Nguon goc cua y thuc / Van dong (phuong thuc ton t"
Cohesion: 0.50
Nodes (5): Nguon goc cua y thuc, Van dong (phuong thuc ton tai cua vat chat), Vat chat, van dong, y thuc (chapter), Dinh nghia vat chat (Lenin), Vat chat va y thuc (quan he)

## Ambiguous Edges - Review These
- `MLN111 Study Guide (HTML)` → `Giao trinh Triet hoc Mac-Lenin (Bo GD&DT)`  [AMBIGUOUS]
  data/reports/Giải thích đáp án MLN111.md · relation: conceptually_related_to

## Knowledge Gaps
- **65 isolated node(s):** `On cau sai (kho cau sai)`, `tools/test-story.js`, `ES modules (bi loai)`, `Bundler (Vite) (bi loai)`, `Boc IIFE/namespace (Farm, Quiz) de giam bien toan cuc` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 215 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MLN111 Study Guide (HTML)` connect `Bang dap an cau 101-586 / Bay dao vai tro va tuyet` to `Bay hay gap va meo nho (MLN122) / Ch.1 Doi tuong, `, `Nguon goc cua y thuc / Van dong (phuong thuc ton t`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `MLN111 Study Guide (HTML)` (e.g. with `Giai ma 586 dap an Triet hoc Mac-Lenin (report)` and `MLN122 Study Guide (HTML)`) actually correct?**
  _`MLN111 Study Guide (HTML)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `On cau sai (kho cau sai)`, `tools/test-story.js`, `ES modules (bi loai)` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Bang dap an cau 101-586 / Bay dao vai tro va tuyet` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Why does `MLN122 Study Guide (HTML)` connect `Bay hay gap va meo nho (MLN122) / Ch.1 Doi tuong, ` to `Bang dap an cau 101-586 / Bay dao vai tro va tuyet`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Should `Cau Sap xep chuyen thanh trac nghiem thu tu / Dac ` be split into smaller, more focused modules?**
  _Cohesion score 0.05496828752642706 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `MLN111 Study Guide (HTML)` and `Giao trinh Triet hoc Mac-Lenin (Bo GD&DT)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._