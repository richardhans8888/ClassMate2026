import { randomBytes } from 'crypto'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'

// GET /api/study-groups?subject=Math&userId=xxx&myGroups=true
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject')
  const userId = searchParams.get('userId')
  const myGroups = searchParams.get('myGroups')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10)))

  try {
    let groups
    let total: number

    if (myGroups === 'true' && userId) {
      const where = {
        members: { some: { userId } },
        ...(subject ? { subject } : {}),
      }
      total = await prisma.studyGroup.count({ where })
      groups = await prisma.studyGroup.findMany({
        where,
        include: {
          owner: { include: { profile: true } },
          _count: { select: { members: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      })
    } else {
      const where = {
        isPrivate: false,
        ...(subject ? { subject } : {}),
      }
      total = await prisma.studyGroup.count({ where })
      groups = await prisma.studyGroup.findMany({
        where,
        include: {
          owner: { include: { profile: true } },
          _count: { select: { members: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      })
    }

    return NextResponse.json({
      groups,
      meta: { total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) },
    })
  } catch (err) {
    console.error('[GET /api/study-groups]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/study-groups — create a group
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const limited = await checkRateLimit(session.id, writeLimiter)
  if (limited) return limited

  const { name, description, subject, maxMembers, isPrivate } = await req.json()
  if (!name || !subject)
    return NextResponse.json({ error: 'name and subject are required' }, { status: 400 })

  // Always use the authenticated session user as the owner — never trust client-supplied ownerId
  const ownerId = session.id

  try {
    const inviteCode = randomBytes(3).toString('hex').toUpperCase()

    const group = await prisma.$transaction(async (tx) => {
      const newGroup = await tx.studyGroup.create({
        data: {
          name,
          description: description ?? null,
          subject,
          ownerId,
          maxMembers: maxMembers || 10,
          isPrivate: isPrivate || false,
          inviteCode,
        },
      })

      // Auto-add owner as member with role 'owner'
      await tx.studyGroupMember.create({
        data: { groupId: newGroup.id, userId: ownerId, role: 'owner' },
      })

      return newGroup
    })

    return NextResponse.json({ group })
  } catch (err) {
    console.error('[POST /api/study-groups]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/study-groups?groupId=xxx
export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const groupId = searchParams.get('groupId')
  if (!groupId) return NextResponse.json({ error: 'groupId is required' }, { status: 400 })

  try {
    // Only delete if the authenticated user is the owner — no client-supplied userId needed
    await prisma.studyGroup.deleteMany({
      where: { id: groupId, ownerId: session.id },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/study-groups]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
