const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'nawabari_secret';

exports.register = async (req, res) => {
  const { email, password, nickname } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
  }
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: '이미 사용 중인 이메일입니다.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, nickname) VALUES ($1, $2, $3) RETURNING id, email, nickname',
      [email, hash, nickname || email.split('@')[0]]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: '이메일 또는 비밀번호가 틀렸습니다.' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: '이메일 또는 비밀번호가 틀렸습니다.' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user.id, email: user.email, nickname: user.nickname } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, nickname, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
