import apiClient from '@/lib/api-client'
import { ApiResponse, PaginatedResponse, Question, QuestionBundle, UserStats } from '@/types'

export interface GameHistory {
  sessionId: number
  bundleTitle: string
  completedAt: string
  shareCode?: string
  questionCount: number
}

export const mypageApi = {
  // 내 게임 기록
  getGameHistory: async (page = 0, size = 10): Promise<ApiResponse<PaginatedResponse<GameHistory>>> => {
    const response = await apiClient.get(`/api/my/game-history?page=${page}&size=${size}`)
    return response.data
  },

  // 내 질문 목록
  getMyQuestions: async (page = 0, size = 10): Promise<ApiResponse<PaginatedResponse<Question>>> => {
    const response = await apiClient.get(`/api/my/questions?page=${page}&size=${size}`)
    return response.data
  },

  // 상태별 질문 조회
  getQuestionsByStatus: async (status: 'PENDING' | 'APPROVED' | 'REJECTED', page = 0, size = 10): Promise<ApiResponse<PaginatedResponse<Question>>> => {
    const response = await apiClient.get(`/api/my/questions/status/${status}?page=${page}&size=${size}`)
    return response.data
  },

  // 내 질문 묶음 목록
  getMyBundles: async (page = 0, size = 10): Promise<ApiResponse<PaginatedResponse<QuestionBundle>>> => {
    const response = await apiClient.get(`/api/my/question-bundles?page=${page}&size=${size}`)
    return response.data
  },

  // 내 통계
  getMyStats: async (): Promise<ApiResponse<UserStats>> => {
    const response = await apiClient.get('/api/my/stats')
    return response.data
  }
}