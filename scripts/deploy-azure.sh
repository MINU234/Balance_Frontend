#!/bin/bash

# Azure Static Web Apps 배포 스크립트
# 사용법: ./scripts/deploy-azure.sh

set -e

echo "🚀 Azure Static Web Apps 배포를 시작합니다..."

# 1. Azure CLI 로그인 확인
echo "🔐 Azure 로그인 상태를 확인합니다..."
if ! az account show > /dev/null 2>&1; then
    echo "Azure에 로그인해야 합니다."
    az login
fi

# 2. 현재 구독 확인
SUBSCRIPTION=$(az account show --query name -o tsv)
echo "📋 현재 구독: $SUBSCRIPTION"

# 3. 리소스 그룹 설정
RESOURCE_GROUP="balance-game-rg"
LOCATION="koreacentral"
APP_NAME="balance-game-frontend"

echo "🏗️  리소스 그룹을 확인/생성합니다..."
if ! az group show --name $RESOURCE_GROUP > /dev/null 2>&1; then
    echo "리소스 그룹 '$RESOURCE_GROUP'을 생성합니다..."
    az group create --name $RESOURCE_GROUP --location $LOCATION
else
    echo "✅ 리소스 그룹 '$RESOURCE_GROUP'이 이미 존재합니다."
fi

# 4. Static Web App 생성 (존재하지 않는 경우)
echo "🌐 Static Web App을 확인/생성합니다..."
if ! az staticwebapp show --name $APP_NAME --resource-group $RESOURCE_GROUP > /dev/null 2>&1; then
    echo "Static Web App '$APP_NAME'을 생성합니다..."
    
    # GitHub 저장소 URL 입력 받기
    read -p "GitHub 저장소 URL을 입력하세요 (예: https://github.com/username/repo): " REPO_URL
    read -p "브랜치 이름을 입력하세요 (기본값: main): " BRANCH
    BRANCH=${BRANCH:-main}
    
    az staticwebapp create \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --source $REPO_URL \
        --location $LOCATION \
        --branch $BRANCH \
        --app-location "/" \
        --output-location "out" \
        --login-with-github
else
    echo "✅ Static Web App '$APP_NAME'이 이미 존재합니다."
fi

# 5. 배포 토큰 가져오기
echo "🔑 배포 토큰을 가져옵니다..."
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list --name $APP_NAME --resource-group $RESOURCE_GROUP --query properties.apiKey -o tsv)

if [ -z "$DEPLOYMENT_TOKEN" ]; then
    echo "❌ 배포 토큰을 가져올 수 없습니다."
    exit 1
fi

echo "✅ 배포 토큰을 성공적으로 가져왔습니다."

# 6. GitHub Secrets 설정 안내
echo ""
echo "🎯 다음 단계를 수행하세요:"
echo ""
echo "1. GitHub 저장소의 Settings > Secrets and variables > Actions로 이동"
echo "2. 'New repository secret' 클릭"
echo "3. 다음 시크릿을 추가:"
echo ""
echo "   Name: AZURE_STATIC_WEB_APPS_API_TOKEN"
echo "   Value: $DEPLOYMENT_TOKEN"
echo ""
echo "4. 코드를 GitHub에 push하면 자동 배포가 시작됩니다."
echo ""

# 7. 앱 URL 표시
APP_URL=$(az staticwebapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query defaultHostname -o tsv)
echo "🌐 앱 URL: https://$APP_URL"

# 8. 환경 변수 설정
echo ""
echo "🔧 환경 변수 설정 (선택사항):"
echo "Azure Portal에서 다음 환경 변수를 설정할 수 있습니다:"
echo ""
echo "Configuration > Application settings에서 추가:"
echo "- NEXT_PUBLIC_API_URL: https://balance-game-ekedbfhkcxeyc8cb.koreacentral-01.azurewebsites.net/api"
echo ""

echo "✅ Azure Static Web Apps 설정이 완료되었습니다!"
echo "📖 자세한 내용은 Azure Portal에서 확인하세요: https://portal.azure.com"