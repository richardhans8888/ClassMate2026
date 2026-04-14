'use client'

import { useUserRole } from '@/lib/contexts/user-role-context'
import type { UserRole } from '@/lib/navigation'

interface RoleGateProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Renders children only when the current user's role is in allowedRoles.
 * Returns null (nothing in DOM) for unauthorized users.
 * Also returns null while the role is still loading to prevent flash.
 */
export function RoleGate({ allowedRoles, children, fallback = null }: RoleGateProps) {
  const { role, isLoaded } = useUserRole()

  if (!isLoaded) return null
  if (!role || !allowedRoles.includes(role)) return <>{fallback}</>
  return <>{children}</>
}
