'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import apiClient from '@/lib/simpleApiClient';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 6) {
      alert('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    if (!formData.agreeTerms) {
      alert('이용약관에 동의해주세요.');
      return;
    }

    setLoading(true);

    try {
      // 실제 백엔드 API 호출
      await apiClient.signup({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname
      });
      
      alert('회원가입 성공!');
      router.push('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || '회원가입에 실패했습니다.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 뒤로가기 */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            홈으로 돌아가기
          </Link>
        </div>

        {/* 회원가입 카드 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          {/* 로고 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">회원가입</h1>
            <p className="text-slate-600">밸런스 게임에 오신 것을 환영합니다!</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <label htmlFor="nickname" className="block text-sm font-medium text-slate-700 mb-2">
                닉네임
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  placeholder="멋진 닉네임"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  maxLength={20}
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
              <p className="text-xs text-slate-500 mt-1">6자 이상의 비밀번호를 입력해주세요</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-start space-x-3 pt-2">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 border-2 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
              />
              <label htmlFor="agreeTerms" className="text-sm text-slate-700 leading-5">
                <span className="text-blue-600 hover:text-blue-700 cursor-pointer">이용약관</span>
                {' '}및{' '}
                <span className="text-blue-600 hover:text-blue-700 cursor-pointer">개인정보처리방침</span>
                에 동의합니다
              </label>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  회원가입 중...
                </span>
              ) : (
                '회원가입'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              이미 계정이 있으신가요?{' '}
              <Link 
                href="/login" 
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}