import fs from 'fs'
import path from 'path'
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
      select: { id: true, fileUrl: true, title: true, fileType: true },
    })

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }

    if (!material.fileUrl.startsWith('/uploads/')) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    const uploadsBase = path.resolve(process.cwd(), 'public', 'uploads')
    // path.join keeps absolute fileUrl segments relative to cwd; path.resolve then normalizes ..
    const filePath = path.resolve(path.join(process.cwd(), 'public', material.fileUrl))
    if (!filePath.startsWith(uploadsBase + path.sep)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found on server' }, { status: 404 })
    }

    await prisma.studyMaterial.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    })

    const fileBuffer = fs.readFileSync(filePath)
    const filename = `${material.title}.${material.fileType}`

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Content-Length': String(fileBuffer.length),
      },
    })
  } catch (error) {
    console.error('Material download error:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}
