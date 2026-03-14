import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TutorSidebarClient } from './_components/TutorSidebarClient'

export default async function TutorStudioLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { role: true },
  })

  if (!user || user.role !== 'TUTOR') redirect('/dashboard')

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 dark:bg-[#0F1115] dark:text-white">
      <TutorSidebarClient />
      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-[#0F1115]">
        <div className="h-full p-8">{children}</div>
      </main>
    </div>
  )
}
