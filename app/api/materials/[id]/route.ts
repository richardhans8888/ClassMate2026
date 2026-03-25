import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { canModerate } from '@/lib/authorize'
import { sanitizeText } from '@/lib/sanitize'

const USER_SELECT = {
  select: {
    id: true,
    email: true,
    profile: { select: { displayName: true, avatarUrl: true } },
  },
} as const

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    const material = await prisma.studyMaterial.findUnique({
      where: { id },
      include: { user: USER_SELECT },
    })

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }

    return NextResponse.json({ material }, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch material'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    const material = await prisma.studyMaterial.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }

    const authorized = await canModerate(session, material.userId)
    if (!authorized) {
      return NextResponse.json({ error: 'Not authorized to edit this material' }, { status: 403 })
    }

    const body = (await request.json()) as Record<string, unknown>
    const titleRaw = typeof body.title === 'string' ? body.title : undefined
    const descriptionRaw = typeof body.description === 'string' ? body.description : undefined
    const subjectRaw = typeof body.subject === 'string' ? body.subject : undefined

    const data: Record<string, unknown> = {}
    if (titleRaw !== undefined) {
      const sanitized = sanitizeText(titleRaw)
      if (!sanitized)
        return NextResponse.json({ error: 'title must contain valid text' }, { status: 400 })
      data.title = sanitized
    }
    if (descriptionRaw !== undefined) {
      data.description = sanitizeText(descriptionRaw) || null
    }
    if (subjectRaw !== undefined) {
      const sanitized = sanitizeText(subjectRaw)
      if (!sanitized)
        return NextResponse.json({ error: 'subject must contain valid text' }, { status: 400 })
      data.subject = sanitized
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const updated = await prisma.studyMaterial.update({
      where: { id },
      data,
      include: { user: USER_SELECT },
    })

    return NextResponse.json({ material: updated }, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update material'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    const material = await prisma.studyMaterial.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }

    const authorized = await canModerate(session, material.userId)
    if (!authorized) {
      return NextResponse.json({ error: 'Not authorized to delete this material' }, { status: 403 })
    }

    await prisma.studyMaterial.delete({ where: { id } })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete material'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
