'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Navigation from '@/components/navigation'
import { ArrowLeftIcon, ShareIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GameSession, GameResult, QuestionBundle } from '@/types'
import { gameApi } from '@/lib/api/game'
import { questionsApi } from '@/lib/api/questions'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

type GameState = 'loading' | 'playing' | 'completed' | 'error'

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>('loading')
  const [bundle, setBundle] = useState<QuestionBundle | null>(null)
  const [session, setSession] = useState<GameSession | null>(null)
  const [result, setResult] = useState<GameResult | null>(null)
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const bundleId = urlParams.get('id')
    if (bundleId) {
      startGame(bundleId)
    } else {
      setGameState('error')
    }
  }, [])

  const startGame = async (bundleId: string) => {
    try {
      setGameState('loading')
      
      const bundleResponse = await questionsApi.getBundleDetail(parseInt(bundleId))
      if (!bundleResponse.success) {
        throw new Error('Could not load game info')
      }
      setBundle(bundleResponse.data)

      const sessionResponse = await gameApi.startGame({
        bundleId: parseInt(bundleId),
        userEmail: user?.email || null
      })

      if (sessionResponse.success) {
        setSession(sessionResponse.data)
        setGameState('playing')
      } else {
        throw new Error('Could not start game')
      }
    } catch (error: any) {
      console.error('Game start failed:', error)
      toast.error(error.message || 'Could not start game')
      setGameState('error')
    }
  }

  const handleOptionSelect = (option: 'A' | 'B') => {
    setSelectedOption(option)
  }

  const handleSubmitAnswer = async () => {
    if (!session || !selectedOption) return

    setIsSubmitting(true)
    try {
      const response = await gameApi.submitAnswer({
        sessionId: session.sessionId,
        questionId: session.currentQuestion.id,
        selectedOption
      })

      if (response.success) {
        if (session.currentQuestionIndex + 1 < session.totalQuestions) {
          await completeGame()
        } else {
          await completeGame()
        }
      }
    } catch (error: any) {
      console.error('Answer submission failed:', error)
      toast.error('Failed to submit answer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const completeGame = async () => {
    if (!session) return

    try {
      const response = await gameApi.completeGame(session.sessionId)
      if (response.success) {
        setResult(response.data)
        setGameState('completed')
        toast.success('Game completed!')
      }
    } catch (error: any) {
      console.error('Game completion failed:', error)
      toast.error('Failed to complete game')
    }
  }

  const copyShareCode = () => {
    if (result?.shareCode) {
      navigator.clipboard.writeText(result.shareCode)
      toast.success('Share code copied!')
    }
  }

  if (gameState === 'loading') {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Preparing game...</p>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'error') {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-red-600">Error</CardTitle>
                <CardDescription>Could not start game.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/play">
                    <Button className="w-full">Choose Another Game</Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
                    Go Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'completed' && result) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Game Complete!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              You completed {bundle?.title} game!
            </p>

            <Card className="glass-card border-0 mb-8">
              <CardHeader>
                <CardTitle>Share Code</CardTitle>
                <CardDescription>
                  Share this with friends to compare results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="text-3xl font-mono font-bold text-blue-600">
                    {result.shareCode}
                  </div>
                </div>
                <Button onClick={copyShareCode} className="w-full">
                  <ShareIcon className="w-4 h-4 mr-2" />
                  Copy Share Code
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Link href="/play">
                <Button size="lg" className="w-full">
                  Play Another Game
                </Button>
              </Link>
              <Link href="/compare">
                <Button variant="outline" size="lg" className="w-full">
                  Compare Results
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'playing' && session) {
    const progress = ((session.currentQuestionIndex + 1) / session.totalQuestions) * 100

    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Link href="/play">
                <Button variant="ghost" size="sm">
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Exit
                </Button>
              </Link>
              <div className="text-sm text-gray-600">
                {session.currentQuestionIndex + 1} / {session.totalQuestions}
              </div>
            </div>

            <div className="mb-8">
              <Progress value={progress} className="h-2" />
              <div className="text-center text-sm text-gray-600 mt-2">
                {Math.round(progress)}% complete
              </div>
            </div>

            <Card className="glass-card border-0 mb-8">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-4">
                  {session.currentQuestion.text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleOptionSelect('A')}
                    className={`p-6 rounded-lg border-2 transition-all duration-300 text-left ${
                      selectedOption === 'A'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center mr-3">
                        A
                      </div>
                      <div className="font-medium">Choice A</div>
                    </div>
                    <div className="text-lg">
                      {session.currentQuestion.optionAText}
                    </div>
                  </button>

                  <button
                    onClick={() => handleOptionSelect('B')}
                    className={`p-6 rounded-lg border-2 transition-all duration-300 text-left ${
                      selectedOption === 'B'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center mr-3">
                        B
                      </div>
                      <div className="font-medium">Choice B</div>
                    </div>
                    <div className="text-lg">
                      {session.currentQuestion.optionBText}
                    </div>
                  </button>
                </div>

                <div className="text-center mt-8">
                  <Button
                    size="lg"
                    onClick={handleSubmitAnswer}
                    disabled={!selectedOption || isSubmitting}
                    className="px-12"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return null
}