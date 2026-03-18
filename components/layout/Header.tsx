'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  User,
  Menu,
  BookOpen,
  Trophy,
  LogOut,
  Users,
  Plus,
  Calendar as CalendarIcon,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from 'components/mode-toggle'
import { authClient } from '@/lib/auth-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface HeaderProps {
  onLogout?: () => void
}

export function Header({ onLogout }: HeaderProps) {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const userId = session?.user?.id
  const name = session?.user?.name ?? session?.user?.email?.split('@')[0] ?? 'User'
  const email = session?.user?.email ?? ''
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [level, setLevel] = useState<number>(1)

  // Fetch level from profile
  useEffect(() => {
    if (!userId) return
    fetch(`/api/user/profile?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.profile?.level) setLevel(data.profile.level as number)
      })
      .catch(console.error)
  }, [userId])

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await authClient.signOut()

      const res = await fetch('/api/logout', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to clear session')

      onLogout?.()
      toast.success('Successfully signed out')
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white text-gray-900 transition-colors duration-300 dark:border-gray-800 dark:bg-[#0F172A] dark:text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <div className="flex items-center gap-8 md:gap-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-lg bg-blue-600 p-1.5">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              ClassMate
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link
            href="/"
            className="text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/materials"
            className="text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            Materials
          </Link>
          <Link
            href="/forums"
            className="text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            Study Rooms
          </Link>
          <Link
            href="/groups"
            className="text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            Study Group
          </Link>
          <Link
            href="/ai-tutor"
            className="text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            Learn with AI
          </Link>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
          <ModeToggle />

          <div className="hidden items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 md:flex dark:border-gray-700 dark:bg-[#1E293B]">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-xs font-bold text-gray-700 dark:text-white">Lvl {level}</span>
          </div>

          {/* User Menu */}
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                  <div className="h-9 w-9 cursor-pointer rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[2px] transition-transform group-hover:scale-105">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-[#0F172A]">
                      <User className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                    </div>
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
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Switch Account</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem asChild>
                  <Link href="/schedule" className="cursor-pointer">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>My Schedule</span>
                  </Link>
                </DropdownMenuItem>

                {/* Sign Out */}
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 dark:text-red-400"
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

            {/* Switch Account Dialog */}
            <DialogContent className="border-gray-200 bg-white sm:max-w-[425px] dark:border-gray-800 dark:bg-[#0F1117]">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Switch Account</DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400">
                  Sign out and sign in with a different account.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[2px]">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-[#0F172A]">
                        <User className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-gray-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500 dark:bg-[#0F1117]">Or</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full rounded-lg border-2 border-dashed border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-300"
                  onClick={handleLogout}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add / Switch Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg text-gray-500 md:hidden dark:text-gray-400"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-white p-0 dark:bg-[#0F172A]">
              <div className="flex h-full flex-col">
                {/* Brand header */}
                <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 pr-12 dark:border-gray-800">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-base font-bold text-gray-900 dark:text-white">
                    ClassMate
                  </span>
                </div>

                {/* Nav links */}
                <nav className="flex flex-col gap-1 px-3 py-4">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    Home
                  </Link>
                  <Link
                    href="/materials"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    Materials
                  </Link>
                  <Link
                    href="/forums"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    Study Rooms
                  </Link>
                  <Link
                    href="/groups"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    Study Groups
                  </Link>
                  <Link
                    href="/ai-tutor"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    Learn with AI
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
