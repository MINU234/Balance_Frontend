'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Navigation from '@/components/navigation.tsx'
import { PlayIcon, ShareIcon, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { QuestionBundle } from '@/types'
import { questionsApi } from '@/lib/api/questions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function PlayPage() {
  const [shareCode, setShareCode] = useState('')
  const [popularBundles, setPopularBundles] = useState<QuestionBundle[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadPopularBundles()
  }, [])

  const loadPopularBundles = async () => {
    try {
      const response = await questionsApi.getPopularBundles(0, 8)
      if (response.success) {
        setPopularBundles(response.data.content)
      }
    } catch (error) {
      console.error('인기 묶음 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayWithCode = () => {
    if (!shareCode.trim()) {
      toast.error('공유코드를 입력해주세요')
      return
    }

    if (shareCode.length !== 8) {
      toast.error('공유코드는 8자리여야 합니다')
      return
    }

    router.push(`/compare/${shareCode}`)
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 섹션 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            게임 플레이
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            원하는 방식으로 밸런스 게임을 시작하세요
          </p>
        </div>

        {/* 플레이 옵션 섹션 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 게임 선택하기 */}
          <Card className="glass-card border-0 text-center group hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                <PlayIcon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800 dark:text-white">게임 선택하기</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                다양한 주제의 질문 묶음 중에서 선택해서 플레이하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/explore">
                <Button size="lg" className="w-full">
                  게임 탐색하기
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 공유코드로 비교하기 */}
          <Card className="glass-card border-0 text-center group hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                <ShareIcon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800 dark:text-white">공유코드로 비교</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                친구의 8자리 공유코드를 입력해서 결과를 비교해보세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="8자리 공유코드 입력"
                  value={shareCode}
                  onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                  className="pl-10 text-center font-mono text-lg"
                  maxLength={8}
                />
              </div>
              <Button 
                size="lg" 
                className="w-full" 
                onClick={handlePlayWithCode}
                disabled={!shareCode.trim()}
              >
                비교하기
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 인기 게임 묶음 */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center">
            🔥 지금 인기 있는 게임
          </h2>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularBundles.map((bundle) => (
                <Card key={bundle.id} className="card-hover group">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-base group-hover:text-blue-600 transition-colors line-clamp-2">
                        {bundle.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm line-clamp-2">
                      {bundle.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
                      <span>{bundle.questionCount}개 질문</span>
                      <span>{bundle.playCount}회 플레이</span>
                    </div>
                    <Link href={`/game?id=${bundle.id}`}>
                      <Button size="sm" className="w-full">
                        <PlayIcon className="w-3 h-3 mr-1" />
                        시작하기
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}