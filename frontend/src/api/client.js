import axios from 'axios';

// 서버 주소 (백엔드가 5000번 포트에서 실행 중)
const client = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// 모든 요청에 자동으로 토큰을 붙여줍니다
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
