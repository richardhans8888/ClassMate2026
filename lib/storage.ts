import fs from 'fs/promises'
import path from 'path'

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads')

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.ppt',
  '.pptx',
  '.xls',
  '.xlsx',
  '.txt',
  '.md',
  '.zip',
])

/**
 * Magic-byte signatures for binary file types.
 * Each entry maps an extension to one or more acceptable byte sequences at the
 * start of the file. Extensions not listed here (txt, md) are text-only and
 * have no reliable magic bytes, so they are validated by extension alone.
 */
const MAGIC_BYTES: Record<string, number[][]> = {
  // %PDF
  '.pdf': [[0x25, 0x50, 0x44, 0x46]],
  // ZIP local-file header (DOCX / XLSX / PPTX / ZIP are all ZIP-based)
  '.zip': [[0x50, 0x4b, 0x03, 0x04]],
  '.docx': [[0x50, 0x4b, 0x03, 0x04]],
  '.xlsx': [[0x50, 0x4b, 0x03, 0x04]],
  '.pptx': [[0x50, 0x4b, 0x03, 0x04]],
  // OLE2 compound-document header (legacy DOC / XLS / PPT)
  '.doc': [[0xd0, 0xcf, 0x11, 0xe0]],
  '.xls': [[0xd0, 0xcf, 0x11, 0xe0]],
  '.ppt': [[0xd0, 0xcf, 0x11, 0xe0]],
}

function matchesMagicBytes(buffer: Buffer, signatures: number[][]): boolean {
  return signatures.some((sig) => sig.every((byte, i) => buffer[i] === byte))
}

async function validateMimeFromBuffer(file: File, ext: string): Promise<void> {
  const signatures = MAGIC_BYTES[ext]
  if (!signatures) {
    // No magic-byte rule for this extension (txt, md) — accept as-is
    return
  }

  // Read only the first 8 bytes to check the signature
  const slice = file.slice(0, 8)
  const arrayBuffer = await slice.arrayBuffer()
  const header = Buffer.from(arrayBuffer)

  if (!matchesMagicBytes(header, signatures)) {
    throw new Error(
      `File content does not match expected format for ${ext}. The file may be corrupt or misnamed.`
    )
  }
}

export async function uploadFile(file: File, userId: string): Promise<string> {
  const ext = path.extname(file.name).toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error(`File extension ${ext} is not allowed`)
  }

  await validateMimeFromBuffer(file, ext)

  const uniqueName = `${crypto.randomUUID()}${ext}`
  const userDir = path.join(UPLOADS_DIR, userId)
  await fs.mkdir(userDir, { recursive: true })

  const filePath = path.join(userDir, uniqueName)
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(filePath, buffer)

  return `/uploads/${userId}/${uniqueName}`
}

export async function deleteFile(fileUrl: string): Promise<void> {
  if (!fileUrl.startsWith('/uploads/')) return
  const filePath = path.join(process.cwd(), 'public', fileUrl)
  try {
    await fs.unlink(filePath)
  } catch {
    // File may not exist; ignore
  }
}
