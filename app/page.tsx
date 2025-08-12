"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Play, Users, Heart, Coffee, Lightbulb, Star, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

// 1. 필요한 전역 상태 및 API 클라이언트 임포트
import { useAuth } from "@/context/AuthContext"
import apiClient from "@/lib/apiClient"

// 2. 백엔드와 협의된 상세 데이터 타입 정의
interface FeaturedBundle {
  id: number;
  title: string;
  description: string;
  creatorNickname: string;
  playCount: number;
  questionCount: number;
  keywords: string[];
}

interface StatsData {
  totalQuestions: number;
  totalBundles: number;
  totalPlays: number;
  activeUsers: number;
}

export default function HomePage() {
  // 3. 전역 인증 상태 및 로딩 상태 가져오기
  const { isLoggedIn, logout, isLoading: isAuthLoading } = useAuth();

  // 4. 페이지 데이터 상태 관리
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredCollections, setFeaturedCollections] = useState<FeaturedBundle[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // 5. API 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 여러 API를 병렬로 호출하여 로딩 속도 최적화
        const [bundlesResponse, statsResponse] = await Promise.all([
          apiClient.get('/question-bundles/popular?page=0&size=3'), // 인기 묶음 데이터
          apiClient.get('/stats') // 통계 데이터
        ]);

        // 백엔드 명세에 따라 content 필드 접근
        if (bundlesResponse.data?.content) {
          setFeaturedCollections(bundlesResponse.data.content);
        }
        if (statsResponse.data) {
          setStats(statsResponse.data);
        }

      } catch (error) {
        console.error("홈페이지 데이터 로딩 오류:", error);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchData();
  }, []);

  // 6. 로딩 상태 처리 (UI 깜빡임 방지)
  if (isAuthLoading || isDataLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-500 animate-pulse">페이지를 불러오고 있습니다...</p>
        </div>
    );
  }

  // --- 오리지널 디자인을 보존한 JSX 렌더링 ---

  // '인기 키워드'는 시각적 요소가 중요하므로, 우선 디자인을 유지하고 추후 API 연동 가능
  const popularKeywords = [
    { name: "연애", icon: Heart, count: 156, color: "bg-pink-100 text-pink-800" },
    { name: "음식", icon: Coffee, count: 89, color: "bg-orange-100 text-orange-800" },
    { name: "가치관", icon: Lightbulb, count: 234, color: "bg-blue-100 text-blue-800" },
    { name: "일상", icon: Star, count: 67, color: "bg-green-100 text-green-800" },
  ];

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        {/* Header: 로그인 상태에 따라 동적 렌더링 */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  BalanceGame
                </h1>
              </Link>
              <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                    <>
                      <Button variant="ghost" asChild><Link href="/my-page">마이페이지</Link></Button>
                      <Button variant="ghost" asChild><Link href="/create">묶음 만들기</Link></Button>
                      <Button variant="ghost" asChild><Link href="/create-question">질문 만들기</Link></Button>
                      <Button onClick={logout}>로그아웃</Button>
                    </>
                ) : (
                    <>
                      <Button variant="ghost" asChild><Link href="/login">로그인</Link></Button>
                      <Button asChild><Link href="/signup">회원가입</Link></Button>
                    </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              선택의 순간,<br />당신의 마음은?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              다양한 주제의 밸런스 게임으로 친구, 연인, 가족과 함께<br />
              서로의 가치관과 취향을 재미있게 알아보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="키워드나 질문 묶음 검색..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Button size="lg" className="w-full sm:w-auto"><Search className="w-4 h-4 mr-2" />검색</Button>
            </div>
          </div>
        </section>

        {/* Popular Keywords (디자인 보존) */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">인기 키워드</h3>
            <p className="text-gray-600">가장 많이 플레이되는 주제들을 확인해보세요</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularKeywords.map((keyword) => (
                <Card key={keyword.name} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <div className={`w-12 h-12 rounded-full ${keyword.color} mx-auto flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <keyword.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <h4 className="font-semibold mb-1">#{keyword.name}</h4>
                    <p className="text-sm text-gray-500">{keyword.count.toLocaleString()}개 질문</p>
                  </CardContent>
                </Card>
            ))}
          </div>
        </section>

        {/* Featured Collections: API 데이터로 동적 렌더링 */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">추천 질문 묶음</h3>
              <p className="text-gray-600">다른 사용자들이 만든 인기 질문 묶음들</p>
            </div>
            <Button variant="outline" asChild><Link href="/explore">더 보기</Link></Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCollections.map((collection) => (
                <Card key={collection.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg mb-2">{collection.title}</CardTitle>
                    <CardDescription className="text-sm">{collection.description}</CardDescription>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {collection.keywords.map((keyword) => (
                          <Badge key={keyword} variant="secondary" className="text-xs">{keyword}</Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>by {collection.creatorNickname}</span>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center"><Play className="w-4 h-4 mr-1" />{collection.playCount.toLocaleString()}</span>
                        <span className="flex items-center"><Users className="w-4 h-4 mr-1" />{collection.questionCount}문항</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1" asChild>
                        <Link href={`/play/${collection.id}`}><Play className="w-4 h-4 mr-2" />플레이하기</Link>
                      </Button>
                      {isLoggedIn && <Button variant="outline" size="sm">복제</Button>}
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </section>

        {/* Stats Section: API 데이터로 동적 렌더링 */}
        <section className="bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">{stats?.totalQuestions.toLocaleString() ?? '...'}</div>
                <div className="text-gray-600">총 질문 수</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats?.totalBundles.toLocaleString() ?? '...'}</div>
                <div className="text-gray-600">질문 묶음</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">{stats?.totalPlays.toLocaleString() ?? '...'}</div>
                <div className="text-gray-600">총 플레이 수</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">{stats?.activeUsers.toLocaleString() ?? '...'}</div>
                <div className="text-gray-600">활성 사용자</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section: 로그인 상태에 따라 동적 렌더링 */}
        {!isLoggedIn && (
            <section className="container mx-auto px-4 py-16 text-center">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold mb-4">나만의 질문 묶음을 만들어보세요</h3>
                <p className="text-lg text-gray-600 mb-8">회원가입하고 원하는 질문들을 조합해서 친구들과 공유해보세요</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/signup"><TrendingUp className="w-4 h-4 mr-2" />무료로 시작하기</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild><Link href="/explore">둘러보기</Link></Button>
                </div>
              </div>
            </section>
        )}

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">B</span>
                </div>
                <span className="font-bold">BalanceGame</span>
              </div>
              <p className="text-gray-400 text-sm">© 2024 BalanceGame. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
  )
}
