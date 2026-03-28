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
  Menu,
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
      {/* Section header — fades out when collapsed, takes no space */}
      <p
        className={cn(
          'text-muted-foreground mb-1.5 overflow-hidden px-2 text-[10px] font-semibold tracking-widest whitespace-nowrap uppercase transition-all duration-200 ease-in-out',
          collapsed ? 'max-h-0 opacity-0' : 'max-h-6 opacity-100'
        )}
      >
        {section}
      </p>

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
              className="relative flex h-10 items-center"
            >
              {/* Collapsed view — centered 40×40 pill, crossfades in */}
              <span
                className={cn(
                  'absolute inset-0 flex items-center justify-center transition-opacity duration-200',
                  collapsed ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-150',
                    active
                      ? 'bg-accent text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </span>

              {/* Expanded view — full-width row with label, crossfades in */}
              <span
                className={cn(
                  'absolute inset-0 flex items-center gap-2 rounded-lg px-2 text-sm font-medium transition-opacity duration-200',
                  collapsed ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100',
                  active
                    ? 'bg-accent text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </span>
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
      {/* Hamburger toggle (desktop only) — always at same position */}
      {onToggleCollapse && (
        <div className="flex h-14 items-center px-2">
          <button
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-150"
          >
            <Menu className="h-5 w-5 shrink-0" />
          </button>
        </div>
      )}

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
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
          className="relative flex h-10 items-center"
        >
          {/* Collapsed view */}
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center transition-opacity duration-200',
              collapsed ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            )}
          >
            <span className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-150">
              <Settings className="h-5 w-5" />
            </span>
          </span>

          {/* Expanded view */}
          <span
            className={cn(
              'absolute inset-0 flex items-center gap-2 rounded-lg px-2 text-sm font-medium transition-opacity duration-200',
              collapsed ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100',
              'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Settings className="h-5 w-5 shrink-0" />
            <span className="truncate">Settings</span>
          </span>
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
