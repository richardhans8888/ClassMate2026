'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  MessageCircle,
  Calendar,
  Bot,
  User,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import {
  getNavigationBySection,
  type NavigationItem,
  type SidebarSection,
  type UserRole,
} from '@/lib/navigation'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  MessageSquare,
  Users,
  MessageCircle,
  Calendar,
  Bot,
  User,
  Shield,
  Settings,
}

interface SidebarProps {
  userRole: UserRole | null
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

function NavGroup({
  section,
  items,
  isActive,
  collapsed,
  onNavigate,
}: {
  section: SidebarSection
  items: NavigationItem[]
  isActive: (href: string) => boolean
  collapsed: boolean
  onNavigate?: () => void
}) {
  if (items.length === 0) return null

  return (
    <div className="mb-4">
      {!collapsed && (
        <p className="text-muted-foreground mb-1.5 px-3 text-[10px] font-semibold tracking-widest uppercase">
          {section}
        </p>
      )}
      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? User
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                collapsed && 'justify-center px-2',
                active
                  ? 'bg-accent text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function SidebarContent({
  userRole,
  collapsed,
  onToggleCollapse,
  isActive,
  onNavigate,
}: {
  userRole: UserRole | null
  collapsed: boolean
  onToggleCollapse?: () => void
  isActive: (href: string) => boolean
  onNavigate?: () => void
}) {
  const sections = getNavigationBySection(userRole)

  return (
    <div className="flex h-full flex-col">
      {/* Collapse toggle (desktop only) */}
      {onToggleCollapse && (
        <div className="border-border border-b p-2">
          <button
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'text-muted-foreground hover:bg-muted hover:text-foreground flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors',
              collapsed && 'justify-center px-0'
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="mr-2 h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Nav groups */}
      <nav className={cn('flex-1 overflow-y-auto py-4', collapsed ? 'px-2' : 'px-3')}>
        {(['Main', 'Learning', 'Account'] as SidebarSection[]).map((section) => (
          <NavGroup
            key={section}
            section={section}
            items={sections[section]}
            isActive={isActive}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Settings pinned at bottom */}
      <div className="border-border border-t p-2">
        <Link
          href="/settings"
          onClick={onNavigate}
          title={collapsed ? 'Settings' : undefined}
          className={cn(
            'text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            collapsed && 'justify-center px-2'
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="truncate">Settings</span>}
        </Link>
      </div>
    </div>
  )
}

export function Sidebar({
  userRole,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop sidebar — fixed */}
      <aside
        className={cn(
          'border-border bg-card fixed top-0 left-0 z-30 hidden h-full flex-col border-r transition-all duration-300 md:flex',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarContent
          userRole={userRole}
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
          isActive={isActive}
        />
      </aside>

      {/* Mobile sidebar — Sheet */}
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && onMobileClose()}>
        <SheetContent side="left" className="bg-card w-64 p-0">
          <SidebarContent
            userRole={userRole}
            collapsed={false}
            isActive={isActive}
            onNavigate={onMobileClose}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}
