'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlayIcon, TrophyIcon, StarIcon, UsersIcon, ShareIcon } from 'lucide-react'
import Link from 'next/link'
import { QuestionBundle, ApiResponse, PaginatedResponse } from '@/types'
import apiClient from '@/lib/api-client'

export default function HomePage() {
  const [popularBundles, setPopularBundles] = useState<QuestionBundle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPopularBundles = async () => {
      if (typeof window === 'undefined') {
        setLoading(false)
        return
      }

      try {
        const response = await apiClient.get<ApiResponse<PaginatedResponse<QuestionBundle>>>(
          '/api/question-bundles/popular?page=0&size=6'
        )
        setPopularBundles(response.data.data.content)
      } catch (error) {
        console.error('인기 묶음을 불러오는데 실패했습니다:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPopularBundles()
  }, [])

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="floating-particle absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-60"></div>
          <div className="floating-particle absolute top-32 right-20 w-6 h-6 bg-purple-400 rounded-full opacity-40" style={{ animationDelay: '2s' }}></div>
          <div className="floating-particle absolute top-48 left-1/3 w-3 h-3 bg-pink-400 rounded-full opacity-50" style={{ animationDelay: '4s' }}></div>

          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-fade-in">
            Balance Game
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            다양한 주제의 밸런스 게임을 플레이하고<br />
            친구들과 결과를 비교해보세요!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link href="/explore">
              <Button size="xl" variant="gradient" className="group">
                <PlayIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                지금 시작하기
              </Button>
            </Link>
            <Link href="/create">
              <Button size="xl" variant="outline" className="group">
                <StarIcon className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                질문 묶음 만들기
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="glass-card border-0 text-center group hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                <PlayIcon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-gray-800 dark:text-white">간편한 플레이</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                회원가입 없이도 바로 게임을 시작할 수 있어요
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-card border-0 text-center group hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                <ShareIcon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-gray-800 dark:text-white">공유 코드</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                8자리 공유코드로 친구들과 결과를 비교해보세요
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-card border-0 text-center group hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                <TrophyIcon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-gray-800 dark:text-white">다양한 주제</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                연애, 우정, 음식 등 다양한 주제의 질문들이 기다려요
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* Popular Bundles Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              🔥 인기 게임
            </h2>
            <Link href="/explore">
              <Button variant="ghost">더 보기 →</Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularBundles.map((bundle) => (
                <Card key={bundle.id} className="card-hover group">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {bundle.title}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-500">
                        <UsersIcon className="w-4 h-4 mr-1" />
                        {bundle.playCount}
                      </div>
                    </div>
                    <CardDescription className="text-sm">
                      {bundle.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">
                        {bundle.questionCount}개 질문
                      </span>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                        {bundle.createdBy.nickname}
                      </span>
                    </div>
                    <Link href="/play">
                      <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                        <PlayIcon className="w-4 h-4 mr-2" />
                        플레이하기
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