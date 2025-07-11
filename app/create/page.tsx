"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Search, X, GripVertical, Save } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function CreateCollectionPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedKeyword, setSelectedKeyword] = useState("all")

  const availableQuestions = [
    {
      id: 1,
      title: "치킨 vs 피자",
      description: "평생 둘 중 하나만 먹을 수 있다면?",
      keywords: ["음식"],
      author: "푸드파이터",
    },
    {
      id: 2,
      title: "돈 vs 시간",
      description: "돈이 많지만 시간이 없는 삶 vs 시간은 많지만 돈이 없는 삶",
      keywords: ["가치관"],
      author: "철학자",
    },
    {
      id: 3,
      title: "여름 vs 겨울",
      description: "평생 여름만 있는 곳 vs 평생 겨울만 있는 곳",
      keywords: ["일상"],
      author: "날씨맨",
    },
    {
      id: 4,
      title: "집에서 영화 vs 영화관",
      description: "영화를 볼 때 어디가 더 좋을까?",
      keywords: ["연애", "일상"],
      author: "영화광",
    },
    {
      id: 5,
      title: "아침형 vs 밤형",
      description: "당신의 라이프스타일은?",
      keywords: ["일상", "가치관"],
      author: "라이프코치",
    },
  ]

  const keywords = ["all", "음식", "가치관", "일상", "연애"]

  const addQuestion = (question) => {
    if (!selectedQuestions.find((q) => q.id === question.id)) {
      setSelectedQuestions([...selectedQuestions, question])
    }
  }

  const removeQuestion = (questionId) => {
    setSelectedQuestions(selectedQuestions.filter((q) => q.id !== questionId))
  }

  const moveQuestion = (index, direction) => {
    const newQuestions = [...selectedQuestions]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex >= 0 && targetIndex < newQuestions.length) {
      ;[newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]]
      setSelectedQuestions(newQuestions)
    }
  }

  const handleSave = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.")
      return
    }
    if (selectedQuestions.length === 0) {
      alert("최소 1개 이상의 질문을 선택해주세요.")
      return
    }

    // 저장 로직
    console.log({
      title,
      description,
      isPublic,
      questions: selectedQuestions,
    })

    alert("질문 묶음이 저장되었습니다!")
    // 마이페이지로 리다이렉트
    window.location.href = "/my-page"
  }

  const filteredQuestions = availableQuestions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesKeyword = selectedKeyword === "all" || question.keywords.includes(selectedKeyword)
    return matchesSearch && matchesKeyword
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/my-page">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  마이페이지
                </Link>
              </Button>
              <h1 className="text-xl font-bold">새 질문 묶음 만들기</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => window.history.back()}>
                취소
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                저장하기
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Collection Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
                <CardDescription>질문 묶음의 기본 정보를 입력하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    placeholder="질문 묶음의 제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    placeholder="질문 묶음에 대한 설명을 입력하세요"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="public">공개 설정</Label>
                    <p className="text-sm text-gray-500">다른 사용자들이 이 묶음을 볼 수 있도록 할까요?</p>
                  </div>
                  <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
                </div>
              </CardContent>
            </Card>

            {/* Selected Questions */}
            <Card>
              <CardHeader>
                <CardTitle>선택된 질문 ({selectedQuestions.length}개)</CardTitle>
                <CardDescription>질문의 순서를 변경하거나 제거할 수 있습니다</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedQuestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>아직 선택된 질문이 없습니다.</p>
                    <p className="text-sm">오른쪽에서 질문을 선택해주세요.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedQuestions.map((question, index) => (
                      <div key={question.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex flex-col space-y-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveQuestion(index, "up")}
                            disabled={index === 0}
                            className="h-6 w-6 p-0"
                          >
                            ↑
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveQuestion(index, "down")}
                            disabled={index === selectedQuestions.length - 1}
                            className="h-6 w-6 p-0"
                          >
                            ↓
                          </Button>
                        </div>
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{question.title}</h4>
                          <p className="text-xs text-gray-600">{question.description}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeQuestion(question.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Question Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>질문 선택</CardTitle>
                <CardDescription>원하는 질문들을 선택하여 묶음을 만드세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="질문 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Keyword Filter */}
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword) => (
                      <Button
                        key={keyword}
                        size="sm"
                        variant={selectedKeyword === keyword ? "default" : "outline"}
                        onClick={() => setSelectedKeyword(keyword)}
                      >
                        {keyword === "all" ? "전체" : `#${keyword}`}
                      </Button>
                    ))}
                  </div>

                  {/* Questions List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredQuestions.map((question) => {
                      const isSelected = selectedQuestions.find((q) => q.id === question.id)
                      return (
                        <div key={question.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{question.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{question.description}</p>
                              <div className="flex items-center space-x-2">
                                <div className="flex flex-wrap gap-1">
                                  {question.keywords.map((keyword) => (
                                    <Badge key={keyword} variant="secondary" className="text-xs">
                                      #{keyword}
                                    </Badge>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">by {question.author}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => (isSelected ? removeQuestion(question.id) : addQuestion(question))}
                              variant={isSelected ? "secondary" : "outline"}
                            >
                              {isSelected ? (
                                <>
                                  <X className="w-3 h-3 mr-1" />
                                  제거
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3 mr-1" />
                                  추가
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {filteredQuestions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>검색 결과가 없습니다.</p>
                      <p className="text-sm">다른 키워드로 검색해보세요.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Create New Question */}
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">원하는 질문이 없나요?</h3>
                <p className="text-sm text-gray-600 mb-4">새로운 밸런스 게임 질문을 직접 만들어보세요</p>
                <Button variant="outline" asChild>
                  <Link href="/create-question">
                    <Plus className="w-4 h-4 mr-2" />새 질문 만들기
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
