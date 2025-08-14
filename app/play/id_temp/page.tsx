"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Clock, 
  Users, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Share2,
  Copy,
  Trophy,
  Sparkles
} from "lucide-react"
import { GameSession, Question, GameResult } from "@/types/api"
import apiClient from "@/lib/simpleApiClient"
import { toast } from "@/hooks/use-toast"
import confetti from 'canvas-confetti'

export default function GamePlayPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const bundleId = params.id as string
  const selectedQuestionIds = searchParams.get('questions')?.split(',').map(Number) || []
  
  const [session, setSession] = useState<GameSession | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: 'A' | 'B' }>({})
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [timerActive, setTimerActive] = useState(false)
  
  useEffect(() => {
    if (bundleId && selectedQuestionIds.length > 0) {
      startGame()
    }
  }, [bundleId])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (timerActive && timeLeft > 0 && !gameCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && !gameCompleted) {
      // 시간 초과 시 자동으로 A 선택
      handleAnswer('A')
    }
    return () => clearTimeout(timer)
  }, [timerActive, timeLeft, gameCompleted])

  const startGame = async () => {
    try {
      setLoading(true)
      const response = await apiClient.startGame({
        questionBundleId: Number(bundleId),
        selectedQuestionIds: selectedQuestionIds
      })
      
      if (response.success && response.data) {
        setSession(response.data)
        setCurrentQuestion(response.data.questions[0])
        setCurrentQuestionIndex(0)
        setTimerActive(true)
        setTimeLeft(30)
      } else {
        toast({
          title: "게임 시작 실패",
          description: response.message || "게임을 시작할 수 없습니다.",
          variant: "destructive"
        })
        router.push('/explore')
      }
    } catch (error: any) {
      console.error('게임 시작 실패:', error)
      toast({
        title: "게임 시작 실패", 
        description: "게임을 시작할 수 없습니다.",
        variant: "destructive"
      })
      router.push('/explore')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = async (answer: 'A' | 'B') => {
    if (!session || !currentQuestion || submitting) return

    try {
      setSubmitting(true)
      const newAnswers = { ...answers, [currentQuestion.id]: answer }
      setAnswers(newAnswers)

      const response = await apiClient.submitAnswer({
        sessionId: session.id,
        questionId: currentQuestion.id,
        selectedOption: answer
      })

      if (response.success && response.data) {
        setSession(response.data)
        
        // 다음 질문으로 이동
        if (currentQuestionIndex < session.questions.length - 1) {
          const nextIndex = currentQuestionIndex + 1
          setCurrentQuestionIndex(nextIndex)
          setCurrentQuestion(session.questions[nextIndex])
          setTimeLeft(30)
        } else {
          // 게임 완료
          await completeGame()
        }
      }
    } catch (error: any) {
      console.error('답변 제출 실패:', error)
      toast({
        title: "답변 제출 실패",
        description: "답변을 제출할 수 없습니다.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const completeGame = async () => {
    if (!session) return

    try {
      setTimerActive(false)
      const response = await apiClient.completeGame(session.id)
      
      if (response.success && response.data) {
        setGameResult(response.data)
        setGameCompleted(true)
        
        // 축하 효과
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        
        toast({
          title: "게임 완료!",
          description: "모든 질문에 답변했습니다."
        })
      }
    } catch (error: any) {
      console.error('게임 완료 실패:', error)
      toast({
        title: "게임 완료 실패",
        description: "게임을 완료할 수 없습니다.",
        variant: "destructive"
      })
    }
  }

  const copyShareLink = () => {
    if (gameResult?.shareCode) {
      const shareUrl = `${window.location.origin}/play/share/${gameResult.shareCode}`
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "링크 복사됨",
        description: "공유 링크가 클립보드에 복사되었습니다."
      })
    }
  }

  const getProgressPercentage = () => {
    if (!session) return 0
    return ((currentQuestionIndex + 1) / session.questions.length) * 100
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-full" />
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <div className="grid md:grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (gameCompleted && gameResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <Trophy className="w-16 h-16 text-yellow-500" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                🎉 게임 완료!
              </CardTitle>
              <p className="text-gray-600">모든 질문에 답변을 완료했습니다</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                  <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">답변한 질문</h3>
                  <p className="text-2xl font-bold text-purple-600">{session?.questions.length}개</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">공유 코드</h3>
                  <p className="text-xl font-mono text-blue-600">{gameResult.shareCode}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  onClick={() => router.push(`/results/${session?.id}`)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  size="lg"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  결과 보기
                </Button>
                
                <Button
                  onClick={copyShareLink}
                  variant="outline"
                  className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                  size="lg"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  결과 공유하기
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <Button
                  onClick={() => router.push('/explore')}
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-gray-900"
                >
                  다른 게임 둘러보기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!session || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600">게임을 불러올 수 없습니다.</p>
              <Button 
                onClick={() => router.push('/explore')} 
                className="mt-4"
              >
                돌아가기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            뒤로가기
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-white/70">
              <Clock className="w-4 h-4 mr-1" />
              {timeLeft}초
            </Badge>
            
            <Badge variant="secondary" className="bg-white/70">
              <Users className="w-4 h-4 mr-1" />
              {currentQuestionIndex + 1} / {session.questions.length}
            </Badge>
          </div>
        </div>

        {/* 진행률 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>진행률</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        {/* 질문 카드 */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center text-gray-900">
              {currentQuestion.questionText}
            </CardTitle>
            {currentQuestion.description && (
              <p className="text-gray-600 text-center mt-2">
                {currentQuestion.description}
              </p>
            )}
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* 선택지 A */}
              <Button
                onClick={() => handleAnswer('A')}
                disabled={submitting}
                className="h-auto p-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold">A</span>
                  </div>
                  <h3 className="font-semibold mb-2">{currentQuestion.optionAText}</h3>
                  {currentQuestion.optionAImageUrl && (
                    <img 
                      src={currentQuestion.optionAImageUrl} 
                      alt="Option A" 
                      className="w-full h-32 object-cover rounded-lg mt-2"
                    />
                  )}
                </div>
              </Button>

              {/* 선택지 B */}
              <Button
                onClick={() => handleAnswer('B')}
                disabled={submitting}
                className="h-auto p-6 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold">B</span>
                  </div>
                  <h3 className="font-semibold mb-2">{currentQuestion.optionBText}</h3>
                  {currentQuestion.optionBImageUrl && (
                    <img 
                      src={currentQuestion.optionBImageUrl} 
                      alt="Option B" 
                      className="w-full h-32 object-cover rounded-lg mt-2"
                    />
                  )}
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 힌트 또는 추가 정보 */}
        {currentQuestion.keywords && (
          <Card className="bg-white/50 backdrop-blur-sm border-0">
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">태그</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {currentQuestion.keywords.split(',').map((keyword, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-purple-100 text-purple-700"
                    >
                      {keyword.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}