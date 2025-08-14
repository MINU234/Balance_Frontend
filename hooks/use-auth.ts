'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import apiClient from '@/lib/api-client'
import { User, ApiResponse } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, nickname: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/api/auth/me')
      setUser(response.data.data)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await apiClient.post<ApiResponse<string>>('/api/auth/login', {
        email,
        password
      })
      
      // 로그인 성공 후 사용자 정보 다시 가져오기
      await checkAuthStatus()
      return response.data
    } catch (error: any) {
      setLoading(false)
      throw new Error(error.response?.data?.error?.message || '로그인에 실패했습니다.')
    }
  }

  const signup = async (email: string, password: string, nickname: string) => {
    setLoading(true)
    try {
      const response = await apiClient.post<ApiResponse<string>>('/api/auth/signup', {
        email,
        password,
        nickname
      })
      
      // 회원가입 성공 후 자동 로그인
      await login(email, password)
      return response.data
    } catch (error: any) {
      setLoading(false)
      throw new Error(error.response?.data?.error?.message || '회원가입에 실패했습니다.')
    }
  }

  const logout = async () => {
    try {
      await apiClient.post('/api/auth/logout')
    } catch (error) {
      console.error('로그아웃 중 오류:', error)
    } finally {
      setUser(null)
    }
  }

  return {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  }
}