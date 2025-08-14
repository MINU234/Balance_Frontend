"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, X, Save, Eye, ImageIcon, Sparkles, Check } from "lucide-react"
import { useState, useRef } from "react"
import Link from "next/link"
import apiClient from "@/lib/simpleApiClient"

export default function CreateQuestionPage() {
  const [questionData, setQuestionData] = useState({
    text: "",
    optionAText: "",
    optionBText: "",
    keyword: "",
    optionAImageUrl: "",
    optionBImageUrl: "",
  })

  const [previewImages, setPreviewImages] = useState({
    optionA: null,
    optionB: null,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const fileInputRefA = useRef<HTMLInputElement>(null)
  const fileInputRefB = useRef<HTMLInputElement>(null)

  const popularKeywords = ["#연애", "#음식", "#가치관", "#일상", "#직장", "#여행", "#취미", "#인생", "#친구", "#가족"]

  const handleInputChange = (field: string, value: string) => {
    setQuestionData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleKeywordClick = (keyword: string) => {
    setQuestionData((prev) => ({
      ...prev,
      keyword: keyword,
    }))
  }

  const handleImageUpload = async (file: File, option: 'A' | 'B') => {
    if (!file) return

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.")
      return
    }

    // 이미지 파일 타입 체크
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.")
      return
    }

    try {
      setIsLoading(true)

      // 실제 구현에서는 여기서 파일을 서버에 업로드
      // 현재는 시뮬레이션
      const formData = new FormData()
      formData.append("file", file)

      // 시뮬레이션된 업로드 응답
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const mockImageUrl = `https://minwoo.blob.core.windows.net/minwoo/${Date.now()}-${file.name}`

      // 미리보기 이미지 설정
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImages((prev) => ({
          ...prev,
          [option]: e.target?.result || '',
        }))
      }
      reader.readAsDataURL(file)

      // 실제 URL 저장
      const fieldName = option === "A" ? "optionAImageUrl" : "optionBImageUrl"
      handleInputChange(fieldName, mockImageUrl)
    } catch (error) {
      console.error("이미지 업로드 실패:", error)
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const removeImage = (option: 'A' | 'B') => {
    const fieldName = option === "A" ? "optionAImageUrl" : "optionBImageUrl"
    handleInputChange(fieldName, "")
    setPreviewImages((prev) => ({
      ...prev,
      [option]: null,
    }))
  }

  const validateForm = () => {
    if (!questionData.text.trim()) {
      alert("질문을 입력해주세요.")
      return false
    }
    if (!questionData.optionAText.trim()) {
      alert("A 선택지를 입력해주세요.")
      return false
    }
    if (!questionData.optionBText.trim()) {
      alert("B 선택지를 입력해주세요.")
      return false
    }
    if (!questionData.keyword.trim()) {
      alert("키워드를 선택하거나 입력해주세요.")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // API 요청 (실제 API 사용)
      await apiClient.createQuestion({
        text: questionData.text,
        optionAText: questionData.optionAText,
        optionBText: questionData.optionBText,
        keyword: questionData.keyword,
        optionAImageUrl: questionData.optionAImageUrl,
        optionBImageUrl: questionData.optionBImageUrl
      })
      
      alert("질문이 성공적으로 등록되었습니다!")
      // 마이페이지로 리다이렉트
      window.location.href = "/my-page"
    } catch (error) {
      console.error("질문 등록 오류:", error)
      alert("질문 등록에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl float-animation"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-purple-500/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/my-page">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  마이페이지
                </Link>
              </Button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">새 질문 만들기</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                disabled={!questionData.text || !questionData.optionAText || !questionData.optionBText}
              >
                <Eye className="w-4 h-4 mr-2" />
                미리보기
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                취소
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "저장 중..." : "저장하기"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
                <CardDescription>밸런스 게임 질문의 기본 정보를 입력하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question">질문 *</Label>
                  <Textarea
                    id="question"
                    placeholder="예: 다시 태어난다면?"
                    value={questionData.text}
                    onChange={(e) => handleInputChange("text", e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keyword">키워드 *</Label>
                  <Input
                    id="keyword"
                    placeholder="예: #인생"
                    value={questionData.keyword}
                    onChange={(e) => handleInputChange("keyword", e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {popularKeywords.map((keyword) => (
                      <Button
                        key={keyword}
                        size="sm"
                        variant={questionData.keyword === keyword ? "default" : "outline"}
                        onClick={() => handleKeywordClick(keyword)}
                        type="button"
                      >
                        {keyword}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Option A */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="bg-purple-600 text-white px-2 py-1 rounded text-sm">A</div>
                  <span>선택지 A</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="optionA">선택지 A 텍스트 *</Label>
                  <Input
                    id="optionA"
                    placeholder="예: 돈 많은 박명수"
                    value={questionData.optionAText}
                    onChange={(e) => handleInputChange("optionAText", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>선택지 A 이미지</Label>
                  {previewImages.optionA ? (
                    <div className="relative">
                      <img
                        src={previewImages.optionA || "/placeholder.svg"}
                        alt="Option A Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => removeImage("A")}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                      onClick={() => fileInputRefA.current?.click()}
                    >
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">이미지를 업로드하세요</p>
                      <p className="text-sm text-gray-500">JPG, PNG 파일 (최대 5MB)</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRefA}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], "A")}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Option B */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm">B</div>
                  <span>선택지 B</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="optionB">선택지 B 텍스트 *</Label>
                  <Input
                    id="optionB"
                    placeholder="예: 잘생긴 거지"
                    value={questionData.optionBText}
                    onChange={(e) => handleInputChange("optionBText", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>선택지 B 이미지</Label>
                  {previewImages.optionB ? (
                    <div className="relative">
                      <img
                        src={previewImages.optionB || "/placeholder.svg"}
                        alt="Option B Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => removeImage("B")}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                      onClick={() => fileInputRefB.current?.click()}
                    >
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">이미지를 업로드하세요</p>
                      <p className="text-sm text-gray-500">JPG, PNG 파일 (최대 5MB)</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRefB}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], "B")}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>미리보기</CardTitle>
                <CardDescription>작성 중인 질문이 실제로 어떻게 보일지 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                {questionData.text && questionData.optionAText && questionData.optionBText ? (
                  <div className="space-y-6">
                    {/* Question Preview */}
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                      <h3 className="text-xl font-bold mb-2">{questionData.text}</h3>
                      {questionData.keyword && <Badge variant="secondary">{questionData.keyword}</Badge>}
                    </div>

                    {/* Options Preview */}
                    <div className="grid gap-4">
                      {/* Option A Preview */}
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden rounded-t-lg">
                            {previewImages.optionA ? (
                              <img
                                src={previewImages.optionA || "/placeholder.svg"}
                                alt="Option A"
                                className="w-full h-32 object-cover"
                              />
                            ) : (
                              <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute top-2 left-2">
                              <div className="bg-purple-600 text-white px-2 py-1 rounded text-sm font-semibold">A</div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold">{questionData.optionAText}</h4>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Option B Preview */}
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden rounded-t-lg">
                            {previewImages.optionB ? (
                              <img
                                src={previewImages.optionB || "/placeholder.svg"}
                                alt="Option B"
                                className="w-full h-32 object-cover"
                              />
                            ) : (
                              <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute top-2 left-2">
                              <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">B</div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold">{questionData.optionBText}</h4>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>질문과 선택지를 입력하면</p>
                    <p>미리보기가 여기에 표시됩니다</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>💡 질문 작성 팁</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <span>명확하고 이해하기 쉬운 질문을 작성하세요</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>두 선택지가 균형을 이루도록 구성하세요</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>이미지는 선택지를 잘 표현하는 것으로 선택하세요</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <span>적절한 키워드를 설정하여 검색이 쉽도록 하세요</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
