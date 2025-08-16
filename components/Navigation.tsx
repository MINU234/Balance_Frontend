'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { Menu, X, User, LogOut, Plus, Gamepad2 } from 'lucide-react'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Balance Game
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/explore" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              탐색
            </Link>
            <Link href="/play" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              게임
            </Link>
            <Link href="/create" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>만들기</span>
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/my-page" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{user?.nickname || '마이페이지'}</span>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-gray-700 dark:text-gray-300 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  로그아웃
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">
                    회원가입
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-3">
              <Link href="/explore" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors px-2 py-1">
                탐색
              </Link>
              <Link href="/play" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors px-2 py-1">
                게임
              </Link>
              <Link href="/create" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors px-2 py-1 flex items-center space-x-1">
                <Plus className="h-4 w-4" />
                <span>만들기</span>
              </Link>
              
              {isAuthenticated ? (
                <div className="flex flex-col space-y-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                  <Link href="/my-page" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors px-2 py-1 flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{user?.nickname || '마이페이지'}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-left text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors px-2 py-1 flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>로그아웃</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200 dark:border-gray-800">
                  <Link href="/login" className="text-left">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      로그인
                    </Button>
                  </Link>
                  <Link href="/signup" className="text-left">
                    <Button size="sm" className="w-full">
                      회원가입
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}