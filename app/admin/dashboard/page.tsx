"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  AlertCircle,
  TrendingUp,
  Users,
  FileText,
  BarChart3
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import apiClient from "@/lib/apiClient"
import { toast } from "@/lib/toast"

import { Question } from '@/types/api'

interface DashboardStats {
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  todayCount: number
  weekCount: number
  monthCount: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [selectedTab, setSelectedTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([])
  const [rejectionReasons, setRejectionReasons] = useState<{ [key: number]: string }>({})
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  // 관리자 권한 체크
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      console.error("관리자 권한이 필요합니다")
      router.push('/')
    }
  }, [user, authLoading, router])

  // 통계 데이터 로드
  const fetchStats = async () => {
    try {
      const response = await apiClient.getAdminDashboardStats()
      setStats(response)
    } catch (error) {
      console.error('통계 로드 실패:', error)
      toast.error("통계를 불러올 수 없습니다")
    }
  }

  // 질문 목록 로드
  const fetchQuestions = async (status: string = 'PENDING', page: number = 0) => {
    setIsLoading(true)
    try {
      let response;
      if (status === 'PENDING') {
        response = await apiClient.getPendingQuestions(page, 10);
      } else {
        response = await apiClient.getApprovalHistory(status === 'ALL' ? undefined : status, page, 10);
      }
      
      setQuestions(response.content || [])
      setTotalPages(response.totalPages || 0)
      setCurrentPage(page)
    } catch (error) {
      console.error('질문 로드 실패:', error)
      toast.error("질문 목록을 불러올 수 없습니다")
    } finally {
      setIsLoading(false)
    }
  }

  // 초기 데이터 로드
  useEffect(() => {
    fetchStats()
    fetchQuestions('PENDING')
  }, [])

  // 탭 변경 시 데이터 다시 로드
  useEffect(() => {
    fetchQuestions(selectedTab, 0)
  }, [selectedTab])

  // 질문 승인
  const approveQuestion = async (questionId: number) => {
    try {
      await apiClient.approveQuestion({ questionId })
      toast.success("질문이 승인되었습니다")
      fetchQuestions(selectedTab, currentPage)
      fetchStats()
    } catch (error) {
      toast.error("승인 처리 중 오류가 발생했습니다")
    }
  }

  // 질문 거절
  const rejectQuestion = async (questionId: number) => {
    const reason = rejectionReasons[questionId]
    if (!reason?.trim()) {
      toast.error("거절 사유를 입력해주세요")
      return
    }

    try {
      await apiClient.rejectQuestion({ questionId, reason })
      toast.success("질문이 거절되었습니다")
      setRejectionReasons(prev => ({ ...prev, [questionId]: '' }))
      fetchQuestions(selectedTab, currentPage)
      fetchStats()
    } catch (error) {
      toast.error("거절 처리 중 오류가 발생했습니다")
    }
  }

  // 일괄 승인
  const bulkApprove = async () => {
    if (selectedQuestions.length === 0) {
      toast.error("선택된 질문이 없습니다")
      return
    }

    try {
      await apiClient.bulkApproveQuestions(selectedQuestions)
      toast.success(`${selectedQuestions.length}개의 질문이 승인되었습니다`)
      setSelectedQuestions([])
      fetchQuestions(selectedTab, currentPage)
      fetchStats()
    } catch (error) {
      toast.error("일괄 승인 처리 중 오류가 발생했습니다")
    }
  }

  // 체크박스 토글
  const toggleQuestionSelection = (questionId: number) => {
    setSelectedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    )
  }

  // 전체 선택/해제
  const toggleAllSelection = () => {
    const pendingQuestions = questions.filter(q => q.approvalStatus === 'PENDING')
    if (selectedQuestions.length === pendingQuestions.length) {
      setSelectedQuestions([])
    } else {
      setSelectedQuestions(pendingQuestions.map(q => q.id))
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            관리자 대시보드
          </h1>
          <p className="text-gray-600 mt-2">질문 승인 관리 시스템</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">승인 대기</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.pendingCount || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                즉시 처리 필요
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">승인됨</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats?.approvedCount || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                전체 승인 질문
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">거절됨</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats?.rejectedCount || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                전체 거절 질문
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">오늘 등록</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats?.todayCount || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                24시간 이내
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>질문 관리</CardTitle>
              <div className="flex gap-2">
                {selectedTab === 'PENDING' && selectedQuestions.length > 0 && (
                  <Button onClick={bulkApprove} className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    일괄 승인 ({selectedQuestions.length}개)
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="PENDING" className="gap-2">
                  <Clock className="h-4 w-4" />
                  대기중
                </TabsTrigger>
                <TabsTrigger value="APPROVED" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  승인됨
                </TabsTrigger>
                <TabsTrigger value="REJECTED" className="gap-2">
                  <XCircle className="h-4 w-4" />
                  거절됨
                </TabsTrigger>
                <TabsTrigger value="ALL" className="gap-2">
                  <FileText className="h-4 w-4" />
                  전체
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="space-y-4 mt-4">
                {selectedTab === 'PENDING' && questions.length > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.length === questions.filter(q => q.approvalStatus === 'PENDING').length}
                      onChange={toggleAllSelection}
                      className="h-4 w-4 text-purple-600 rounded"
                    />
                    <span className="text-sm text-gray-600">전체 선택</span>
                  </div>
                )}

                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-48" />
                    ))}
                  </div>
                ) : questions.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">표시할 질문이 없습니다</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question) => (
                      <Card key={question.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3 flex-1">
                              {selectedTab === 'PENDING' && (
                                <input
                                  type="checkbox"
                                  checked={selectedQuestions.includes(question.id)}
                                  onChange={() => toggleQuestionSelection(question.id)}
                                  className="h-4 w-4 text-purple-600 rounded mt-1"
                                />
                              )}
                              <div className="flex-1">
                                <CardTitle className="text-lg">{question.text}</CardTitle>
                                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                  <span>👤 {question.creator?.nickname || '알 수 없음'}</span>
                                  <span>🏷️ {question.keyword || '없음'}</span>
                                  <span>📅 {new Date(question.createdAt).toLocaleDateString('ko-KR')}</span>
                                </div>
                              </div>
                            </div>
                            <Badge
                              variant={
                                question.approvalStatus === 'PENDING' ? 'secondary' :
                                question.approvalStatus === 'APPROVED' ? 'default' : 'destructive'
                              }
                            >
                              {question.approvalStatus === 'PENDING' ? '대기중' :
                               question.approvalStatus === 'APPROVED' ? '승인됨' : '거절됨'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-900 mb-1">선택지 A</p>
                              <p className="text-gray-700">{question.optionAText}</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                              <p className="text-sm font-medium text-purple-900 mb-1">선택지 B</p>
                              <p className="text-gray-700">{question.optionBText}</p>
                            </div>
                          </div>

                          {question.approvalStatus === 'PENDING' && (
                            <>
                              <Textarea
                                placeholder="거절 사유를 입력하세요..."
                                value={rejectionReasons[question.id] || ''}
                                onChange={(e) => setRejectionReasons(prev => ({
                                  ...prev,
                                  [question.id]: e.target.value
                                }))}
                                className="mb-3"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => approveQuestion(question.id)}
                                  className="flex-1"
                                  variant="default"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  승인
                                </Button>
                                <Button
                                  onClick={() => rejectQuestion(question.id)}
                                  className="flex-1"
                                  variant="destructive"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  거절
                                </Button>
                              </div>
                            </>
                          )}

                          {question.approvalStatus === 'REJECTED' && question.rejectionReason && (
                            <Alert className="mt-3">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>거절 사유:</strong> {question.rejectionReason}
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => fetchQuestions(selectedTab, currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      이전
                    </Button>
                    <span className="flex items-center px-4">
                      {currentPage + 1} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => fetchQuestions(selectedTab, currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                    >
                      다음
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
