'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  User,
  Bell,
  Menu,
  BookOpen,
  Trophy,
  LogOut,
  CreditCard,
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

type NotificationItem = {
  id: string
  title: string
  desc?: string
  time: string
  read?: boolean
  href?: string
}

type ApiNotification = {
  id: string
  title: string
  message: string | null
  isRead: boolean
  createdAt: string
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function Header({ onLogout }: HeaderProps) {
  const { data: session } = authClient.useSession()
  const userId = session?.user?.id
  const name = session?.user?.name ?? session?.user?.email?.split('@')[0] ?? 'User'
  const email = session?.user?.email ?? ''
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [level, setLevel] = useState<number>(1)

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  // Fetch notifications from API
  useEffect(() => {
    if (!userId) return
    fetch(`/api/notifications?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        const mapped: NotificationItem[] = (data.notifications ?? []).map((n: ApiNotification) => ({
          id: n.id,
          title: n.title,
          desc: n.message ?? undefined,
          time: formatRelativeTime(n.createdAt),
          read: n.isRead,
        }))
        setNotifications(mapped)
      })
      .catch(console.error)
  }, [userId])

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
      onLogout?.()
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  async function markAllRead() {
    if (!userId) return
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, markAllRead: true }),
      })
    } catch (err) {
      console.error(err)
    }
  }

  async function clearNotifications() {
    if (!userId) return
    const toDelete = [...notifications]
    setNotifications([])
    try {
      await Promise.allSettled(
        toDelete.map((n) =>
          fetch(`/api/notifications?notificationId=${n.id}&userId=${userId}`, { method: 'DELETE' })
        )
      )
    } catch (err) {
      console.error(err)
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded px-2 py-1 text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                Learn
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href="/tutors" className="cursor-pointer">
                  Find your tutor
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/learn/modules" className="cursor-pointer">
                  Your modules
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 inline-flex h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="flex items-center justify-between font-medium">
                <span>Notifications</span>
                <span className="text-xs text-gray-500">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                {notifications.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <DropdownMenuItem key={n.id} asChild>
                      <Link href={n.href || '#'} className="flex items-start gap-2 px-2 py-2">
                        <div
                          className={`mt-1 h-2 w-2 rounded-full ${n.read ? 'bg-gray-300' : 'bg-blue-500'}`}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{n.title}</div>
                          {n.desc && <div className="truncate text-xs text-gray-400">{n.desc}</div>}
                          <div className="text-xs text-gray-500">{n.time}</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="flex items-center justify-end gap-2 px-2 pb-2">
                <button
                  onClick={markAllRead}
                  className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300"
                >
                  Mark all read
                </button>
                <button
                  onClick={clearNotifications}
                  className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300"
                >
                  Clear
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

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

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/tutor-studio" className="cursor-pointer">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Tutor Studio</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/purchases" className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Purchase &amp; Memberships</span>
                  </Link>
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
                    href="/tutors"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    Find Tutor
                  </Link>
                  <Link
                    href="/learn/modules"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    Your Modules
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
