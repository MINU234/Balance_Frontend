'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuthState } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { 
  UserIcon, 
  LogOutIcon, 
  MenuIcon, 
  XIcon,
  HomeIcon,
  SearchIcon,
  PlusIcon,
  GamepadIcon
} from 'lucide-react'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuthState()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('로그아웃되었습니다.')
      router.push('/')
      setIsMobileMenuOpen(false)
    } catch (error) {
      toast.error('로그아웃 중 오류가 발생했습니다.')
    }
  }

  const menuItems = [
    { href: '/', label: '홈', icon: HomeIcon },
    { href: '/explore', label: '탐색', icon: SearchIcon },
    { href: '/create', label: '만들기', icon: PlusIcon },
    { href: '/play', label: '게임', icon: GamepadIcon },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BG</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Balance Game
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link href="/my-page">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <UserIcon className="w-4 h-4" />
                      <span>{user?.nickname || '마이페이지'}</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    <span>로그아웃</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      로그인
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="gradient" size="sm">
                      회원가입
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-3">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Link 
                      href="/my-page"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <UserIcon className="w-5 h-5" />
                      <span>{user?.nickname || '마이페이지'}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                    >
                      <LogOutIcon className="w-5 h-5" />
                      <span>로그아웃</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block"
                    >
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        로그인
                      </Button>
                    </Link>
                    <Link 
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block"
                    >
                      <Button variant="gradient" size="sm" className="w-full">
                        회원가입
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}