"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Clock, Share2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function GamePlayPage() {
  const [gameState, setGameState] = useState("waiting") // waiting, playing, result
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userChoices, setUserChoices] = useState([])
  const [gameResults, setGameResults] = useState([])

  const collection = {
    id: 1,
    title: "연인과 함께하는 밸런스 게임",
    description: "연인 사이의 가치관과 취향을 알아보는 재미있는 질문들",
    author: "러브마스터",
    questions: [
      {
        id: 1,
        question: "평생 둘 중 하나만 먹을 수 있다면?",
        optionA: {
          title: "치킨",
          description: "바삭바삭한 황금빛 치킨! 언제 먹어도 질리지 않는 국민 간식",
          image: "/placeholder.svg?height=200&width=300&text=치킨",
        },
        optionB: {
          title: "피자",
          description: "쫄깃한 도우와 풍부한 토핑! 다양한 맛을 즐길 수 있는 이탈리아의 선물",
          image: "/placeholder.svg?height=200&width=300&text=피자",
        },
      },
      {
        id: 2,
        question: "이상적인 데이트는?",
        optionA: {
          title: "집에서 영화보기",
          description: "아늑한 집에서 좋아하는 사람과 함께 영화를 보며 편안한 시간",
          image: "/placeholder.svg?height=200&width=300&text=홈시어터",
        },
        optionB: {
          title: "야외 활동하기",
          description: "자연 속에서 함께 걷고, 새로운 경험을 공유하는 활동적인 데이트",
          image: "/placeholder.svg?height=200&width=300&text=야외활동",
        },
      },
      {
        id: 3,
        question: "더 중요한 것은?",
        optionA: {
          title: "돈",
          description: "경제적 자유와 안정! 하고 싶은 것들을 마음껏 할 수 있는 힘",
          image: "/placeholder.svg?height=200&width=300&text=돈",
        },
        optionB: {
          title: "시간",
          description: "소중한 사람들과 함께할 수 있는 여유! 인생을 천천히 즐길 수 있는 자유",
          image: "/placeholder.svg?height=200&width=300&text=시간",
        },
      },
    ],
    keywords: ["연애", "가치관"],
  }

  const handleChoice = (choice) => {
    const newChoices = [...userChoices, choice]
    setUserChoices(newChoices)

    if (currentQuestion < collection.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // 게임 완료 - 결과 계산
      const results = collection.questions.map((question, index) => ({
        question,
        userChoice: newChoices[index],
        choiceData: newChoices[index] === "A" ? question.optionA : question.optionB,
      }))
      setGameResults(results)
      setGameState("result")
    }
  }

  const startGame = () => {
    setGameState("playing")
  }

  const matchRate =
    gameResults.length > 0 ? Math.round((gameResults.filter((r) => r.match).length / gameResults.length) * 100) : 0

  if (gameState === "waiting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/explore">
                <ArrowLeft className="w-4 h-4 mr-2" />
                탐색으로 돌아가기
              </Link>
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">{collection.title}</CardTitle>
                <CardDescription className="text-lg">{collection.description}</CardDescription>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {collection.keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary">
                      #{keyword}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{collection.questions.length}</div>
                    <div className="text-gray-600">문항</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">1인용</div>
                    <div className="text-gray-600">플레이어</div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-lg">게임 방법</h3>
                  <div className="text-left space-y-2 text-sm text-gray-600">
                    <p>• 혼자서도 즐길 수 있는 밸런스 게임입니다</p>
                    <p>• 각 질문에 대해 A 또는 B 중 하나를 선택하세요</p>
                    <p>• 이미지와 설명을 보고 신중하게 선택해보세요</p>
                    <p>• 모든 질문이 끝나면 당신의 선택을 확인할 수 있습니다</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" onClick={startGame} className="flex-1">
                    <Users className="w-4 h-4 mr-2" />
                    게임 시작하기
                  </Button>
                  <Button size="lg" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    공유하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === "playing") {
    const question = collection.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / collection.questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/explore">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    나가기
                  </Link>
                </Button>
                <div className="text-sm text-gray-600">
                  {currentQuestion + 1} / {collection.questions.length}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">05:23</span>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-4">{question.question}</CardTitle>
                <CardDescription className="text-lg">둘 중 하나를 선택해주세요</CardDescription>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Option A */}
              <Card
                className="hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleChoice("A")}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={question.optionA.image || "/placeholder.svg"}
                      alt={question.optionA.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">A</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors">
                      {question.optionA.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{question.optionA.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Option B */}
              <Card
                className="hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleChoice("B")}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={question.optionB.image || "/placeholder.svg"}
                      alt={question.optionB.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">B</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                      {question.optionB.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{question.optionB.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">카드를 클릭하여 선택하세요</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === "result") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">게임 결과</h1>
              <div className="flex space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/explore">다른 게임</Link>
                </Button>
                <Button onClick={() => window.location.reload()}>다시 플레이</Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Overall Result */}
            <Card className="mb-8 text-center">
              <CardHeader>
                <CardTitle className="text-3xl mb-4">당신의 선택 결과 🎯</CardTitle>
                <CardDescription className="text-lg">
                  {collection.questions.length}개의 질문에 대한 당신만의 답변을 확인해보세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {gameResults.filter((r) => r.userChoice === "A").length}
                    </div>
                    <div className="text-gray-600">A 선택</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {gameResults.filter((r) => r.userChoice === "B").length}
                    </div>
                    <div className="text-gray-600">B 선택</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">상세 결과</h3>
              {gameResults.map((result, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative">
                        <img
                          src={result.choiceData.image || "/placeholder.svg"}
                          alt={result.choiceData.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <div
                            className={`${result.userChoice === "A" ? "bg-purple-600" : "bg-blue-600"} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                          >
                            {result.userChoice}
                          </div>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col justify-center">
                        <h4 className="font-semibold text-lg mb-2">{result.question.question}</h4>
                        <h5 className="font-bold text-xl mb-3 text-purple-600">
                          당신의 선택: {result.choiceData.title}
                        </h5>
                        <p className="text-gray-600 leading-relaxed">{result.choiceData.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
              <Button size="lg" onClick={() => window.location.reload()}>
                다시 플레이하기
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/explore">다른 게임 찾기</Link>
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                결과 공유하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
