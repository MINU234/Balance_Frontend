'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Navigation from '@/components/navigation'
import { CalendarIcon, GamepadIcon, TrophyIcon, UsersIcon, StarIcon, PlayIcon } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { mypageApi, GameHistory } from '@/lib/api/mypage'
import { UserStats, Question, QuestionBundle } from '@/types'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function MyPage() {
  const { user, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([])
  const [myQuestions, setMyQuestions] = useState<Question[]>([])
  const [myBundles, setMyBundles] = useState<QuestionBundle[]>([])
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadMyPageData()
    }
  }, [user, authLoading])

  const loadMyPageData = async () => {
    try {
      setLoading(true)
      const [statsRes, historyRes, questionsRes, bundlesRes] = await Promise.all([
        mypageApi.getMyStats(),
        mypageApi.getGameHistory(0, 10),
        mypageApi.getMyQuestions(0, 10),
        mypageApi.getMyBundles(0, 10)
      ])

      if (statsRes.success) {
        setStats(statsRes.data)
      }
      if (historyRes.success) {
        setGameHistory(historyRes.data.content)
      }
      if (questionsRes.success) {
        setMyQuestions(questionsRes.data.content)
      }
      if (bundlesRes.success) {
        setMyBundles(bundlesRes.data.content)
      }
    } catch (error) {
      console.error('마이페이지 데이터 로딩 실패:', error)
      toast.error('데이터를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">로그인 정보를 확인하고 있습니다...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            마이페이지
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            안녕하세요, {user.nickname}님! 🎉
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">데이터를 불러오고 있습니다...</p>
          </div>
        ) : (
          <>
            {/* 통계 카드 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="text-center">
                <CardHeader className="pb-2">
                  <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
                    <GamepadIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-600">게임 플레이</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats?.totalGamesPlayed || 0}회</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-2">
                  <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-2">
                    <StarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-600">내 질문</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats?.totalQuestionsCreated || 0}개</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-2">
                  <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-2">
                    <TrophyIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-600">질문 묶음</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{stats?.totalBundlesCreated || 0}개</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-2">
                  <div className="mx-auto w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mb-2">
                    <UsersIcon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-600">평균 일치율</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-pink-600">{stats?.averageMatchPercentage || 0}%</div>
                </CardContent>
              </Card>
            </div>

            {/* 탭 컨텐츠 */}
            <Tabs defaultValue="history" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="history">게임 기록</TabsTrigger>
                <TabsTrigger value="questions">내 질문</TabsTrigger>
                <TabsTrigger value="bundles">내 묶음</TabsTrigger>
              </TabsList>

              {/* 게임 기록 탭 */}
              <TabsContent value="history" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">최근 게임 기록</h3>
                  <Link href="/play">
                    <Button size="sm">
                      <PlayIcon className="w-4 h-4 mr-2" />
                      게임 플레이
                    </Button>
                  </Link>
                </div>
                
                {gameHistory.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <GamepadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">아직 플레이한 게임이 없습니다</p>
                      <Link href="/play">
                        <Button className="mt-4">첫 게임 시작하기</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {gameHistory.map((game) => (
                      <Card key={game.sessionId}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{game.bundleTitle}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  {formatDate(game.completedAt)}
                                </span>
                                <span>{game.questionCount}개 질문</span>
                                {game.shareCode && (
                                  <Badge variant="secondary" className="font-mono">
                                    {game.shareCode}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* 내 질문 탭 */}
              <TabsContent value="questions" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">내가 만든 질문</h3>
                  <Link href="/create/question">
                    <Button size="sm">질문 만들기</Button>
                  </Link>
                </div>

                {myQuestions.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <StarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">아직 만든 질문이 없습니다</p>
                      <Link href="/create/question">
                        <Button className="mt-4">첫 질문 만들기</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {myQuestions.map((question) => (
                      <Card key={question.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{question.text}</CardTitle>
                          <div className="flex gap-2">
                            <Badge variant="outline">#{question.keyword}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                              <span className="font-medium text-blue-700 dark:text-blue-300">A: </span>
                              {question.optionAText}
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                              <span className="font-medium text-purple-700 dark:text-purple-300">B: </span>
                              {question.optionBText}
                            </div>
                          </div>
                          {question.statistics && (
                            <div className="mt-3 text-xs text-gray-500">
                              총 {question.statistics.totalCount}명이 참여했습니다
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* 내 묶음 탭 */}
              <TabsContent value="bundles" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">내가 만든 질문 묶음</h3>
                  <Link href="/create/bundle">
                    <Button size="sm">묶음 만들기</Button>
                  </Link>
                </div>

                {myBundles.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <TrophyIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">아직 만든 질문 묶음이 없습니다</p>
                      <Link href="/create/bundle">
                        <Button className="mt-4">첫 묶음 만들기</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {myBundles.map((bundle) => (
                      <Card key={bundle.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{bundle.title}</CardTitle>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <PlayIcon className="w-4 h-4" />
                              {bundle.playCount}
                            </div>
                          </div>
                          <CardDescription>{bundle.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-gray-500">{bundle.questionCount}개 질문</span>
                            <Badge variant={bundle.isPublic ? 'default' : 'secondary'}>
                              {bundle.isPublic ? '공개' : '비공개'}
                            </Badge>
                          </div>
                          <Link href={`/game?id=${bundle.id}`}>
                            <Button size="sm" className="w-full">
                              <PlayIcon className="w-3 h-3 mr-2" />
                              플레이하기
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}