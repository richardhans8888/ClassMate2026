'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Footer } from 'components/layout/Footer'
import { Sidebar } from 'components/layout/Sidebar'
import { TopNavbar } from 'components/layout/TopNavbar'
import { type UserRole } from '@/lib/navigation'

const SIDEBAR_COLLAPSED_KEY = 'classmate_sidebar_collapsed'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [userImage, setUserImage] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  // Persist collapse preference
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed))
  }, [collapsed])

  // Fetch current user — works for both Better Auth and Firebase/Google OAuth
  useEffect(() => {
    fetch('/api/user/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return
        if (data.role) setUserRole(data.role as UserRole)
        setUserImage(data.avatarUrl ?? data.image ?? null)
        setUserName(data.name ?? null)
        setUserEmail(data.email ?? null)
      })
      .catch((err) => {
        console.error('[MainLayout] Failed to fetch user:', err)
      })
  }, [])

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
        <TopNavbar
          onMobileMenuOpen={() => setMobileOpen(true)}
          userImage={userImage}
          userName={userName}
          userEmail={userEmail}
        />
        <main className="flex-1">{children}</main>
        {!hideFooter && <Footer />}
      </div>
    </div>
  )
}
