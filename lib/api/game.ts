import apiClient from '@/lib/api-client'
import { ApiResponse, GameSession, GameResult, GameComparison } from '@/types'

export interface StartGameRequest {
  bundleId: number
  userEmail?: string | null
}

export interface SubmitAnswerRequest {
  sessionId: number
  questionId: number
  selectedOption: 'A' | 'B'
}

export const gameApi = {
  // 게임 시작
  startGame: async (data: StartGameRequest): Promise<ApiResponse<GameSession>> => {
    const response = await apiClient.post('/api/game/start', data)
    return response.data
  },

  // 답변 제출
  submitAnswer: async (data: SubmitAnswerRequest): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/api/game/answer', data)
    return response.data
  },

  // 게임 완료
  completeGame: async (sessionId: number): Promise<ApiResponse<GameResult>> => {
    const response = await apiClient.post(`/api/game/sessions/${sessionId}/complete`)
    return response.data
  },

  // 게임 결과 조회
  getGameResults: async (sessionId: number): Promise<ApiResponse<GameResult>> => {
    const response = await apiClient.get(`/api/game/sessions/${sessionId}/results`)
    return response.data
  },

  // 공유코드로 세션 조회
  getSessionByShareCode: async (shareCode: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/api/game/share/${shareCode}`)
    return response.data
  },

  // 공유코드 검증
  validateShareCode: async (shareCode: string): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.get(`/api/game/share/${shareCode}/validate`)
    return response.data
  },

  // 결과 비교
  compareResults: async (shareCode: string, compareSessionId: number): Promise<ApiResponse<GameComparison>> => {
    const response = await apiClient.post(`/api/game/compare?shareCode=${shareCode}&compareSessionId=${compareSessionId}`)
    return response.data
  }
}