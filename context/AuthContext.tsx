"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import apiClient, { setAccessToken } from "@/lib/apiClient";
import { toast } from "@/lib/toast";

interface User {
    id: number;
    email: string;
    nickname: string;
    role?: 'USER' | 'ADMIN';
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    isLoading: boolean;
    checkLoginStatus: () => Promise<void>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkLoginStatus = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get("/auth/me");
            if (res.status === 200) {
                setIsLoggedIn(true);
                setUser(res.data);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        } catch (error) {
            console.log('로그인 상태 확인 실패 (정상적인 상황일 수 있음)');
            setIsLoggedIn(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            console.log('로그인 시도:', { email });
            
            const res = await apiClient.post("/auth/login", { 
                email, 
                password 
            });
            
            console.log('로그인 응답:', res.data);
            
            // 토큰이 응답에 있는 경우
            if (res.data.accessToken) {
                setAccessToken(res.data.accessToken);
                await checkLoginStatus();
                toast.success("로그인되었습니다");
                return true;
            }
            
            // 토큰이 없어도 성공 응답인 경우 (쿠키 기반 인증)
            if (res.status === 200) {
                await checkLoginStatus();
                toast.success("로그인되었습니다");
                return true;
            }
            
            return false;
        } catch (error: any) {
            console.error('로그인 에러 상세:', error);
            
            // 에러 메시지 파싱
            let message = "로그인에 실패했습니다";
            
            if (error.response) {
                // 서버 응답이 있는 경우
                if (error.response.status === 400) {
                    message = "이메일 또는 비밀번호를 확인해주세요";
                } else if (error.response.status === 401) {
                    message = "인증에 실패했습니다. 이메일과 비밀번호를 확인해주세요";
                } else if (error.response.status === 404) {
                    message = "사용자를 찾을 수 없습니다";
                } else if (error.response.data?.message) {
                    message = error.response.data.message;
                }
            } else if (error.request) {
                // 요청은 보냈지만 응답이 없는 경우
                message = "서버에 연결할 수 없습니다. 네트워크를 확인해주세요";
            }
            
            toast.error(message);
            return false;
        }
    };

    const logout = async () => {
        try {
            await apiClient.post("/auth/logout");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setAccessToken(null);
            setIsLoggedIn(false);
            setUser(null);
            toast.success("로그아웃되었습니다");
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, user, isLoading, checkLoginStatus, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
