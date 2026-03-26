import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/study-groups/[groupId]/join
export async function POST(req: NextRequest, context: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await context.params
  const { userId, inviteCode } = await req.json()
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  try {
    const group = await prisma.studyGroup.findUnique({ where: { id: groupId } })
    if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 })

    // Check private group invite code
    if (group.isPrivate && group.inviteCode !== inviteCode)
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 403 })

    // Check if already a member
    const existing = await prisma.studyGroupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    })
    if (existing) return NextResponse.json({ error: 'Already a member' }, { status: 400 })

    // Check max members
    if (group.maxMembers) {
      const count = await prisma.studyGroupMember.count({ where: { groupId } })
      if (count >= group.maxMembers)
        return NextResponse.json({ error: 'Group is full' }, { status: 400 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.studyGroupMember.create({
        data: { groupId, userId, role: 'member' },
      })

      await tx.studyGroup.update({
        where: { id: groupId },
        data: { memberCount: { increment: 1 } },
      })

      // Award XP for joining a group
      await tx.user.update({
        where: { id: userId },
        data: { xp: { increment: 20 } },
      })
      await tx.pointTransaction.create({
        data: {
          userId,
          actionType: 'STUDY_GROUP_JOINED',
          points: 20,
          description: 'Joined a study group',
        },
      })
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/study-groups/[groupId]/join]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/study-groups/[groupId]/join — leave group
export async function DELETE(req: NextRequest, context: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await context.params
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  try {
    const deleted = await prisma.studyGroupMember.deleteMany({
      where: { groupId, userId },
    })

    if (deleted.count > 0) {
      await prisma.studyGroup.update({
        where: { id: groupId },
        data: { memberCount: { decrement: 1 } },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/study-groups/[groupId]/join]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
