# 밸런스 게임 프론트엔드 ⚖️

친구들과 함께 즐기는 밸런스 게임! 당신의 선택을 공유하고 비교해보세요.

**🌐 운영 중인 서비스**: 실제 백엔드 API와 연동하여 완전히 동작하는 웹 애플리케이션입니다.

## 🎯 서비스 개요

이 프로젝트는 다양한 주제의 밸런스 게임을 통해 사용자들이 선택의 재미를 경험하고, 8자리 공유코드를 통해 친구들과 취향을 비교할 수 있는 웹 서비스입니다.

### ✨ 핵심 기능

- **🎮 즉석 게임 플레이**: 회원가입 없이도 바로 게임 참여 가능
- **🔗 8자리 공유코드**: 게임 완료 후 자동 생성되는 공유코드로 친구와 비교
- **📊 일치율 분석**: 선택의 일치율을 백분율로 표시하여 친구와의 취향 유사도 확인
- **👤 회원 시스템**: 로그인 시 게임 기록 저장 및 질문 생성 기능
- **🎨 질문 생성**: 나만의 밸런스 게임 질문 및 묶음 제작
- **👑 관리자 승인제**: 품질 높은 콘텐츠를 위한 질문 승인 시스템

## 🚀 기술 스택

- **프레임워크**: Next.js 15.2.4 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: Radix UI
- **아이콘**: Lucide React
- **HTTP 클라이언트**: Axios
- **상태 관리**: React Context API

## 📦 설치 및 실행

### 로컬 개발 환경

```bash
# 저장소 클론
git clone [repository-url]
cd Balance_Game_Front

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local

# 개발 서버 실행
npm run dev
```

서버가 실행되면 http://localhost:3000에서 확인할 수 있습니다.

### Docker를 사용한 실행

```bash
# 전체 스택 실행 (프론트엔드 + 백엔드 + 데이터베이스)
docker-compose up -d

# 프론트엔드만 실행
docker build -t balance-game-frontend .
docker run -p 3000:3000 balance-game-frontend
```

## 🔧 스크립트 명령어

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 검사

## 🌐 배포

### Vercel 배포

1. Vercel에 프로젝트 연결
2. 환경 변수 설정:
   - `NEXT_PUBLIC_API_URL`: 백엔드 API URL
3. 자동 배포 완료

### Docker 배포

```bash
# 프로덕션 이미지 빌드
docker build -t balance-game-frontend .

# 컨테이너 실행
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-api-url.com/api \
  balance-game-frontend
```

## 📁 프로젝트 구조

```
Balance_Game_Front/
├── app/                    # App Router 페이지
│   ├── (auth)/            # 인증 관련 페이지
│   ├── admin/             # 관리자 페이지
│   ├── play/              # 게임 플레이 페이지
│   └── globals.css        # 전역 스타일
├── components/            # 재사용 가능한 컴포넌트
│   └── ui/               # UI 컴포넌트 라이브러리
├── lib/                  # 유틸리티 함수
│   ├── apiClient.ts      # API 클라이언트
│   └── utils.ts          # 공통 유틸리티
├── types/                # TypeScript 타입 정의
├── public/               # 정적 파일
└── context/              # React Context
```

## 🔗 API 연동

백엔드 API와의 통신은 `lib/simpleApiClient.ts`를 통해 처리됩니다.

### 주요 API 엔드포인트

- `POST /api/game/start` - 게임 시작
- `POST /api/game/answer` - 답변 제출
- `POST /api/game/sessions/{id}/complete` - 게임 완료
- `GET /api/game/share/{shareCode}` - 공유 코드로 세션 조회
- `POST /api/auth/login` - 로그인
- `POST /api/auth/signup` - 회원가입

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Blue to Purple gradient
- **Secondary**: Pink to Rose gradient
- **Accent**: Cyan to Blue gradient

### 주요 컴포넌트
- 글래스모피즘 카드
- 그라디언트 버튼
- 애니메이션 효과
- 반응형 내비게이션

## 🔐 보안

- XSS 보호 헤더 설정
- CSRF 토큰 검증
- JWT 토큰 기반 인증
- HTTPS 강제 사용

## 📱 반응형 디자인

- **Mobile**: 320px ~ 768px
- **Tablet**: 768px ~ 1024px
- **Desktop**: 1024px 이상

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 있습니다.

## 📞 문의

프로젝트에 대한 질문이나 제안이 있으시면 언제든 연락해주세요!

---

Made with ❤️ in Korea