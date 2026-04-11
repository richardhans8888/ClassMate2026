'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, User, LogOut, Settings, Sun, Moon, Loader2, BookOpen } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const AVATAR_COLORS = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-cyan-500',
  'bg-fuchsia-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-indigo-500',
]

function getAvatarColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length] as string
}

interface TopNavbarProps {
  onMobileMenuOpen: () => void
  userImage?: string | null
  userName?: string | null
  userEmail?: string | null
}

export function TopNavbar({ onMobileMenuOpen, userImage, userName, userEmail }: TopNavbarProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const name = userName ?? userEmail?.split('@')[0] ?? 'User'
  const email = userEmail ?? ''
  const avatarColor = getAvatarColor(userEmail ?? userName ?? 'user')

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await authClient.signOut()
      const res = await fetch('/api/logout', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to clear session')
      toast.success('Successfully signed out')
      router.push('/login')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-background sticky top-0 z-40 flex h-16 items-center gap-4 px-4">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <span className="text-foreground hidden text-base font-bold tracking-tight md:block">
          ClassMate
        </span>
      </div>

      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground rounded-lg md:hidden"
        onClick={onMobileMenuOpen}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open navigation</span>
      </Button>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group focus-visible:ring-ring rounded-full outline-none focus-visible:ring-2">
              <div className="bg-primary h-9 w-9 cursor-pointer rounded-full p-[2px] transition-transform group-hover:scale-105">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={userName ?? 'User avatar'}
                    width={36}
                    height={36}
                    className="h-full w-full rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div
                    className={`flex h-full w-full items-center justify-center rounded-full ${avatarColor}`}
                  >
                    {name !== 'User' ? (
                      <span className="text-sm font-semibold text-white">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                )}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">{name}</p>
                <p className="text-muted-foreground text-xs leading-none">{email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="cursor-pointer"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="mr-2 h-4 w-4" />
              ) : (
                <Moon className="mr-2 h-4 w-4" />
              )}
              <span>Dark Mode</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-semantic-error cursor-pointer"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
