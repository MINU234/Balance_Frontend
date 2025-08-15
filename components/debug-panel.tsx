'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authApi } from '@/lib/api/auth'
import { questionsApi } from '@/lib/api/questions'

export default function DebugPanel() {
  const [logs, setLogs] = useState<string[]>([])
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('password123')
  const [nickname, setNickname] = useState('testuser')

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const testLogin = async () => {
    addLog(`로그인 시도: ${email}`)
    try {
      const result = await authApi.login({ email, password })
      addLog(`로그인 성공: ${JSON.stringify(result)}`)
    } catch (error: any) {
      addLog(`로그인 실패: ${error.message}`)
      console.error('Login test error:', error)
    }
  }

  const testSignup = async () => {
    addLog(`회원가입 시도: ${email}, ${nickname}`)
    try {
      const result = await authApi.signup({ email, password, nickname })
      addLog(`회원가입 성공: ${JSON.stringify(result)}`)
    } catch (error: any) {
      addLog(`회원가입 실패: ${error.message}`)
      console.error('Signup test error:', error)
    }
  }

  const testApiEndpoints = async () => {
    addLog('API 엔드포인트 테스트 시작')
    
    const endpoints = [
      { name: '인기 묶음', fn: () => questionsApi.getPopularBundles(0, 5) },
      { name: '인기 질문', fn: () => questionsApi.getPopularQuestions(0, 5) },
      { name: '사용자 정보', fn: () => authApi.me() }
    ]

    for (const endpoint of endpoints) {
      try {
        addLog(`${endpoint.name} 테스트 중...`)
        const result = await endpoint.fn()
        addLog(`${endpoint.name} 성공: ${result.success ? 'OK' : 'FAIL'}`)
      } catch (error: any) {
        addLog(`${endpoint.name} 실패: ${error.message}`)
      }
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>🐛 API 디버깅 패널</CardTitle>
        <CardDescription>
          백엔드 API 요청을 테스트하고 에러를 확인합니다. 
          브라우저 콘솔(F12)에서 더 자세한 정보를 확인하세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 테스트 입력 */}
        <div className="grid md:grid-cols-3 gap-3">
          <Input
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        {/* 테스트 버튼들 */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={testLogin} variant="outline">로그인 테스트</Button>
          <Button onClick={testSignup} variant="outline">회원가입 테스트</Button>
          <Button onClick={testApiEndpoints} variant="outline">API 엔드포인트 테스트</Button>
          <Button onClick={clearLogs} variant="secondary">로그 클리어</Button>
        </div>

        {/* 로그 출력 */}
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          <div className="text-gray-500 mb-2">API 테스트 로그:</div>
          {logs.length === 0 ? (
            <div className="text-gray-500">로그가 없습니다. 위 버튼들을 눌러서 테스트해보세요.</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))
          )}
        </div>

        <div className="text-sm text-gray-600 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
          <strong>💡 백엔드 관리자 참고:</strong>
          <br />• 브라우저 개발자 도구(F12) → Console 탭에서 상세 에러 정보 확인
          <br />• Network 탭에서 실제 HTTP 요청/응답 확인
          <br />• 서버 로그에서 해당 시간대의 에러 로그 대조
        </div>
      </CardContent>
    </Card>
  )
}