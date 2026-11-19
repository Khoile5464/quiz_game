-- «Endless Run Quiz» — schema cho BACKEND THẬT (app hiện chạy tĩnh với localStorage nên đây là bản thiết kế sẵn để chuyển lên server).
-- Ánh xạ bản cục bộ (js/run/run-local.js): run → S.rf.runs, user_pet → S.farm.animals (source='run'), user_pity → S.farm.pity.rainforest,
-- ngày/pet hôm nay → S.rf.day. Migration: 001 tạo bảng; 002 nạp 30 thú seed. Chạy theo thứ tự, mỗi phần idempotent (IF NOT EXISTS / ON CONFLICT).

-- ===== 001_create_run_tables.sql =====
CREATE TABLE IF NOT EXISTS pet (
  id            TEXT PRIMARY KEY,                       -- 'r_toucan'
  map_id        TEXT NOT NULL,                          -- 'rainforest'
  name          TEXT NOT NULL,
  rarity        CHAR(1) NOT NULL CHECK (rarity IN ('C','R','E','L')),
  habitat_layer TEXT NOT NULL CHECK (habitat_layer IN ('ground','trunk','canopy')),
  weight        INTEGER NOT NULL DEFAULT 1 CHECK (weight >= 0)
);
CREATE INDEX IF NOT EXISTS pet_map_rarity ON pet (map_id, rarity);

CREATE TABLE IF NOT EXISTS run (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('active','over','ended','expired','disconnected','abandoned','complete')),
  score         INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at      TIMESTAMPTZ
);
-- mỗi user tối đa MỘT run đang chạy
CREATE UNIQUE INDEX IF NOT EXISTS run_one_active_per_user ON run (user_id) WHERE status = 'active';

CREATE TABLE IF NOT EXISTS run_event (               -- audit + chống gian lận + idempotent theo (run_id, event_id)
  id         BIGSERIAL PRIMARY KEY,
  run_id     TEXT NOT NULL REFERENCES run(id),
  event_id   TEXT NOT NULL,                           -- token câu hỏi / boxId: gửi trùng → vi phạm UNIQUE → trả kết quả cũ
  type       TEXT NOT NULL,                           -- start | question | answer | box | end
  payload    JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (run_id, event_id, type)
);

CREATE TABLE IF NOT EXISTS user_pet (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  pet_id      TEXT NOT NULL REFERENCES pet(id),
  nickname    TEXT,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source      TEXT NOT NULL DEFAULT 'run',
  run_id      TEXT REFERENCES run(id)
);
CREATE INDEX IF NOT EXISTS user_pet_user ON user_pet (user_id, pet_id);

CREATE TABLE IF NOT EXISTS user_pity (
  user_id                  TEXT NOT NULL,
  map_id                   TEXT NOT NULL,
  counter_since_legendary  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, map_id)
);

CREATE TABLE IF NOT EXISTS user_pet_daily (          -- giới hạn pet/ngày
  user_id TEXT NOT NULL, day DATE NOT NULL, pets INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);

-- ===== 002_seed_rainforest.sql ===== (đồng bộ với js/run/rainforest-data.js)
INSERT INTO pet (id, map_id, name, rarity, habitat_layer) VALUES
 ('r_brownsquirrel','rainforest','Sóc nâu','C','trunk'),('r_gecko','rainforest','Tắc kè','C','trunk'),('r_treefrog','rainforest','Ếch cây xanh','C','ground'),
 ('r_forestdove','rainforest','Bồ câu rừng','C','canopy'),('r_fruitbat','rainforest','Dơi ăn quả','C','canopy'),('r_redeyefrog','rainforest','Ếch mắt đỏ','R','ground'),
 ('r_chameleon','rainforest','Cắc kè hoa','R','trunk'),('r_hummingbird','rainforest','Chim ruồi','R','canopy'),('r_greenviper','rainforest','Rắn lục cây','E','trunk'),
 ('r_poisonfrog','rainforest','Ếch phi tiêu xanh dương','L','ground'),('r_longtailmonkey','rainforest','Khỉ đuôi dài','C','trunk'),('r_woodpecker','rainforest','Chim gõ kiến','C','trunk'),
 ('r_myna','rainforest','Sáo rừng','C','canopy'),('r_flyingsquirrel','rainforest','Sóc bay','C','canopy'),('r_greenparrot','rainforest','Vẹt xanh','C','canopy'),
 ('r_sloth','rainforest','Lười ba ngón','R','trunk'),('r_gibbon','rainforest','Vượn tay trắng','R','trunk'),('r_tamarin','rainforest','Tamarin sư tử vàng','R','trunk'),
 ('r_hornbill','rainforest','Chim hồng hoàng','E','canopy'),('r_cloudedleopard','rainforest','Báo gấm','L','trunk'),('r_toucan','rainforest','Toucan','C','canopy'),
 ('r_greyparrot','rainforest','Vẹt xám','C','canopy'),('r_kingfisher','rainforest','Chim bói cá','C','canopy'),('r_bluemacaw','rainforest','Macaw xanh-vàng','C','canopy'),
 ('r_junglowl','rainforest','Cú mèo rừng','C','canopy'),('r_redmacaw','rainforest','Macaw đỏ','R','canopy'),('r_quetzal','rainforest','Quetzal','R','canopy'),
 ('r_peacock','rainforest','Chim công','R','ground'),('r_harpy','rainforest','Đại bàng Harpy','E','canopy'),('r_paradise','rainforest','Chim thiên đường','L','canopy')
ON CONFLICT (id) DO NOTHING;
