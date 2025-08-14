'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Search,
  Plus,
  User,
  Settings,
  LogOut,
  Menu,
  Crown,
  PlayCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navigationItems = [
    {
      title: '홈',
      href: '/',
      icon: Home,
      description: '메인 페이지'
    },
    {
      title: '탐색',
      href: '/explore',
      icon: Search,
      description: '질문 묶음 둘러보기'
    },
  ];

  const authenticatedItems = [
    {
      title: '질문 생성',
      href: '/create-question',
      icon: Plus,
      description: '새 질문 만들기'
    },
    {
      title: '묶음 생성',
      href: '/create',
      icon: PlayCircle,
      description: '질문 묶음 만들기'
    },
    {
      title: '마이페이지',
      href: '/my-page',
      icon: User,
      description: '내 정보 및 활동'
    },
  ];

  const adminItems = [
    {
      title: '관리자',
      href: '/admin/dashboard',
      icon: Crown,
      description: '관리자 대시보드'
    },
  ];

  const allItems = [
    ...navigationItems,
    ...(isAuthenticated === true ? authenticatedItems : []),
    ...(isAdmin === true ? adminItems : []),
  ];

  const NavItems = ({ mobile = false, onItemClick }: { mobile?: boolean; onItemClick?: () => void }) => (
    <>
      {allItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        if (mobile) {
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-accent"
              )}
            >
              <Icon className="h-5 w-5" />
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
              </div>
            </Link>
          );
        }

        return (
          <NavigationMenuItem key={item.href}>
            <Link href={item.href} legacyBehavior passHref>
              <NavigationMenuLink 
                className={cn(
                  navigationMenuTriggerStyle(),
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        );
      })}
    </>
  );

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.nickname?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user?.nickname}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          {isAdmin && (
            <Badge variant="secondary" className="ml-auto">
              관리자
            </Badge>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/my-page" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            마이페이지
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin/dashboard" className="cursor-pointer">
              <Crown className="mr-2 h-4 w-4" />
              관리자 대시보드
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* 로고 */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <PlayCircle className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold hidden sm:inline-block">
              밸런스 게임
            </span>
          </Link>
        </div>

        {/* 데스크톱 네비게이션 */}
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavItems />
            </NavigationMenuList>
          </NavigationMenu>

          {/* 사용자 메뉴 */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">로그인</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">회원가입</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">메뉴</SheetTitle>
              </SheetHeader>
              <div className="py-6">
                {/* 사용자 정보 */}
                {isAuthenticated && user && (
                  <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
                    <Avatar>
                      <AvatarFallback>
                        {user.nickname?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.nickname}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {isAdmin && (
                        <Badge variant="secondary" className="mt-1">
                          관리자
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* 네비게이션 아이템 */}
                <nav className="space-y-2">
                  <NavItems mobile onItemClick={() => setIsSheetOpen(false)} />
                </nav>

                {/* 하단 액션 */}
                <div className="mt-6 pt-4 border-t space-y-2">
                  {isAuthenticated ? (
                    <Button 
                      onClick={handleLogout} 
                      variant="ghost" 
                      className="w-full justify-start text-destructive hover:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      로그아웃
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        asChild 
                        variant="ghost" 
                        className="w-full"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Link href="/login">로그인</Link>
                      </Button>
                      <Button 
                        asChild 
                        className="w-full"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Link href="/signup">회원가입</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
