-- CREATE DATABASE nawabari;

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 기록 테이블
CREATE TABLE IF NOT EXISTS records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address VARCHAR(300),
  photo_url VARCHAR(500),
  sound_url VARCHAR(500),
  emotion VARCHAR(50),         -- 감정 태그 (행복, 평온, 설렘, 무서움 등)
  category VARCHAR(50),        -- 카페, 산책길, 쉼터, 무서운골목 등
  is_public BOOLEAN DEFAULT true,
  is_favorited BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 즐겨찾기 테이블
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  record_id INTEGER REFERENCES records(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, record_id)
);

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER records_updated_at
  BEFORE UPDATE ON records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
