import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠어요?')) {
      logout();
    }
  };

  return (
    <div style={{
      backgroundColor: '#0f0f1a', minHeight: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '80px',
    }}>

      {/* 아바타 */}
      <div style={{
        width: '90px', height: '90px', borderRadius: '45px',
        backgroundColor: '#d4a017', display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '16px',
      }}>
        <span style={{ fontSize: '36px', fontWeight: '700', color: '#0a0a0f' }}>
          {user?.nickname?.charAt(0)?.toUpperCase() || '?'}
        </span>
      </div>

      {/* 닉네임 */}
      <p style={{ color: '#fff8e1', fontSize: '22px', fontWeight: '600', marginBottom: '6px' }}>
        {user?.nickname || '사용자'}
      </p>

      {/* 이메일 */}
      <p style={{ color: '#888', fontSize: '14px', marginBottom: '60px' }}>
        {user?.email}
      </p>

      {/* 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        style={{
          border: '1px solid #8B0000', borderRadius: '12px',
          padding: '13px 40px', backgroundColor: 'transparent',
          color: '#ff4444', fontWeight: '600', fontSize: '15px', cursor: 'pointer',
        }}
      >
        로그아웃
      </button>
    </div>
  );
}
