/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true,
    domains: [
      'balance-game-ekedbfhkcxeyc8cb.koreacentral-01.azurewebsites.net',
      'localhost'
    ]
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  },
  // Azure Static Web Apps 호환을 위한 설정
  generateBuildId: async () => {
    return 'build'
  }
};

module.exports = nextConfig;