# PickChef - Recipe Management System

냉장고 속 재료로 맛있는 레시피를 찾고 관리하는 웹 애플리케이션입니다.

## 🚀 기술 스택

### Frontend
- **React 18** with TypeScript
- **Styled Components** for styling
- **React Router** for navigation
- **React Query** for data fetching
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **FastAPI** - 고성능 Python 웹 프레임워크
- **SQLAlchemy** - Python SQL 툴킷 및 ORM
- **MySQL** - 관계형 데이터베이스
- **Pydantic** - 데이터 검증 및 설정
- **Docker** - 컨테이너화

## 📦 설치 및 실행

### 1. Docker를 사용한 실행 (권장)

```bash
# 프로젝트 클론
git clone <repository-url>
cd pickchef

# Docker Compose로 전체 서비스 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

서비스가 실행되면:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs
- **MySQL**: localhost:3306

### 2. 개발 환경 설정

#### Backend 설정
```bash
cd backend
pip install -r requirements.txt

# 환경 변수 설정
cp .env.example .env

# 서버 실행
uvicorn app.main:app --reload
```

#### Frontend 설정
```bash
# 루트 디렉토리에서
npm install
npm run dev
```

## 🗄️ 데이터베이스 구조

### Tables
- **ingredients**: 재료 정보
- **recipes**: 레시피 정보
- **recipe_ingredients**: 레시피-재료 관계 (다대다)
- **ratings**: 레시피 평가

### 관계도
```
ingredients ← recipe_ingredients → recipes → ratings
```

## 🔧 API 엔드포인트

### 재료 (Ingredients)
- `GET /api/ingredients` - 모든 재료 조회
- `POST /api/ingredients` - 재료 생성
- `GET /api/ingredients/{id}` - 특정 재료 조회
- `PUT /api/ingredients/{id}` - 재료 수정
- `DELETE /api/ingredients/{id}` - 재료 삭제

### 레시피 (Recipes)
- `GET /api/recipes` - 모든 레시피 조회
- `POST /api/recipes` - 레시피 생성
- `GET /api/recipes/{id}` - 특정 레시피 조회
- `PUT /api/recipes/{id}` - 레시피 수정
- `DELETE /api/recipes/{id}` - 레시피 삭제

### 평가 (Ratings)
- `GET /api/recipes/{id}/ratings` - 레시피 평가 조회
- `POST /api/recipes/{id}/ratings` - 레시피 평가 생성

## 🎯 주요 기능

1. **재료 관리**
   - 재료 추가, 수정, 삭제
   - 카테고리별 분류
   - 단위 관리

2. **레시피 관리**
   - 레시피 생성 및 편집
   - 난이도 및 조리시간 설정
   - 재료와의 연관 관계

3. **평가 시스템**
   - 5점 척도 평가
   - 평가 코멘트
   - 평균 평점 계산

4. **반응형 디자인**
   - 모바일, 태블릿, 데스크톱 지원
   - 직관적인 사용자 인터페이스

## 🐳 Docker 설정

### docker-compose.yml 주요 서비스
- **db**: MySQL 8.0 데이터베이스
- **backend**: FastAPI 애플리케이션

### 환경 변수
```env
DATABASE_URL=mysql+pymysql://root:password@db:3306/pickchef
```

## 🛠️ 개발자 도구

### API 문서
FastAPI는 자동으로 Swagger UI를 제공합니다:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 데이터베이스 관리
```bash
# MySQL 컨테이너 접속
docker-compose exec db mysql -u root -p pickchef
```

## 📝 라이센스

MIT License