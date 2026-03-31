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

export async function uploadFile(file: File, userId: string): Promise<string> {
  const ext = path.extname(file.name).toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error(`File extension ${ext} is not allowed`)
  }

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
