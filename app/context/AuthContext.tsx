"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/app/lib/apiClient'; // API 클라이언트 임포트

interface User {
    nickname: string;
    email: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    isLoading: boolean; // 1. isLoading 상태 추가
    checkLoginStatus: () => Promise<void>;
    logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // 2. 초기값을 true로 설정

    const checkLoginStatus = async () => {
        setIsLoading(true); // 3. 상태 확인 시작 시 로딩 시작
        try {
            const response = await apiClient.get('/auth/me');
            if (response.status === 200) {
                setIsLoggedIn(true);
                setUser(response.data);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        } catch (error) {
            setIsLoggedIn(false);
            setUser(null);
        } finally {
            setIsLoading(false); // 4. 상태 확인 완료 시 로딩 종료
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    // 2. 로그아웃 함수
    const logout = async () => {
        try {
            await apiClient.post('/auth/logout'); // 백엔드에 로그아웃 요청
        } catch (error) {
            console.error("로그아웃 실패:", error);
        } finally {
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    // 로그인 페이지에서 로그인 성공 후 이 함수를 호출하여 상태를 갱신
    const value = { isLoggedIn, user, isLoading, checkLoginStatus, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
