'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  TrendingUp, 
  Clock, 
  Users, 
  Star,
  Play,
  ArrowLeft
} from 'lucide-react';
import { QuestionBundle } from '@/types/api';
import apiClient from '@/lib/simpleApiClient';
import { toast } from '@/hooks/use-toast';

// 유틸리티 함수들
const formatPlayCount = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)}주 전`;
  return `${Math.ceil(diffDays / 30)}개월 전`;
};

const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  return error?.message || '알 수 없는 오류가 발생했습니다.';
};

// 간단한 debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ExplorePage() {
  const [popularBundles, setPopularBundles] = useState<QuestionBundle[]>([]);
  const [recentBundles, setRecentBundles] = useState<QuestionBundle[]>([]);
  const [searchResults, setSearchResults] = useState<QuestionBundle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState({
    popular: true,
    recent: true,
    search: false,
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    loadPopularBundles();
    loadRecentBundles();
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      searchBundles(debouncedSearchQuery.trim());
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  const loadPopularBundles = async () => {
    try {
      setLoading(prev => ({ ...prev, popular: true }));
      const response = await apiClient.getPopularBundles(0, 12);
      setPopularBundles(response.content);
    } catch (error) {
      console.error('인기 게임 로드 실패:', error);
    } finally {
      setLoading(prev => ({ ...prev, popular: false }));
    }
  };

  const loadRecentBundles = async () => {
    try {
      setLoading(prev => ({ ...prev, recent: true }));
      const response = await apiClient.getQuestionBundles(0, 12);
      setRecentBundles(response.content);
    } catch (error) {
      console.error('최신 게임 로드 실패:', error);
    } finally {
      setLoading(prev => ({ ...prev, recent: false }));
    }
  };

  const searchBundles = async (keyword: string) => {
    try {
      setLoading(prev => ({ ...prev, search: true }));
      const response = await apiClient.getQuestionBundles(0, 12, keyword);
      setSearchResults(response.content);
    } catch (error) {
      console.error('검색 실패:', error);
    } finally {
      setLoading(prev => ({ ...prev, search: false }));
    }
  };

  const BundleGrid = ({ 
    bundles, 
    loading: isLoading, 
    emptyMessage 
  }: {
    bundles: QuestionBundle[];
    loading: boolean;
    emptyMessage: string;
  }) => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((bundle) => (
          <div key={bundle.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 border border-slate-100 group">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {bundle.title}
              </h3>
              <p className="text-slate-600 text-sm line-clamp-2">
                {bundle.description || '재미있는 밸런스 게임입니다.'}
              </p>
            </div>
            
            <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{formatPlayCount(bundle.playCount || 0)}명</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDate(bundle.createdAt)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="bg-slate-100 px-2 py-1 rounded-lg text-xs font-medium">
                {bundle.questionCount}문제
              </span>
              <span className="text-xs text-slate-500">
                by {bundle.creator.nickname}
              </span>
            </div>
            
            {bundle.keywords && (
              <div className="flex flex-wrap gap-1 mb-4">
                {bundle.keywords.split(',').slice(0, 3).map((keyword, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs font-medium">
                    #{keyword.trim()}
                  </span>
                ))}
              </div>
            )}
            
            <Link 
              href={`/play/${bundle.id}`}
              className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <Play className="inline h-4 w-4 mr-2" />
              게임 시작
            </Link>
          </div>
        ))}
        
        {/* 로딩 스켈레톤 */}
        {isLoading && Array.from({ length: 6 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="h-6 bg-slate-200 rounded-lg mb-3"></div>
            <div className="h-4 bg-slate-200 rounded-lg mb-4"></div>
            <div className="flex justify-between mb-4">
              <div className="h-4 bg-slate-200 rounded-lg w-20"></div>
              <div className="h-4 bg-slate-200 rounded-lg w-16"></div>
            </div>
            <div className="h-10 bg-slate-200 rounded-lg"></div>
          </div>
        ))}
      </div>
      
      {/* 빈 상태 */}
      {bundles.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">게임을 찾을 수 없습니다</h3>
          <p className="text-slate-600">{emptyMessage}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 네비게이션 */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-slate-600 hover:text-slate-800 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                홈으로
              </Link>
              <h1 className="text-xl font-bold text-slate-800">게임 둘러보기</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                로그인
              </Link>
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">게임 둘러보기</h1>
          <p className="text-slate-600">다양한 밸런스 게임을 찾아보세요!</p>
        </div>
        
        {/* 검색바 */}
        <div className="max-w-md mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              placeholder="게임 제목이나 키워드로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
            />
            {loading.search && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              </div>
            )}
          </div>
        </div>

        {/* 콘텐츠 */}
        {searchQuery.trim() ? (
          // 검색 결과
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">
              '{searchQuery}' 검색 결과 ({searchResults.length}개)
            </h2>
            <BundleGrid
              bundles={searchResults}
              loading={loading.search}
              emptyMessage="검색 조건에 맞는 게임이 없습니다. 다른 키워드로 시도해보세요."
            />
          </div>
        ) : (
          // 기본 탭 뷰
          <div className="space-y-6">
            <div className="border-b border-slate-200">
              <nav className="-mb-px flex space-x-8">
                <button className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  인기 게임
                </button>
                <button className="border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  최신 게임
                </button>
              </nav>
            </div>
            
            <BundleGrid
              bundles={popularBundles}
              loading={loading.popular}
              emptyMessage="아직 인기 게임이 없습니다."
            />
          </div>
        )}
      </main>
    </div>
  );
}