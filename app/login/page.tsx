'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, ArrowLeft } from 'lucide-react';
import apiClient from '@/lib/simpleApiClient';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 실제 백엔드 API 호출
      const response = await apiClient.login({
        email: formData.email,
        password: formData.password
      });
      
      // 토큰 저장 (simpleApiClient 응답 구조에 맞게 수정)
      if (response.token) {
        localStorage.setItem('accessToken', response.token);
      } else if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
      }
      alert('로그인 성공!');
      router.push('/');
    } catch (error: any) {
      const message = error.response?.data?.message || '로그인에 실패했습니다.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl float-animation"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="w-full max-w-md">
        {/* 뒤로가기 */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            홈으로 돌아가기
          </Link>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          {/* 로고 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">로그인</h1>
            <p className="text-slate-600">다시 오신 것을 환영합니다!</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  로그인 중...
                </span>
              ) : (
                '로그인'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              아직 계정이 없으신가요?{' '}
              <Link 
                href="/signup" 
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}