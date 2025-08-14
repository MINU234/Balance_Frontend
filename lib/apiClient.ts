import axios, { AxiosInstance } from 'axios';
import { 
  User, 
  Question, 
  QuestionBundle, 
  GameSession, 
  GameResult, 
  GameComparison,
  LoginRequest, 
  SignupRequest, 
  StartGameRequest, 
  AnswerRequest,
  QuestionCreateRequest,
  QuestionBundleCreateRequest,
  AdminDashboardStats,
  QuestionApprovalRequest,
  QuestionRejectRequest,
  PaginatedResponse,
  QuestionStats,
  ApiResponse,
  MyPageStats,
  GameHistory
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://balance-game-ekedbfhkcxeyc8cb.koreacentral-01.azurewebsites.net/api';

// 디버그 로그
console.log('🔗 API Base URL:', API_BASE_URL);

class ApiClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // 쿠키 포함
      timeout: 10000, // 10초 타임아웃
    });

    // Request interceptor - 요청 로그 추가
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        // 쿠키는 withCredentials: true로 자동 포함됨
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - 응답 로그 추가
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        console.error(`❌ API Error: ${error.response?.status} ${originalRequest?.url}`, error.response?.data);
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // 쿠키 기반 토큰 갱신 시도
          try {
            await this.client.post('/auth/refresh', {}, {
              withCredentials: true
            });
            
            // 갱신 성공 시 원래 요청 재시도 (쿠키가 자동으로 갱신됨)
            return this.client(originalRequest);
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError);
            // 리프레시도 실패하면 로그인 페이지로 리다이렉트
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // 인증 관련 API
  async login(credentials: LoginRequest): Promise<ApiResponse<string>> {
    const response = await this.client.post('/auth/login', credentials);
    return response.data;
  }

  async signup(userData: SignupRequest): Promise<ApiResponse<User>> {
    const response = await this.client.post('/auth/signup', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }

  // 게임 플레이 관련 API
  async startGame(gameData: StartGameRequest): Promise<ApiResponse<GameSession>> {
    const response = await this.client.post('/game/start', gameData);
    return response.data;
  }

  async submitAnswer(answerData: AnswerRequest): Promise<ApiResponse<GameSession>> {
    const response = await this.client.post('/game/answer', answerData);
    return response.data;
  }

  async completeGame(sessionId: number): Promise<ApiResponse<GameResult>> {
    const response = await this.client.post(`/game/sessions/${sessionId}/complete`);
    return response.data;
  }

  async getGameResults(sessionId: number): Promise<ApiResponse<GameResult>> {
    const response = await this.client.get(`/game/sessions/${sessionId}/results`);
    return response.data;
  }

  async getSessionByShareCode(shareCode: string): Promise<ApiResponse<GameSession>> {
    const response = await this.client.get(`/game/share/${shareCode}`);
    return response.data;
  }

  async compareResults(shareCode: string, compareSessionId: number): Promise<ApiResponse<GameComparison>> {
    const response = await this.client.post('/game/compare', null, {
      params: { shareCode, compareSessionId }
    });
    return response.data;
  }

  async validateShareCode(shareCode: string): Promise<ApiResponse<boolean>> {
    const response = await this.client.get(`/game/share/${shareCode}/validate`);
    return response.data;
  }

  // 질문 관련 API
  async getPopularQuestions(page = 0, size = 10): Promise<ApiResponse<PaginatedResponse<Question>>> {
    const response = await this.client.get('/questions/popular', {
      params: { page, size }
    });
    return response.data;
  }

  async createQuestion(questionData: QuestionCreateRequest): Promise<ApiResponse<Question>> {
    const response = await this.client.post('/questions', questionData);
    return response.data;
  }

  async getQuestionById(id: number): Promise<Question> {
    const response = await this.client.get(`/questions/${id}`);
    return response.data;
  }

  async getQuestionStats(questionId: number): Promise<QuestionStats> {
    const response = await this.client.get(`/questions/${questionId}/stats`);
    return response.data;
  }

  // 질문 번들 관련 API
  async getPopularBundles(page = 0, size = 10): Promise<PaginatedResponse<QuestionBundle>> {
    const response = await this.client.get('/question-bundles/popular', {
      params: { page, size }
    });
    return response.data;
  }

  async getBundleById(id: number): Promise<ApiResponse<QuestionBundle>> {
    const response = await this.client.get(`/question-bundles/${id}`);
    return response.data;
  }

  async createQuestionBundle(bundleData: QuestionBundleCreateRequest): Promise<QuestionBundle> {
    const response = await this.client.post('/question-bundles', bundleData);
    return response.data;
  }

  async searchBundles(keyword?: string, page = 0, size = 10): Promise<PaginatedResponse<QuestionBundle>> {
    const params: any = { page, size };
    if (keyword) {
      params.keyword = keyword;
    }
    const response = await this.client.get('/question-bundles/search', { params });
    return response.data;
  }

  // 관리자 API
  async getAdminDashboardStats(): Promise<AdminDashboardStats> {
    const response = await this.client.get('/admin/dashboard/stats');
    return response.data;
  }

  async getPendingQuestions(page = 0, size = 10): Promise<PaginatedResponse<Question>> {
    const response = await this.client.get('/admin/questions/pending', {
      params: { page, size }
    });
    return response.data;
  }

  async approveQuestion(data: QuestionApprovalRequest): Promise<void> {
    await this.client.post(`/admin/questions/${data.questionId}/approve`);
  }

  async rejectQuestion(data: QuestionRejectRequest): Promise<void> {
    await this.client.post(`/admin/questions/${data.questionId}/reject`, {
      reason: data.reason
    });
  }

  async bulkApproveQuestions(questionIds: number[]): Promise<void> {
    await this.client.post('/admin/questions/bulk-approve', { questionIds });
  }

  async getApprovalHistory(status?: string, page = 0, size = 10): Promise<PaginatedResponse<Question>> {
    const response = await this.client.get('/admin/questions/history', {
      params: { status, page, size }
    });
    return response.data;
  }

  // 통계 및 키워드 관련 API
  async getKeywordStats(): Promise<{ keyword: string; count: number }[]> {
    const response = await this.client.get('/keywords/stats');
    return response.data;
  }

  async getMyStats(): Promise<ApiResponse<MyPageStats>> {
    const response = await this.client.get('/my/stats');
    return response.data;
  }

  async getMyGameHistory(page = 0, size = 10): Promise<ApiResponse<PaginatedResponse<GameHistory>>> {
    const response = await this.client.get('/my/game-history', {
      params: { page, size }
    });
    return response.data;
  }

  async getMyQuestions(status?: string, page = 0, size = 10): Promise<ApiResponse<PaginatedResponse<Question>>> {
    const params: any = { page, size };
    if (status) {
      params.status = status;
    }
    const response = await this.client.get('/my/questions', { params });
    return response.data;
  }

  async getMyBundles(page = 0, size = 10): Promise<ApiResponse<PaginatedResponse<QuestionBundle>>> {
    const response = await this.client.get('/my/question-bundles', {
      params: { page, size }
    });
    return response.data;
  }

  // 이미지 업로드 관련 API
  async uploadImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.client.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getStockImages(page = 0, size = 10): Promise<PaginatedResponse<{ id: number; imageUrl: string; description?: string; tags?: string }>> {
    const response = await this.client.get('/images/stock', {
      params: { page, size }
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
