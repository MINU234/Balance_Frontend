'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {
    Play,
    Share,
    Trophy,
    Users,
    Star,
    ArrowRight,
    Sparkles,
    Crown,
    Flame,
    Clock,
    CheckCircle,
    Gift,
    Coffee,
    Heart
} from 'lucide-react';
import {QuestionBundle} from '@/types/api';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';

// 유틸리티 함수들
const formatPlayCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
};

export default function HomePage() {
    const [popularBundles, setPopularBundles] = useState<QuestionBundle[]>([]);
    const [loading, setLoading] = useState(true);
    const [shareCode, setShareCode] = useState('');
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // 빌드 시에는 API 호출을 건너뛰기
        if (process.env.SKIP_BUILD_STATIC_GENERATION === 'true') {
            setLoading(false);
            return;
        }
        loadPopularBundles();
    }, []);

    const loadPopularBundles = async () => {
        try {
            const response = await apiClient.getPopularBundles(0, 6);
            if (response.success && response.data && response.data.content) {
                setPopularBundles(response.data.content);
            } else {
                setPopularBundles([]);
            }
        } catch (error) {
            console.error('인기 게임 로드 실패:', error);
            setPopularBundles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleShareCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (shareCode.trim()) {
            window.location.href = `/play/share/${shareCode.trim().toUpperCase()}`;
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* 배경 장식 요소들 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl float-animation"></div>
                <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '4s' }}></div>
                <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-violet-400/30 to-purple-400/30 rounded-full blur-2xl float-animation" style={{ animationDelay: '1s' }}></div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                {/* 히어로 섹션 */}
                <section className="text-center py-20">
                    <div className="mb-12">
                        <div className="mb-6">
                            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                                ✨ 친구들과 함께하는 재미있는 선택
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-slate-900 via-purple-800 to-blue-800 bg-clip-text text-transparent mb-8 leading-tight">
                            밸런스 게임
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-8">
                            <span className="font-medium text-purple-700">어려운 선택의 순간</span>, 당신은 무엇을 고를까요?<br/>
                            친구들과 함께 선택을 공유하고 <span className="font-medium text-blue-700">취향을 비교</span>해보세요!
                        </p>
                        <div className="flex justify-center items-center gap-8 text-sm text-slate-500 mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>실시간 게임</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span>8자리 공유코드</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                <span>일치율 분석</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link
                            href="/explore"
                            className="group bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 flex items-center gap-3 pulse-glow"
                        >
                            <Play className="h-6 w-6 group-hover:scale-125 transition-transform"/>
                            게임 시작하기
                        </Link>

                        {isAuthenticated && (
                            <Link
                                href="/create"
                                className="group border-2 border-purple-200 bg-white/80 backdrop-blur-sm text-purple-700 px-10 py-4 rounded-2xl text-lg font-semibold hover:border-purple-300 hover:bg-purple-50 hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-3"
                            >
                                <Sparkles className="h-6 w-6 group-hover:scale-125 transition-transform"/>
                                게임 만들기
                            </Link>
                        )}
                    </div>
                </section>

                {/* 공유 코드 입력 */}
                <section className="max-w-md mx-auto mb-20">
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden">
                        {/* 배경 장식 */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-2xl"></div>
                        
                        <div className="text-center mb-8 relative z-10">
                            <div
                                className="w-16 h-16 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Share className="h-8 w-8 text-white"/>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">
                                공유 코드로 참여하기
                            </h3>
                            <p className="text-slate-600">
                                친구가 보낸 <span className="font-semibold text-purple-600">8자리 공유 코드</span>를 입력하세요
                            </p>
                        </div>

                        <form onSubmit={handleShareCodeSubmit} className="space-y-6 relative z-10">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="ABC12345"
                                    value={shareCode}
                                    onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                                    className="w-full text-center text-2xl font-mono border-2 border-purple-200 rounded-2xl px-6 py-4 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all bg-white/80 backdrop-blur-sm shadow-inner"
                                    maxLength={8}
                                />
                                {shareCode.length === 8 && (
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                            <CheckCircle className="h-4 w-4 text-white"/>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={shareCode.length !== 8}
                                className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <Play className="h-5 w-5"/>
                                    게임 참여하기
                                </span>
                            </button>
                        </form>
                    </div>
                </section>

                {/* 기능 소개 */}
                <section className="grid md:grid-cols-3 gap-8 mb-20">
                    <div className="text-center p-6">
                        <div
                            className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Play className="h-8 w-8 text-white"/>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-3">간편한 게임</h3>
                        <p className="text-slate-600 leading-relaxed">
                            복잡한 룰 없이 A 또는 B 중 하나만 선택하면 끝!
                        </p>
                    </div>

                    <div className="text-center p-6">
                        <div
                            className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Share className="h-8 w-8 text-white"/>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-3">결과 공유</h3>
                        <p className="text-slate-600 leading-relaxed">
                            8자리 공유 코드로 친구들과 결과를 비교해보세요
                        </p>
                    </div>

                    <div className="text-center p-6">
                        <div
                            className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Trophy className="h-8 w-8 text-white"/>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-3">일치율 확인</h3>
                        <p className="text-slate-600 leading-relaxed">
                            친구와 얼마나 <span className="font-semibold text-purple-600">비슷한 취향</span>인지 확인할 수 있어요.<br/>
                            의외의 결과에 놀랄지도!
                        </p>
                        <div className="mt-4 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-500"/>
                        </div>
                    </div>
                </section>

                {/* 인기 게임 */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                                <Crown className="h-8 w-8 text-yellow-500"/>
                                인기 게임
                                <Flame className="h-6 w-6 text-orange-500 animate-pulse"/>
                            </h2>
                            <p className="text-slate-600 mt-2 flex items-center gap-2">
                                <Clock className="h-4 w-4"/>
                                지금 가장 많이 플레이되는 밸런스 게임들
                            </p>
                        </div>
                        <Link
                            href="/explore"
                            className="group text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 border border-blue-200 hover:border-blue-300"
                        >
                            더보기
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform"/>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({length: 6}).map((_, i) => (
                                <div key={i}
                                     className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 animate-pulse border border-slate-200/50">
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
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {popularBundles.map((bundle, index) => (
                                <div key={bundle.id}
                                     className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-slate-200/50 hover:border-slate-300 transform hover:scale-105">
                                    <div className="mb-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 group-hover:text-slate-900 transition-colors">
                                                {bundle.title}
                                            </h3>
                                            {index < 3 && (
                                                <div className="flex-shrink-0 ml-2">
                          <span
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800">
                            🏆 #{index + 1}
                          </span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-slate-600 text-sm line-clamp-2 group-hover:text-slate-700 transition-colors">
                                            {bundle.description || '재미있는 밸런스 게임입니다.'}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4 text-blue-500"/>
                                            <span
                                                className="font-medium">{formatPlayCount(bundle.playCount || 0)}명</span>
                                        </div>
                                        <span
                                            className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      📝 {bundle.questionCount}문제
                    </span>
                                    </div>

                                    {bundle.keywords && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {bundle.keywords.split(',').slice(0, 3).map((keyword, idx) => (
                                                <span key={idx}
                                                      className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">
                          #{keyword.trim()}
                        </span>
                                            ))}
                                        </div>
                                    )}

                                    <Link
                                        href={`/play/${bundle.id}`}
                                        className="flex w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 items-center justify-center gap-2"
                                    >
                                        <Play className="h-4 w-4"/>
                                        게임 시작
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* 회원가입 CTA */}
                {!isAuthenticated && (
                    <section className="mt-20 text-center">
                        <div
                            className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-3xl p-12 text-white shadow-2xl">
                            {/* 배경 장식 */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-5 left-5 w-20 h-20 bg-white rounded-full blur-xl"></div>
                                <div
                                    className="absolute bottom-5 right-5 w-32 h-32 bg-white rounded-full blur-xl"></div>
                                <div
                                    className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full blur-xl"></div>
                            </div>

                            <div className="relative z-10">
                                <div
                                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium text-sm mb-6">
                                    <Gift className="h-4 w-4"/>
                                    특별한 혜택이 기다려요!
                                </div>

                                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                    더 많은 기능을 이용해보세요!
                                </h2>
                                <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
                                    회원가입하고 <span className="font-semibold">나만의 밸런스 게임</span>을 만들어보세요.<br/>
                                    게임 기록도 저장하고 친구들과 더 재미있게 즐길 수 있어요.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/signup"
                                        className="group bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform"/>
                                        회원가입하기
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        <Coffee className="h-4 w-4"/>
                                        로그인
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {/* 푸터 */}
            <footer className="bg-slate-900 text-white py-12 mt-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <div
                                    className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                                        <div
                                            className="w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-sm"></div>
                                    </div>
                                </div>
                                <span className="text-lg font-bold">밸런스 게임</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                선택의 재미를 친구들과 함께 나누는<br/>
                                최고의 밸런스 게임 플랫폼입니다.
                            </p>
                            <div className="flex space-x-4">
                                <div
                                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                                    <span className="text-xl">📧</span>
                                </div>
                                <div
                                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                                    <span className="text-xl">🐦</span>
                                </div>
                                <div
                                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                                    <span className="text-xl">📱</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4 text-white">서비스</h3>
                            <ul className="space-y-2 text-slate-400">
                                <li><Link href="/explore" className="hover:text-white transition-colors">게임 둘러보기</Link>
                                </li>
                                <li><Link href="/create" className="hover:text-white transition-colors">게임 만들기</Link>
                                </li>
                                <li><Link href="/my-page" className="hover:text-white transition-colors">마이페이지</Link>
                                </li>
                                <li><a href="#" className="hover:text-white transition-colors">인기 게임</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4 text-white">지원</h3>
                            <ul className="space-y-2 text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors">고객센터</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">자주묻는질문</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">이용약관</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">개인정보처리방침</a></li>
                            </ul>
                        </div>
                    </div>

                    <div
                        className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-slate-400 text-sm">
                            &copy; 2024 밸런스 게임. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <span className="text-slate-500 text-sm">Made with</span>
                            <Heart className="h-4 w-4 text-red-500 animate-pulse"/>
                            <span className="text-slate-500 text-sm">in Korea</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
