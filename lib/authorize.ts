import { prisma } from '@/lib/prisma'

type UserRole = 'STUDENT' | 'TUTOR' | 'ADMIN'

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
 * Check if user is an admin
 */
export async function requireAdmin(session: SessionUser): Promise<boolean> {
  return requireRole(session, ['ADMIN'])
}

/**
 * Check if user is a moderator (TUTOR or ADMIN)
 */
export async function requireModerator(session: SessionUser): Promise<boolean> {
  return requireRole(session, ['TUTOR', 'ADMIN'])
}

/**
 * Check if user can moderate a resource (is owner or moderator)
 */
export async function canModerate(session: SessionUser, resourceOwnerId: string): Promise<boolean> {
  // User can always moderate their own resources
  if (session.id === resourceOwnerId) {
    return true
  }
  // Otherwise, must be a moderator (TUTOR or ADMIN)
  return requireModerator(session)
}

/**
 * Check if user can modify a connection (is sender or recipient)
 */
export async function canModifyConnection(
  session: SessionUser,
  senderId: string,
  recipientId: string
): Promise<boolean> {
  return session.id === senderId || session.id === recipientId
}
