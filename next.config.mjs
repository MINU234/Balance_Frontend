/** @type {import('next').NextConfig} */
const nextConfig = {
  // CORS 프록시 설정
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://balance-game-ekedbfhkcxeyc8cb.koreacentral-01.azurewebsites.net/api/:path*',
      },
    ]
  },
  
  // CORS 헤더 설정
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ]
  },

  // 환경 변수
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://balance-game-ekedbfhkcxeyc8cb.koreacentral-01.azurewebsites.net/api',
  },
}

export default nextConfig
