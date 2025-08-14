"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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

export default function SharePlayPage() {
  const params = useParams()
  const router = useRouter()
  const shareCode = params.shareCode as string

  const [sessionInfo, setSessionInfo] = useState<GameSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const fetchSessionInfo = async () => {
      try {
        const response = await apiClient.getSessionByShareCode(shareCode)
        setSessionInfo(response)
        setIsExpired(false)
      } catch (error: any) {
        console.error('공유 코드 조회 실패:', error)
        if (error.response?.data?.message?.includes('만료')) {
          setIsExpired(true)
          toast({
            title: "오류",
            description: "공유 코드가 만료되었습니다",
            variant: "destructive",
          })
        } else {
          toast({
            title: "오류",
            description: "유효하지 않은 공유 코드입니다",
            variant: "destructive",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessionInfo()
  }, [shareCode])

  const startComparison = () => {
    if (sessionInfo) {
      router.push(`/play/${sessionInfo.bundleId}?shareCode=${shareCode}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-md mx-auto space-y-6">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto" />
              <h2 className="text-2xl font-bold">공유 코드가 만료되었습니다</h2>
              <p className="text-gray-600">
                공유 코드는 생성 후 3일간 유효합니다.
                <br />
                친구에게 새로운 공유 코드를 요청해주세요.
              </p>
              <Button onClick={() => router.push('/explore')} className="w-full">
                홈으로 돌아가기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!sessionInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold">유효하지 않은 공유 코드</h2>
              <p className="text-gray-600">
                공유 코드를 다시 확인해주세요.
              </p>
              <Button onClick={() => router.push('/explore')} className="w-full">
                홈으로 돌아가기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white text-center">
            <Share2 className="h-12 w-12 mx-auto mb-3" />
            <h1 className="text-2xl font-bold mb-2">친구가 공유한 게임</h1>
            <div className="bg-white/20 rounded-lg px-4 py-2 inline-block">
              <p className="font-mono text-lg">{shareCode}</p>
            </div>
          </div>
          
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">{sessionInfo.bundleTitle}</h2>
              <p className="text-gray-600">
                친구와 같은 질문에 답변하고
                <br />
                얼마나 비슷한지 확인해보세요!
              </p>
            </div>

            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                게임을 완료하면 친구와의 답변 일치율을 확인할 수 있습니다.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={startComparison}
              size="lg"
              className="w-full"
            >
              <Play className="h-5 w-5 mr-2" />
              게임 시작하기
            </Button>

            <Button
              onClick={() => router.push('/explore')}
              variant="outline"
              className="w-full"
            >
              다른 게임 둘러보기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}