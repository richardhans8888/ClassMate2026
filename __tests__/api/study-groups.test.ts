// app/api/study-groups/__tests__/route.test.ts
import { NextRequest } from 'next/server'
import { GET, POST, DELETE } from '@/app/api/study-groups/route'

jest.mock('@/lib/auth', () => ({ getSession: jest.fn() }))
jest.mock('@/lib/prisma')
import { prisma } from '@/lib/prisma'

afterEach(() => {
  jest.clearAllMocks()
})

describe('GET /api/study-groups', () => {
  it('returns 200 with an empty groups array when no filters are applied', async () => {
    ;(prisma.studyGroup.findMany as jest.Mock).mockResolvedValue([])
    const req = new NextRequest('http://localhost/api/study-groups')
    const res = await GET(req)

    expect(res.status).toBe(200)
    const body = (await res.json()) as { groups: unknown[] }
    expect(Array.isArray(body.groups)).toBe(true)
  })
})

describe('POST /api/study-groups', () => {
  it('returns 400 when name is missing', async () => {
    const req = new NextRequest('http://localhost/api/study-groups', {
      method: 'POST',
      body: JSON.stringify({ ownerId: 'user-1' }), // no name
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 when ownerId is missing', async () => {
    const req = new NextRequest('http://localhost/api/study-groups', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Group' }), // no ownerId
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/study-groups', () => {
  it('returns 400 when groupId is missing', async () => {
    const req = new NextRequest(
      'http://localhost/api/study-groups?userId=user-1'
      // groupId intentionally omitted
    )
    const res = await DELETE(req)

    expect(res.status).toBe(400)
    const body = (await res.json()) as { error: string }
    expect(body.error).toMatch(/groupId/i)
  })

  it('returns 400 when userId is missing', async () => {
    const req = new NextRequest(
      'http://localhost/api/study-groups?groupId=group-1'
      // userId intentionally omitted
    )
    const res = await DELETE(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 when both groupId and userId are missing', async () => {
    const req = new NextRequest('http://localhost/api/study-groups')
    const res = await DELETE(req)

    expect(res.status).toBe(400)
  })
})
