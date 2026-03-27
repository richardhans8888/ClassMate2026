'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Footer } from 'components/layout/Footer'
import { Sidebar } from 'components/layout/Sidebar'
import { TopNavbar } from 'components/layout/TopNavbar'
import { authClient } from '@/lib/auth-client'
import { type UserRole } from '@/lib/navigation'

const SIDEBAR_COLLAPSED_KEY = 'classmate_sidebar_collapsed'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const userId = session?.user?.id

  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  // Persist collapse preference
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed))
  }, [collapsed])

  // Fetch user role for role-gated nav items
  useEffect(() => {
    if (!userId) return
    fetch(`/api/user/profile?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.profile?.role) setUserRole(data.profile.role as UserRole)
      })
      .catch((err) => {
        console.error('[MainLayout] Failed to fetch user role:', err)
      })
  }, [userId])

  const hideFooter =
    pathname.startsWith('/session') ||
    pathname.startsWith('/chat') ||
    (pathname.startsWith('/groups/') && pathname !== '/groups')

  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar
        userRole={userRole}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Content area — offset by sidebar width on desktop */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? 'md:ml-16' : 'md:ml-64'}`}
      >
        <TopNavbar onMobileMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1">{children}</main>
        {!hideFooter && <Footer />}
      </div>
    </div>
  )
}
