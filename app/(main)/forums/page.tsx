import { redirect } from 'next/navigation'
import { ForumList } from '@/components/features/forums/ForumList'
import { getSession } from '@/lib/auth'

export default async function ForumsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="px-4 py-4 sm:px-6 md:px-12 lg:px-16">
      <ForumList />
    </div>
  )
}
