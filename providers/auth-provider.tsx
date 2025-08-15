'use client'

import { createContext, ReactNode } from 'react'
import { useAuthState } from '@/hooks/use-auth'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, nickname: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const authState = useAuthState()

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  )
}