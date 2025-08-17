'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { authApi } from '@/lib/api/auth'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, nickname: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

import { AuthContext } from '@/providers/auth-provider'

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
      const response = await authApi.me()
      if (response.success) {
        setUser(response.data)
      } else {
        setUser(null)
      }
    } catch (error: any) {
      console.debug('Auth check failed (인증되지 않은 사용자):', {
        status: error.response?.status,
        url: error.config?.url
      })
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await authApi.login({ email, password })
      
      if (response.success) {
        // 로그인 성공 시 사용자 정보 직접 설정 (API 재호출 방지)
        if (response.data?.user) {
          setUser(response.data.user)
        } else {
          // 사용자 정보가 없는 경우에만 안전하게 체크
          try {
            await checkAuthStatus()
          } catch (checkError) {
            console.warn('로그인 후 사용자 정보 확인 실패, 무시함:', checkError)
            // 체크 실패해도 로그인은 성공으로 처리
          }
        }
        setLoading(false)
      } else {
        setLoading(false)
        throw new Error('로그인에 실패했습니다.')
      }
    } catch (error: any) {
      setLoading(false)
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message)
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error(error.message || '로그인에 실패했습니다.')
      }
    }
  }

  const signup = async (email: string, password: string, nickname: string) => {
    setLoading(true)
    try {
      const response = await authApi.signup({ email, password, nickname })
      
      if (response.success) {
        // 회원가입 성공 후 자동 로그인
        await login(email, password)
      } else {
        setLoading(false)
        throw new Error('회원가입에 실패했습니다.')
      }
    } catch (error: any) {
      setLoading(false)
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message)
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error(error.message || '회원가입에 실패했습니다.')
      }
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
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