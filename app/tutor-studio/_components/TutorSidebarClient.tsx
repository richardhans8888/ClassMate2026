'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, BookOpen, DollarSign, Calendar, LogOut, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/tutor-studio', icon: LayoutDashboard },
  {
    name: 'Student Requests',
    href: '/tutor-studio/requests',
    icon: Users,
    count: 3,
  },
  { name: 'Active Courses', href: '/tutor-studio/courses', icon: BookOpen },
  { name: 'Earnings', href: '/tutor-studio/earnings', icon: DollarSign },
  { name: 'Schedule', href: '/tutor-studio/schedule', icon: Calendar },
]

export function TutorSidebarClient() {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0F1115]">
      {/* Header */}
      <div className="p-6">
        <h1 className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent">
          Tutor Studio
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'border border-teal-200 bg-gray-100 text-teal-600 dark:border-teal-900/30 dark:bg-[#1A1F26] dark:text-teal-400'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#1A1F26] dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={`h-5 w-5 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500'}`}
                />
                {item.name}
              </div>
              {item.count && (
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-700 dark:bg-teal-500/20 dark:text-teal-400">
                  {item.count}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-2 border-t border-gray-200 p-4 dark:border-gray-800">
        <Link href="/">
          <Button
            variant="ghost"
            className="w-full justify-start rounded-lg pl-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#1A1F26] dark:hover:text-white"
          >
            <Home className="mr-3 h-5 w-5" />
            Back to Home
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-lg pl-3 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/10 dark:hover:text-red-300"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
