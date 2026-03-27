'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { User, Menu, BookOpen, LogOut, Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from 'components/mode-toggle'
import { authClient } from '@/lib/auth-client'
import { getNavigationByGroup, type UserRole } from '@/lib/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface HeaderProps {
  onLogout?: () => void
}

export function Header({ onLogout }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const userId = session?.user?.id
  const name = session?.user?.name ?? session?.user?.email?.split('@')[0] ?? 'User'
  const email = session?.user?.email ?? ''
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const { core: coreNavItems } = getNavigationByGroup(userRole)

  useEffect(() => {
    if (!userId) return
    fetch(`/api/user/profile?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.profile?.role) setUserRole(data.profile.role as UserRole)
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

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
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
        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {coreNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative rounded-md px-3 py-1.5 transition-colors ${
                isActive(item.href)
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute inset-x-3 -bottom-[18px] h-[2px] rounded-full bg-blue-600 dark:bg-blue-400" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
          <ModeToggle />

          {/* User Menu */}
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
                  {coreNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
