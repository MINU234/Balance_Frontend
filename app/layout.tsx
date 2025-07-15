import type { Metadata } from 'next'
import { AuthProvider } from '@/app/context/AuthContext';
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="ko">
      <body>
      {/* 2. AuthProvider로 children을 감싸줍니다. */}
      <AuthProvider>
        {children}
      </AuthProvider>
      </body>
      </html>
  )
}
