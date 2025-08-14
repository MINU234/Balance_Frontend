import { apiClient } from './apiClient';

// 기존 apiClient를 simpleApiClient로 재내보내기
export const simpleApiClient = apiClient;
export default apiClient;