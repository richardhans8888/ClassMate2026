import { randomBytes } from 'crypto'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'
import { sanitizeText } from '@/lib/sanitize'

// GET /api/study-groups?subject=Math&myGroups=true&excludeMyGroups=true
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject')
  const myGroups = searchParams.get('myGroups')
  const excludeMyGroups = searchParams.get('excludeMyGroups') === 'true'
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10) || 12))

  try {
    let groups
    let total: number

    if (myGroups === 'true') {
      const session = await getSession()
      if (!session) {
        return NextResponse.json({
          groups: [],
          meta: { total: 0, page: 1, limit, pages: 1 },
        })
      }
      const where = {
        members: { some: { userId: session.id } },
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
      // Optionally exclude groups the current user has already joined
      let excludeUserId: string | undefined
      if (excludeMyGroups) {
        const session = await getSession()
        if (session) excludeUserId = session.id
      }

      const where = {
        isPrivate: false,
        ...(subject ? { subject } : {}),
        ...(excludeUserId ? { members: { none: { userId: excludeUserId } } } : {}),
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

  const body = await req.json()
  const sanitizedName = sanitizeText(body.name ?? '')
  const sanitizedSubject = sanitizeText(body.subject ?? '')
  const sanitizedDescription =
    typeof body.description === 'string' ? sanitizeText(body.description) : null

  if (!sanitizedName || !sanitizedSubject)
    return NextResponse.json({ error: 'name and subject are required' }, { status: 400 })

  // Always use the authenticated session user as the owner — never trust client-supplied ownerId
  const ownerId = session.id

  try {
    const inviteCode = randomBytes(3).toString('hex').toUpperCase()

    const group = await prisma.$transaction(async (tx) => {
      const newGroup = await tx.studyGroup.create({
        data: {
          name: sanitizedName,
          description: sanitizedDescription ?? null,
          subject: sanitizedSubject,
          ownerId,
          maxMembers: body.maxMembers || 10,
          isPrivate: body.isPrivate || false,
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
