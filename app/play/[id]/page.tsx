"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ArrowLeft, 
  Share2, 
  Trophy,
  Heart,
  Star,
  Zap,
  Timer,
  CheckCircle
} from "lucide-react"
import apiClient from "@/lib/simpleApiClient"
import { toast } from "@/hooks/use-toast"
import { Question, QuestionBundle, GameSession } from "@/types/api"

export default function GamePlayPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const bundleId = params.id as string
  const shareCode = searchParams.get('shareCode') // 공유 코드로 들어온 경우

  const [bundle, setBundle] = useState<QuestionBundle | null>(null)
  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: 'A' | 'B' }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [generatedShareCode, setGeneratedShareCode] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)

  // 타이머
  useEffect(() => {
    if (!isCompleted && !isLoading) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isCompleted, isLoading])

  // 시간 포맷
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 번들 정보 로드
  const fetchBundle = async () => {
    try {
      const bundleData = await apiClient.getBundleById(parseInt(bundleId))
      setBundle(bundleData)
    } catch (error) {
      console.error('번들 로드 실패:', error)
      toast({
        title: "오류",
        description: "질문 묶음을 불러올 수 없습니다",
        variant: "destructive",
      })
      router.push('/explore')
    }
  }

  // 게임 세션 시작
  const startGameSession = async () => {
    try {
      // 로컬 스토리지에서 임시 사용자 ID 가져오기 또는 생성
      let tempUserId = localStorage.getItem('tempUserId')
      if (!tempUserId) {
        tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('tempUserId', tempUserId)
      }

      const sessionData: any = {
        bundleId: parseInt(bundleId),
        tempUserId
      }

      // 공유 코드가 있으면 추가
      if (shareCode) {
        sessionData.shareCode = shareCode
      }

      const sessionResponse = await apiClient.startGame(sessionData)
      setGameSession(sessionResponse)
    } catch (error) {
      console.error('게임 시작 실패:', error)
      toast({
        title: "오류",
        description: "게임을 시작할 수 없습니다",
        variant: "destructive",
      })
    }
  }

  // 초기 로드
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      await fetchBundle()
      await startGameSession()
      setIsLoading(false)
    }
    init()
  }, [bundleId])

  // 답변 제출
  const submitAnswer = async (option: 'A' | 'B') => {
    if (!gameSession || !bundle || !currentQuestion || isAnimating) return

    setSelectedOption(option)
    setIsAnimating(true)
    
    try {
      // 답변 저장
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }))
      
      // 서버에 답변 전송
      await apiClient.submitAnswer({
        sessionId: gameSession.sessionId,
        questionId: currentQuestion.id,
        selectedOption: option
      })

      // 애니메이션 후 다음 질문으로
      setTimeout(() => {
        setIsAnimating(false)
        setSelectedOption(null)
        
        if (currentQuestionIndex < (bundle.questions?.length || 0) - 1) {
          setCurrentQuestionIndex(prev => prev + 1)
        } else {
          completeGame()
        }
      }, 600)
    } catch (error) {
      console.error('답변 제출 실패:', error)
      toast({
        title: "오류",
        description: "답변을 저장할 수 없습니다",
        variant: "destructive",
      })
      setIsAnimating(false)
      setSelectedOption(null)
    }
  }

  // 게임 완료
  const completeGame = async () => {
    if (!gameSession) return
    
    setIsSubmitting(true)
    try {
      const response = await apiClient.completeGame(gameSession.sessionId)
      setGeneratedShareCode(response.shareCode)
      setIsCompleted(true)
      
      // 축하 효과
      toast({
        title: "게임 완료!",
        description: "모든 질문에 답변하셨습니다! 🎉",
      })
      
      // 공유 코드로 들어온 경우 결과 비교 페이지로 이동
      if (shareCode) {
        setTimeout(() => {
          router.push(`/results/${gameSession.sessionId}?compareWith=${shareCode}`)
        }, 1500)
      }
    } catch (error) {
      console.error('게임 완료 실패:', error)
      toast({
        title: "오류",
        description: "게임 완료 처리 중 오류가 발생했습니다",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 공유하기
  const handleShare = async () => {
    if (!generatedShareCode) return

    const shareUrl = `${window.location.origin}/play/share/${generatedShareCode}`
    const shareText = `나와 함께 "${bundle?.title}" 밸런스 게임을 해보세요!\n우리의 답변 일치율은 몇 %일까요?`

    if (navigator.share) {
      try {
        await navigator.share({
          title: '밸런스 게임 공유',
          text: shareText,
          url: shareUrl
        })
      } catch (error) {
        console.log('공유 취소')
      }
    } else {
      // 클립보드에 복사
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        toast({
          title: "복사 완료",
          description: "공유 링크가 복사되었습니다!",
        })
      } catch (error) {
        // 복사 실패 시 텍스트 선택
        const textArea = document.createElement('textarea')
        textArea.value = `${shareText}\n${shareUrl}`
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        toast({
          title: "복사 완료",
          description: "공유 링크가 복사되었습니다!",
        })
      }
    }
  }

  // 로딩 화면
  if (isLoading || !bundle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-96" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = bundle.questions && bundle.questions[currentQuestionIndex] ? bundle.questions[currentQuestionIndex] : null
  const progress = ((currentQuestionIndex + 1) / (bundle.questions?.length || 1)) * 100

  // 완료 화면
  if (isCompleted && generatedShareCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-8 text-white text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4 animate-bounce" />
              <h1 className="text-3xl font-bold mb-2">게임 완료! 🎉</h1>
              <p className="text-lg opacity-90">{bundle.title}</p>
              <p className="text-sm opacity-75 mt-2">
                소요 시간: {formatTime(timeSpent)}
              </p>
            </div>
            
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  총 {bundle.questions?.length || 0}개의 질문에 답변하셨습니다!
                </p>
                
                {/* 답변 요약 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {Object.values(answers).filter(a => a === 'A').length}
                    </div>
                    <div className="text-sm text-gray-600">A 선택</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {Object.values(answers).filter(a => a === 'B').length}
                    </div>
                    <div className="text-sm text-gray-600">B 선택</div>
                  </div>
                </div>
                
                {/* 공유 코드 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-sm text-gray-500 mb-2">공유 코드</p>
                  <p className="text-3xl font-bold font-mono text-purple-600">
                    {generatedShareCode}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">3일 동안 유효합니다</p>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-3">
                  <Button 
                    onClick={handleShare}
                    className="flex-1"
                    size="lg"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    친구에게 공유하기
                  </Button>
                  <Button
                    onClick={() => router.push(`/results/${gameSession?.sessionId}`)}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    내 답변 보기
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="flex-1"
                  >
                    다시 플레이
                  </Button>
                  <Button
                    onClick={() => router.push('/explore')}
                    variant="ghost"
                    className="flex-1"
                  >
                    다른 게임 찾기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // 게임 진행 화면
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold">질문을 불러올 수 없습니다</h2>
              <p className="text-gray-600">
                질문 데이터에 문제가 있습니다.
              </p>
              <Button onClick={() => router.push('/explore')}>
                다른 게임 찾기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              if (confirm('정말 나가시겠습니까? 진행 상황이 저장되지 않습니다.')) {
                router.push('/explore')
              }
            }}
            disabled={isAnimating}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            나가기
          </Button>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="gap-1">
              <Timer className="h-3 w-3" />
              {formatTime(timeSpent)}
            </Badge>
            <Badge variant="outline">
              {currentQuestionIndex + 1} / {bundle.questions?.length || 0}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <Progress value={progress} className="h-2" />

        {/* Question Card */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <CardTitle className="text-center text-2xl">
              {currentQuestion.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
              {/* Option A */}
              <button
                onClick={() => submitAnswer('A')}
                disabled={isAnimating}
                className={`
                  group relative p-8 transition-all duration-300
                  ${selectedOption === 'A' ? 'bg-blue-50' : 'hover:bg-blue-50/50'}
                  ${isAnimating && selectedOption === 'A' ? 'scale-105' : ''}
                  ${isAnimating && selectedOption === 'B' ? 'opacity-50' : ''}
                  disabled:cursor-not-allowed
                `}
              >
                <div className="space-y-4">
                  {currentQuestion.optionAImageUrl && (
                    <img 
                      src={currentQuestion.optionAImageUrl} 
                      alt="Option A"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold mb-3">
                      A
                    </div>
                    <p className="text-lg font-medium">{currentQuestion.optionAText}</p>
                  </div>
                </div>
                
                {selectedOption === 'A' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 rounded-lg pointer-events-none">
                    <div className="bg-blue-500 text-white rounded-full p-3 animate-bounce">
                      <Heart className="h-8 w-8" />
                    </div>
                  </div>
                )}
              </button>

              {/* Option B */}
              <button
                onClick={() => submitAnswer('B')}
                disabled={isAnimating}
                className={`
                  group relative p-8 transition-all duration-300
                  ${selectedOption === 'B' ? 'bg-purple-50' : 'hover:bg-purple-50/50'}
                  ${isAnimating && selectedOption === 'B' ? 'scale-105' : ''}
                  ${isAnimating && selectedOption === 'A' ? 'opacity-50' : ''}
                  disabled:cursor-not-allowed
                `}
              >
                <div className="space-y-4">
                  {currentQuestion.optionBImageUrl && (
                    <img 
                      src={currentQuestion.optionBImageUrl} 
                      alt="Option B"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 font-bold mb-3">
                      B
                    </div>
                    <p className="text-lg font-medium">{currentQuestion.optionBText}</p>
                  </div>
                </div>
                
                {selectedOption === 'B' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-500/20 rounded-lg pointer-events-none">
                    <div className="bg-purple-500 text-white rounded-full p-3 animate-bounce">
                      <Star className="h-8 w-8" />
                    </div>
                  </div>
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Bundle Info */}
        <div className="text-center text-sm text-gray-500">
          <p className="font-medium">{bundle.title}</p>
          <p>by {bundle.creator.nickname}</p>
          {bundle.keywords && (
            <div className="flex justify-center gap-2 mt-2">
              {bundle.keywords.split(',').map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {keyword.trim()}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}