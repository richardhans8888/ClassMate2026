import path from 'path'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadFile } from '@/lib/storage'
import { sanitizeText } from '@/lib/sanitize'

const ALLOWED_FILE_TYPES = [
  'pdf',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'xls',
  'xlsx',
  'txt',
  'md',
  'zip',
] as const

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024

type SortBy = 'createdAt' | 'downloads' | 'rating'

function normalizeSortBy(input: string | null): SortBy {
  if (input === 'downloads' || input === 'rating') {
    return input
  }
  return 'createdAt'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')
    const userId = searchParams.get('userId')
    const sortBy = normalizeSortBy(searchParams.get('sortBy'))

    const where: { subject?: string; userId?: string } = {}
    if (subject) {
      where.subject = sanitizeText(subject)
    }
    if (userId) {
      where.userId = userId
    }

    const orderBy =
      sortBy === 'downloads'
        ? { downloads: 'desc' as const }
        : sortBy === 'rating'
          ? { rating: 'desc' as const }
          : { createdAt: 'desc' as const }

    const materials = await prisma.studyMaterial.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ materials })
  } catch (error) {
    console.error('Materials GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()

    const file = formData.get('file')
    const titleRaw = formData.get('title')
    const descriptionRaw = formData.get('description')
    const subjectRaw = formData.get('subject')

    if (!(file instanceof File) || !titleRaw || !subjectRaw) {
      return NextResponse.json({ error: 'file, title, and subject are required' }, { status: 400 })
    }

    const fileExt = path.extname(file.name).toLowerCase().replace('.', '')
    if (!ALLOWED_FILE_TYPES.includes(fileExt as (typeof ALLOWED_FILE_TYPES)[number])) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${ALLOWED_FILE_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File size exceeds 50MB limit (${MAX_FILE_SIZE_BYTES} bytes)` },
        { status: 400 }
      )
    }

    const sanitizedTitle = sanitizeText(String(titleRaw))
    const sanitizedDescription = descriptionRaw ? sanitizeText(String(descriptionRaw)) : null
    const sanitizedSubject = sanitizeText(String(subjectRaw))

    if (!sanitizedTitle || !sanitizedSubject) {
      return NextResponse.json(
        { error: 'title and subject must contain valid text' },
        { status: 400 }
      )
    }

    const fileUrl = await uploadFile(file, session.id)

    const createdMaterial = await prisma.studyMaterial.create({
      data: {
        userId: session.id,
        title: sanitizedTitle,
        description: sanitizedDescription,
        fileUrl,
        subject: sanitizedSubject,
        fileType: fileExt,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: { select: { displayName: true, avatarUrl: true } },
          },
        },
      },
    })

    return NextResponse.json({ material: createdMaterial }, { status: 201 })
  } catch (error) {
    console.error('Materials POST error:', error)
    return NextResponse.json({ error: 'Failed to create material' }, { status: 500 })
  }
}
