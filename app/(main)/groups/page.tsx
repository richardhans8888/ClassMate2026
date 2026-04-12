'use client'

import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PaginationControls } from '@/components/ui/pagination-controls'
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

  const [discoverGroups, setDiscoverGroups] = useState<Group[]>([])
  const [joinedGroups, setJoinedGroups] = useState<Group[]>([])
  const [loadingGroups, setLoadingGroups] = useState(true)

  const [discoverPage, setDiscoverPage] = useState(1)
  const [discoverTotalPages, setDiscoverTotalPages] = useState(1)
  const [yourGroupsPage, setYourGroupsPage] = useState(1)
  const [yourGroupsTotalPages, setYourGroupsTotalPages] = useState(1)

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
    async function fetchDiscover() {
      setLoadingGroups(true)
      try {
        const params = new URLSearchParams()
        params.set('page', String(discoverPage))
        params.set('limit', '12')
        if (activeSubject !== 'All Subjects') params.set('subject', activeSubject)
        const res = await fetch(`/api/study-groups?${params.toString()}`)
        const data = await res.json()
        const mapped: Group[] = (data.groups ?? []).map((g: ApiGroup) => mapApiGroup(g))
        setDiscoverGroups(mapped)
        setDiscoverTotalPages(data.meta?.pages ?? 1)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingGroups(false)
      }
    }
    void fetchDiscover()
  }, [discoverPage, activeSubject])

  useEffect(() => {
    if (!userId) {
      setJoinedGroups([])
      return
    }
    async function fetchYourGroups() {
      try {
        const params = new URLSearchParams()
        params.set('myGroups', 'true')
        params.set('userId', userId!)
        params.set('page', String(yourGroupsPage))
        params.set('limit', '12')
        if (activeSubject !== 'All Subjects') params.set('subject', activeSubject)
        const res = await fetch(`/api/study-groups?${params.toString()}`)
        const data = await res.json()
        const mapped: Group[] = (data.groups ?? []).map((g: ApiGroup) => mapApiGroup(g))
        setJoinedGroups(mapped)
        setYourGroupsTotalPages(data.meta?.pages ?? 1)
      } catch (err) {
        console.error(err)
      }
    }
    void fetchYourGroups()
  }, [yourGroupsPage, activeSubject, userId])

  const joined = useMemo(() => {
    let list = joinedGroups.filter(
      (g) => query.trim().length === 0 || g.name.toLowerCase().includes(query.toLowerCase())
    )
    if (activeSort === 'Most Popular') {
      list = [...list].sort((a, b) => b.capacity / b.max - a.capacity / a.max)
    } else if (activeSort === 'Newest') {
      list = [...list].reverse()
    }
    return list
  }, [joinedGroups, query, activeSort])

  const discover = useMemo(() => {
    let list = discoverGroups.filter(
      (g) => query.trim().length === 0 || g.name.toLowerCase().includes(query.toLowerCase())
    )
    if (activeSort === 'Most Popular') {
      list = [...list].sort((a, b) => b.capacity / b.max - a.capacity / a.max)
    } else if (activeSort === 'Newest') {
      list = [...list].reverse()
    }
    return list
  }, [discoverGroups, query, activeSort])

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
        setJoinedGroups((prev) => [newGroup, ...prev])
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
    <div className="bg-background text-foreground flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 md:px-12 lg:px-16">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-foreground text-2xl font-bold">Study Groups</h1>
            <p className="text-muted-foreground mt-1">
              Find and join study groups to collaborate with peers.
            </p>
          </div>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg sm:w-auto"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Group
          </Button>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="border-border bg-card text-foreground flex items-center gap-2 rounded-full border px-3 py-2 text-xs">
                  {activeSort}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {sortOptions.map((opt) => (
                  <DropdownMenuItem key={opt} onClick={() => setActiveSort(opt)}>
                    {opt}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative flex-1 sm:flex-none">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search groups..."
                className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-ring/40 w-full rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none sm:w-64"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => {
                setActiveSubject(s)
                setDiscoverPage(1)
                setYourGroupsPage(1)
              }}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                activeSubject === s
                  ? 'border-ring/40 bg-muted text-foreground'
                  : 'border-border bg-card text-foreground hover:bg-muted'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="text-muted-foreground text-sm font-semibold">Your Groups</h2>
        </div>

        {loadingGroups ? (
          <div className="flex justify-center py-12">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {joined.length === 0 ? (
                <div className="border-border bg-card rounded-xl border border-dashed p-6 text-center">
                  <div className="mb-1 font-bold">No groups yet</div>
                  <div className="text-muted-foreground mb-3 text-xs">
                    Join a group below to get started.
                  </div>
                </div>
              ) : (
                joined.map((g) => <GroupCard key={g.id} g={g} joined />)
              )}
            </div>
            {yourGroupsTotalPages > 1 && (
              <PaginationControls
                currentPage={yourGroupsPage}
                totalPages={yourGroupsTotalPages}
                onPrevious={() => setYourGroupsPage((p) => p - 1)}
                onNext={() => setYourGroupsPage((p) => p + 1)}
                isLoading={loadingGroups}
              />
            )}

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-muted-foreground text-sm font-semibold">Discover Groups</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {discover.map((g) => (
                <GroupCard key={g.id} g={g} joined={false} />
              ))}
            </div>
            {discoverTotalPages > 1 && (
              <PaginationControls
                currentPage={discoverPage}
                totalPages={discoverTotalPages}
                onPrevious={() => setDiscoverPage((p) => p - 1)}
                onNext={() => setDiscoverPage((p) => p + 1)}
                isLoading={loadingGroups}
              />
            )}
          </>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription className="text-xs">
              Fill in the details to create your study group.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div className="space-y-2">
              <label className="text-xs">Group Name</label>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Linear Algebra Study"
                className="border-border bg-card text-foreground placeholder:text-muted-foreground h-10 w-full rounded-lg border px-3 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs">Subject</label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="border-border bg-card text-foreground h-10 w-full rounded-lg border px-3 text-sm"
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
                <label className="text-xs">Theme</label>
                <select
                  value={formTheme}
                  onChange={(e) => setFormTheme(e.target.value as Group['accent'])}
                  className="border-border bg-card text-foreground h-10 w-full rounded-lg border px-3 text-sm"
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
                <label className="text-xs">Privacy</label>
                <select
                  value={formPrivacy}
                  onChange={(e) => setFormPrivacy(e.target.value as 'Public' | 'Private')}
                  className="border-border bg-card text-foreground h-10 w-full rounded-lg border px-3 text-sm"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs">Max Members</label>
                <input
                  type="number"
                  min={2}
                  max={200}
                  value={formMax}
                  onChange={(e) => setFormMax(parseInt(e.target.value || '12'))}
                  className="border-border bg-card text-foreground h-10 w-full rounded-lg border px-3 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs">Schedule</label>
              <input
                value={formSchedule}
                onChange={(e) => setFormSchedule(e.target.value)}
                placeholder="e.g., Wed, 7PM"
                className="border-border bg-card text-foreground placeholder:text-muted-foreground h-10 w-full rounded-lg border px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs">Description</label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Brief description"
                className="border-border bg-card text-foreground placeholder:text-muted-foreground min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" className="rounded-lg" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
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
  const accentClass = 'bg-primary'
  const isFull = g.status === 'Full'
  const isActive = g.status === 'Active'
  const SubjectIcon = (() => {
    if (g.subject === 'Science') return FlaskConical
    if (g.subject === 'Computer Science') return Code
    if (g.subject === 'History') return BookOpen
    return BookOpen
  })()

  return (
    <div className="group border-border bg-card overflow-hidden rounded-xl border">
      <div className={`relative h-24 ${accentClass}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#ffffff33_1px,transparent_1px)] [background-size:20px_20px] opacity-25" />
        <div className="absolute top-1/2 left-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm">
          <SubjectIcon className="h-6 w-6 text-white/90" />
        </div>
        {isActive && (
          <div className="bg-semantic-success absolute top-3 right-3 rounded-full px-2 py-1 text-[11px] font-bold text-white shadow">
            Active
          </div>
        )}
      </div>
      <div className="bg-muted p-5">
        <div className="border-border bg-muted text-muted-foreground mb-2 inline-block rounded-full border px-2 py-1 text-[11px] font-bold">
          {g.subject.toUpperCase()}
        </div>
        <div className="mb-1">
          <h3 className="text-foreground font-bold">{g.name}</h3>
          <p className="text-muted-foreground text-xs">{g.desc}</p>
        </div>
        <div className="text-muted-foreground mt-3 flex items-center justify-between text-xs">
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
      <div className="bg-muted px-5 pb-5">
        {joined ? (
          <Link href={`/groups/${g.id}`}>
            <button className="border-primary text-primary hover:bg-primary/10 flex h-10 w-full items-center justify-center rounded-lg border bg-transparent font-semibold">
              Open Group <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        ) : isFull ? (
          <button className="border-border text-muted-foreground h-10 w-full cursor-not-allowed rounded-lg border bg-transparent">
            Group Full
          </button>
        ) : (
          <Link href={`/groups/${g.id}`}>
            <button className="border-primary text-primary hover:bg-primary/10 flex h-10 w-full items-center justify-center rounded-lg border bg-transparent font-semibold">
              Join Group <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}
