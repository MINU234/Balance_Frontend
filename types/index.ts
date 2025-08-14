export interface User {
  id: number;
  email: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface Question {
  id: number;
  text: string;
  optionAText: string;
  optionBText: string;
  optionAImageUrl?: string;
  optionBImageUrl?: string;
  keyword: string;
  createdBy?: {
    id: number;
    nickname: string;
  };
  statistics?: {
    optionACount: number;
    optionBCount: number;
    totalCount: number;
  };
}

export interface QuestionBundle {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  questionCount: number;
  playCount: number;
  createdBy: {
    id: number;
    nickname: string;
  };
  questions?: Question[];
  createdAt: string;
}

export interface GameSession {
  sessionId: number;
  bundleId: number;
  bundleTitle: string;
  totalQuestions: number;
  currentQuestionIndex: number;
  currentQuestion: Question;
}

export interface GameAnswer {
  questionId: number;
  questionText: string;
  selectedOption: 'A' | 'B';
  selectedText: string;
}

export interface GameResult {
  sessionId: number;
  shareCode: string;
  expiresAt: string;
  results: {
    totalQuestions: number;
    answers: GameAnswer[];
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface ApiError {
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

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    page: number;
    size: number;
    sort: string;
  };
  totalElements: number;
  totalPages: number;
}

export interface UserStats {
  totalGamesPlayed: number;
  totalQuestionsCreated: number;
  totalBundlesCreated: number;
  approvedQuestions: number;
  pendingQuestions: number;
  rejectedQuestions: number;
  mostPlayedKeyword: string;
  averageMatchPercentage: number;
}