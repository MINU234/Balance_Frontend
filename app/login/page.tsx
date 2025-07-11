"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Mail, Lock, Chrome } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("password123")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 로그인 로직 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 로그인 성공 처리
      console.log("로그인 성공!")

      // 홈페이지로 리다이렉트
      router.push("/")
    } catch (error) {
      console.error("로그인 오류:", error)
      alert("로그인에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    setIsLoading(true)

    try {
      // 소셜 로그인 로직 시뮬레이션
      console.log(`${provider} 로그인 시도`)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 로그인 성공 처리
      console.log(`${provider} 로그인 성공!`)

      // 홈페이지로 리다이렉트
      router.push("/")
    } catch (error) {
      console.error("소셜 로그인 오류:", error)
      alert("소셜 로그인에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Link>
          </Button>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                BalanceGame
              </h1>
            </div>
            <p className="text-gray-600">로그인하고 더 많은 기능을 이용해보세요</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
            <CardDescription>계정에 로그인하여 나만의 질문 묶음을 만들어보세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link href="/forgot-password" className="text-blue-600 hover:underline">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>

            {/* 빠른 로그인 버튼 추가 */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 text-center mb-2">
                <strong>테스트용 빠른 로그인</strong>
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-blue-100 hover:bg-blue-200"
                onClick={handleQuickLogin}
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "바로 로그인하기"}
              </Button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">또는</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Google로 로그인
                </Button>

                <Button
                  variant="outline"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 border-yellow-400"
                  onClick={() => handleSocialLogin("kakao")}
                  disabled={isLoading}
                >
                  <div className="w-4 h-4 mr-2 bg-black rounded-sm flex items-center justify-center">
                    <span className="text-yellow-400 text-xs font-bold">K</span>
                  </div>
                  카카오로 로그인
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">아직 계정이 없으신가요? </span>
              <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                회원가입
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 text-center">회원 전용 기능</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>나만의 질문 묶음 생성 및 관리</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>새로운 밸런스 게임 질문 등록</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span>다른 사용자 묶음 복제 및 편집</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>게임 기록 및 통계 확인</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
