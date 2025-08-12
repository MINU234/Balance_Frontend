// 임시 toast 구현 (sonner 설치 전까지 사용)
const toast = {
  success: (message: string) => {
    console.log('✅', message)
    // 실제로는 sonner 사용
  },
  error: (message: string) => {
    console.error('❌', message)
    // 실제로는 sonner 사용
  },
  info: (message: string) => {
    console.info('ℹ️', message)
    // 실제로는 sonner 사용
  }
}

export { toast }
