export type UserRole = 'STUDENT' | 'TUTOR' | 'ADMIN'

type NavigationGroup = 'core' | 'more'

interface NavigationItem {
  href: string
  label: string
  group: NavigationGroup
  roles?: UserRole[]
}

export const navigationItems: NavigationItem[] = [
  { href: '/', label: 'Home', group: 'core' },
  { href: '/forums', label: 'Forums', group: 'core' },
  { href: '/materials', label: 'Materials', group: 'core' },
  { href: '/chat', label: 'Chat', group: 'core' },
  { href: '/groups', label: 'Study Groups', group: 'core' },
  { href: '/ai-tutor', label: 'Learn with AI', group: 'core' },
  { href: '/admin/moderation', label: 'Moderation', group: 'core', roles: ['ADMIN'] },
]

export function isNavigationItemVisible(item: NavigationItem, role: UserRole | null): boolean {
  if (!item.roles || item.roles.length === 0) {
    return true
  }

  if (!role) {
    return false
  }

  return item.roles.includes(role)
}

export function getNavigationByGroup(role: UserRole | null): {
  core: NavigationItem[]
  more: NavigationItem[]
} {
  const visibleItems = navigationItems.filter((item) => isNavigationItemVisible(item, role))

  return {
    core: visibleItems.filter((item) => item.group === 'core'),
    more: visibleItems.filter((item) => item.group === 'more'),
  }
}
