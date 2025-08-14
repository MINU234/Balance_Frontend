"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Play,
  Users,
  AlertCircle,
  Share2
} from "lucide-react"
import apiClient from "@/lib/apiClient"
import { toast } from "@/hooks/use-toast"
import { GameSession } from "@/types/api"

interface Props {
  params: { shareCode: string }
}

export default function SharePlayPageClient({ params }: Props) {
  const router = useRouter()
  const shareCode = params.shareCode
  
  const [session, setSession] = useState<GameSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (shareCode) {
      loadSharedSession()
    }
  }, [shareCode])

  const loadSharedSession = async () => {
    try {
      setLoading(true)
      setError("")
      
      const response = await apiClient.getSessionByShareCode(shareCode)
      
      if (response.success && response.data) {
        setSession(response.data)
      } else {
        setError("공유 코드를 찾을 수 없습니다.")
      }
    } catch (error: any) {
      console.error('공유 세션 로드 실패:', error)
      if (error.response?.status === 404) {
        setError("존재하지 않는 공유 코드입니다.")
      } else {
        setError("공유 코드를 불러올 수 없습니다.")
      }
    } finally {
      setLoading(false)
    }
  }

  const startNewGame = () => {
    if (session?.questionBundle) {
      const questionIds = session.questions.map(q => q.id).join(',')
      router.push(`/play/${session.questionBundle.id}?questions=${questionIds}`)
    }
  }

  const viewResults = () => {
    if (session) {
      router.push(`/results/${session.id}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-8 w-64 mb-6" />
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
              
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 text-center">
            <Button 
              onClick={() => router.push('/explore')}
              variant="outline"
            >
              다른 게임 둘러보기
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600">세션을 불러올 수 없습니다.</p>
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
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            공유된 게임 결과
          </h1>
          <p className="text-gray-600">
            누군가가 플레이한 게임 결과를 확인하고 같은 게임을 플레이해보세요!
          </p>
        </div>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {session.questionBundle?.title || '게임 결과'}
              </h2>
              {session.questionBundle?.description && (
                <p className="text-gray-600 mb-4">
                  {session.questionBundle.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">질문 수</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {session.questions?.length || 0}개
                </p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Share2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">공유 코드</h3>
                <p className="text-lg font-mono text-blue-600">
                  {shareCode}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={startNewGame}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                같은 게임 플레이하기
              </Button>
              
              <Button
                onClick={viewResults}
                variant="outline"
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                size="lg"
              >
                결과 자세히 보기
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            onClick={() => router.push('/explore')}
            variant="ghost"
            className="text-gray-600 hover:text-gray-900"
          >
            다른 게임 둘러보기
          </Button>
        </div>
      </div>
    </div>
  )
}