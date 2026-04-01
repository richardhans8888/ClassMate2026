import { NextRequest } from 'next/server'
import { POST, GET } from '@/app/api/connections/route'
import { PATCH, DELETE } from '@/app/api/connections/[id]/route'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/auth', () => ({ getSession: jest.fn() }))
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    connection: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}))

afterEach(() => {
  jest.clearAllMocks()
})

// ---------------------------------------------------------------------------
// POST /api/connections
// ---------------------------------------------------------------------------

describe('POST /api/connections', () => {
  it('returns 401 when unauthenticated', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId: 'user-2' }),
    })
    const res = await POST(req)

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toMatch(/unauthorized/i)
  })

  it('returns 400 when recipientId is missing', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })

    const req = new NextRequest('http://localhost/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/recipientId/i)
  })

  it('returns 400 when connecting to self', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })

    const req = new NextRequest('http://localhost/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId: 'user-1' }),
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/yourself/i)
  })

  it('returns 404 when recipient does not exist', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId: 'nonexistent' }),
    })
    const res = await POST(req)

    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toMatch(/not found/i)
  })

  it('returns 409 when already connected', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user-2' })
    ;(prisma.connection.findFirst as jest.Mock).mockResolvedValue({
      id: 'conn-1',
      senderId: 'user-1',
      recipientId: 'user-2',
      status: 'ACCEPTED',
    })

    const req = new NextRequest('http://localhost/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId: 'user-2' }),
    })
    const res = await POST(req)

    expect(res.status).toBe(409)
    const data = await res.json()
    expect(data.error).toMatch(/already connected/i)
  })

  it('returns 409 when request already sent', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user-2' })
    ;(prisma.connection.findFirst as jest.Mock).mockResolvedValue({
      id: 'conn-1',
      senderId: 'user-1',
      recipientId: 'user-2',
      status: 'PENDING',
    })

    const req = new NextRequest('http://localhost/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId: 'user-2' }),
    })
    const res = await POST(req)

    expect(res.status).toBe(409)
    const data = await res.json()
    expect(data.error).toMatch(/already sent/i)
  })

  it('auto-accepts when reverse PENDING request exists', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user-2' })
    ;(prisma.connection.findFirst as jest.Mock).mockResolvedValue({
      id: 'conn-1',
      senderId: 'user-2',
      recipientId: 'user-1',
      status: 'PENDING',
    })
    ;(prisma.connection.update as jest.Mock).mockResolvedValue({
      id: 'conn-1',
      senderId: 'user-2',
      recipientId: 'user-1',
      status: 'ACCEPTED',
    })

    const req = new NextRequest('http://localhost/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId: 'user-2' }),
    })
    const res = await POST(req)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.connection.status).toBe('ACCEPTED')
    expect(prisma.connection.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'ACCEPTED' } })
    )
  })

  it('creates a PENDING connection request', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user-2' })
    ;(prisma.connection.findFirst as jest.Mock).mockResolvedValue(null)
    ;(prisma.connection.create as jest.Mock).mockResolvedValue({
      id: 'conn-new',
      senderId: 'user-1',
      recipientId: 'user-2',
      status: 'PENDING',
    })

    const req = new NextRequest('http://localhost/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId: 'user-2' }),
    })
    const res = await POST(req)

    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.connection.status).toBe('PENDING')
    expect(data.connection.senderId).toBe('user-1')
    expect(prisma.connection.create).toHaveBeenCalledWith({
      data: { senderId: 'user-1', recipientId: 'user-2', status: 'PENDING' },
    })
  })
})

// ---------------------------------------------------------------------------
// GET /api/connections
// ---------------------------------------------------------------------------

describe('GET /api/connections', () => {
  it('returns 401 when unauthenticated', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/connections?status=accepted')
    const res = await GET(req)

    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid status filter', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })

    const req = new NextRequest('http://localhost/api/connections?status=invalid')
    const res = await GET(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/invalid status/i)
  })

  it('returns accepted connections for current user', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    const mockConnections = [
      {
        id: 'conn-1',
        senderId: 'user-1',
        recipientId: 'user-2',
        status: 'ACCEPTED',
        sender: { id: 'user-1', name: 'Alice', profile: null },
        recipient: { id: 'user-2', name: 'Bob', profile: null },
      },
    ]
    ;(prisma.connection.findMany as jest.Mock).mockResolvedValue(mockConnections)

    const req = new NextRequest('http://localhost/api/connections?status=accepted')
    const res = await GET(req)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.connections).toHaveLength(1)
    expect(data.connections[0].id).toBe('conn-1')
  })

  it('returns pending_received connections', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.connection.findMany as jest.Mock).mockResolvedValue([])

    const req = new NextRequest('http://localhost/api/connections?status=pending_received')
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(prisma.connection.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { recipientId: 'user-1', status: 'PENDING' },
      })
    )
  })

  it('returns pending_sent connections', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.connection.findMany as jest.Mock).mockResolvedValue([])

    const req = new NextRequest('http://localhost/api/connections?status=pending_sent')
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(prisma.connection.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { senderId: 'user-1', status: 'PENDING' },
      })
    )
  })
})

// ---------------------------------------------------------------------------
// PATCH /api/connections/[id]
// ---------------------------------------------------------------------------

describe('PATCH /api/connections/[id]', () => {
  it('returns 401 when unauthenticated', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/connections/conn-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ACCEPTED' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'conn-1' }) })

    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid status value', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })

    const req = new NextRequest('http://localhost/api/connections/conn-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'INVALID' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'conn-1' }) })

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/ACCEPTED or REJECTED/i)
  })

  it('returns 404 when connection does not exist', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.connection.findUnique as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/connections/nonexistent', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ACCEPTED' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'nonexistent' }) })

    expect(res.status).toBe(404)
  })

  it('returns 403 when user is not the recipient', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.connection.findUnique as jest.Mock).mockResolvedValue({
      id: 'conn-1',
      senderId: 'user-2',
      recipientId: 'user-3',
      status: 'PENDING',
    })

    const req = new NextRequest('http://localhost/api/connections/conn-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ACCEPTED' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'conn-1' }) })

    expect(res.status).toBe(403)
  })

  it('returns 409 when connection is not pending', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.connection.findUnique as jest.Mock).mockResolvedValue({
      id: 'conn-1',
      senderId: 'user-2',
      recipientId: 'user-1',
      status: 'ACCEPTED',
    })

    const req = new NextRequest('http://localhost/api/connections/conn-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ACCEPTED' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'conn-1' }) })

    expect(res.status).toBe(409)
    const data = await res.json()
    expect(data.error).toMatch(/no longer pending/i)
  })

  it('accepts the connection when recipient calls with ACCEPTED', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.connection.findUnique as jest.Mock).mockResolvedValue({
      id: 'conn-1',
      senderId: 'user-2',
      recipientId: 'user-1',
      status: 'PENDING',
    })
    ;(prisma.connection.update as jest.Mock).mockResolvedValue({
      id: 'conn-1',
      status: 'ACCEPTED',
    })

    const req = new NextRequest('http://localhost/api/connections/conn-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ACCEPTED' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'conn-1' }) })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.connection.status).toBe('ACCEPTED')
  })

  it('rejects the connection when recipient calls with REJECTED', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.connection.findUnique as jest.Mock).mockResolvedValue({
      id: 'conn-1',
      senderId: 'user-2',
      recipientId: 'user-1',
      status: 'PENDING',
    })
    ;(prisma.connection.update as jest.Mock).mockResolvedValue({
      id: 'conn-1',
      status: 'REJECTED',
    })

    const req = new NextRequest('http://localhost/api/connections/conn-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'REJECTED' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'conn-1' }) })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.connection.status).toBe('REJECTED')
  })
})

// ---------------------------------------------------------------------------
// DELETE /api/connections/[id]
// ---------------------------------------------------------------------------

describe('DELETE /api/connections/[id]', () => {
  it('returns 401 when unauthenticated', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/connections/conn-1', {
      method: 'DELETE',
    })
    const res = await DELETE(req, { params: Promise.resolve({ id: 'conn-1' }) })

    expect(res.status).toBe(401)
  })

  it('returns 404 when connection does not exist', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.connection.findUnique as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/connections/nonexistent', {
      method: 'DELETE',
    })
    const res = await DELETE(req, { params: Promise.resolve({ id: 'nonexistent' }) })

    expect(res.status).toBe(404)
  })

  it('returns 403 when user is neither sender nor recipient', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-3', email: 'u3@test.com' })
    ;(prisma.connection.findUnique as jest.Mock).mockResolvedValue({
      id: 'conn-1',
      senderId: 'user-1',
      recipientId: 'user-2',
      status: 'ACCEPTED',
    })

    const req = new NextRequest('http://localhost/api/connections/conn-1', {
      method: 'DELETE',
    })
    const res = await DELETE(req, { params: Promise.resolve({ id: 'conn-1' }) })

    expect(res.status).toBe(403)
  })

  it('allows sender to delete the connection', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'u1@test.com' })
    ;(prisma.connection.findUnique as jest.Mock).mockResolvedValue({
      id: 'conn-1',
      senderId: 'user-1',
      recipientId: 'user-2',
      status: 'ACCEPTED',
    })
    ;(prisma.connection.delete as jest.Mock).mockResolvedValue({})

    const req = new NextRequest('http://localhost/api/connections/conn-1', {
      method: 'DELETE',
    })
    const res = await DELETE(req, { params: Promise.resolve({ id: 'conn-1' }) })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(prisma.connection.delete).toHaveBeenCalledWith({ where: { id: 'conn-1' } })
  })

  it('allows recipient to delete the connection', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user-2', email: 'u2@test.com' })
    ;(prisma.connection.findUnique as jest.Mock).mockResolvedValue({
      id: 'conn-1',
      senderId: 'user-1',
      recipientId: 'user-2',
      status: 'ACCEPTED',
    })
    ;(prisma.connection.delete as jest.Mock).mockResolvedValue({})

    const req = new NextRequest('http://localhost/api/connections/conn-1', {
      method: 'DELETE',
    })
    const res = await DELETE(req, { params: Promise.resolve({ id: 'conn-1' }) })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
  })
})
