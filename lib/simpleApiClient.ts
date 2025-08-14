// 백엔드 API 클라이언트 - 협업 가이드 기반 구현
import axios, { AxiosInstance } from 'axios';
import { 
  QuestionBundle, 
  PaginatedResponse, 
  GameSession, 
  User, 
  LoginRequest, 
  SignupRequest, 
  StartGameRequest, 
  AnswerRequest,
  QuestionCreateRequest,
  GameResult,
  GameComparison 
} from '@/types/api';

class ApiClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://balance-game-ekedbfhkcxeyc8cb.koreacentral-01.azurewebsites.net/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 요청 인터셉터 - JWT 토큰 자동 추가
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('accessToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터 - 401 오류 시 로그인 페이지로 리다이렉트
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // ========== 인증 관련 API ==========
  
  async login(credentials: LoginRequest) {
    try {
      const response = await this.client.post('/auth/login', credentials);
      return response;
    } catch (error) {
      throw this.handleError(error, '로그인에 실패했습니다.');
    }
  }

  async signup(userData: SignupRequest) {
    try {
      const response = await this.client.post('/auth/signup', userData);
      return response;
    } catch (error) {
      throw this.handleError(error, '회원가입에 실패했습니다.');
    }
  }

  // ========== 게임 관련 API ==========

  async startGame(data: StartGameRequest): Promise<GameSession> {
    try {
      const response = await this.client.post('/game/start', data);
      return response;
    } catch (error) {
      throw this.handleError(error, '게임 시작에 실패했습니다.');
    }
  }

  async submitAnswer(data: AnswerRequest): Promise<void> {
    try {
      await this.client.post('/game/answer', data);
    } catch (error) {
      throw this.handleError(error, '답변 제출에 실패했습니다.');
    }
  }

  async completeGame(sessionId: number): Promise<{ shareCode: string }> {
    try {
      const response = await this.client.post(`/game/sessions/${sessionId}/complete`);
      return response;
    } catch (error) {
      throw this.handleError(error, '게임 완료 처리에 실패했습니다.');
    }
  }

  async getGameResults(sessionId: number): Promise<GameResult> {
    try {
      const response = await this.client.get(`/game/sessions/${sessionId}/results`);
      return response;
    } catch (error) {
      throw this.handleError(error, '게임 결과 조회에 실패했습니다.');
    }
  }

  async getSharedSession(shareCode: string): Promise<GameResult> {
    try {
      const response = await this.client.get(`/game/share/${shareCode}`);
      return response;
    } catch (error) {
      throw this.handleError(error, '공유 게임 조회에 실패했습니다.');
    }
  }

  async compareResults(shareCode: string, compareSessionId: number): Promise<GameComparison> {
    try {
      const response = await this.client.post(`/game/compare?shareCode=${shareCode}&compareSessionId=${compareSessionId}`);
      return response;
    } catch (error) {
      throw this.handleError(error, '결과 비교에 실패했습니다.');
    }
  }

  // ========== 질문 및 묶음 관련 API ==========

  async getPopularBundles(page = 0, size = 6): Promise<PaginatedResponse<QuestionBundle>> {
    try {
      const response = await this.client.get(`/questions/popular?page=${page}&size=${size}`);
      return response;
    } catch (error) {
      // 백엔드 연결 실패 시 임시 목업 데이터 반환
      console.warn('백엔드 연결 실패, 목업 데이터 사용:', error);
      return this.getMockPopularBundles();
    }
  }

  async getQuestionBundles(page = 0, size = 20, keyword?: string): Promise<PaginatedResponse<QuestionBundle>> {
    try {
      const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
      if (keyword) params.append('keyword', keyword);
      
      const response = await this.client.get(`/question-bundles?${params}`);
      return response;
    } catch (error) {
      throw this.handleError(error, '질문 묶음 조회에 실패했습니다.');
    }
  }

  async getBundleById(id: number): Promise<QuestionBundle> {
    try {
      const response = await this.client.get(`/question-bundles/${id}`);
      return response;
    } catch (error) {
      // 백엔드 연결 실패 시 임시 데이터 반환
      console.warn('백엔드 연결 실패, 목업 데이터 사용:', error);
      return this.getMockBundleById(id);
    }
  }

  async createQuestion(questionData: QuestionCreateRequest) {
    try {
      const response = await this.client.post('/questions', questionData);
      return response;
    } catch (error) {
      throw this.handleError(error, '질문 생성에 실패했습니다.');
    }
  }

  // ========== 마이페이지 관련 API ==========

  async getMyProfile(): Promise<User> {
    try {
      const response = await this.client.get('/my/profile');
      return response;
    } catch (error) {
      throw this.handleError(error, '프로필 조회에 실패했습니다.');
    }
  }

  async getMyQuestionBundles(page = 0, size = 10): Promise<PaginatedResponse<QuestionBundle>> {
    try {
      const response = await this.client.get(`/my/question-bundles?page=${page}&size=${size}`);
      return response;
    } catch (error) {
      throw this.handleError(error, '내 질문 묶음 조회에 실패했습니다.');
    }
  }

  async getMyGameHistory(page = 0, size = 10) {
    try {
      const response = await this.client.get(`/my/game-history?page=${page}&size=${size}`);
      return response;
    } catch (error) {
      throw this.handleError(error, '게임 기록 조회에 실패했습니다.');
    }
  }

  async getMyStats() {
    try {
      const response = await this.client.get('/my/stats');
      return response;
    } catch (error) {
      throw this.handleError(error, '통계 조회에 실패했습니다.');
    }
  }

  async updateQuestionBundleVisibility(bundleId: number, isPublic: boolean) {
    try {
      const response = await this.client.patch(`/question-bundles/${bundleId}`, { isPublic });
      return response;
    } catch (error) {
      throw this.handleError(error, '공개 설정 변경에 실패했습니다.');
    }
  }

  async deleteQuestionBundle(bundleId: number) {
    try {
      await this.client.delete(`/question-bundles/${bundleId}`);
    } catch (error) {
      throw this.handleError(error, '질문 묶음 삭제에 실패했습니다.');
    }
  }

  // ========== 유틸리티 메서드 ==========

  private handleError(error: any, defaultMessage: string) {
    const message = error.response?.data?.message || error.message || defaultMessage;
    return new Error(message);
  }

  // 백엔드 연결 실패 시 사용할 목업 데이터
  private getMockPopularBundles(): PaginatedResponse<QuestionBundle> {
    return {
      content: [
        {
          id: 1,
          title: '연애 밸런스 게임',
          description: '사랑에 대한 당신의 가치관을 알아보세요',
          keywords: '연애,사랑,데이트',
          isPublic: true,
          creator: { id: 1, email: 'admin@example.com', nickname: '운영자', role: 'ADMIN', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
          questions: [],
          questionCount: 10,
          playCount: 1250,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: 2,
          title: '음식 취향 테스트',
          description: '먹는 것으로 보는 당신의 성격',
          keywords: '음식,취향,성격',
          isPublic: true,
          creator: { id: 1, email: 'admin@example.com', nickname: '운영자', role: 'ADMIN', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
          questions: [],
          questionCount: 8,
          playCount: 890,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: 3,
          title: '라이프스타일 밸런스',
          description: '일상 속 선택들로 성격 파악하기',
          keywords: '라이프스타일,일상,성격',
          isPublic: true,
          creator: { id: 1, email: 'admin@example.com', nickname: '운영자', role: 'ADMIN', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
          questions: [],
          questionCount: 12,
          playCount: 673,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }
      ],
      totalElements: 3,
      totalPages: 1,
      size: 6,
      number: 0,
      first: true,
      last: true
    };
  }

  private getMockBundleById(id: number): QuestionBundle {
    return {
      id: id,
      title: '연애 밸런스 게임',
      description: '사랑에 대한 당신의 가치관을 알아보세요',
      keywords: '연애,사랑,데이트',
      isPublic: true,
      creator: { id: 1, email: 'admin@example.com', nickname: '운영자', role: 'ADMIN', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      questions: [
        {
          id: 1,
          text: '첫 데이트 장소는?',
          optionAText: '영화관',
          optionBText: '카페',
          optionAImageUrl: '',
          optionBImageUrl: '',
          keyword: '데이트',
          isActive: true,
          approvalStatus: 'APPROVED',
          creator: { id: 1, email: 'admin@example.com', nickname: '운영자', role: 'ADMIN', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: 2,
          text: '선호하는 연락 방식은?',
          optionAText: '전화',
          optionBText: '메시지',
          optionAImageUrl: '',
          optionBImageUrl: '',
          keyword: '소통',
          isActive: true,
          approvalStatus: 'APPROVED',
          creator: { id: 1, email: 'admin@example.com', nickname: '운영자', role: 'ADMIN', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }
      ],
      questionCount: 2,
      playCount: 1250,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    };
  }
}

// 싱글톤 인스턴스 export
const apiClient = new ApiClient();
export default apiClient;
