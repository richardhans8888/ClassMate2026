import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { requireAdmin } from '@/lib/authorize'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'
import { updateUserRoleSchema } from '@/lib/schemas'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, writeLimiter)
    if (limited) return limited

    const isAdmin = await requireAdmin(session)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: targetId } = await params

    if (targetId === session.id) {
      return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 })
    }

    const roleParsed = updateUserRoleSchema.safeParse(await req.json())
    if (!roleParsed.success) {
      return NextResponse.json({ error: roleParsed.error.flatten() }, { status: 400 })
    }
    const newRole = roleParsed.data.role

    const [caller, target] = await Promise.all([
      prisma.user.findUnique({ where: { id: session.id }, select: { role: true } }),
      prisma.user.findUnique({ where: { id: targetId }, select: { role: true } }),
    ])

    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const callerRole = caller?.role
    const targetCurrentRole = target.role

    if (targetCurrentRole === 'OWNER') {
      return NextResponse.json({ error: 'Cannot modify the owner role' }, { status: 403 })
    }

    if (callerRole === 'ADMIN') {
      if (targetCurrentRole === 'ADMIN') {
        return NextResponse.json({ error: 'Admins cannot modify other admins' }, { status: 403 })
      }
      if (newRole === 'ADMIN') {
        return NextResponse.json({ error: 'Admins cannot promote to admin' }, { status: 403 })
      }
    }

    await prisma.user.update({
      where: { id: targetId },
      data: { role: newRole },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    console.error('Role update error:', error)
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 })
  }
}
