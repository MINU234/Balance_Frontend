'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types/api';
import apiClient from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 로그인 상태 확인 (쿠키 기반)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 빌드 시점에는 인증 체크를 건너뛰기
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }
        
        // 쿠키에 세션이 있는지 확인 (서버에서 httpOnly 쿠키로 관리)
        console.log('🔍 Checking authentication status...');
        const response = await apiClient.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setUser(null);
        }
        console.log('✅ User authenticated:', userData);
      } catch (error: any) {
        console.log('ℹ️ User not authenticated or session expired');
        // 인증되지 않은 상태는 정상적인 상황
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const loginResponse = await apiClient.login({ email, password });
      
      if (loginResponse.success) {
        // 로그인 후 사용자 정보 조회 (쿠키는 서버에서 자동 설정)
        const userResponse = await apiClient.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
        }
      }

      if (user) {
        toast({
          title: "로그인 성공",
          description: `환영합니다, ${user.nickname}님!`,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.response?.data?.message || '로그인에 실패했습니다.';
      toast({
        title: "로그인 실패",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, nickname: string) => {
    try {
      setLoading(true);
      const signupResponse = await apiClient.signup({ email, password, nickname });
      
      if (signupResponse.success) {
        // 회원가입 성공 후 자동 로그인
        await login(email, password);
      }
      
      toast({
        title: "회원가입 성공",
        description: "밸런스 게임에 오신 것을 환영합니다!",
      });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.response?.data?.message || '회원가입에 실패했습니다.';
      toast({
        title: "회원가입 실패",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // 서버에 로그아웃 요청을 보내서 쿠키 무효화
      await apiClient.logout();
    } catch (error) {
      console.log('Logout request failed, but proceeding with client-side logout');
    }
    
    setUser(null);
    
    toast({
      title: "로그아웃",
      description: "성공적으로 로그아웃되었습니다.",
    });
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
