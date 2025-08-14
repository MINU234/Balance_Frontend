# Azure Static Web Apps 수동 배포 가이드 🚀

Azure CLI 없이 Azure Portal을 통해 직접 배포하는 방법입니다.

## 📋 1단계: 프로젝트 준비

### 1. 빌드 설정 확인

현재 프로젝트는 이미 Azure Static Web Apps 배포를 위한 설정이 완료되어 있습니다:

- ✅ `next.config.js` - Static export 설정
- ✅ `staticwebapp.config.json` - 라우팅 및 보안 설정  
- ✅ `.github/workflows/azure-static-web-apps-deploy.yml` - 자동 배포 워크플로우

### 2. 로컬 빌드 테스트

```bash
# 환경 변수 설정
echo "NEXT_PUBLIC_API_URL=https://balance-game-ekedbfhkcxeyc8cb.koreacentral-01.azurewebsites.net/api" > .env.local

# 빌드 실행
npm run build

# 결과 확인 (out 폴더가 생성되어야 함)
ls out/
```

## 🌐 2단계: GitHub 저장소 준비

### 1. 저장소 생성 및 업로드

```bash
# Git 초기화 (아직 안했다면)
git init
git add .
git commit -m "Initial commit for Azure deployment"

# GitHub에 새 저장소 생성 후
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/balance-game-frontend.git
git push -u origin main
```

## 🏗️ 3단계: Azure Portal에서 Static Web App 생성

### 1. Azure Portal 접속
- https://portal.azure.com 로 이동
- Microsoft 계정으로 로그인

### 2. Static Web App 생성
1. **"+ Create a resource"** 클릭
2. **"Static Web App"** 검색 후 선택
3. **"Create"** 클릭

### 3. 기본 설정
```
Subscription: (사용할 구독 선택)
Resource Group: balance-game-rg (새로 만들기)
Name: balance-game-frontend
Plan type: Free
Region: East Asia 또는 Korea Central
```

### 4. 배포 세부 정보
```
Deployment source: GitHub
GitHub account: (GitHub 계정 연결)
Organization: (본인 계정)
Repository: balance-game-frontend
Branch: main
```

### 5. 빌드 세부 정보
```
Build Presets: Next.js
App location: /
Api location: (비워둠)
Output location: out
```

### 6. **"Review + create"** → **"Create"** 클릭

## ⚙️ 4단계: 배포 설정 확인

### 1. GitHub 워크플로우 확인
배포 완료 후 GitHub 저장소의 `.github/workflows/` 폴더에 Azure 워크플로우 파일이 자동 생성됩니다.

### 2. 배포 토큰 확인
1. Azure Portal → 생성한 Static Web App → **"Manage deployment token"**
2. 토큰 복사 (GitHub Secrets에 필요)

### 3. GitHub Secrets 설정
1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **"New repository secret"** 클릭
3. 다음 시크릿 추가:
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - **Value**: (복사한 토큰)

## 🔧 5단계: 환경 변수 설정

### 1. Azure Portal에서 설정
1. Static Web App → **Configuration** → **Application settings**
2. **"+ Add"** 클릭하여 다음 변수 추가:

```
Name: NEXT_PUBLIC_API_URL
Value: https://balance-game-ekedbfhkcxeyc8cb.koreacentral-01.azurewebsites.net/api
```

## 🚀 6단계: 배포 실행

### 1. 자동 배포 트리거
코드를 GitHub에 push하면 자동으로 배포됩니다:

```bash
git add .
git commit -m "Deploy to Azure Static Web Apps"
git push origin main
```

### 2. 배포 상태 확인
- **GitHub**: Repository → **Actions** 탭에서 워크플로우 진행 상태 확인
- **Azure Portal**: Static Web App → **GitHub Action runs**에서 배포 로그 확인

## 🌐 7단계: 배포 완료 확인

### 1. URL 확인
Azure Portal → Static Web App → **Overview**에서 URL 확인:
- 일반적으로 `https://[app-name].azurestaticapps.net` 형태

### 2. 기능 테스트
- [ ] 홈페이지 로딩
- [ ] 게임 탐색 페이지
- [ ] 로그인/회원가입 (API 연동)
- [ ] 게임 플레이 기능
- [ ] 반응형 디자인 (모바일/데스크톱)

## 🔒 8단계: 보안 및 성능 설정

### 1. 커스텀 도메인 (선택사항)
1. Static Web App → **Custom domains**
2. **"+ Add"** → 도메인 입력
3. DNS 설정에 CNAME 레코드 추가

### 2. 인증 설정 확인
현재는 자체 JWT 인증을 사용하지만, 필요시 Azure AD 연동 가능

### 3. 모니터링 설정
1. **Application Insights** 연결 (선택사항)
2. **Alerts** 설정 (오류율, 응답 시간 등)

## 🐛 트러블슈팅

### 1. 빌드 실패 시
**오류**: Build failed
**해결**:
```bash
# 로컬에서 빌드 테스트
npm run build

# 타입 오류가 있다면 임시로 무시
# tsconfig.json에서 "noEmit": false로 설정
```

### 2. 라우팅 문제
**오류**: 페이지 새로고침 시 404
**해결**: `staticwebapp.config.json` 설정 확인 (이미 설정됨)

### 3. API 연결 실패
**오류**: CORS 오류 또는 API 호출 실패
**해결**:
1. 환경 변수 `NEXT_PUBLIC_API_URL` 확인
2. 백엔드 서버의 CORS 설정에 Azure 도메인 추가

### 4. GitHub Actions 실패
**오류**: Workflow failed
**해결**:
1. GitHub Secrets의 `AZURE_STATIC_WEB_APPS_API_TOKEN` 확인
2. 워크플로우 파일의 `output_location: "out"` 설정 확인

## 📊 성능 모니터링

### 1. Azure Portal에서 확인
- **Metrics**: 요청 수, 응답 시간, 오류율
- **Logs**: 상세한 로그 분석

### 2. GitHub Actions에서 확인
- 빌드 시간 및 성공률 모니터링

## 💰 비용 관리

### 1. Free Tier 한도
- 100 GB/월 대역폭
- 0.5 GB 스토리지
- 2개 커스텀 도메인

### 2. 사용량 확인
Azure Portal → **Cost Management + Billing**

## 🔄 업데이트 및 관리

### 1. 코드 업데이트
```bash
git add .
git commit -m "feat: update feature"  
git push origin main
```

### 2. 롤백
Azure Portal → Static Web App → **Environment** → 이전 버전 선택

### 3. 환경별 배포
- **Staging**: PR 생성 시 자동으로 스테이징 환경 생성
- **Production**: main 브랜치에 merge 시 프로덕션 배포

---

## ✅ 배포 완료 체크리스트

- [ ] GitHub 저장소 생성 및 코드 업로드
- [ ] Azure Portal에서 Static Web App 생성
- [ ] GitHub Secrets 설정 (AZURE_STATIC_WEB_APPS_API_TOKEN)
- [ ] 환경 변수 설정 (NEXT_PUBLIC_API_URL)
- [ ] 자동 배포 테스트 (코드 push)
- [ ] 웹사이트 기능 테스트
- [ ] 커스텀 도메인 설정 (선택사항)
- [ ] 모니터링 설정 (선택사항)

## 🎉 배포 완료!

축하합니다! 밸런스 게임이 Azure Static Web Apps에 성공적으로 배포되었습니다.

**접속 URL**: `https://your-app-name.azurestaticapps.net`

---

*문제가 발생하거나 도움이 필요하면 GitHub Issues에서 문의해주세요.*