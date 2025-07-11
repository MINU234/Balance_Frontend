"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Play, Users, Heart, Coffee, Lightbulb, Star, Filter, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedKeyword, setSelectedKeyword] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  const keywords = [
    { id: "all", name: "전체", icon: Star, count: 546 },
    { id: "love", name: "연애", icon: Heart, count: 156 },
    { id: "food", name: "음식", icon: Coffee, count: 89 },
    { id: "values", name: "가치관", icon: Lightbulb, count: 234 },
    { id: "daily", name: "일상", icon: Star, count: 67 },
  ]

  const collections = [
    {
      id: 1,
      title: "연인과 함께하는 밸런스 게임",
      description: "연인 사이의 가치관과 취향을 알아보는 재미있는 질문들",
      author: "러브마스터",
      plays: 1234,
      questions: 15,
      keywords: ["연애", "가치관"],
      isPublic: true,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "친구들과 즐기는 음식 토론",
      description: "음식에 대한 다양한 선택의 순간들",
      author: "푸드파이터",
      plays: 856,
      questions: 20,
      keywords: ["음식", "일상"],
      isPublic: true,
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      title: "인생 철학 밸런스 게임",
      description: "깊이 있는 가치관 질문으로 서로를 더 알아가기",
      author: "철학자",
      plays: 567,
      questions: 12,
      keywords: ["가치관", "철학"],
      isPublic: true,
      createdAt: "2024-01-08",
    },
    {
      id: 4,
      title: "직장인 고민 밸런스",
      description: "직장 생활의 다양한 선택 상황들",
      author: "워커홀릭",
      plays: 423,
      questions: 18,
      keywords: ["직장", "일상"],
      isPublic: true,
      createdAt: "2024-01-05",
    },
    {
      id: 5,
      title: "여행지 선택 게임",
      description: "여행 관련 재미있는 선택들",
      author: "여행러버",
      plays: 789,
      questions: 14,
      keywords: ["여행", "일상"],
      isPublic: true,
      createdAt: "2024-01-03",
    },
    {
      id: 6,
      title: "학생 시절 추억 게임",
      description: "학창시절 경험했을 법한 상황들",
      author: "추억여행자",
      plays: 345,
      questions: 16,
      keywords: ["추억", "학교"],
      isPublic: true,
      createdAt: "2024-01-01",
    },
  ]

  const questions = [
    {
      id: 1,
      title: "치킨 vs 피자",
      description: "평생 둘 중 하나만 먹을 수 있다면?",
      keywords: ["음식"],
      author: "푸드파이터",
      usedCount: 234,
    },
    {
      id: 2,
      title: "돈 vs 시간",
      description: "돈이 많지만 시간이 없는 삶 vs 시간은 많지만 돈이 없는 삶",
      keywords: ["가치관"],
      author: "철학자",
      usedCount: 456,
    },
    {
      id: 3,
      title: "여름 vs 겨울",
      description: "평생 여름만 있는 곳 vs 평생 겨울만 있는 곳",
      keywords: ["일상"],
      author: "날씨맨",
      usedCount: 123,
    },
  ]

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
              <h1 className="text-xl font-bold">탐색하기</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">회원가입</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="질문 묶음이나 질문을 검색하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">인기순</SelectItem>
                  <SelectItem value="recent">최신순</SelectItem>
                  <SelectItem value="plays">플레이순</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                필터
              </Button>
            </div>
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Button
                key={keyword.id}
                variant={selectedKeyword === keyword.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedKeyword(keyword.id)}
                className="flex items-center space-x-1"
              >
                <keyword.icon className="w-3 h-3" />
                <span>#{keyword.name}</span>
                <span className="text-xs opacity-70">({keyword.count})</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="collections" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="collections">질문 묶음</TabsTrigger>
            <TabsTrigger value="questions">개별 질문</TabsTrigger>
          </TabsList>

          <TabsContent value="collections">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <Card key={collection.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{collection.title}</CardTitle>
                        <CardDescription className="text-sm">{collection.description}</CardDescription>
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
                      <span>by {collection.author}</span>
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
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1" asChild>
                        <Link href={`/play/${collection.id}`}>
                          <Play className="w-4 h-4 mr-2" />
                          플레이하기
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        복제
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="questions">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questions.map((question) => (
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
                      <span>by {question.author}</span>
                      <span>{question.usedCount}번 사용됨</span>
                    </div>
                    <Button className="w-full bg-transparent" variant="outline">
                      내 묶음에 추가
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
