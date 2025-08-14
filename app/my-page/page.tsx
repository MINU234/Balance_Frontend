'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function MyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
        마이페이지
      </h1>
      
      <div className="text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>준비 중입니다</CardTitle>
            <CardDescription>마이페이지 기능을 구현 중입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => typeof window !== 'undefined' && window.history.back()}>
              돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}