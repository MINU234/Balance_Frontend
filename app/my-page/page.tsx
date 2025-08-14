"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Share2,
  Eye,
  EyeOff,
  Play,
  Users,
  Search,
  Calendar,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import apiClient from "@/lib/apiClient"
import { useAuth } from '@/context/AuthContext'
import { MyPageStats, GameHistory, QuestionBundle, User } from '@/types/api'


export default function MyPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [myCollections, setMyCollections] = useState<QuestionBundle[]>([]);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [stats, setStats] = useState<MyPageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      loadData();
    } else if (!authLoading && !isAuthenticated) {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, user]);

  const loadData = async () => {
    try {
      setLoading(false);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      setLoading(false);
    }
  };

  const checkAuthAndLoadData_UNUSED = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // 실제 API 호출로 사용자 데이터 로드
      try {
        const userData = await apiClient.getMyProfile();
        setUser(userData);
      } catch (error) {
        // API 실패 시 임시 데이터 사용
        console.warn('프로필 API 실패, 임시 데이터 사용:', error);
        setUser({
          id: 1,
          email: "user@example.com",
          nickname: "밸런스 게이머",
          role: "USER",
          createdAt: "2024-01-01"
        });
      }

      // 내 질문 묶음 로드
      try {
        const bundlesResponse = await apiClient.getMyQuestionBundles(0, 10);
        setMyCollections(bundlesResponse.content);
      } catch (error) {
        // API 실패 시 임시 데이터 사용
        console.warn('질문 묶음 API 실패, 임시 데이터 사용:', error);
        setMyCollections([
          {
            id: 1,
            title: "내가 만든 연애 밸런스",
            description: "연인과 함께 할 수 있는 재미있는 질문들",
            keywords: "연애,가치관",
            isPublic: true,
            questionCount: 12,
            playCount: 234,
            createdAt: "2024-01-15",
          },
          {
            id: 2,
            title: "친구들과 하는 음식 게임",
            description: "음식 취향을 알아보는 질문 모음",
            keywords: "음식,일상",
            isPublic: false,
            questionCount: 18,
            playCount: 156,
            createdAt: "2024-01-10",
          }
        ]);
      }

      // 게임 기록 로드
      try {
        const historyResponse = await apiClient.getMyGameHistory(0, 10);
        setGameHistory(historyResponse.content);
      } catch (error) {
        // API 실패 시 임시 데이터 사용
        console.warn('게임 기록 API 실패, 임시 데이터 사용:', error);
        setGameHistory([
          {
            id: 1,
            bundleTitle: "연인과 함께하는 밸런스 게임",
            playedAt: "2024-01-16",
            matchRate: 85,
            partner: "익명",
          },
          {
            id: 2,
            bundleTitle: "친구들과 즐기는 음식 토론",
            playedAt: "2024-01-14",
            matchRate: 62,
            partner: "익명",
          }
        ]);
      }

    } catch (error) {
      console.error('데이터 로드 실패:', error);
      toast({
        title: "오류 발생",
        description: "데이터를 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePublic = async (id: number) => {
    try {
      const collection = myCollections.find(col => col.id === id);
      if (!collection) return;

      // 실제 API 호출
      await apiClient.updateQuestionBundleVisibility(id, !collection.isPublic);
      
      setMyCollections(prev => 
        prev.map(col => 
          col.id === id ? { ...col, isPublic: !col.isPublic } : col
        )
      );
      
      toast({
        title: "설정 변경 완료",
        description: "공개 설정이 변경되었습니다.",
      });
    } catch (error) {
      console.error('공개 설정 변경 실패:', error);
      toast({
        title: "오류 발생",
        description: "설정 변경에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const deleteCollection = async (id: number) => {
    if (!confirm("정말로 이 질문 묶음을 삭제하시겠습니까?")) {
      return;
    }

    try {
      // 실제 API 호출
      await apiClient.deleteQuestionBundle(id);
      
      setMyCollections(prev => prev.filter(col => col.id !== id));
      
      toast({
        title: "삭제 완료",
        description: "질문 묶음이 삭제되었습니다.",
      });
    } catch (error) {
      console.error('삭제 실패:', error);
      toast({
        title: "오류 발생",
        description: "삭제에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
        {/* 배경 장식 요소들 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl float-animation"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-transparent border-t-purple-500 border-r-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-700 text-lg font-medium">마이페이지 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
        {/* 배경 장식 요소들 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl float-animation"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <Card className="w-full max-w-md relative z-10 bg-white/90 backdrop-blur-md border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">로그인이 필요합니다</h2>
            <p className="text-slate-600 mb-6 text-lg">마이페이지를 이용하려면 로그인해주세요.</p>
            <Button asChild className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <Link href="/login">로그인하기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayStats = {
    totalCollections: myCollections.length,
    totalQuestions: myCollections.reduce((sum, col) => sum + col.questionCount, 0),
    totalPlays: myCollections.reduce((sum, col) => sum + (col.playCount || 0), 0),
    avgMatchRate: 0, // 임시로 0 설정
  };

  const filteredCollections = myCollections.filter(collection =>
    collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl float-animation"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-purple-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  홈으로
                </Link>
              </Button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">마이페이지</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                <Link href="/create">
                  <Plus className="w-4 h-4 mr-2" />새 묶음 만들기
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-md shadow-2xl border-0">
              <CardContent className="p-6 text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {user.nickname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mb-2 text-slate-800">{user.nickname}</h2>
                <p className="text-slate-600 text-sm mb-4">{user.email}</p>
                <div className="text-xs text-slate-500 mb-6">
                  가입일: {new Date(user.createdAt).toLocaleDateString()}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{displayStats.totalCollections}</div>
                    <div className="text-xs text-slate-600">내 묶음</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{displayStats.totalQuestions}</div>
                    <div className="text-xs text-slate-600">총 질문</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{displayStats.totalPlays}</div>
                    <div className="text-xs text-slate-600">총 플레이</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{displayStats.avgMatchRate}%</div>
                    <div className="text-xs text-slate-600">평균 일치율</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="collections" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm">
                <TabsTrigger value="collections">내 질문 묶음</TabsTrigger>
                <TabsTrigger value="history">게임 기록</TabsTrigger>
              </TabsList>

              <TabsContent value="collections" className="mt-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">내 질문 묶음</h3>
                    <p className="text-sm text-slate-600">내가 만든 질문 묶음을 관리하세요</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="묶음 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64 bg-white/70 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {filteredCollections.map((collection) => (
                    <Card key={collection.id} className="bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border border-slate-200/50 hover:border-slate-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2 text-slate-800">{collection.title}</CardTitle>
                            <CardDescription className="text-slate-600">{collection.description}</CardDescription>
                          </div>
                          <div className="flex items-center space-x-1">
                            {collection.isPublic ? (
                              <Eye className="w-4 h-4 text-green-600" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>
                        {collection.keywords && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {collection.keywords.split(',').map((keyword, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                                #{keyword.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Play className="w-4 h-4 mr-1" />
                              {collection.playCount || 0}
                            </span>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {collection.questionCount}문항
                            </span>
                          </div>
                          <span className="text-xs">{new Date(collection.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/edit/${collection.id}`}>
                              <Edit className="w-3 h-3 mr-1" />
                              편집
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => togglePublic(collection.id)}>
                            {collection.isPublic ? (
                              <EyeOff className="w-3 h-3 mr-1" />
                            ) : (
                              <Eye className="w-3 h-3 mr-1" />
                            )}
                            {collection.isPublic ? "비공개" : "공개"}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="w-3 h-3 mr-1" />
                            공유
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => deleteCollection(collection.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredCollections.length === 0 && (
                  <Card className="bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <Plus className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-slate-800">아직 만든 질문 묶음이 없어요</h3>
                      <p className="text-slate-600 mb-4">나만의 밸런스 게임을 만들어보세요!</p>
                      <Button asChild>
                        <Link href="/create">
                          <Plus className="w-4 h-4 mr-2" />
                          첫 번째 묶음 만들기
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">게임 기록</h3>
                  <p className="text-sm text-slate-600">최근 플레이한 게임들을 확인하세요</p>
                </div>

                <div className="space-y-4">
                  {gameHistory.map((game) => (
                    <Card key={game.id} className="bg-white/70 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1 text-slate-800">{game.bundleTitle}</h4>
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(game.playedAt).toLocaleDateString()}
                              </span>
                              <span>상대: {game.partner}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600 mb-1">{game.matchRate}%</div>
                            <div className="text-xs text-slate-500">일치율</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {gameHistory.length === 0 && (
                  <Card className="bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-slate-800">아직 플레이한 게임이 없어요</h3>
                      <p className="text-slate-600 mb-4">다양한 밸런스 게임을 플레이하고 기록을 확인해보세요</p>
                      <Button asChild>
                        <Link href="/explore">게임 찾아보기</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
