/** @type {import('next').NextConfig} */
const nextConfig = {
  // Azure Static Web Apps 배포를 위한 설정
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
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
  
  
  // 성능 최적화
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
