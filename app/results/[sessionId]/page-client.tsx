'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Share, 
  Copy, 
  Trophy, 
  Play, 
  Search,
  CheckCircle,
  Home,
  X
} from 'lucide-react';
import { GameResult, GameComparison } from '@/types/api';
import apiClient from '@/lib/simpleApiClient';
import { toast } from '@/hooks/use-toast';

interface Props {
  params: { sessionId: string }
}

// 유틸리티 함수들
const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  return error?.message || '알 수 없는 오류가 발생했습니다.';
};

const getMatchRateColor = (rate: number): string => {
  if (rate >= 80) return 'text-green-600';
  if (rate >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getMatchRateMessage = (rate: number): string => {
  if (rate >= 90) return '놀라운 일치율! 정말 통하는 사이네요! 🎉';
  if (rate >= 80) return '높은 일치율! 비슷한 취향이군요! 😊';
  if (rate >= 60) return '적당한 일치율! 서로 다른 매력이 있어요! 🤔';
  if (rate >= 40) return '다른 관점을 가지고 있네요! 흥미로워요! 🤨';
  return '정반대의 취향! 서로에게 배울 점이 많겠어요! 😮';
};

const isValidShareCode = (code: string): boolean => {
  return /^[A-Z0-9]{8}$/.test(code);
};

export default function ResultsPageClient({ params }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId;
  const compareSessionId = searchParams.get('compare');
  
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [comparison, setComparison] = useState<GameComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [shareCode, setShareCode] = useState<string>('');
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    loadGameResult();
  }, [sessionId]);

  useEffect(() => {
    if (compareSessionId && gameResult) {
      compareWithSession();
    }
  }, [compareSessionId, gameResult]);

  const loadGameResult = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.getGameResults(Number(sessionId));
      
      if (response.success && response.data) {
        setGameResult(response.data);
      } else {
        setError(response.message || '게임 결과를 불러올 수 없습니다.');
      }
    } catch (error: any) {
      console.error('게임 결과 로드 실패:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const compareWithSession = async () => {
    if (!gameResult?.shareCode || !compareSessionId) return;

    try {
      setComparing(true);
      
      const response = await apiClient.compareResults(
        gameResult.shareCode, 
        Number(compareSessionId)
      );
      
      if (response.success && response.data) {
        setComparison(response.data);
      } else {
        toast({
          title: "비교 실패",
          description: response.message || "결과 비교를 할 수 없습니다.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('결과 비교 실패:', error);
      toast({
        title: "비교 실패",
        description: getErrorMessage(error),
        variant: "destructive"
      });
    } finally {
      setComparing(false);
    }
  };

  const handleCompareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shareCode.trim()) {
      toast({
        title: "공유 코드 입력",
        description: "비교할 공유 코드를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidShareCode(shareCode.trim().toUpperCase())) {
      toast({
        title: "잘못된 형식",
        description: "공유 코드는 8자리 영문 대문자와 숫자 조합이어야 합니다.",
        variant: "destructive"
      });
      return;
    }

    try {
      setComparing(true);
      
      const response = await apiClient.validateShareCode(shareCode.trim().toUpperCase());
      
      if (response.success && response.data) {
        // 유효한 공유 코드인 경우 비교 수행
        if (gameResult?.shareCode) {
          const compareResponse = await apiClient.compareResults(
            gameResult.shareCode, 
            Number(sessionId) // 현재 세션과 비교
          );
          
          if (compareResponse.success && compareResponse.data) {
            setComparison(compareResponse.data);
          }
        }
      } else {
        toast({
          title: "공유 코드 오류",
          description: "존재하지 않는 공유 코드입니다.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('공유 코드 검증 실패:', error);
      toast({
        title: "검증 실패",
        description: getErrorMessage(error),
        variant: "destructive"
      });
    } finally {
      setComparing(false);
    }
  };

  const copyShareLink = () => {
    if (gameResult?.shareCode) {
      const shareUrl = `${window.location.origin}/play/share/${gameResult.shareCode}`;
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "링크 복사됨",
        description: "공유 링크가 클립보드에 복사되었습니다."
      });
    }
  };

  const copyShareCode = () => {
    if (gameResult?.shareCode) {
      navigator.clipboard.writeText(gameResult.shareCode);
      toast({
        title: "코드 복사됨", 
        description: "공유 코드가 클립보드에 복사되었습니다."
      });
    }
  };

  const clearComparison = () => {
    setComparison(null);
    setShareCode('');
    // URL에서 compare 파라미터 제거
    const newUrl = window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mb-6" />
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              {[1, 2, 3].map((i) => (
                <div key={i} className="mb-6 last:mb-0">
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardContent className="py-12">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                결과를 불러올 수 없습니다
              </h1>
              <p className="text-gray-600 mb-6">{error}</p>
              
              <div className="space-y-3">
                <Link href="/explore">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Search className="w-5 h-5 mr-2" />
                    다른 게임 둘러보기
                  </Button>
                </Link>
                
                <Link href="/">
                  <Button variant="outline">
                    <Home className="w-5 h-5 mr-2" />
                    홈으로 가기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!gameResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardContent className="py-12">
              <p className="text-gray-600">게임 결과가 없습니다.</p>
              <Link href="/explore">
                <Button className="mt-4">
                  다른 게임 둘러보기
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-yellow-500 mr-2" />
            게임 결과
          </h1>
          <p className="text-gray-600">
            당신의 선택과 결과를 확인하고 친구들과 비교해보세요!
          </p>
        </div>

        {/* 결과 요약 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900">게임 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">게임 제목:</span>
                  <p className="font-semibold text-gray-900">
                    {gameResult.session?.questionBundle?.title || '밸런스 게임'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">답변한 질문:</span>
                  <p className="font-semibold text-gray-900">
                    {gameResult.session?.questions?.length || 0}개
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">플레이 시간:</span>
                  <p className="font-semibold text-gray-900">
                    {gameResult.completedAt ? new Date(gameResult.completedAt).toLocaleString() : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900 flex items-center">
                <Share className="w-5 h-5 mr-2" />
                결과 공유
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="shareCode" className="text-sm text-gray-600">
                    공유 코드
                  </Label>
                  <div className="flex mt-1">
                    <Input
                      id="shareCode"
                      value={gameResult.shareCode || ''}
                      readOnly
                      className="bg-gray-50 font-mono text-center"
                    />
                    <Button
                      onClick={copyShareCode}
                      variant="outline"
                      size="sm"
                      className="ml-2 shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={copyShareLink}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  size="sm"
                >
                  <Share className="w-4 h-4 mr-2" />
                  공유 링크 복사
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 결과 비교 */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">
              친구와 비교하기
            </CardTitle>
            <CardDescription>
              친구의 공유 코드를 입력하면 얼마나 취향이 비슷한지 알 수 있어요!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!comparison ? (
              <form onSubmit={handleCompareSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="compareCode" className="text-sm text-gray-600">
                      친구의 공유 코드
                    </Label>
                    <Input
                      id="compareCode"
                      placeholder="예: ABC12345"
                      value={shareCode}
                      onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                      className="mt-1 font-mono"
                      maxLength={8}
                    />
                  </div>
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={comparing || !shareCode.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {comparing ? '비교 중...' : '비교하기'}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* 비교 결과 헤더 */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    비교 결과
                  </h3>
                  <Button
                    onClick={clearComparison}
                    variant="outline"
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-1" />
                    닫기
                  </Button>
                </div>

                {/* 일치율 표시 */}
                <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                  <div className={`text-4xl font-bold mb-2 ${getMatchRateColor(comparison.matchRate)}`}>
                    {comparison.matchRate.toFixed(1)}%
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">일치율</p>
                  <p className="text-gray-600">{getMatchRateMessage(comparison.matchRate)}</p>
                </div>

                {/* 상세 비교 */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">질문별 비교 결과</h4>
                  <div className="space-y-4">
                    {comparison.detailedComparison?.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">
                            {item.question?.questionText || `질문 ${index + 1}`}
                          </h5>
                          {item.isMatch ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="p-3 bg-blue-50 rounded">
                            <span className="font-medium text-blue-700">내 선택:</span>
                            <p className="text-gray-900 mt-1">
                              {item.userChoice === 'A' 
                                ? item.question?.optionAText 
                                : item.question?.optionBText}
                            </p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded">
                            <span className="font-medium text-purple-700">친구 선택:</span>
                            <p className="text-gray-900 mt-1">
                              {item.friendChoice === 'A'
                                ? item.question?.optionAText
                                : item.question?.optionBText}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 상세 결과 */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">
              상세 결과
            </CardTitle>
            <CardDescription>
              각 질문에 대한 당신의 선택을 확인해보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {gameResult.answers?.map((answer, index) => (
              <div key={answer.question?.id || index} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                <h4 className="font-semibold text-gray-900 mb-4">
                  질문 {index + 1}: {answer.question?.questionText}
                </h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* 선택지 A */}
                  <div className={`p-4 rounded-lg border-2 ${
                    answer.selectedOption === 'A' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                        answer.selectedOption === 'A'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        A
                      </div>
                      <span className="font-medium text-gray-900">
                        {answer.question?.optionAText}
                      </span>
                      {answer.selectedOption === 'A' && (
                        <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                      )}
                    </div>
                    {answer.question?.optionAImageUrl && (
                      <img
                        src={answer.question.optionAImageUrl}
                        alt="Option A"
                        className="w-full h-24 object-cover rounded mt-2"
                      />
                    )}
                  </div>

                  {/* 선택지 B */}
                  <div className={`p-4 rounded-lg border-2 ${
                    answer.selectedOption === 'B'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                        answer.selectedOption === 'B'
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        B
                      </div>
                      <span className="font-medium text-gray-900">
                        {answer.question?.optionBText}
                      </span>
                      {answer.selectedOption === 'B' && (
                        <CheckCircle className="w-5 h-5 text-pink-500 ml-auto" />
                      )}
                    </div>
                    {answer.question?.optionBImageUrl && (
                      <img
                        src={answer.question.optionBImageUrl}
                        alt="Option B"
                        className="w-full h-24 object-cover rounded mt-2"
                      />
                    )}
                  </div>
                </div>

                {/* 키워드 표시 */}
                {answer.question?.keywords && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">관련 태그:</p>
                    <div className="flex flex-wrap gap-2">
                      {answer.question.keywords.split(',').map((keyword, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className="bg-purple-100 text-purple-700"
                        >
                          {keyword.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link href="/explore" className="flex-1">
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              size="lg"
            >
              <Search className="w-5 h-5 mr-2" />
              다른 게임 둘러보기
            </Button>
          </Link>
          
          <Link href="/" className="flex-1">
            <Button 
              variant="outline"
              className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              홈으로 가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}