import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://balance-game-ekedbfhkcxeyc8cb.koreacentral-01.azurewebsites.net/api';

console.log('API URL:', API_URL); // 디버깅용

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 타임아웃 늘림
});

// 토큰 관리
let accessToken: string | null = null;

// 토큰 설정 함수
export const setAccessToken = (token: string | null) => {
    accessToken = token;
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token);
        }
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
        }
    }
};

// 초기 토큰 로드
if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
        setAccessToken(storedToken);
    }
}

// Request 인터셉터
apiClient.interceptors.request.use(
    (config) => {
        // 디버깅용 로그
        console.log('API Request:', {
            url: config.url,
            method: config.method,
            data: config.data,
            headers: config.headers
        });
        
        // 토큰이 있으면 헤더에 추가
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response 인터셉터
apiClient.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    async (error: Error | AxiosError) => {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            
            console.log('API Error Details:', {
                url: error.config?.url,
                method: error.config?.method,
                status: status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            
            // CORS 에러 체크
            if (error.message === 'Network Error' && !error.response) {
                console.error('CORS Error or Network Issue - 백엔드 서버가 실행 중인지 확인하세요');
                console.error('현재 API URL:', API_URL);
            }
            
            // 401 Unauthorized - 토큰 만료 또는 인증 실패
            if (status === 401) {
                // 리프레시 토큰으로 새 액세스 토큰 요청 시도
                if (error.config?.url !== '/auth/refresh' && error.config?.url !== '/auth/login') {
                    try {
                        const refreshResponse = await axios.post(
                            `${API_URL}/auth/refresh`,
                            {},
                            { withCredentials: true }
                        );
                        
                        const newAccessToken = refreshResponse.data.accessToken;
                        setAccessToken(newAccessToken);
                        
                        // 원래 요청 재시도
                        if (error.config) {
                            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                            return apiClient.request(error.config);
                        }
                    } catch (refreshError) {
                        // 리프레시도 실패하면 로그아웃
                        setAccessToken(null);
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                    }
                }
            }
            
            // 403 Forbidden - 권한 없음
            if (status === 403) {
                console.error("권한이 없습니다.");
            }
            
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error ||
                                error.message ||
                                '서버에서 오류가 발생했습니다.';
            console.error("API Error:", errorMessage);
        } else {
            console.error("An unexpected error occurred:", error.message);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
