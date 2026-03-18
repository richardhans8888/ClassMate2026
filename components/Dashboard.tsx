'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Flame, Play, Bot, Zap, Users } from 'lucide-react'
import { motion } from 'framer-motion'

// Mock Data
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Dashboard() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 transition-colors duration-300 dark:bg-[#0F172A] dark:text-white">
      {/* Hero Section */}
      <section className="border-b border-gray-200 px-5 pt-12 pb-12 sm:px-6 sm:pt-14 sm:pb-14 md:px-12 md:pt-16 md:pb-14 dark:border-gray-800">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl leading-tight font-bold text-transparent sm:text-3xl md:text-4xl lg:text-5xl dark:from-blue-400 dark:to-purple-400">
              Your Academic Community Hub
            </h1>
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg dark:text-gray-400">
              Connect with fellow students, join study groups, share materials, and collaborate in
              forums powered by AI moderation.
            </p>
          </motion.div>

          {/* Featured & Trending Header */}
          <div className="mb-5 flex items-end justify-between md:mb-6">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Flame className="h-5 w-5 animate-pulse fill-blue-600 text-blue-600 md:h-6 md:w-6 dark:fill-blue-400 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold md:text-2xl">Featured & Trending</h2>
            </div>
            <Link
              href="/groups"
              className="group flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              View all groups
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Featured Cards Grid */}
          <motion.div
            className="mb-8 grid grid-cols-1 gap-5 sm:gap-6 md:mb-12 md:grid-cols-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Forums Card */}
            <motion.div
              variants={item}
              className="group relative h-64 cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
              onClick={() => router.push('/forums')}
              role="button"
              aria-label="Open Forums"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />

              {/* Decorative circles */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-24 w-24 rounded-full bg-black/10 blur-lg" />

              <div className="absolute top-4 left-4">
                <span className="rounded-full border border-white/10 bg-white/20 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-md">
                  Forums
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full border border-white/20 bg-white/10 p-4 backdrop-blur-sm transition-transform group-hover:scale-110">
                  <Play className="h-8 w-8 fill-white text-white" />
                </div>
              </div>

              <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                <h3 className="mb-1 text-xl leading-tight font-bold text-white">
                  Discussion Forums
                </h3>
                <div className="flex items-end justify-between">
                  <p className="flex items-center gap-1 text-sm text-gray-200">
                    <Zap className="h-3 w-3 fill-yellow-300 text-yellow-300" />
                    Ask questions & share knowledge
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Study Groups Card */}
            <motion.div
              variants={item}
              className="group relative cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-md transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg dark:border-gray-800 dark:bg-[#1E293B] dark:hover:border-blue-500"
              onClick={() => router.push('/groups')}
              role="button"
              aria-label="View Study Groups"
            >
              <div className="absolute top-5 right-5 flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-100 px-2 py-1 dark:border-gray-700 dark:bg-[#0F172A]">
                  <Users className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-bold text-gray-900 dark:text-white">12</span>
                </div>
                <span className="text-[10px] font-medium text-blue-600 dark:text-blue-300">
                  Active Now
                </span>
              </div>

              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-lg font-bold text-white shadow-inner">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="flex items-center gap-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    Study Groups
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Collaborate & Learn</p>
                </div>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-[10px] text-gray-600 dark:border-gray-700 dark:bg-[#0F172A] dark:text-gray-300">
                  Calculus
                </span>
                <span className="rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-[10px] text-gray-600 dark:border-gray-700 dark:bg-[#0F172A] dark:text-gray-300">
                  Physics
                </span>
                <span className="rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-[10px] text-gray-600 dark:border-gray-700 dark:bg-[#0F172A] dark:text-gray-300">
                  Chemistry
                </span>
              </div>

              <p className="mb-4 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                Join study groups to collaborate with peers, share notes, and prepare for exams
                together.
              </p>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  5 groups available
                </span>
                <button
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition-all hover:bg-blue-700 hover:shadow-md active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push('/groups')
                  }}
                >
                  Browse Groups
                </button>
              </div>
            </motion.div>

            {/* AI Promo Card */}
            <motion.div
              variants={item}
              className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-indigo-900/50 bg-gradient-to-br from-[#1E1B4B] to-[#1E293B] p-6 text-center shadow-lg transition-all hover:-translate-y-1 hover:shadow-indigo-500/20"
            >
              <div className="pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl"></div>

              <div className="animate-bounce-slow mb-4 rounded-full bg-indigo-500/20 p-4 transition-transform duration-500 group-hover:scale-110">
                <Bot className="h-8 w-8 text-indigo-400" />
              </div>

              <h3 className="mb-2 text-xl font-bold text-white">Try AI Tutoring</h3>
              <p className="mb-6 max-w-xs text-sm text-gray-400">
                Get instant help with homework, concept explanations, and quiz generation 24/7.
              </p>

              <Link
                href="/ai-tutor"
                className="transform rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:scale-105 hover:from-indigo-500 hover:to-purple-500 active:scale-95"
              >
                Start Free Chat
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
