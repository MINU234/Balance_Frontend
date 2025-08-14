'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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

export default function GameResultsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const sessionId = parseInt(params.sessionId as string);
  const compareWith = searchParams.get('compareWith'); // URL에서 비교할 공유코드
  
  const [results, setResults] = useState<GameResult | null>(null);
  const [comparison, setComparison] = useState<GameComparison | null>(null);
  const [compareCode, setCompareCode] = useState('');
  const [loading, setLoading] = useState({
    results: true,
    compare: false,
  });

  useEffect(() => {
    loadResults();
    
    // compareWith 파라미터가 있으면 자동으로 비교 수행
    if (compareWith) {
      setCompareCode(compareWith);
    }
  }, [sessionId]);

  useEffect(() => {
    // compareWith가 있고 결과가 로드되면 자동 비교
    if (compareWith && results && !comparison) {
      handleCompare(compareWith);
    }
  }, [compareWith, results]);

  const loadResults = async () => {
    try {
      setLoading(prev => ({ ...prev, results: true }));
      const gameResults = await apiClient.getGameResults(sessionId);
      setResults(gameResults);
    } catch (error) {
      toast({
        title: "오류",
        description: getErrorMessage(error),
        variant: "destructive",
      });
      router.push('/explore');
    } finally {
      setLoading(prev => ({ ...prev, results: false }));
    }
  };

  const handleCompare = async (codeToCompare?: string) => {
    const code = codeToCompare || compareCode.trim();
    
    if (!code || !isValidShareCode(code)) {
      toast({
        title: "잘못된 공유 코드",
        description: "8자리 공유 코드를 정확히 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(prev => ({ ...prev, compare: true }));
      const comparisonResult = await apiClient.compareResults(
        code.toUpperCase(), 
        sessionId
      );
      setComparison(comparisonResult);
      
      // 높은 일치율이면 축하 효과
      if (comparisonResult.matchRate >= 80) {
        // 간단한 축하 효과 (confetti가 없으면 토스트로 대체)
        toast({
          title: "놀라운 일치율!",
          description: `${comparisonResult.matchRate.toFixed(1)}% 일치! 🎉`,
        });
      }
    } catch (error) {
      toast({
        title: "비교 실패",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, compare: false }));
    }
  };

  const copyShareCode = async () => {
    if (!results?.shareCode) return;
    
    const shareUrl = `${window.location.origin}/play/share/${results.shareCode}`;
    const shareText = `나와 함께 "${results.bundleTitle}" 밸런스 게임을 해보세요!\n공유 코드: ${results.shareCode}`;
    
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      toast({
        title: "복사 완료!",
        description: "공유 링크가 클립보드에 복사되었습니다.",
      });
    } catch (error) {
      try {
        await navigator.clipboard.writeText(results.shareCode);
        toast({
          title: "복사 완료!",
          description: "공유 코드가 클립보드에 복사되었습니다.",
        });
      } catch (error) {
        toast({
          title: "복사 실패",
          description: "수동으로 복사해주세요.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading.results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold mb-4">결과를 불러올 수 없습니다</h2>
              <Button onClick={() => router.push('/explore')}>
                홈으로 돌아가기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-8 text-white text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">게임 완료!</h1>
            <p className="text-lg opacity-90">"{results.bundleTitle}"</p>
            <Badge variant="secondary" className="mt-3 bg-white/20 text-white border-white/30">
              총 {results.totalQuestions}문제 완료
            </Badge>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 공유하기 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share className="h-5 w-5" />
                친구와 공유하기
              </CardTitle>
              <CardDescription>
                공유 코드를 친구에게 보내서 결과를 비교해보세요!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.shareCode && (
                <div className="space-y-2">
                  <Label>공유 코드</Label>
                  <div className="flex gap-2">
                    <Input
                      value={results.shareCode}
                      readOnly
                      className="font-mono text-lg text-center bg-gray-50"
                    />
                    <Button onClick={copyShareCode} size="icon" variant="outline">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    이 코드는 3일간 유효합니다
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 결과 비교하기 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                결과 비교하기
              </CardTitle>
              <CardDescription>
                친구의 공유 코드를 입력하여 일치율을 확인해보세요!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>친구의 공유 코드</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="예: ABC12345"
                    value={compareCode}
                    onChange={(e) => setCompareCode(e.target.value.toUpperCase())}
                    className="font-mono text-center"
                    maxLength={8}
                  />
                  <Button 
                    onClick={() => handleCompare()}
                    disabled={loading.compare || compareCode.length !== 8}
                  >
                    {loading.compare ? '비교 중...' : '비교하기'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 비교 결과 */}
        {comparison && (
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white text-center">
              <h2 className="text-2xl font-bold mb-2">비교 결과</h2>
              <div className="text-4xl font-bold mb-2">
                {comparison.matchRate.toFixed(1)}%
              </div>
              <p className="text-lg opacity-90">
                {getMatchRateMessage(comparison.matchRate)}
              </p>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div>
                  <div className="text-xl font-bold">{comparison.matchCount}</div>
                  <div className="opacity-75">일치</div>
                </div>
                <div>
                  <div className="text-xl font-bold">{comparison.totalQuestions - comparison.matchCount}</div>
                  <div className="opacity-75">불일치</div>
                </div>
                <div>
                  <div className="text-xl font-bold">{comparison.totalQuestions}</div>
                  <div className="opacity-75">전체</div>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>일치율</span>
                  <span>{comparison.matchRate.toFixed(1)}%</span>
                </div>
                <Progress value={comparison.matchRate} className="h-3" />
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold mb-3">문항별 상세 비교</h3>
                {Object.values(comparison.comparisons).map((comp, index) => (
                  <div
                    key={comp.questionId}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      comp.isMatch ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {comp.isMatch ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-medium">문제 {index + 1}</span>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">나의 선택</div>
                        <div className="font-semibold">{comp.compareChoice}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">친구의 선택</div>
                        <div className="font-semibold">{comp.originalChoice}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/explore" className="gap-2">
              <Play className="h-5 w-5" />
              다른 게임 하기
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/explore" className="gap-2">
              <Home className="h-5 w-5" />
              홈으로 돌아가기
            </Link>
          </Button>
          <Button variant="ghost" size="lg" onClick={() => window.location.reload()}>
            다시 플레이
          </Button>
        </div>
      </div>
    </div>
  );
}