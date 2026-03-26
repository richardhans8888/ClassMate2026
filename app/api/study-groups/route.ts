import { randomBytes } from 'crypto'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/study-groups?subject=Math&userId=xxx&myGroups=true
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject')
  const userId = searchParams.get('userId')
  const myGroups = searchParams.get('myGroups')

  try {
    let groups

    if (myGroups === 'true' && userId) {
      groups = await prisma.studyGroup.findMany({
        where: {
          members: { some: { userId } },
          ...(subject ? { subject } : {}),
        },
        include: {
          owner: { include: { profile: true } },
          _count: { select: { members: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      groups = await prisma.studyGroup.findMany({
        where: {
          isPrivate: false,
          ...(subject ? { subject } : {}),
        },
        include: {
          owner: { include: { profile: true } },
          _count: { select: { members: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
    }

    return NextResponse.json({ groups })
  } catch (err) {
    console.error('[GET /api/study-groups]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/study-groups — create a group
export async function POST(req: NextRequest) {
  const { name, description, subject, ownerId, maxMembers, isPrivate } = await req.json()
  if (!name || !subject || !ownerId)
    return NextResponse.json({ error: 'name, subject, ownerId required' }, { status: 400 })

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

// DELETE /api/study-groups?groupId=xxx&userId=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const groupId = searchParams.get('groupId')
  const userId = searchParams.get('userId')
  if (!groupId || !userId)
    return NextResponse.json({ error: 'groupId and userId required' }, { status: 400 })

  try {
    await prisma.studyGroup.deleteMany({
      where: { id: groupId, ownerId: userId },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/study-groups]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
