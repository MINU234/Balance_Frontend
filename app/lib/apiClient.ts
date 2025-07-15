import axios from 'axios';

// 1. Axios 인스턴스 생성
const apiClient = axios.create({
    // 2. 기본 URL 설정 (환경 변수 사용)
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // 3. 기본 헤더 설정
    headers: {
        'Content-Type': 'application/json',
    },
    // 4. 요청 타임아웃 설정 (선택 사항)
    timeout: 10000, // 10초
    withCredentials: true,
});

// 6. 응답 인터셉터 (Response Interceptor) 설정 (선택 사항)
//    - API 응답을 받은 후 `.then` 또는 `.catch`로 처리되기 전에 실행됩니다.
apiClient.interceptors.response.use(
    (response) => {
        // 응답 데이터가 있는 경우 그대로 반환합니다.
        return response;
    },
    (error) => {
        // 401 Unauthorized 에러 발생 시 (토큰 만료 등)
        if (error.response && error.response.status === 401) {
            // 예를 들어, localStorage의 토큰을 삭제하고 로그인 페이지로 리다이렉트
            console.error("인증 실패! 로그인이 필요합니다.");
            localStorage.removeItem('accessToken');
            // window.location.href = '/login';
        }

        // 다른 종류의 에러는 그대로 반환하여 각 API 호출 부분에서 처리하도록 합니다.
        return Promise.reject(error);
    }
);


export default apiClient;
