const pool = require('../config/database');

// 기록 목록 조회
exports.getRecords = async (req, res) => {
  const { category, emotion, search, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const userId = req.user.id;

  let query = `
    SELECT r.*,
      EXISTS(SELECT 1 FROM favorites f WHERE f.user_id = $1 AND f.record_id = r.id) as is_favorited
    FROM records r
    WHERE (r.is_public = true OR r.user_id = $1)
  `;
  const params = [userId];
  let i = 2;

  if (category) { query += ` AND r.category = $${i++}`; params.push(category); }
  if (emotion) { query += ` AND r.emotion = $${i++}`; params.push(emotion); }
  if (search) { query += ` AND (r.title ILIKE $${i} OR r.description ILIKE $${i})`; params.push(`%${search}%`); i++; }

  query += ` ORDER BY r.created_at DESC LIMIT $${i++} OFFSET $${i++}`;
  params.push(limit, offset);

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 기록 상세 조회
exports.getRecord = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT r.*,
        EXISTS(SELECT 1 FROM favorites f WHERE f.user_id = $2 AND f.record_id = r.id) as is_favorited
       FROM records r
       WHERE r.id = $1 AND (r.is_public = true OR r.user_id = $2)`,
      [id, userId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: '기록을 찾을 수 없습니다.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 기록 생성
exports.createRecord = async (req, res) => {
  const { title, description, latitude, longitude, address, photo_url, sound_url, emotion, category, is_public } = req.body;
  const userId = req.user.id;
  if (!title) return res.status(400).json({ error: '제목을 입력해주세요.' });
  try {
    const result = await pool.query(
      `INSERT INTO records (user_id, title, description, latitude, longitude, address, photo_url, sound_url, emotion, category, is_public)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [userId, title, description, latitude, longitude, address, photo_url, sound_url, emotion, category, is_public ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 기록 수정
exports.updateRecord = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, description, latitude, longitude, address, photo_url, sound_url, emotion, category, is_public } = req.body;
  try {
    const result = await pool.query(
      `UPDATE records SET title=$1, description=$2, latitude=$3, longitude=$4, address=$5,
        photo_url=$6, sound_url=$7, emotion=$8, category=$9, is_public=$10
       WHERE id=$11 AND user_id=$12 RETURNING *`,
      [title, description, latitude, longitude, address, photo_url, sound_url, emotion, category, is_public, id, userId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: '기록을 찾을 수 없습니다.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 기록 삭제
exports.deleteRecord = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const result = await pool.query(
      'DELETE FROM records WHERE id=$1 AND user_id=$2 RETURNING id', [id, userId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: '기록을 찾을 수 없습니다.' });
    res.json({ message: '삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 내 기록 목록
exports.getMyRecords = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT r.*,
        EXISTS(SELECT 1 FROM favorites f WHERE f.user_id = $1 AND f.record_id = r.id) as is_favorited
       FROM records r WHERE r.user_id = $1 ORDER BY r.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 즐겨찾기 토글
exports.toggleFavorite = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const exists = await pool.query(
      'SELECT id FROM favorites WHERE user_id=$1 AND record_id=$2', [userId, id]
    );
    if (exists.rows.length > 0) {
      await pool.query('DELETE FROM favorites WHERE user_id=$1 AND record_id=$2', [userId, id]);
      res.json({ is_favorited: false });
    } else {
      await pool.query('INSERT INTO favorites (user_id, record_id) VALUES ($1, $2)', [userId, id]);
      res.json({ is_favorited: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 즐겨찾기 목록
exports.getFavorites = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT r.*, true as is_favorited FROM records r
       JOIN favorites f ON f.record_id = r.id
       WHERE f.user_id = $1 ORDER BY f.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 지도용 기록 (위치 있는 것만)
exports.getMapRecords = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT id, title, latitude, longitude, emotion, category, photo_url
       FROM records
       WHERE latitude IS NOT NULL AND longitude IS NOT NULL
         AND (is_public = true OR user_id = $1)`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
