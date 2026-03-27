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
    <div className="bg-background min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="border-border border-b px-5 pt-12 pb-12 sm:px-6 sm:pt-14 sm:pb-14 md:px-12 md:pt-16 md:pb-14">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-foreground mb-4 text-2xl leading-tight font-bold sm:text-3xl md:text-4xl lg:text-5xl">
              Your Academic Community Hub
            </h1>
            <p className="text-muted-foreground mb-8 max-w-2xl text-base leading-relaxed md:text-lg">
              Connect with fellow students, join study groups, share materials, and collaborate in
              forums powered by AI moderation.
            </p>
          </motion.div>

          {/* Featured & Trending Header */}
          <div className="mb-5 flex items-end justify-between md:mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-accent rounded-lg p-2">
                <Flame className="fill-primary text-primary h-5 w-5 animate-pulse md:h-6 md:w-6" />
              </div>
              <h2 className="text-xl font-bold md:text-2xl">Featured & Trending</h2>
            </div>
            <Link
              href="/groups"
              className="group text-primary flex items-center gap-1 text-sm font-medium hover:underline"
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
              <div className="bg-primary absolute inset-0" />

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
                  <p className="flex items-center gap-1 text-sm text-white/80">
                    <Zap className="fill-semantic-warning text-semantic-warning h-3 w-3" />
                    Ask questions & share knowledge
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Study Groups Card */}
            <motion.div
              variants={item}
              className="group border-border bg-card hover:border-primary relative cursor-pointer rounded-2xl border p-5 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
              onClick={() => router.push('/groups')}
              role="button"
              aria-label="View Study Groups"
            >
              <div className="absolute top-5 right-5 flex flex-col items-end gap-1">
                <div className="border-border bg-muted flex items-center gap-1 rounded-md border px-2 py-1">
                  <Users className="text-primary h-3 w-3" />
                  <span className="text-foreground text-xs font-bold">12</span>
                </div>
                <span className="text-primary text-[10px] font-medium">Active Now</span>
              </div>

              <div className="mb-3 flex items-start gap-3">
                <div className="bg-semantic-success flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-inner">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-foreground group-hover:text-primary flex items-center gap-1 text-lg font-bold transition-colors">
                    Study Groups
                  </h3>
                  <p className="text-primary text-sm">Collaborate & Learn</p>
                </div>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                <span className="border-border bg-muted text-muted-foreground rounded-md border px-2 py-1 text-[10px]">
                  Calculus
                </span>
                <span className="border-border bg-muted text-muted-foreground rounded-md border px-2 py-1 text-[10px]">
                  Physics
                </span>
                <span className="border-border bg-muted text-muted-foreground rounded-md border px-2 py-1 text-[10px]">
                  Chemistry
                </span>
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-2 text-xs">
                Join study groups to collaborate with peers, share notes, and prepare for exams
                together.
              </p>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                  5 groups available
                </span>
                <button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium shadow transition-all hover:shadow-md active:scale-95"
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
              className="group border-border relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border bg-[#1E1D2E] p-6 text-center shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="bg-primary/10 pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full blur-3xl"></div>

              <div className="animate-bounce-slow bg-primary/20 mb-4 rounded-full p-4 transition-transform duration-500 group-hover:scale-110">
                <Bot className="text-primary h-8 w-8" />
              </div>

              <h3 className="mb-2 text-xl font-bold text-white">Try AI Tutoring</h3>
              <p className="text-muted-foreground mb-6 max-w-xs text-sm">
                Get instant help with homework, concept explanations, and quiz generation 24/7.
              </p>

              <Link
                href="/ai-tutor"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transform rounded-full px-6 py-2.5 font-medium shadow-lg transition-all hover:-translate-y-0.5 hover:scale-105 active:scale-95"
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
