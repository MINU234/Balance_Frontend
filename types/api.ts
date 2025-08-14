// API 표준 응답 형태
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
  timestamp: string;
}

// 사용자 관련 타입
export interface User {
  id: number;
  email: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
  provider?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Question {
  id: number;
  text: string;
  optionAText: string;
  optionBText: string;
  optionAImageUrl?: string;
  optionBImageUrl?: string;
  keyword?: string;
  isActive: boolean;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  creator: User;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionBundle {
  id: number;
  title: string;
  description?: string;
  keywords?: string;
  isPublic: boolean;
  creator: User;
  questions: Question[];
  questionCount: number;
  playCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface GameSession {
  sessionId: number;
  bundleId: number;
  bundleTitle: string;
  shareCode?: string;
  tempUserId?: string;
  totalQuestions: number;
  currentQuestionIndex: number;
  currentQuestion?: {
    id: number;
    text: string;
    optionAText: string;
    optionBText: string;
    optionAImageUrl?: string;
    optionBImageUrl?: string;
  };
  isGameComplete?: boolean;
  nextQuestion?: {
    id: number;
    text: string;
    optionAText: string;
    optionBText: string;
    optionAImageUrl?: string;
    optionBImageUrl?: string;
  };
}

export interface UserAnswer {
  answerId: number;
  questionId: number;
  selectedOption: 'A' | 'B';
  answeredAt: string;
}

export interface GameResult {
  sessionId: number;
  shareCode: string;
  expiresAt: string;
  results: {
    totalQuestions: number;
    answers: Array<{
      questionId: number;
      questionText: string;
      selectedOption: 'A' | 'B';
      selectedText: string;
    }>;
  };
}

export interface GameComparison {
  shareCode: string;
  originalSession: {
    sessionId: number;
    completedAt: string;
  };
  compareSession: {
    sessionId: number;
    completedAt: string;
  };
  comparison: {
    matchPercentage: number;
    totalQuestions: number;
    matchedAnswers: number;
    questionComparisons: Array<{
      questionId: number;
      questionText: string;
      originalAnswer: 'A' | 'B';
      compareAnswer: 'A' | 'B';
      isMatch: boolean;
    }>;
  };
}

// 마이페이지 관련 타입
export interface MyPageStats {
  totalGamesPlayed: number;
  totalQuestionsCreated: number;
  totalBundlesCreated: number;
  approvedQuestions: number;
  pendingQuestions: number;
  rejectedQuestions: number;
  mostPlayedKeyword?: string;
  averageMatchPercentage?: number;
}

export interface QuestionStats {
  questionId: number;
  statistics: {
    optionACount: number;
    optionBCount: number;
    totalCount: number;
  };
}

export interface GameHistory {
  sessionId: number;
  bundleTitle: string;
  completedAt: string;
  shareCode?: string;
  matchPercentage?: number;
}

// 요청 DTO 타입들
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface StartGameRequest {
  bundleId: number;
  userEmail?: string;
  tempUserId?: string;
  shareCode?: string;
}

export interface AnswerRequest {
  sessionId: number;
  questionId: number;
  selectedOption: string;
}

export interface QuestionCreateRequest {
  text: string;
  optionAText: string;
  optionBText: string;
  optionAImageUrl?: string;
  optionBImageUrl?: string;
  keyword?: string;
}

export interface QuestionBundleCreateRequest {
  title: string;
  description?: string;
  questionIds: number[];
  isPublic: boolean;
}

// 관리자 관련 타입들
export interface AdminDashboardStats {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  dailyStats: DailyStats[];
  keywordStats: KeywordStats[];
  adminActivityStats: AdminActivityStats[];
}

export interface DailyStats {
  date: string;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface KeywordStats {
  keyword: string;
  count: number;
}

export interface AdminActivityStats {
  adminName: string;
  approvedCount: number;
  rejectedCount: number;
  lastActivityDate?: string;
}

export interface QuestionApprovalRequest {
  questionId: number;
}

export interface QuestionRejectRequest {
  questionId: number;
  reason: string;
}

// 페이징 응답
export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    page: number;
    size: number;
    sort?: string;
  };
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
