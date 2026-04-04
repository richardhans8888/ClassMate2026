import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, writeLimiter } from '@/lib/rate-limit'

export async function POST(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await checkRateLimit(session.id, writeLimiter)
    if (limited) return limited

    const { id } = await context.params

    const material = await prisma.studyMaterial.findUnique({
      where: { id },
      select: { id: true, fileUrl: true },
    })

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }

    await prisma.studyMaterial.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    })

    return NextResponse.json({ success: true, downloadUrl: material.fileUrl })
  } catch (error) {
    console.error('Material download tracking error:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}
