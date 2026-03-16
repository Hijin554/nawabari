# Nawabari - User Management System

React + Node.js + Express + PostgreSQL + Tailwind CSS로 구축된 풀스택 사용자 관리 시스템입니다.

## 프로젝트 구조

```
nawabari/
├── backend/          # Node.js + Express 백엔드
│   ├── config/       # 데이터베이스 설정
│   ├── controllers/  # 비즈니스 로직
│   ├── routes/       # API 라우트
│   ├── database/     # 데이터베이스 초기화 스크립트
│   └── server.js     # 서버 진입점
└── frontend/         # React + Tailwind 프론트엔드
    └── src/          # 소스 코드
```

## 사전 요구사항

- Node.js (v16 이상)
- PostgreSQL (v12 이상)
- npm 또는 yarn

## 설치 및 실행 방법

### 1. PostgreSQL 데이터베이스 설정

PostgreSQL에 접속하여 데이터베이스를 생성합니다:

```bash
# PostgreSQL에 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE nawabari;

# 데이터베이스에 연결
\c nawabari

# 테이블 생성 (backend/database/init.sql 파일의 내용 실행)
```

또는 직접 SQL 파일을 실행:

```bash
psql -U postgres -d nawabari -f backend/database/init.sql
```

### 2. 백엔드 설정 및 실행

```bash
# backend 디렉토리로 이동
cd backend

# 의존성 설치
npm install

# 환경 변수 파일 생성
cp .env.example .env

# .env 파일을 열어 PostgreSQL 정보 입력
# PORT=5000
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=yourpassword
# DB_NAME=nawabari

# 개발 서버 실행
npm run dev
```

백엔드 서버가 http://localhost:5000 에서 실행됩니다.

### 3. 프론트엔드 설정 및 실행

새 터미널을 열고:

```bash
# frontend 디렉토리로 이동
cd frontend

# 의존성 설치 (이미 했다면 스킵)
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드가 http://localhost:5173 에서 실행됩니다.

## API 엔드포인트

### Users

- `GET /api/users` - 모든 사용자 조회
- `GET /api/users/:id` - 특정 사용자 조회
- `POST /api/users` - 새 사용자 생성
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- `PUT /api/users/:id` - 사용자 정보 수정
- `DELETE /api/users/:id` - 사용자 삭제

### Health Check

- `GET /api/health` - 서버 상태 확인

## 기술 스택

### 백엔드
- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL 클라이언트)
- dotenv
- cors

### 프론트엔드
- React
- Vite
- Tailwind CSS
- Axios

## 주요 기능

- 사용자 CRUD (생성, 조회, 수정, 삭제)
- 반응형 디자인
- 다크 모드 지원
- 실시간 데이터 업데이트
- 폼 유효성 검사

## 개발 팁

- 백엔드 포트를 변경하려면 `backend/.env` 파일의 `PORT` 값을 수정하세요
- 프론트엔드에서 API URL을 변경하려면 `frontend/src/App.jsx`의 `API_URL` 상수를 수정하세요
- 데이터베이스 스키마를 변경하려면 `backend/database/init.sql`을 수정하세요
