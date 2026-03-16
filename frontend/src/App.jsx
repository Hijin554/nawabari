import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import SplashScreen from './components/SplashScreen';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import RecordDetailPage from './pages/RecordDetailPage';
import AddRecordPage from './pages/AddRecordPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';

// 로그인이 필요한 페이지를 감싸는 컴포넌트
// 로그인 안 된 상태에서 접근하면 로그인 페이지로 보냅니다
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ backgroundColor: '#0a0a0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#d4a017', fontSize: '16px' }}>로딩 중...</div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* 로그인 / 회원가입 (로그인 상태면 홈으로) */}
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />

      {/* 로그인이 필요한 페이지들 (하단 탭 바 포함) */}
      <Route path="/" element={
        <PrivateRoute>
          <Layout><HomePage /></Layout>
        </PrivateRoute>
      } />
      <Route path="/record/:id" element={
        <PrivateRoute>
          <Layout><RecordDetailPage /></Layout>
        </PrivateRoute>
      } />
      <Route path="/add" element={
        <PrivateRoute>
          <Layout><AddRecordPage /></Layout>
        </PrivateRoute>
      } />
      <Route path="/edit/:id" element={
        <PrivateRoute>
          <Layout><AddRecordPage /></Layout>
        </PrivateRoute>
      } />
      <Route path="/favorites" element={
        <PrivateRoute>
          <Layout><FavoritesPage /></Layout>
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <Layout><ProfilePage /></Layout>
        </PrivateRoute>
      } />

      {/* 없는 경로는 홈으로 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  // splashDone: 스플래시 화면이 끝났는지 여부
  // sessionStorage: 새로고침해도 같은 탭에서는 다시 안 나옴
  const [splashDone, setSplashDone] = useState(
    () => sessionStorage.getItem('splashDone') === 'true'
  );

  const handleSplashFinish = () => {
    sessionStorage.setItem('splashDone', 'true');
    setSplashDone(true);
  };

  // 스플래시가 끝나지 않았으면 스플래시 화면 표시
  if (!splashDone) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
