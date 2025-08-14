import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Balance Game - 밸런스 게임',
  description: '다양한 주제의 밸런스 게임을 플레이하고 친구들과 결과를 비교해보세요!',
  keywords: ['밸런스게임', 'balance game', '선택게임', '게임', 'game'],
  openGraph: {
    title: 'Balance Game - 밸런스 게임',
    description: '다양한 주제의 밸런스 게임을 플레이하고 친구들과 결과를 비교해보세요!',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
          {children}
        </div>
      </body>
    </html>
  )
}