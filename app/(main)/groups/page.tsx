'use client'

import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Users,
  Search,
  Plus,
  ChevronDown,
  ArrowRight,
  Clock,
  FlaskConical,
  BookOpen,
  Code,
  Loader2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from 'components/ui/dialog'
import { authClient } from '@/lib/auth-client'

type Group = {
  id: string
  name: string
  subject: string
  capacity: number
  max: number
  schedule: string
  status: 'Active' | 'Full' | 'Recruiting'
  accent: 'blue' | 'indigo' | 'emerald' | 'rose' | 'purple'
  desc: string
  privacy?: 'Public' | 'Private'
}

type ApiGroup = {
  id: string
  name: string
  description: string | null
  subject: string | null
  maxMembers: number | null
  isPrivate: boolean
  _count: { members: number }
}

function subjectToAccent(subject: string | null): Group['accent'] {
  switch (subject) {
    case 'Mathematics':
      return 'blue'
    case 'Computer Science':
      return 'indigo'
    case 'History':
      return 'rose'
    case 'Physics':
      return 'purple'
    case 'Science':
      return 'emerald'
    default:
      return 'purple'
  }
}

function mapApiGroup(g: ApiGroup): Group {
  const capacity = g._count.members
  const max = g.maxMembers ?? 99
  const status: Group['status'] = capacity >= max && max > 0 ? 'Full' : 'Active'
  return {
    id: g.id,
    name: g.name,
    subject: g.subject ?? 'General',
    capacity,
    max,
    schedule: 'TBD',
    status,
    accent: subjectToAccent(g.subject),
    desc: g.description ?? 'No description provided.',
    privacy: g.isPrivate ? 'Private' : 'Public',
  }
}

const subjects = [
  'All Subjects',
  'Mathematics',
  'Computer Science',
  'Literature',
  'History',
  'Physics',
  'Science',
  'Psychology',
  'Law',
]
const sortOptions = ['Most Popular', 'Newest', 'Soonest']

export default function StudyGroupsPage() {
  const { data: session } = authClient.useSession()
  const userId = session?.user?.id

  const [allGroups, setAllGroups] = useState<Group[]>([])
  const [joinedGroupIds, setJoinedGroupIds] = useState<Set<string>>(new Set())
  const [loadingGroups, setLoadingGroups] = useState(true)

  const [query, setQuery] = useState('')
  const [activeSubject, setActiveSubject] = useState('All Subjects')
  const [activeSort, setActiveSort] = useState('Most Popular')
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  const [formName, setFormName] = useState('')
  const [formSubject, setFormSubject] = useState('Mathematics')
  const [formTheme, setFormTheme] = useState<Group['accent']>('purple')
  const [formPrivacy, setFormPrivacy] = useState<'Public' | 'Private'>('Public')
  const [formDesc, setFormDesc] = useState('')
  const [formMax, setFormMax] = useState(12)
  const [formSchedule, setFormSchedule] = useState('TBD')

  useEffect(() => {
    async function fetchGroups() {
      setLoadingGroups(true)
      try {
        const [publicRes, myRes] = await Promise.all([
          fetch('/api/study-groups'),
          userId
            ? fetch(`/api/study-groups?myGroups=true&userId=${userId}`)
            : Promise.resolve(null),
        ])

        const publicData = await publicRes.json()
        const mapped: Group[] = (publicData.groups ?? []).map((g: ApiGroup) => mapApiGroup(g))
        setAllGroups(mapped)

        if (myRes) {
          const myData = await myRes.json()
          const ids = new Set<string>((myData.groups ?? []).map((g: ApiGroup) => g.id))
          setJoinedGroupIds(ids)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingGroups(false)
      }
    }
    fetchGroups()
  }, [userId])

  const filtered = useMemo(() => {
    let list = allGroups.filter(
      (g) =>
        (activeSubject === 'All Subjects' || g.subject === activeSubject) &&
        (query.trim().length === 0 || g.name.toLowerCase().includes(query.toLowerCase()))
    )
    if (activeSort === 'Most Popular') {
      list = [...list].sort((a, b) => b.capacity / b.max - a.capacity / a.max)
    } else if (activeSort === 'Newest') {
      list = [...list].reverse()
    }
    return list
  }, [activeSubject, activeSort, query, allGroups])

  const joined = filtered.filter((g) => joinedGroupIds.has(g.id))
  const discover = filtered.filter((g) => !joinedGroupIds.has(g.id))

  async function handleCreate() {
    if (!userId || !formName.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/study-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: userId,
          name: formName.trim(),
          description: formDesc || null,
          subject: formSubject,
          maxMembers: formMax,
          isPrivate: formPrivacy === 'Private',
        }),
      })
      const data = await res.json()
      if (data.group) {
        const newGroup = mapApiGroup({ ...data.group, _count: { members: 1 } })
        setAllGroups((prev) => [newGroup, ...prev])
        setJoinedGroupIds((prev) => new Set([...prev, newGroup.id]))
      }
      setCreateOpen(false)
      setFormName('')
      setFormDesc('')
      setFormMax(12)
      setFormSchedule('TBD')
      setFormSubject('Mathematics')
      setFormTheme('purple')
      setFormPrivacy('Public')
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden bg-white text-gray-900 dark:bg-[#0F1115] dark:text-white">
      <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-[#151921]">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 p-2">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl leading-tight font-bold">Study Groups</h1>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
              <span className="font-bold text-purple-400">Community</span>
              <span>•</span>
              <span>Join or create a group</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-gray-700 dark:border-gray-800 dark:bg-[#1E2330] dark:text-gray-300">
                <span className="text-xs">{activeSort}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {sortOptions.map((opt) => (
                <DropdownMenuItem key={opt} onClick={() => setActiveSort(opt)}>
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search groups..."
              className="w-64 rounded-full border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500/40 focus:outline-none dark:border-gray-800 dark:bg-[#1E2330] dark:text-gray-300"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            className="rounded-lg bg-purple-600 text-white hover:bg-purple-500"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Group
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                activeSubject === s
                  ? 'border-purple-500/40 bg-gray-100 text-gray-900 dark:bg-[#1E2330] dark:text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-[#151921] dark:text-gray-300 dark:hover:bg-[#1E2330]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-300">Your Groups</h2>
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg border-gray-700 hover:bg-[#1E2330]"
            onClick={() => setCreateOpen(true)}
          >
            Create Group
          </Button>
        </div>

        {loadingGroups ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
          </div>
        ) : (
          <>
            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {joined.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center dark:border-gray-700 dark:bg-[#151921]">
                  <div className="mb-1 font-bold">No groups yet</div>
                  <div className="mb-3 text-xs text-gray-400">
                    Join a group below to get started.
                  </div>
                </div>
              ) : (
                joined.map((g) => <GroupCard key={g.id} g={g} joined />)
              )}
            </div>

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-300">Discover Groups</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {discover.map((g) => (
                <GroupCard key={g.id} g={g} joined={false} />
              ))}

              <button
                onClick={() => setCreateOpen(true)}
                className="group flex items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-6 hover:border-gray-400 dark:border-gray-700 dark:bg-[#151921] dark:hover:border-gray-600"
              >
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 group-hover:bg-gray-200 dark:bg-[#1E2330] dark:group-hover:bg-[#252b3b]">
                    <Plus className="h-5 w-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-white" />
                  </div>
                  <div className="font-bold">Create a New Group</div>
                  <div className="mt-1 text-xs text-gray-400">Start your own study circle.</div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="border border-white/10 bg-[#0F1622] text-white sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription className="text-xs text-gray-400">
              Fill in the details to create your study group.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-gray-300">Group Name</label>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Linear Algebra Study"
                className="h-10 w-full rounded-lg border border-white/10 bg-[#0E141E] px-3 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Subject</label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="h-10 w-full rounded-lg border border-white/10 bg-[#0E141E] px-3 text-sm"
                >
                  {subjects
                    .filter((s) => s !== 'All Subjects')
                    .map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Theme</label>
                <select
                  value={formTheme}
                  onChange={(e) => setFormTheme(e.target.value as Group['accent'])}
                  className="h-10 w-full rounded-lg border border-white/10 bg-[#0E141E] px-3 text-sm"
                >
                  <option value="purple">Purple</option>
                  <option value="blue">Blue</option>
                  <option value="indigo">Indigo</option>
                  <option value="emerald">Emerald</option>
                  <option value="rose">Rose</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Privacy</label>
                <select
                  value={formPrivacy}
                  onChange={(e) => setFormPrivacy(e.target.value as 'Public' | 'Private')}
                  className="h-10 w-full rounded-lg border border-white/10 bg-[#0E141E] px-3 text-sm"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Max Members</label>
                <input
                  type="number"
                  min={2}
                  max={200}
                  value={formMax}
                  onChange={(e) => setFormMax(parseInt(e.target.value || '12'))}
                  className="h-10 w-full rounded-lg border border-white/10 bg-[#0E141E] px-3 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-300">Schedule</label>
              <input
                value={formSchedule}
                onChange={(e) => setFormSchedule(e.target.value)}
                placeholder="e.g., Wed, 7PM"
                className="h-10 w-full rounded-lg border border-white/10 bg-[#0E141E] px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-300">Description</label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Brief description"
                className="min-h-[80px] w-full rounded-lg border border-white/10 bg-[#0E141E] px-3 py-2 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                className="rounded-lg border-white/10"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="rounded-lg bg-purple-600 text-white hover:bg-purple-500"
                disabled={!formName.trim() || creating}
                onClick={handleCreate}
              >
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function GroupCard({ g, joined }: { g: Group; joined: boolean }) {
  const accentClass =
    g.accent === 'blue'
      ? 'from-blue-600 to-blue-500'
      : g.accent === 'indigo'
        ? 'from-indigo-600 to-indigo-500'
        : g.accent === 'emerald'
          ? 'from-emerald-600 to-emerald-500'
          : g.accent === 'rose'
            ? 'from-rose-500 to-rose-400'
            : 'from-purple-600 to-purple-500'
  const isFull = g.status === 'Full'
  const isActive = g.status === 'Active'
  const SubjectIcon = (() => {
    if (g.subject === 'Science') return FlaskConical
    if (g.subject === 'Computer Science') return Code
    if (g.subject === 'History') return BookOpen
    return BookOpen
  })()

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-[#1E2A3A] dark:bg-[#0E141E]">
      <div className={`relative h-24 bg-gradient-to-br ${accentClass}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#ffffff33_1px,transparent_1px)] [background-size:20px_20px] opacity-25" />
        <div className="absolute top-1/2 left-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-xl border border-white/30 bg-white/15 backdrop-blur-sm">
          <SubjectIcon className="h-6 w-6 text-white/90" />
        </div>
        {isActive && (
          <div className="absolute top-3 right-3 rounded-full bg-emerald-500 px-2 py-1 text-[11px] font-bold text-white shadow">
            Active
          </div>
        )}
      </div>
      <div className="bg-gray-50 p-5 dark:bg-[#0F1622]">
        <div className="mb-2 inline-block rounded-full border border-gray-200 bg-gray-100 px-2 py-1 text-[11px] font-bold text-gray-600 dark:border-[#223247] dark:bg-[#111A29] dark:text-gray-300">
          {g.subject.toUpperCase()}
        </div>
        <div className="mb-1">
          <h3 className="font-bold text-gray-900 dark:text-white">{g.name}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">{g.desc}</p>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {g.capacity}/{g.max}
          </span>
          <div className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {g.schedule}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 pb-5 dark:bg-[#0F1622]">
        {joined ? (
          <Link href={`/groups/${g.id}`}>
            <button className="flex h-10 w-full items-center justify-center rounded-lg border border-blue-600 bg-transparent font-semibold text-blue-400 hover:bg-blue-600/10">
              Open Group <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        ) : isFull ? (
          <button className="h-10 w-full cursor-not-allowed rounded-lg border border-[#264777] bg-transparent text-gray-500">
            Group Full
          </button>
        ) : (
          <Link href={`/groups/${g.id}`}>
            <button className="flex h-10 w-full items-center justify-center rounded-lg border border-blue-600 bg-transparent font-semibold text-blue-400 hover:bg-blue-600/10">
              Join Group <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}
