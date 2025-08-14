import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-bold text-purple-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="space-y-4">
          <Link href="/">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}