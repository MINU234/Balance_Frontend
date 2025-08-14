/** @type {import('next').NextConfig} */
const nextConfig = {
  // Azure Static Web Apps 배포를 위한 설정
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  images: {
    unoptimized: true, // Static export를 위해 필요
    domains: [
      'balance-game-ekedbfhkcxeyc8cb.koreacentral-01.azurewebsites.net',
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.azurewebsites.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // 번들 크기 최적화
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  },
  
  // 보안 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // 리다이렉트 설정
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // 성능 최적화
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
