import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/user/xp — award XP to a user
export async function POST(req: NextRequest) {
  const { userId, amount, actionType, description } = await req.json()
  if (!userId || !amount || !actionType)
    return NextResponse.json({ error: 'userId, amount, actionType required' }, { status: 400 })

  try {
    const updatedUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: { xp: { increment: amount } },
      })

      await tx.pointTransaction.create({
        data: {
          userId,
          actionType,
          points: amount,
          description: description ?? null,
        },
      })

      return user
    })

    return NextResponse.json({
      success: true,
      profile: {
        xp: updatedUser.xp,
        level: updatedUser.level,
      },
    })
  } catch (err) {
    console.error('[POST /api/user/xp]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
