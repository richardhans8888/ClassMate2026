import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/materials/route'
import { POST as downloadPOST } from '@/app/api/materials/[id]/download/route'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

jest.mock('@/lib/prisma')
jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}))

afterEach(() => {
  jest.clearAllMocks()
})

describe('/api/materials GET', () => {
  it('returns materials list', async () => {
    const mockMaterials = [{ id: '1', title: 'Test Material', subject: 'Math' }]
    ;(prisma.studyMaterial.findMany as jest.Mock).mockResolvedValue(mockMaterials)

    const request = new NextRequest('http://localhost/api/materials')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.materials).toEqual(mockMaterials)
  })

  it('filters by subject', async () => {
    ;(prisma.studyMaterial.findMany as jest.Mock).mockResolvedValue([])

    const request = new NextRequest('http://localhost/api/materials?subject=Physics')
    await GET(request)

    expect(prisma.studyMaterial.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { subject: 'Physics' },
      })
    )
  })
})

describe('/api/materials POST', () => {
  it('creates material with valid data', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user1' })
    ;(prisma.$transaction as jest.Mock).mockImplementation(async (callback) => callback(prisma))
    ;(prisma.studyMaterial.create as jest.Mock).mockResolvedValue({
      id: '1',
      title: 'Test',
      fileUrl: 'https://example.com/file.pdf',
      user: { id: 'user1', email: 'test@example.com', profile: null },
    })

    const request = new NextRequest('http://localhost/api/materials', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Material',
        fileUrl: 'https://example.com/file.pdf',
        subject: 'Math',
        fileType: 'pdf',
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    expect(response.status).toBe(201)
  })

  it('rejects unauthorized requests', async () => {
    ;(getSession as jest.Mock).mockResolvedValue(null)

    const request = new NextRequest('http://localhost/api/materials', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it('rejects invalid file types', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user1' })

    const request = new NextRequest('http://localhost/api/materials', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test',
        fileUrl: 'https://example.com/file.exe',
        subject: 'Math',
        fileType: 'exe',
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toContain('Invalid file type')
  })

  it('rejects oversized files', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user1' })

    const request = new NextRequest('http://localhost/api/materials', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test',
        fileUrl: 'https://example.com/file.pdf',
        subject: 'Math',
        fileType: 'pdf',
        fileSize: 60 * 1024 * 1024,
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toContain('50MB')
  })

  it('sanitizes XSS in title', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user1' })
    ;(prisma.$transaction as jest.Mock).mockImplementation(async (callback) => callback(prisma))
    ;(prisma.studyMaterial.create as jest.Mock).mockResolvedValue({ id: '1' })

    const request = new NextRequest('http://localhost/api/materials', {
      method: 'POST',
      body: JSON.stringify({
        title: '<script>alert("xss")</script>Safe Title',
        fileUrl: 'https://example.com/file.pdf',
        subject: 'Math',
        fileType: 'pdf',
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    await POST(request)

    expect(prisma.studyMaterial.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'Safe Title',
        }),
      })
    )
  })
})

describe('/api/materials/[id]/download POST', () => {
  it('tracks download and returns URL', async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ id: 'user1' })
    ;(prisma.studyMaterial.findUnique as jest.Mock).mockResolvedValue({
      id: 'material-1',
      fileUrl: 'https://example.com/file.pdf',
    })

    const req = new NextRequest('http://localhost/api/materials/material-1/download', {
      method: 'POST',
    })

    const response = await downloadPOST(req, { params: Promise.resolve({ id: 'material-1' }) })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.downloadUrl).toBe('https://example.com/file.pdf')
    expect(prisma.studyMaterial.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'material-1' },
      })
    )
  })
})
