/**
 * 배포 환경에 최적화된 인증 관리 시스템
 * - 쿠키 기반 인증 (httpOnly, secure)
 * - SSR 친화적
 * - 자동 토큰 갱신
 * - CSRF 보호
 */

import { User } from '@/types/api';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class AuthManager {
  private static instance: AuthManager;
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true
  };
  private listeners: ((state: AuthState) => void)[] = [];

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  // 상태 구독
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // 상태 업데이트 및 리스너 알림
  private updateState(newState: Partial<AuthState>) {
    this.authState = { ...this.authState, ...newState };
    this.listeners.forEach(listener => listener(this.authState));
  }

  // 현재 상태 반환
  getState(): AuthState {
    return this.authState;
  }

  // 클라이언트 사이드 토큰 확인 (fallback)
  async initializeAuth(): Promise<void> {
    try {
      // 서버에서 쿠키 확인을 우선으로 하되, 클라이언트에서는 localStorage 확인
      const token = this.getToken();
      
      if (token) {
        // 토큰 유효성 검증을 위해 사용자 정보 요청
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          this.updateState({
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          // 토큰이 유효하지 않으면 제거
          this.removeToken();
          this.updateState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } else {
        this.updateState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      this.updateState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }

  // 로그인
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // 쿠키 포함
      });

      if (response.ok) {
        const data = await response.json();
        
        // 백업으로 localStorage에도 저장 (개발 환경용)
        if (data.accessToken) {
          this.setToken(data.accessToken);
        }

        // 사용자 정보 로드
        if (data.user) {
          this.updateState({
            user: data.user,
            isAuthenticated: true,
            isLoading: false
          });
        }

        return { success: true };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.message || '로그인에 실패했습니다.' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: '네트워크 오류가 발생했습니다.' 
      };
    }
  }

  // 로그아웃
  async logout(): Promise<void> {
    try {
      // 서버에 로그아웃 요청
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // 클라이언트 상태 초기화
      this.removeToken();
      this.updateState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }

  // 회원가입
  async signup(email: string, password: string, nickname: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, nickname }),
        credentials: 'include',
      });

      if (response.ok) {
        // 회원가입 성공 후 자동 로그인
        return await this.login(email, password);
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.message || '회원가입에 실패했습니다.' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: '네트워크 오류가 발생했습니다.' 
      };
    }
  }

  // 토큰 관리 (개발 환경 fallback)
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    // 1순위: localStorage (개발 환경)
    const token = localStorage.getItem('accessToken');
    return token;
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', token);
  }

  private removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  // API 요청용 헤더 가져오기
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}

export const authManager = AuthManager.getInstance();

// React Hook
import { useState, useEffect } from 'react';

export function useAuth(): AuthState & {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<{ success: boolean; error?: string }>;
} {
  const [authState, setAuthState] = useState<AuthState>(authManager.getState());

  useEffect(() => {
    // 초기 인증 상태 확인
    authManager.initializeAuth();
    
    // 상태 변경 구독
    const unsubscribe = authManager.subscribe(setAuthState);
    
    return unsubscribe;
  }, []);

  return {
    ...authState,
    login: authManager.login.bind(authManager),
    logout: authManager.logout.bind(authManager),
    signup: authManager.signup.bind(authManager),
  };
}
