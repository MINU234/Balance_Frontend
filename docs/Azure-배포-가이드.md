# Azure Static Web Apps 배포 가이드 🚀

이 가이드는 밸런스 게임 프론트엔드를 Azure Static Web Apps에 배포하는 방법을 설명합니다.

## 📋 배포 준비 사항

### 1. 필요한 도구
- **Azure CLI**: Azure 리소스 관리
- **GitHub 계정**: 코드 저장소 및 CI/CD
- **Node.js**: 로컬 빌드 테스트

### 2. Azure CLI 설치
```bash
# Windows (PowerShell)
winget install Microsoft.AzureCLI

# macOS
brew install azure-cli

# Ubuntu/Debian
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

## 🏗️ 자동 배포 설정 (권장)

### 1단계: GitHub에 코드 업로드

```bash
# Git 저장소 초기화 (아직 안했다면)
git init
git add .
git commit -m "Initial commit"

# GitHub 저장소 연결
git branch -M main
git remote add origin https://github.com/your-username/balance-game-frontend.git
git push -u origin main
```

### 2단계: Azure Static Web App 생성

```bash
# Azure 로그인
az login

# 배포 스크립트 실행
npm run deploy:azure
```

### 3단계: GitHub Secrets 설정

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. 다음 시크릿 추가:
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - **Value**: 스크립트에서 출력된 토큰 값

### 4단계: 자동 배포 확인

코드를 push하면 GitHub Actions가 자동으로 Azure에 배포합니다:

```bash
git add .
git commit -m "Deploy to Azure"
git push origin main
```

## 🔧 수동 배포 설정

### 1단계: Azure Portal에서 Static Web App 생성

1. [Azure Portal](https://portal.azure.com) 접속
2. **Create a resource** → **Static Web App** 선택
3. 다음 설정 입력:
   - **Subscription**: 사용할 구독
   - **Resource Group**: `balance-game-rg` (새로 생성)
   - **Name**: `balance-game-frontend`
   - **Region**: `Korea Central`
   - **Source**: `GitHub`
   - **GitHub repository**: 본인의 저장소 선택
   - **Branch**: `main`
   - **Build Presets**: `Next.js`
   - **App location**: `/`
   - **Output location**: `out`

### 2단계: 로컬 빌드 테스트

```bash
# 환경 변수 설정
echo "NEXT_PUBLIC_API_URL=https://balance-game-ekedbfhkcxeyc8cb.koreacentral-01.azurewebsites.net/api" > .env.local

# Azure용 빌드
npm run build:azure

# 빌드 결과 확인
ls -la out/
```

## 🌐 배포 후 설정

### 1. 커스텀 도메인 (선택사항)

1. Azure Portal → Static Web App → **Custom domains**
2. **Add** 클릭 → 도메인 입력
3. DNS 설정에 CNAME 레코드 추가

### 2. 환경 변수 설정

1. Azure Portal → Static Web App → **Configuration**
2. **Application settings**에 다음 추가:
   ```
   NEXT_PUBLIC_API_URL=https://balance-game-ekedbfhkcxeyc8cb.koreacentral-01.azurewebsites.net/api
   ```

### 3. 인증 설정 (선택사항)

현재는 자체 JWT 인증을 사용하지만, Azure AD 연동 가능:

1. **Authentication** → **Add identity provider**
2. GitHub, Google, Microsoft 등 선택 가능

## 📊 모니터링 및 로그

### 1. Application Insights 연동

```bash
# Application Insights 리소스 생성
az monitor app-insights component create \
  --app balance-game-insights \
  --resource-group balance-game-rg \
  --location koreacentral \
  --application-type web
```

### 2. 로그 확인

- Azure Portal → Static Web App → **Functions** → **Monitor**
- GitHub Actions 로그: Repository → **Actions** 탭

## 🔒 보안 설정

### 1. 액세스 제한

`staticwebapp.config.json`에서 라우트별 권한 설정:

```json
{
  "routes": [
    {
      "route": "/admin/*",
      "allowedRoles": ["authenticated"]
    },
    {
      "route": "/my-page",
      "allowedRoles": ["authenticated"] 
    }
  ]
}
```

### 2. 보안 헤더

Next.js 설정과 staticwebapp.config.json에서 보안 헤더 자동 설정됨

## 🚨 트러블슈팅

### 1. 빌드 실패

**문제**: TypeScript 에러로 빌드 실패
**해결**:
```bash
# 타입 오류 무시하고 빌드 (임시)
npm run build || echo "Build completed with warnings"
```

**문제**: Out of memory 에러
**해결**: GitHub Actions 워크플로우에서 Node.js 메모리 증가
```yaml
- name: Build Application
  run: NODE_OPTIONS="--max_old_space_size=4096" npm run build
```

### 2. 라우팅 문제

**문제**: 새로고침 시 404 에러
**해결**: `staticwebapp.config.json`에서 fallback 설정 확인

**문제**: API 호출 실패
**해결**: CORS 설정 및 환경 변수 확인

### 3. 배포 토큰 문제

**문제**: Invalid deployment token
**해결**:
```bash
# 새로운 토큰 생성
az staticwebapp secrets list --name balance-game-frontend --resource-group balance-game-rg
```

## 💡 성능 최적화

### 1. CDN 설정

Azure Static Web Apps는 자동으로 글로벌 CDN 제공

### 2. 빌드 최적화

```json
{
  "scripts": {
    "build:prod": "NODE_ENV=production npm run build:azure"
  }
}
```

### 3. 캐시 설정

`staticwebapp.config.json`에서 캐시 헤더 설정:

```json
{
  "globalHeaders": {
    "Cache-Control": "public, max-age=31536000"
  }
}
```

## 📈 비용 관리

### 1. 요금제 정보

- **Free tier**: 월 100GB 대역폭, 0.5GB 저장소
- **Standard tier**: 무제한 대역폭 및 저장소

### 2. 사용량 모니터링

Azure Portal → **Cost Management + Billing**에서 확인

## 🔄 업데이트 및 롤백

### 1. 자동 배포

```bash
# 새 기능 배포
git add .
git commit -m "feat: add new feature"
git push origin main
```

### 2. 수동 롤백

1. Azure Portal → Static Web App → **Environment**
2. 이전 버전 선택 → **Activate**

### 3. 환경별 배포

```bash
# Staging 환경
git push origin staging

# Production 환경  
git push origin main
```

## 📞 지원 및 문서

- **Azure 문서**: https://docs.microsoft.com/azure/static-web-apps/
- **GitHub Actions**: https://docs.github.com/actions
- **Next.js on Azure**: https://nextjs.org/docs/deployment

---

## ✅ 배포 체크리스트

- [ ] GitHub 저장소 생성 및 코드 업로드
- [ ] Azure CLI 설치 및 로그인
- [ ] Static Web App 생성
- [ ] GitHub Secrets 설정
- [ ] 환경 변수 설정
- [ ] 빌드 및 배포 테스트
- [ ] 도메인 및 보안 설정
- [ ] 모니터링 설정

**🎉 배포 완료 후 URL**: `https://your-app-name.azurestaticapps.net`

---

*이 가이드에 대한 질문이나 문제가 있다면 GitHub Issues에서 문의해주세요.*