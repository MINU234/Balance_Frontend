# 프로덕션 배포용 멀티스테이지 Docker 파일
FROM node:18-alpine AS base

# 필수 패키지 설치
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 의존성 설치 단계
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# 빌드 단계
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 환경 변수 설정
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Next.js 빌드
RUN npm run build

# 프로덕션 실행 단계
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 사용자 추가 (보안)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 빌드 결과물 복사
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
