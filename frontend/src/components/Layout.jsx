import { useLocation, useNavigate } from 'react-router-dom';

// 하단 탭 바 (모바일 앱처럼)
export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: '/',           icon: '🏠', label: '홈' },
    { path: '/favorites',  icon: '⭐', label: '즐겨찾기' },
    { path: '/profile',    icon: '👤', label: '프로필' },
  ];

  return (
    <div style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* 상단 헤더 */}
      <header style={{
        backgroundColor: '#0a0a0f', borderBottom: '1px solid #1a1a2e',
        padding: '14px 20px', display: 'flex', alignItems: 'center',
      }}>
        <span
          style={{ color: '#fff8e1', fontSize: '22px', fontWeight: '700', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          나와바리
        </span>
      </header>

      {/* 본문 */}
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '64px' }}>
        {children}
      </main>

      {/* 하단 탭 바 */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        backgroundColor: '#0a0a0f', borderTop: '1px solid #1a1a2e',
        display: 'flex', height: '64px',
      }}>
        {tabs.map(tab => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none', cursor: 'pointer',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '22px', opacity: active ? 1 : 0.4 }}>{tab.icon}</span>
              <span style={{ fontSize: '11px', color: active ? '#d4a017' : '#555', fontWeight: active ? '600' : '400' }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
