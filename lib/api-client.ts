import axios from 'axios';

// 운영 서버 URL (보고서에 명시된 실제 운영 서버)
const API_BASE_URL = 'https://balance-game-ekedbfhkcxeyc8cb.koreacentral-01.azurewebsites.net';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // JWT 쿠키 인증을 위해 필요
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 요청 인터셉터 (CORS preflight 처리)
apiClient.interceptors.request.use((config) => {
  if (config.method !== 'get') {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
  }
  return config;
});

// 응답 인터셉터 (에러 처리, 토큰 갱신)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // /api/auth/me 엔드포인트의 500 에러는 인증 체크용이므로 로그 레벨을 낮춤
    if (error.config?.url?.includes('/api/auth/me') && error.response?.status === 500) {
      console.debug('Auth check failed (expected for non-authenticated users):', {
        url: error.config?.url,
        status: error.response?.status,
        timestamp: new Date().toISOString()
      });
    } else {
      // 다른 에러는 상세히 로깅
      console.error('API Error Details:', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        requestData: error.config?.data,
        requestHeaders: error.config?.headers,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }

    if (error.response?.status === 401) {
      // 인증이 필요한 API에서만 리다이렉트 (메인페이지, 탐색페이지 등 공개 페이지는 제외)
      const requiresAuth = ['/api/auth/me', '/api/my-page', '/api/admin', '/api/questions/create', '/api/question-bundles/create'].some(path => 
        error.config?.url?.includes(path)
      );
      
      if (requiresAuth && typeof window !== 'undefined') {
        console.warn('인증이 필요한 API 호출 실패, 로그인 페이지로 이동:', error.config?.url);
        window.location.href = '/login';
      } else {
        console.debug('공개 API에서 401 에러 발생 (무시):', error.config?.url);
      }
    } else if (error.response?.status >= 500) {
      // 서버 에러의 경우 사용자 친화적 메시지로 변환
      error.userMessage = '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    } else if (error.response?.status >= 400) {
      // 클라이언트 에러의 경우 서버 메시지 사용
      error.userMessage = error.response?.data?.message || '요청 처리 중 오류가 발생했습니다.';
    } else if (error.code === 'ECONNABORTED') {
      // 타임아웃 에러
      error.userMessage = '요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.';
    } else {
      // 네트워크 에러 등
      error.userMessage = '네트워크 연결을 확인해주세요.';
    }

    return Promise.reject(error);
  }
);

export default apiClient;