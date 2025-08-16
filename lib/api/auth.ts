import apiClient from '@/lib/api-client'
import { ApiResponse, User } from '@/types'

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  nickname: string
}

export const authApi = {
  // 로그인
  login: async (data: LoginRequest): Promise<ApiResponse<string>> => {
    try {
      const response = await apiClient.post('/api/auth/login', data)
      // 서버에서 200 응답이 오면 성공으로 처리
      if (response.status === 200) {
        return { success: true, data: response.data };
      }
      return { success: false, data: null as any };
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.response?.status === 500) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      throw new Error(error.userMessage || '로그인에 실패했습니다. 다시 시도해주세요.');
    }
  },

  // 회원가입
  signup: async (data: SignupRequest): Promise<ApiResponse<string>> => {
    try {
      const response = await apiClient.post('/api/auth/signup', data)
      // 서버에서 200 응답이 오면 성공으로 처리
      if (response.status === 200) {
        return { success: true, data: response.data };
      }
      return { success: false, data: null as any };
    } catch (error: any) {
      console.error('Signup failed:', error);
      if (error.response?.status === 500) {
        throw new Error('이미 가입된 이메일이거나 서버에 문제가 있습니다. 다른 이메일로 시도해주세요.');
      }
      throw new Error(error.userMessage || '회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  },

  // 현재 사용자 정보 조회
  me: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get('/api/auth/me')
      return response.data
    } catch (error: any) {
      // 401/500 에러의 경우 인증되지 않은 상태로 처리
      if (error.response?.status === 401 || error.response?.status === 500) {
        // 인증 에러는 로그를 줄이고 조용히 처리
        console.debug('Auth check: User not authenticated (server returned ' + error.response?.status + ')');
        return { success: false, data: null as any };
      }
      console.error('User info fetch failed:', error);
      // 사용자 정보 조회 실패는 로그아웃 상태로 처리
      return { success: false, data: null as any };
    }
  },

  // 로그아웃
  logout: async (): Promise<ApiResponse<string>> => {
    try {
      const response = await apiClient.post('/api/auth/logout')
      return response.data
    } catch (error: any) {
      console.error('Logout failed:', error);
      // 로그아웃 실패해도 클라이언트에서는 성공으로 처리
      return { success: true, data: 'Local logout completed' };
    }
  }
}