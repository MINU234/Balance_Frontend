import apiClient from '@/lib/api-client'
import { ApiResponse, PaginatedResponse, Question, QuestionBundle } from '@/types'

export const questionsApi = {
  // 인기 질문 조회
  getPopularQuestions: async (page = 0, size = 20): Promise<ApiResponse<PaginatedResponse<Question>>> => {
    try {
      const response = await apiClient.get(`/api/questions/popular?page=${page}&size=${size}`)
      return response.data
    } catch (error: any) {
      console.error('Failed to fetch popular questions:', error);
      // 빈 데이터로 fallback
      return {
        success: false,
        data: {
          content: [],
          pageable: { page, size, sort: '' },
          totalElements: 0,
          totalPages: 0
        }
      };
    }
  },

  // 인기 묶음 조회
  getPopularBundles: async (page = 0, size = 12): Promise<ApiResponse<PaginatedResponse<QuestionBundle>>> => {
    try {
      const response = await apiClient.get(`/api/question-bundles/popular?page=${page}&size=${size}`)
      return response.data
    } catch (error: any) {
      console.error('Failed to fetch popular bundles:', error);
      // 빈 데이터로 fallback
      return {
        success: false,
        data: {
          content: [],
          pageable: { page, size, sort: '' },
          totalElements: 0,
          totalPages: 0
        }
      };
    }
  },

  // 묶음 검색
  searchBundles: async (query: string, page = 0, size = 12): Promise<ApiResponse<PaginatedResponse<QuestionBundle>>> => {
    const response = await apiClient.get(`/api/question-bundles/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`)
    return response.data
  },

  // 묶음 상세 조회
  getBundleDetail: async (bundleId: number): Promise<ApiResponse<QuestionBundle>> => {
    const response = await apiClient.get(`/api/question-bundles/${bundleId}`)
    return response.data
  },

  // 질문 생성 (회원 전용)
  createQuestion: async (data: {
    text: string
    optionAText: string
    optionBText: string
    keyword: string
    optionAImageUrl?: string
    optionBImageUrl?: string
  }): Promise<ApiResponse<Question>> => {
    const response = await apiClient.post('/api/questions', data)
    return response.data
  },

  // 질문 묶음 생성 (회원 전용)
  createBundle: async (data: {
    title: string
    description: string
    questionIds: number[]
    isPublic: boolean
  }): Promise<ApiResponse<QuestionBundle>> => {
    const response = await apiClient.post('/api/question-bundles', data)
    return response.data
  }
}