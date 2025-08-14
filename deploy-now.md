# 🚀 지금 바로 Azure에 배포하기!

Azure CLI가 설치되어 있고 로그인도 완료되었습니다. 바로 배포를 시작해보겠습니다!

## 📋 현재 상태 확인
✅ Azure CLI 설치됨 (v2.76.0)
✅ Azure 로그인 완료 (Azure for Students)
✅ 리소스 그룹 존재 (MINWOO)
✅ 프로젝트 배포 준비 완료

## 🎯 1단계: GitHub 저장소 생성 및 업로드

### Option A: GitHub Desktop 사용 (권장)
1. GitHub Desktop 실행
2. "Create a New Repository on your hard drive" 클릭
3. 다음 정보 입력:
   - Name: `balance-game-frontend`
   - Local path: `C:\Users\kmw36\포폴용 프로젝트\Balance_Game_Front`
   - "Publish to GitHub.com" 체크
4. "Create Repository" 클릭
5. GitHub에 퍼블리시

### Option B: 명령어로 업로드
```bash
# 1. GitHub에서 새 저장소 생성 (https://github.com/new)
# 2. 다음 명령어 실행:

cd "C:\Users\kmw36\포폴용 프로젝트\Balance_Game_Front"
git init
git add .
git commit -m "Initial commit - Balance Game Frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/balance-game-frontend.git
git push -u origin main
```

## 🌐 2단계: Azure Static Web App 생성

GitHub 저장소가 준비되면 다음 PowerShell 명령어를 실행하세요:

```powershell
# PowerShell에서 실행
cd "C:\Users\kmw36\포폴용 프로젝트\Balance_Game_Front"

# Static Web App 생성 (저장소 URL을 본인 것으로 변경)
& "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd" staticwebapp create `
  --name "balance-game-frontend" `
  --resource-group "MINWOO" `
  --location "koreacentral" `
  --source "https://github.com/YOUR_USERNAME/balance-game-frontend" `
  --branch "main" `
  --app-location "/" `
  --output-location "out" `
  --login-with-github
```

## 🔑 3단계: 배포 토큰 확인

```powershell
# 배포 토큰 가져오기
& "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd" staticwebapp secrets list `
  --name "balance-game-frontend" `
  --resource-group "MINWOO" `
  --query "properties.apiKey" `
  -o tsv
```

## ⚙️ 4단계: GitHub Secrets 설정

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. 다음 정보 입력:
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - **Value**: 위에서 얻은 토큰

## 🚀 5단계: 배포 실행

코드를 GitHub에 push하면 자동으로 배포됩니다:

```bash
git add .
git commit -m "Deploy to Azure Static Web Apps"
git push origin main
```

## 🌐 6단계: 결과 확인

```powershell
# 앱 URL 확인
& "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd" staticwebapp show `
  --name "balance-game-frontend" `
  --resource-group "MINWOO" `
  --query "defaultHostname" `
  -o tsv
```

## 🎉 예상 결과

- **배포 URL**: `https://balance-game-frontend.azurestaticapps.net`
- **배포 시간**: 3-5분
- **상태**: GitHub Actions에서 확인 가능
- **모니터링**: Azure Portal에서 실시간 확인

---

## 🚨 빠른 배포 스크립트

모든 과정을 자동화한 스크립트를 실행하려면:

```powershell
# PowerShell 관리자 권한으로 실행
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\scripts\deploy-azure.ps1
```

---

**준비 완료! 🎯 GitHub 저장소만 생성하면 바로 배포할 수 있습니다!**