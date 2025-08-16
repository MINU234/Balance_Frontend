'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Navigation from '@/components/navigation.tsx'
import { SearchIcon, ShareIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function ComparePage() {
  const [shareCode, setShareCode] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCompare = async () => {
    if (!shareCode.trim()) {
      toast.error('Share code is required')
      return
    }

    if (shareCode.length !== 8) {
      toast.error('Share code must be 8 characters')
      return
    }

    setLoading(true)
    try {
      router.push(`/compare/${shareCode}`)
    } catch (error) {
      toast.error('Invalid share code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Compare Results
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Enter a friend's share code to compare answers
            </p>
          </div>

          <Card className="glass-card border-0 mb-8">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                <ShareIcon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Enter Share Code</CardTitle>
              <CardDescription>
                Enter an 8-character share code to compare with a friend's answers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="e.g. ABC12345"
                  value={shareCode}
                  onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                  className="pl-12 text-center text-xl font-mono h-14"
                  maxLength={8}
                />
              </div>
              <Button 
                size="lg" 
                className="w-full h-12" 
                onClick={handleCompare}
                disabled={!shareCode.trim() || loading}
              >
                {loading ? 'Checking...' : 'Compare'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                How to use share codes?
              </h3>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <li>• Complete a game to get an 8-character share code</li>
                <li>• Share your code with friends</li>
                <li>• Enter their code to play the same game</li>
                <li>• Compare results when both complete the game</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}