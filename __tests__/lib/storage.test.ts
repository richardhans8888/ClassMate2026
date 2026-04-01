import path from 'path'
import fs from 'fs/promises'
import { uploadFile, deleteFile } from '@/lib/storage'

jest.mock('fs/promises')

const mockFs = fs as jest.Mocked<typeof fs>

// Stable UUID for predictable assertions
const FIXED_UUID = '00000000-0000-0000-0000-000000000001'
jest.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(FIXED_UUID)

function makeFile(name: string, bytes: number[]): File {
  const buffer = new Uint8Array(bytes)
  return new File([buffer], name)
}

function makeTextFile(name: string, content = 'hello'): File {
  return new File([content], name, { type: 'text/plain' })
}

beforeEach(() => {
  jest.clearAllMocks()
  mockFs.mkdir.mockResolvedValue(undefined)
  mockFs.writeFile.mockResolvedValue(undefined)
  mockFs.unlink.mockResolvedValue(undefined)
})

describe('uploadFile', () => {
  describe('extension validation', () => {
    it('rejects disallowed extensions', async () => {
      const file = new File(['content'], 'malware.exe')
      await expect(uploadFile(file, 'user1')).rejects.toThrow('.exe is not allowed')
    })

    it('rejects files with no extension', async () => {
      const file = new File(['content'], 'noextension')
      await expect(uploadFile(file, 'user1')).rejects.toThrow('is not allowed')
    })

    it('is case-insensitive for extensions', async () => {
      // PDF magic bytes: %PDF
      const file = makeFile('TEST.PDF', [0x25, 0x50, 0x44, 0x46])
      const url = await uploadFile(file, 'user1')
      expect(url).toMatch(/\.pdf$/)
    })
  })

  describe('magic-byte validation', () => {
    it('accepts a valid PDF file', async () => {
      const file = makeFile('notes.pdf', [0x25, 0x50, 0x44, 0x46, 0x00, 0x00, 0x00, 0x00])
      await expect(uploadFile(file, 'user1')).resolves.toBeDefined()
    })

    it('rejects a PDF with wrong magic bytes', async () => {
      const file = makeFile('fake.pdf', [0x00, 0x01, 0x02, 0x03])
      await expect(uploadFile(file, 'user1')).rejects.toThrow(
        'File content does not match expected format for .pdf'
      )
    })

    it('accepts a valid DOCX file (ZIP header)', async () => {
      const file = makeFile('report.docx', [0x50, 0x4b, 0x03, 0x04, 0x00, 0x00, 0x00, 0x00])
      await expect(uploadFile(file, 'user1')).resolves.toBeDefined()
    })

    it('rejects a DOCX with wrong magic bytes', async () => {
      const file = makeFile('fake.docx', [0x00, 0x01, 0x02, 0x03])
      await expect(uploadFile(file, 'user1')).rejects.toThrow(
        'File content does not match expected format for .docx'
      )
    })

    it('accepts a valid XLSX file (ZIP header)', async () => {
      const file = makeFile('data.xlsx', [0x50, 0x4b, 0x03, 0x04, 0x00, 0x00, 0x00, 0x00])
      await expect(uploadFile(file, 'user1')).resolves.toBeDefined()
    })

    it('accepts a valid PPTX file (ZIP header)', async () => {
      const file = makeFile('slides.pptx', [0x50, 0x4b, 0x03, 0x04, 0x00, 0x00, 0x00, 0x00])
      await expect(uploadFile(file, 'user1')).resolves.toBeDefined()
    })

    it('accepts a valid ZIP file', async () => {
      const file = makeFile('archive.zip', [0x50, 0x4b, 0x03, 0x04, 0x00, 0x00, 0x00, 0x00])
      await expect(uploadFile(file, 'user1')).resolves.toBeDefined()
    })

    it('accepts a valid DOC file (OLE2 header)', async () => {
      const file = makeFile('doc.doc', [0xd0, 0xcf, 0x11, 0xe0, 0x00, 0x00, 0x00, 0x00])
      await expect(uploadFile(file, 'user1')).resolves.toBeDefined()
    })

    it('accepts a valid XLS file (OLE2 header)', async () => {
      const file = makeFile('sheet.xls', [0xd0, 0xcf, 0x11, 0xe0, 0x00, 0x00, 0x00, 0x00])
      await expect(uploadFile(file, 'user1')).resolves.toBeDefined()
    })

    it('accepts a valid PPT file (OLE2 header)', async () => {
      const file = makeFile('slides.ppt', [0xd0, 0xcf, 0x11, 0xe0, 0x00, 0x00, 0x00, 0x00])
      await expect(uploadFile(file, 'user1')).resolves.toBeDefined()
    })

    it('accepts a TXT file without magic-byte check', async () => {
      const file = makeTextFile('readme.txt')
      await expect(uploadFile(file, 'user1')).resolves.toBeDefined()
    })

    it('accepts a MD file without magic-byte check', async () => {
      const file = makeTextFile('notes.md', '# Heading')
      await expect(uploadFile(file, 'user1')).resolves.toBeDefined()
    })
  })

  describe('file storage', () => {
    it('creates user directory with recursive flag', async () => {
      const file = makeFile('notes.pdf', [0x25, 0x50, 0x44, 0x46])
      await uploadFile(file, 'user42')
      expect(mockFs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining(path.join('uploads', 'user42')),
        { recursive: true }
      )
    })

    it('writes file to disk', async () => {
      const file = makeFile('notes.pdf', [0x25, 0x50, 0x44, 0x46])
      await uploadFile(file, 'user42')
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('user42'),
        expect.any(Buffer)
      )
    })

    it('returns a URL path under /uploads/<userId>/', async () => {
      const file = makeFile('notes.pdf', [0x25, 0x50, 0x44, 0x46])
      const url = await uploadFile(file, 'user42')
      expect(url).toBe(`/uploads/user42/${FIXED_UUID}.pdf`)
    })

    it('uses a UUID in the filename (not original name)', async () => {
      const file = makeFile('my secret notes.pdf', [0x25, 0x50, 0x44, 0x46])
      const url = await uploadFile(file, 'user1')
      expect(url).not.toContain('my secret notes')
      expect(url).toContain(FIXED_UUID)
    })
  })
})

describe('deleteFile', () => {
  it('deletes an existing upload file', async () => {
    await deleteFile('/uploads/user1/some-file.pdf')
    expect(mockFs.unlink).toHaveBeenCalledWith(
      expect.stringContaining(path.join('public', 'uploads', 'user1', 'some-file.pdf'))
    )
  })

  it('ignores URLs that do not start with /uploads/', async () => {
    await deleteFile('https://example.com/file.pdf')
    expect(mockFs.unlink).not.toHaveBeenCalled()
  })

  it('silently swallows ENOENT (file not found)', async () => {
    const err = Object.assign(new Error('ENOENT'), { code: 'ENOENT' })
    mockFs.unlink.mockRejectedValueOnce(err)
    await expect(deleteFile('/uploads/user1/gone.pdf')).resolves.toBeUndefined()
  })

  it('silently swallows any unlink error', async () => {
    mockFs.unlink.mockRejectedValueOnce(new Error('permission denied'))
    await expect(deleteFile('/uploads/user1/gone.pdf')).resolves.toBeUndefined()
  })
})
