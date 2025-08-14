import axios, { AxiosError } from 'axios';

// 로컬 개발 시 프록시 사용, 프로덕션에서는 직접 연결
const isDevelopment = process.env.NODE_ENV === 'development';
const API_URL = isDevelopment 
    ? '/api'  // 개발 환경에서는 프록시 사용
    : (process.env.NEXT_PUBLIC_API_URL || 'https://balance-game-ekedbfhkcxeyc8cb.koreacentral-01.azurewebsites.net/api');

console.log('Environment:', process.env.NODE_ENV);
console.log('API URL:', API_URL);

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000,
});

// 토큰 관리
let accessToken: string | null = null;

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
        console.log('API Request:', {
            url: config.url,
            method: config.method,
            baseURL: config.baseURL,
            fullURL: `${config.baseURL}${config.url}`,
        });
        
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
        });
        return response;
    },
    async (error: Error | AxiosError) => {
        if (axios.isAxiosError(error)) {
            console.error('API Error:', {
                url: error.config?.url,
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            
            if (!error.response) {
                console.error('네트워크 에러 또는 CORS 문제가 발생했습니다.');
                console.error('프록시 설정을 확인하세요.');
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
