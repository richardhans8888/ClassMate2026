'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Mic, Clock, Calendar, Volume2, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'components/ui/dialog'

const rooms = [
  {
    id: 1,
    title: 'Advanced Calculus',
    category: 'MATH',
    status: 'Live',
    description: 'Deep dive into differential equations and limits. Preparing for the mid-term.',
    participants: 24,
    speaking: 5,
    image: 'from-blue-600 to-cyan-500', // Using gradients as placeholders
    tags: ['Calculus', 'Exam Prep'],
  },
  {
    id: 2,
    title: 'Python Data Science',
    category: 'DEV',
    status: 'Quiet',
    description: 'Working through Pandas exercises. Screen sharing active for code review.',
    participants: 12,
    speaking: 0,
    image: 'from-emerald-600 to-teal-500',
    tags: ['Python', 'Pandas'],
  },
  {
    id: 3,
    title: 'Modern Art History',
    category: 'ART',
    status: 'Live',
    description: 'Discussing Bauhaus influence on modern web design. Bring your sketches.',
    participants: 8,
    speaking: 2,
    image: 'from-orange-500 to-amber-500',
    tags: ['History', 'Design'],
  },
  {
    id: 4,
    title: 'Molecular Biology',
    category: 'BIO',
    status: 'Scheduled',
    description: 'Study group for beginners. Introduction to cell structures and functions.',
    startTime: 'Starts in 30m',
    image: 'from-pink-600 to-rose-500',
    tags: ['Biology', 'Cells'],
    participants: 0,
    speaking: 0,
  },
  {
    id: 5,
    title: 'Quantum Mechanics 101',
    category: 'PHY',
    status: 'Live',
    description: "Discussing wave-particle duality and Schrödinger's equation.",
    participants: 15,
    speaking: 3,
    image: 'from-indigo-600 to-purple-600',
    tags: ['Physics', 'Quantum'],
  },
  {
    id: 6,
    title: 'React.js Patterns',
    category: 'DEV',
    status: 'Quiet',
    description: 'Code along session building a dashboard component.',
    participants: 42,
    speaking: 0,
    image: 'from-cyan-600 to-blue-500',
    tags: ['React', 'Frontend'],
  },
  {
    id: 7,
    title: 'Linear Algebra Review',
    category: 'MATH',
    status: 'Scheduled',
    description: 'Reviewing eigenvalues and eigenvectors before the final.',
    startTime: 'Starts in 2h',
    participants: 0,
    speaking: 0,
    image: 'from-blue-500 to-indigo-500',
    tags: ['Math', 'Linear Algebra'],
  },
  {
    id: 8,
    title: 'Typography Mastery',
    category: 'ART',
    status: 'Live',
    description: 'Critique session for font pairing and hierarchy.',
    participants: 6,
    speaking: 4,
    image: 'from-amber-500 to-orange-600',
    tags: ['Design', 'Typography'],
  },
  {
    id: 9,
    title: 'Genetics & DNA',
    category: 'BIO',
    status: 'Live',
    description: 'Solving Punnett squares and discussing heredity.',
    participants: 18,
    speaking: 2,
    image: 'from-rose-500 to-pink-600',
    tags: ['Biology', 'Genetics'],
  },
  {
    id: 10,
    title: 'Astrophysics Lounge',
    category: 'PHY',
    status: 'Quiet',
    description: 'Silent study group for astronomy lovers.',
    participants: 9,
    speaking: 0,
    image: 'from-violet-600 to-fuchsia-600',
    tags: ['Space', 'Physics'],
  },
  {
    id: 11,
    title: 'System Design Interview',
    category: 'DEV',
    status: 'Live',
    description: 'Mock interviews for distributed systems.',
    participants: 30,
    speaking: 8,
    image: 'from-slate-600 to-zinc-500',
    tags: ['Interview', 'Backend'],
  },
  {
    id: 12,
    title: 'Calculus III',
    category: 'MATH',
    status: 'Scheduled',
    description: 'Multivariable calculus study group.',
    startTime: 'Tomorrow, 10am',
    participants: 0,
    speaking: 0,
    image: 'from-sky-500 to-blue-600',
    tags: ['Calculus', 'Math'],
  },
]

const categories = ['All Rooms', 'Mathematics', 'Computer Science', 'Design', 'Biology', 'Physics']

export function ActiveStudyRooms() {
  const [activeCategory, setActiveCategory] = useState('All Rooms')
  const [searchQuery, setSearchQuery] = useState('')
  const [joinOpen, setJoinOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<{
    id: number
    title: string
  } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const filteredRooms = rooms.filter((room) => {
    // Filter by category
    const categoryMatch = (() => {
      if (activeCategory === 'All Rooms') return true
      if (activeCategory === 'Mathematics') return room.category === 'MATH'
      if (activeCategory === 'Computer Science') return room.category === 'DEV'
      if (activeCategory === 'Design') return room.category === 'ART'
      if (activeCategory === 'Biology') return room.category === 'BIO'
      if (activeCategory === 'Physics') return room.category === 'PHY'
      return false
    })()

    // Filter by search query (ID or title)
    const searchMatch =
      searchQuery === '' ||
      room.id.toString().includes(searchQuery) ||
      room.title.toLowerCase().includes(searchQuery.toLowerCase())

    return categoryMatch && searchMatch
  })

  return (
    <div className="mb-10">
      {/* Top Bar: Title, Search, Create */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            Active Study Rooms{' '}
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
            </span>
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Collaborate in real-time with peers across the globe.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Room ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-9 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <Button className="shrink-0 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Create Room
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="scrollbar-hide mb-2 flex items-center gap-2 overflow-x-auto pb-4">
        {categories.map((cat, _i) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filteredRooms.map((room) => (
            <motion.div
              layout
              key={room.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#0F172A] transition-all hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10"
            >
              {/* Card Background Gradient/Image */}
              <div className={`h-32 bg-gradient-to-br ${room.image} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="flex items-center gap-1 rounded border border-white/10 bg-black/40 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                    {room.category === 'MATH' && '∑'}
                    {room.category === 'DEV' && '<>'}
                    {room.category === 'ART' && '🎨'}
                    {room.category === 'BIO' && '🧬'}
                    {room.category === 'PHY' && '⚛'}
                    {room.category}
                  </span>
                </div>

                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-[#0F172A] to-transparent p-4 pt-12">
                  {/* Avatars overlapping */}
                  <div className="flex justify-end -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0F172A] bg-gray-200 text-xs font-bold text-gray-600"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    {room.participants > 3 && (
                      <div className="z-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0F172A] bg-gray-800 text-[10px] text-white">
                        +{room.participants - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5 pt-2">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-lg leading-tight font-bold text-white transition-colors group-hover:text-blue-400">
                    {room.title}
                  </h3>
                  {room.status === 'Live' ? (
                    <span className="flex animate-pulse items-center gap-1 rounded-full border border-green-500/30 bg-green-500/20 px-2 py-0.5 text-[10px] text-green-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div> Live
                    </span>
                  ) : room.status === 'Quiet' ? (
                    <span className="flex items-center gap-1 rounded-full border border-gray-600 bg-gray-700 px-2 py-0.5 text-[10px] text-gray-300">
                      <Volume2 className="h-3 w-3" /> Quiet
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full border border-gray-600 bg-gray-700 px-2 py-0.5 text-[10px] text-gray-300">
                      <Clock className="h-3 w-3" /> Scheduled
                    </span>
                  )}
                </div>

                <p className="mb-4 line-clamp-2 flex-1 text-xs text-gray-400">{room.description}</p>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {room.status === 'Scheduled' ? (
                      <span className="flex items-center gap-1 text-gray-400">
                        <Calendar className="h-3 w-3" /> {room.startTime}
                      </span>
                    ) : (
                      <>
                        {room.speaking > 0 ? (
                          <span className="flex items-center gap-1 text-blue-400">
                            <Mic className="h-3 w-3" /> {room.speaking} speaking
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" /> {room.participants} members
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <Button
                    size="sm"
                    className={
                      room.status === 'Scheduled'
                        ? 'h-8 rounded-lg border border-gray-700 bg-blue-600 bg-gray-800 text-xs text-white hover:bg-blue-700 hover:bg-gray-700'
                        : 'h-8 rounded-lg bg-blue-600 text-xs text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500 hover:bg-blue-700'
                    }
                    onClick={() => {
                      if (room.status === 'Scheduled') {
                        setToast('You will be reminded before this room starts.')
                        setTimeout(() => setToast(null), 2500)
                        return
                      }
                      setSelectedRoom({ id: room.id, title: room.title })
                      setJoinOpen(true)
                    }}
                  >
                    {room.status === 'Scheduled' ? 'Remind Me' : 'Join Room'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {toast && (
        <div className="fixed right-6 bottom-6 rounded-xl border border-white/10 bg-black/80 px-4 py-3 text-white shadow-xl">
          {toast}
        </div>
      )}

      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogContent className="border-gray-800 bg-[#0F172A] text-white">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {selectedRoom ? `Join ${selectedRoom.title}` : 'Join Room'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 text-sm text-gray-300">Join this study room.</div>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <Link href="/groups" onClick={() => setJoinOpen(false)} className="block">
              <div className="h-full rounded-xl border border-gray-700 bg-[#111827] p-4 transition-colors hover:border-blue-500/50 hover:bg-[#0B1220]">
                <div className="mb-1 flex items-center gap-3">
                  <Mic className="h-5 w-5 text-emerald-400" />
                  <div className="font-semibold">Open Study Groups</div>
                </div>
                <p className="text-xs text-gray-400">
                  Continue collaboration from the study groups page.
                </p>
              </div>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
