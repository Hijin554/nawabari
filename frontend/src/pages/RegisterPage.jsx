import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('이메일과 비밀번호를 입력해주세요.');
    setLoading(true);
    setError('');
    try {
      await register(email.trim(), password, nickname.trim());
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#fff8e1' }}>회원가입</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="닉네임 (선택)"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
          />

          {error && (
            <p style={{ color: '#ff4444', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>{error}</p>
          )}

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? '처리 중...' : '가입하기'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '20px' }}>
          이미 계정이 있으신가요?{' '}
          <Link to="/login" style={{ color: '#d4a017', fontWeight: '600', textDecoration: 'none' }}>
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  backgroundColor: '#1a1a2e',
  color: '#fff',
  border: '1px solid #333',
  borderRadius: '12px',
  padding: '14px 16px',
  fontSize: '15px',
  marginBottom: '14px',
  boxSizing: 'border-box',
  outline: 'none',
};

const btnStyle = {
  width: '100%',
  backgroundColor: '#d4a017',
  color: '#0a0a0f',
  border: 'none',
  borderRadius: '12px',
  padding: '15px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  marginTop: '8px',
};
