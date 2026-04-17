import { prisma } from '@/lib/prisma'
import type { UserRole } from '../generated/prisma/enums'

interface SessionUser {
  id: string
  email: string
}

/**
 * Get user role from database
 */
async function getUserRole(userId: string): Promise<UserRole | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })
  return user?.role ?? null
}

/**
 * Check if user has one of the allowed roles
 */
export async function requireRole(
  session: SessionUser,
  allowedRoles: UserRole[]
): Promise<boolean> {
  const role = await getUserRole(session.id)
  return role !== null && allowedRoles.includes(role)
}

/**
 * Check if user is an admin or owner
 */
export async function requireAdmin(session: SessionUser): Promise<boolean> {
  return requireRole(session, ['ADMIN', 'OWNER'])
}

/**
 * Check if user is a moderator (MODERATOR, ADMIN, or OWNER)
 */
export async function requireModerator(session: SessionUser): Promise<boolean> {
  return requireRole(session, ['MODERATOR', 'ADMIN', 'OWNER'])
}

/**
 * Check if user is an owner
 */
export async function requireOwner(session: SessionUser): Promise<boolean> {
  return requireRole(session, ['OWNER'])
}

/**
 * Check if user can moderate a resource (is owner or moderator)
 */
export async function canModerate(session: SessionUser, resourceOwnerId: string): Promise<boolean> {
  // User can always moderate their own resources
  if (session.id === resourceOwnerId) {
    return true
  }
  // Otherwise, must be a moderator (MODERATOR or ADMIN)
  return requireModerator(session)
}
