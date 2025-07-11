"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Share2,
  Eye,
  EyeOff,
  Play,
  Users,
  Search,
  Calendar,
  TrendingUp,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function MyPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const user = {
    name: "김밸런스",
    email: "balance@example.com",
    joinDate: "2024-01-01",
    avatar: "/placeholder.svg?height=80&width=80",
  }

  const myCollections = [
    {
      id: 1,
      title: "내가 만든 연애 밸런스",
      description: "연인과 함께 할 수 있는 재미있는 질문들",
      questions: 12,
      plays: 234,
      isPublic: true,
      createdAt: "2024-01-15",
      keywords: ["연애", "가치관"],
    },
    {
      id: 2,
      title: "친구들과 하는 음식 게임",
      description: "음식 취향을 알아보는 질문 모음",
      questions: 18,
      plays: 156,
      isPublic: false,
      createdAt: "2024-01-10",
      keywords: ["음식", "일상"],
    },
    {
      id: 3,
      title: "직장인 고민 밸런스",
      description: "직장 생활의 다양한 선택 상황들",
      questions: 15,
      plays: 89,
      isPublic: true,
      createdAt: "2024-01-08",
      keywords: ["직장", "일상"],
    },
  ]

  const myQuestions = [
    {
      id: 1,
      title: "치킨 vs 피자",
      description: "평생 둘 중 하나만 먹을 수 있다면?",
      keywords: ["음식"],
      usedCount: 45,
      createdAt: "2024-01-12",
    },
    {
      id: 2,
      title: "재택근무 vs 출근",
      description: "평생 둘 중 하나만 선택할 수 있다면?",
      keywords: ["직장"],
      usedCount: 23,
      createdAt: "2024-01-09",
    },
  ]

  const gameHistory = [
    {
      id: 1,
      collectionTitle: "연인과 함께하는 밸런스 게임",
      playedAt: "2024-01-16",
      matchRate: 85,
      partner: "익명",
    },
    {
      id: 2,
      collectionTitle: "친구들과 즐기는 음식 토론",
      playedAt: "2024-01-14",
      matchRate: 62,
      partner: "익명",
    },
    {
      id: 3,
      collectionTitle: "인생 철학 밸런스 게임",
      playedAt: "2024-01-12",
      matchRate: 78,
      partner: "익명",
    },
  ]

  const stats = {
    totalCollections: myCollections.length,
    totalQuestions: myQuestions.length,
    totalPlays: myCollections.reduce((sum, col) => sum + col.plays, 0),
    avgMatchRate: Math.round(gameHistory.reduce((sum, game) => sum + game.matchRate, 0) / gameHistory.length),
  }

  const togglePublic = (id) => {
    // 공개/비공개 토글 로직
    console.log(`Toggle public status for collection ${id}`)
  }

  const deleteCollection = (id) => {
    // 삭제 로직
    console.log(`Delete collection ${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  홈으로
                </Link>
              </Button>
              <h1 className="text-xl font-bold">마이페이지</h1>
            </div>
            <Button asChild>
              <Link href="/create">
                <Plus className="w-4 h-4 mr-2" />새 묶음 만들기
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">김밸</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mb-2">{user.name}</h2>
                <p className="text-gray-600 text-sm mb-4">{user.email}</p>
                <div className="text-xs text-gray-500 mb-6">가입일: {user.joinDate}</div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{stats.totalCollections}</div>
                    <div className="text-xs text-gray-600">내 묶음</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{stats.totalQuestions}</div>
                    <div className="text-xs text-gray-600">내 질문</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.totalPlays}</div>
                    <div className="text-xs text-gray-600">총 플레이</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{stats.avgMatchRate}%</div>
                    <div className="text-xs text-gray-600">평균 일치율</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="collections" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="collections">내 질문 묶음</TabsTrigger>
                <TabsTrigger value="questions">내 질문</TabsTrigger>
                <TabsTrigger value="history">게임 기록</TabsTrigger>
              </TabsList>

              <TabsContent value="collections" className="mt-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">내 질문 묶음</h3>
                    <p className="text-sm text-gray-600">내가 만든 질문 묶음을 관리하세요</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="묶음 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button asChild>
                      <Link href="/create">
                        <Plus className="w-4 h-4 mr-2" />새 묶음
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {myCollections.map((collection) => (
                    <Card key={collection.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{collection.title}</CardTitle>
                            <CardDescription>{collection.description}</CardDescription>
                          </div>
                          <div className="flex items-center space-x-1">
                            {collection.isPublic ? (
                              <Eye className="w-4 h-4 text-green-600" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {collection.keywords.map((keyword) => (
                            <Badge key={keyword} variant="secondary" className="text-xs">
                              #{keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Play className="w-4 h-4 mr-1" />
                              {collection.plays}
                            </span>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {collection.questions}문항
                            </span>
                          </div>
                          <span className="text-xs">{collection.createdAt}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/edit/${collection.id}`}>
                              <Edit className="w-3 h-3 mr-1" />
                              편집
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => togglePublic(collection.id)}>
                            {collection.isPublic ? (
                              <EyeOff className="w-3 h-3 mr-1" />
                            ) : (
                              <Eye className="w-3 h-3 mr-1" />
                            )}
                            {collection.isPublic ? "비공개" : "공개"}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="w-3 h-3 mr-1" />
                            공유
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => deleteCollection(collection.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="questions" className="mt-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">내 질문</h3>
                    <p className="text-sm text-gray-600">내가 만든 질문들을 관리하세요</p>
                  </div>
                  <Button asChild>
                    <Link href="/create-question">
                      <Plus className="w-4 h-4 mr-2" />새 질문
                    </Link>
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {myQuestions.map((question) => (
                    <Card key={question.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{question.title}</CardTitle>
                        <CardDescription>{question.description}</CardDescription>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {question.keywords.map((keyword) => (
                            <Badge key={keyword} variant="secondary" className="text-xs">
                              #{keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>{question.usedCount}번 사용됨</span>
                          <span>{question.createdAt}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3 mr-1" />
                            편집
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">게임 기록</h3>
                  <p className="text-sm text-gray-600">최근 플레이한 게임들을 확인하세요</p>
                </div>

                <div className="space-y-4">
                  {gameHistory.map((game) => (
                    <Card key={game.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{game.collectionTitle}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {game.playedAt}
                              </span>
                              <span>상대: {game.partner}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600 mb-1">{game.matchRate}%</div>
                            <div className="text-xs text-gray-500">일치율</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {gameHistory.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">아직 플레이한 게임이 없어요</h3>
                      <p className="text-gray-600 mb-4">다양한 밸런스 게임을 플레이하고 기록을 확인해보세요</p>
                      <Button asChild>
                        <Link href="/explore">게임 찾아보기</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
