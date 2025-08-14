import { User } from '@/types/api';

// 임시 사용자 ID 생성
export const generateTempUserId = (): string => {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 공유 코드 유효성 검사
export const isValidShareCode = (shareCode: string): boolean => {
  return /^[A-Z0-9]{8}$/.test(shareCode);
};

// 일치율 계산 및 색상 반환
export const getMatchRateColor = (matchRate: number): string => {
  if (matchRate >= 80) return 'text-green-600';
  if (matchRate >= 60) return 'text-yellow-600';
  if (matchRate >= 40) return 'text-orange-600';
  return 'text-red-600';
};

// 일치율 메시지 반환
export const getMatchRateMessage = (matchRate: number): string => {
  if (matchRate >= 90) return '완벽한 케미! 🔥';
  if (matchRate >= 80) return '찰떡궁합이네요! 💕';
  if (matchRate >= 70) return '꽤 잘 맞아요! 😊';
  if (matchRate >= 60) return '어느 정도 비슷해요 👍';
  if (matchRate >= 50) return '반반이네요 🤔';
  if (matchRate >= 30) return '좀 다른 스타일? 😅';
  return '완전 정반대! 🤯';
};

// 사용자 표시명 생성
export const getUserDisplayName = (user: User | null, tempUserId?: string): string => {
  if (user) {
    return user.nickname;
  }
  if (tempUserId) {
    return `게스트_${tempUserId.slice(-4).toUpperCase()}`;
  }
  return '익명의 사용자';
};

// 날짜 포맷팅
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return '오늘';
  if (diffDays === 2) return '어제';
  if (diffDays <= 7) return `${diffDays - 1}일 전`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)}주 전`;
  if (diffDays <= 365) return `${Math.floor(diffDays / 30)}달 전`;
  
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 상대 시간 표시
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  
  return formatDate(dateString);
};

// 번들 플레이 수 포맷팅
export const formatPlayCount = (count: number): string => {
  if (count < 1000) return count.toString();
  if (count < 10000) return `${(count / 1000).toFixed(1)}K`;
  if (count < 1000000) return `${Math.floor(count / 1000)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
};

// 키워드 추출 및 정리
export const extractKeywords = (text: string): string[] => {
  return text
    .split(/[,\s#]+/)
    .map(keyword => keyword.trim())
    .filter(keyword => keyword.length > 0 && keyword.length <= 20)
    .slice(0, 5); // 최대 5개까지
};

// 로컬 스토리지 헬퍼
export const storage = {
  get: (key: string): any => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: any): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // 저장 실패 시 무시
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};

// 에러 메시지 추출
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return '알 수 없는 오류가 발생했습니다.';
};

// 임시 답변 저장 (로컬 스토리지 활용)
export const saveTemporaryAnswer = (sessionId: number, questionId: number, answer: 'A' | 'B') => {
  const key = `temp_answers_${sessionId}`;
  const answers = storage.get(key) || {};
  answers[questionId] = answer;
  storage.set(key, answers);
};

export const getTemporaryAnswers = (sessionId: number): Record<number, 'A' | 'B'> => {
  const key = `temp_answers_${sessionId}`;
  return storage.get(key) || {};
};

export const clearTemporaryAnswers = (sessionId: number) => {
  const key = `temp_answers_${sessionId}`;
  storage.remove(key);
};

// 진행률 계산
export const calculateProgress = (answered: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((answered / total) * 100);
};
