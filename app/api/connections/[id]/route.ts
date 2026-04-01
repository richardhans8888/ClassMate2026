import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH /api/connections/[id] — accept or reject a connection request
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { status } = await req.json()

    if (status !== 'ACCEPTED' && status !== 'REJECTED') {
      return NextResponse.json({ error: 'status must be ACCEPTED or REJECTED' }, { status: 400 })
    }

    const connection = await prisma.connection.findUnique({ where: { id } })
    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 })
    }

    // Only the recipient can accept or reject
    if (connection.recipientId !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (connection.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Connection request is no longer pending' },
        { status: 409 }
      )
    }

    const updated = await prisma.connection.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ connection: updated })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/connections/[id] — remove a connection (sender or recipient can remove)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const connection = await prisma.connection.findUnique({ where: { id } })
    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 })
    }

    if (connection.senderId !== session.id && connection.recipientId !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.connection.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
