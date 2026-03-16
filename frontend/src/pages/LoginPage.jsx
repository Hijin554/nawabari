import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
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
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* 타이틀 */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '700', color: '#fff8e1', marginBottom: '8px' }}>나와바리</h1>
          <p style={{ color: '#888', fontSize: '14px', letterSpacing: '1px' }}>산책 끝에서 만난 순간들</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit}>
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
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '20px' }}>
          계정이 없으신가요?{' '}
          <Link to="/register" style={{ color: '#d4a017', fontWeight: '600', textDecoration: 'none' }}>
            회원가입
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
