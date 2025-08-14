# Azure Static Web Apps 배포 스크립트 (PowerShell)
# 사용법: .\scripts\deploy-azure.ps1

Write-Host "🚀 Azure Static Web Apps 배포를 시작합니다..." -ForegroundColor Green

# 1. Azure CLI 설치 확인
Write-Host "🔧 Azure CLI 설치를 확인합니다..." -ForegroundColor Blue
try {
    az --version | Out-Null
    Write-Host "✅ Azure CLI가 설치되어 있습니다." -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI가 설치되어 있지 않습니다." -ForegroundColor Red
    Write-Host "다음 명령어로 설치하세요: winget install Microsoft.AzureCLI" -ForegroundColor Yellow
    exit 1
}

# 2. Azure 로그인 확인
Write-Host "🔐 Azure 로그인 상태를 확인합니다..." -ForegroundColor Blue
try {
    $account = az account show --query name -o tsv 2>$null
    if ($account) {
        Write-Host "✅ Azure에 로그인되어 있습니다. 구독: $account" -ForegroundColor Green
    } else {
        throw "Not logged in"
    }
} catch {
    Write-Host "Azure에 로그인해야 합니다." -ForegroundColor Yellow
    az login
}

# 3. 리소스 그룹 및 앱 설정
$resourceGroup = "balance-game-rg"
$location = "koreacentral"
$appName = "balance-game-frontend-$(Get-Random -Minimum 1000 -Maximum 9999)"

Write-Host "🏗️ 리소스 설정:" -ForegroundColor Blue
Write-Host "   리소스 그룹: $resourceGroup" -ForegroundColor White
Write-Host "   위치: $location" -ForegroundColor White
Write-Host "   앱 이름: $appName" -ForegroundColor White

# 4. 리소스 그룹 생성
Write-Host "📦 리소스 그룹을 확인/생성합니다..." -ForegroundColor Blue
$rgExists = az group exists --name $resourceGroup
if ($rgExists -eq "false") {
    Write-Host "리소스 그룹 '$resourceGroup'을 생성합니다..." -ForegroundColor Yellow
    az group create --name $resourceGroup --location $location
    Write-Host "✅ 리소스 그룹이 생성되었습니다." -ForegroundColor Green
} else {
    Write-Host "✅ 리소스 그룹 '$resourceGroup'이 이미 존재합니다." -ForegroundColor Green
}

# 5. GitHub 저장소 정보 입력
Write-Host "📋 GitHub 저장소 정보를 입력하세요:" -ForegroundColor Blue
$repoUrl = Read-Host "GitHub 저장소 URL (예: https://github.com/username/repo)"
if ([string]::IsNullOrEmpty($repoUrl)) {
    Write-Host "❌ 저장소 URL은 필수입니다." -ForegroundColor Red
    exit 1
}

$branch = Read-Host "브랜치 이름 (기본값: main)"
if ([string]::IsNullOrEmpty($branch)) {
    $branch = "main"
}

# 6. Static Web App 생성
Write-Host "🌐 Static Web App '$appName'을 생성합니다..." -ForegroundColor Blue
Write-Host "⏳ 이 과정은 몇 분 정도 걸릴 수 있습니다..." -ForegroundColor Yellow

try {
    $result = az staticwebapp create `
        --name $appName `
        --resource-group $resourceGroup `
        --source $repoUrl `
        --location $location `
        --branch $branch `
        --app-location "/" `
        --output-location "out" `
        --login-with-github 2>$null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Static Web App이 성공적으로 생성되었습니다!" -ForegroundColor Green
    } else {
        throw "Static Web App 생성 실패"
    }
} catch {
    Write-Host "❌ Static Web App 생성에 실패했습니다." -ForegroundColor Red
    Write-Host "수동으로 Azure Portal에서 생성하세요: https://portal.azure.com" -ForegroundColor Yellow
    exit 1
}

# 7. 배포 토큰 가져오기
Write-Host "🔑 배포 토큰을 가져옵니다..." -ForegroundColor Blue
Start-Sleep -Seconds 10  # 리소스 생성 완료 대기

try {
    $deploymentToken = az staticwebapp secrets list --name $appName --resource-group $resourceGroup --query "properties.apiKey" -o tsv
    
    if ([string]::IsNullOrEmpty($deploymentToken)) {
        throw "토큰을 가져올 수 없습니다"
    }
    
    Write-Host "✅ 배포 토큰을 성공적으로 가져왔습니다." -ForegroundColor Green
} catch {
    Write-Host "⚠️ 배포 토큰을 가져오는데 실패했습니다. Azure Portal에서 확인하세요." -ForegroundColor Yellow
    $deploymentToken = "[Azure Portal에서 확인 필요]"
}

# 8. 앱 URL 가져오기
Write-Host "🌐 앱 URL을 가져옵니다..." -ForegroundColor Blue
try {
    $appUrl = az staticwebapp show --name $appName --resource-group $resourceGroup --query "defaultHostname" -o tsv
    Write-Host "✅ 앱 URL: https://$appUrl" -ForegroundColor Green
} catch {
    Write-Host "⚠️ 앱 URL을 가져오는데 실패했습니다." -ForegroundColor Yellow
    $appUrl = "[확인 필요]"
}

# 9. 결과 및 다음 단계 안내
Write-Host "`n🎉 Azure 배포 설정이 완료되었습니다!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Blue

Write-Host "`n📋 배포 정보:" -ForegroundColor Blue
Write-Host "   앱 이름: $appName" -ForegroundColor White
Write-Host "   리소스 그룹: $resourceGroup" -ForegroundColor White
Write-Host "   앱 URL: https://$appUrl" -ForegroundColor White

Write-Host "`n🔧 다음 단계:" -ForegroundColor Blue
Write-Host "1. GitHub 저장소의 Settings > Secrets and variables > Actions 이동" -ForegroundColor White
Write-Host "2. 'New repository secret' 클릭" -ForegroundColor White
Write-Host "3. 다음 정보로 시크릿 추가:" -ForegroundColor White
Write-Host "   Name: AZURE_STATIC_WEB_APPS_API_TOKEN" -ForegroundColor Yellow
Write-Host "   Value: $deploymentToken" -ForegroundColor Yellow

Write-Host "`n4. 코드를 GitHub에 push:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Deploy to Azure'" -ForegroundColor Gray
Write-Host "   git push origin $branch" -ForegroundColor Gray

Write-Host "`n🔗 유용한 링크:" -ForegroundColor Blue
Write-Host "   Azure Portal: https://portal.azure.com" -ForegroundColor Cyan
Write-Host "   GitHub Actions: https://github.com/yourusername/yourrepo/actions" -ForegroundColor Cyan
Write-Host "   배포 가이드: docs/Azure-배포-가이드.md" -ForegroundColor Cyan

Write-Host "`n✅ 스크립트가 완료되었습니다!" -ForegroundColor Green

# 10. 클립보드에 토큰 복사 (선택사항)
$copyToClipboard = Read-Host "`n배포 토큰을 클립보드에 복사하시겠습니까? (y/n)"
if ($copyToClipboard -eq "y" -or $copyToClipboard -eq "Y") {
    try {
        $deploymentToken | Set-Clipboard
        Write-Host "✅ 배포 토큰이 클립보드에 복사되었습니다." -ForegroundColor Green
    } catch {
        Write-Host "⚠️ 클립보드 복사에 실패했습니다." -ForegroundColor Yellow
    }
}