#!/bin/bash

# Balance Game Frontend 배포 스크립트
# 사용법: ./scripts/deploy.sh [environment]
# environment: dev, staging, production (기본값: production)

set -e  # 오류 발생시 스크립트 종료

# 환경 설정
ENVIRONMENT=${1:-production}
PROJECT_NAME="balance-game-frontend"

echo "🚀 Balance Game 프론트엔드 배포를 시작합니다..."
echo "📍 환경: $ENVIRONMENT"

# 환경별 설정
case $ENVIRONMENT in
  "dev")
    API_URL="http://localhost:8080/api"
    ;;
  "staging")
    API_URL="https://balance-game-ekedbfhkcxeyc8cb.koreacentral-01.azurewebsites.net/api"
    ;;
  "production")
    API_URL="https://balance-game-ekedbfhkcxeyc8cb.koreacentral-01.azurewebsites.net/api"
    ;;
  *)
    echo "❌ 잘못된 환경입니다. dev, staging, production 중 하나를 선택하세요."
    exit 1
    ;;
esac

echo "🔧 API URL: $API_URL"

# 1. 의존성 검사 및 설치
echo "📦 의존성을 확인하고 설치합니다..."
if [ ! -d "node_modules" ]; then
    npm ci
else
    echo "✅ node_modules가 이미 존재합니다."
fi

# 2. 환경 변수 파일 생성
echo "🔑 환경 변수를 설정합니다..."
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=$API_URL
NODE_ENV=production
EOF

# 3. 타입 검사 (선택적)
echo "🔍 TypeScript 타입을 검사합니다..."
npm run type-check || {
    echo "⚠️  타입 오류가 있지만 빌드를 계속합니다..."
}

# 4. 린트 검사 (선택적)
echo "🧹 코드 품질을 검사합니다..."
npm run lint || {
    echo "⚠️  린트 오류가 있지만 빌드를 계속합니다..."
}

# 5. 프로덕션 빌드
echo "🏗️  프로덕션 빌드를 시작합니다..."
npm run build

# 6. 빌드 결과 확인
if [ -d ".next" ]; then
    echo "✅ 빌드가 성공적으로 완료되었습니다!"
else
    echo "❌ 빌드가 실패했습니다."
    exit 1
fi

# 7. 배포 완료 메시지
echo ""
echo "🎉 배포가 완료되었습니다!"
echo "📋 배포 정보:"
echo "   - 환경: $ENVIRONMENT"
echo "   - API URL: $API_URL"
echo "   - 빌드 시간: $(date)"
echo ""
echo "📖 배포 옵션:"
echo "   1. Vercel: npx vercel --prod"
echo "   2. Netlify: npx netlify deploy --prod --dir=.next"
echo "   3. 로컬 실행: npm start"
echo ""
echo "✅ 스크립트가 완료되었습니다."
