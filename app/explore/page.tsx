'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Navigation from '@/components/Navigation'
import { SearchIcon, PlayIcon, UsersIcon, FilterIcon } from 'lucide-react'
import Link from 'next/link'
import { QuestionBundle, Question } from '@/types'
import { questionsApi } from '@/lib/api/questions'

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<QuestionBundle[]>([])
  const [popularQuestions, setPopularQuestions] = useState<Question[]>([])
  const [popularBundles, setPopularBundles] = useState<QuestionBundle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      const [questionsRes, bundlesRes] = await Promise.all([
        questionsApi.getPopularQuestions(0, 8),
        questionsApi.getPopularBundles(0, 12)
      ])

      if (questionsRes.success) {
        setPopularQuestions(questionsRes.data.content)
      } else {
        console.warn('인기 질문 데이터를 가져오지 못했습니다.')
        setPopularQuestions([])
      }
      if (bundlesRes.success) {
        setPopularBundles(bundlesRes.data.content)
      } else {
        console.warn('인기 묶음 데이터를 가져오지 못했습니다.')
        setPopularBundles([])
      }
    } catch (error) {
      console.error('데이터 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setSearchLoading(true)
    try {
      const response = await questionsApi.searchBundles(searchQuery, 0, 20)
      if (response.success) {
        setSearchResults(response.data.content)
      }
    } catch (error) {
      console.error('검색 실패:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 섹션 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            게임 탐색
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            다양한 주제의 밸런스 게임을 찾아보세요
          </p>
        </div>

        {/* 검색 섹션 */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="게임 제목, 키워드로 검색하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={searchLoading}
              className="h-12 px-6"
            >
              {searchLoading ? '검색 중...' : '검색'}
            </Button>
          </div>
        </div>

        {/* 검색 결과 */}
        {searchResults.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <SearchIcon className="w-6 h-6" />
              검색 결과 ({searchResults.length}개)
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((bundle) => (
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
                    <CardDescription>{bundle.description}</CardDescription>
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
                    <Link href={`/game?id=${bundle.id}`}>
                      <Button className="w-full">
                        <PlayIcon className="w-4 h-4 mr-2" />
                        플레이하기
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* 인기 게임 묶음 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            🔥 인기 게임 묶음
          </h2>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : popularBundles.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🔍</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                게임 데이터를 준비하고 있습니다
              </p>
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
                    <CardDescription>{bundle.description}</CardDescription>
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
                    <Link href={`/game?id=${bundle.id}`}>
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

        {/* 인기 질문 */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            ⭐ 인기 질문
          </h2>
          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : popularQuestions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">❓</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                질문 데이터를 준비하고 있습니다
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {popularQuestions.slice(0, 8).map((question) => (
                <Card key={question.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">{question.text}</h3>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>A: {question.optionAText}</span>
                      <span>B: {question.optionBText}</span>
                    </div>
                    {question.statistics && (
                      <div className="mt-2 text-xs text-gray-400">
                        총 {question.statistics.totalCount}명 참여
                      </div>
                    )}
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