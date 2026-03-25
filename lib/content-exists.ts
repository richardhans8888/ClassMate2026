import { prisma } from '@/lib/prisma'

export const ALLOWED_CONTENT_TYPES = ['post', 'reply', 'material'] as const

export type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number]

export async function contentExists(
  contentType: AllowedContentType,
  contentId: string
): Promise<boolean> {
  if (contentType === 'post') {
    const post = await prisma.forumPost.findUnique({
      where: { id: contentId },
      select: { id: true },
    })
    return Boolean(post)
  }

  if (contentType === 'reply') {
    const reply = await prisma.forumReply.findUnique({
      where: { id: contentId },
      select: { id: true },
    })
    return Boolean(reply)
  }

  const material = await prisma.studyMaterial.findUnique({
    where: { id: contentId },
    select: { id: true },
  })
  return Boolean(material)
}
