'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Flame,
  Bot,
  Zap,
  Users,
  BookOpen,
  MessageSquare,
  Calendar,
  FileText,
  Compass,
  Sparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const quickActions = [
  {
    href: '/forums',
    icon: MessageSquare,
    label: 'Forums',
    description: 'Ask questions & share knowledge',
    color: 'bg-blue-500/10 text-blue-500',
    border: 'hover:border-blue-500/40',
  },
  {
    href: '/groups',
    icon: Users,
    label: 'Study Groups',
    description: 'Collaborate with peers',
    color: 'bg-emerald-500/10 text-emerald-500',
    border: 'hover:border-emerald-500/40',
  },
  {
    href: '/ai-tutor',
    icon: Bot,
    label: 'AI Tutor',
    description: 'Get instant homework help',
    color: 'bg-purple-500/10 text-purple-500',
    border: 'hover:border-purple-500/40',
  },
  {
    href: '/materials',
    icon: FileText,
    label: 'Materials',
    description: 'Upload & share study notes',
    color: 'bg-amber-500/10 text-amber-500',
    border: 'hover:border-amber-500/40',
  },
  {
    href: '/schedule',
    icon: Calendar,
    label: 'Schedule',
    description: 'Manage your study sessions',
    color: 'bg-rose-500/10 text-rose-500',
    border: 'hover:border-rose-500/40',
  },
  {
    href: '/discover',
    icon: Compass,
    label: 'Discover',
    description: 'Find new connections',
    color: 'bg-cyan-500/10 text-cyan-500',
    border: 'hover:border-cyan-500/40',
  },
]

const featuredCards = [
  {
    href: '/forums',
    label: 'Forums',
    title: 'Join the Conversation',
    subtitle: 'Ask questions, share answers, and grow together',
    image: '/discussion-image.png',
    badge: 'Discussion',
    badgeIcon: MessageSquare,
  },
  {
    href: '/groups',
    label: 'Study Groups',
    title: 'Study Together',
    subtitle: 'Find your people and ace your exams as a team',
    image: '/study-group-image.png',
    badge: 'Collaborate',
    badgeIcon: Users,
  },
  {
    href: '/materials',
    label: 'Materials',
    title: 'Shared Resources',
    subtitle: 'Notes, slides, and past papers — all in one place',
    image: '/resources-image.png',
    badge: 'Resources',
    badgeIcon: BookOpen,
  },
]

export default function Dashboard() {
  const router = useRouter()

  return (
    <div className="bg-background transition-colors duration-300">
      {/* Hero */}
      <section className="border-border border-b px-5 pt-10 pb-10 sm:px-8 md:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <div className="text-primary mb-2 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
                <Sparkles className="h-4 w-4" />
                Welcome back
              </div>
              <h1 className="text-foreground text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
                Your Academic
                <br />
                <span className="text-primary">Community Hub</span>
              </h1>
              <p className="text-muted-foreground mt-3 max-w-xl text-base leading-relaxed md:text-lg">
                Connect with fellow students, join study groups, share materials, and get AI-powered
                help — all in one place.
              </p>
            </div>
            <Link
              href="/ai-tutor"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
            >
              <Bot className="h-4 w-4" />
              Ask AI Tutor
            </Link>
          </motion.div>

          {/* Featured Cards */}
          <div className="mb-6 flex items-center gap-2">
            <div className="bg-accent rounded-lg p-2">
              <Flame className="fill-primary text-primary h-5 w-5 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold">Featured & Trending</h2>
            <Link
              href="/groups"
              className="group text-primary ml-auto flex items-center gap-1 text-sm font-medium hover:underline"
            >
              View all groups
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <motion.div
            className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {featuredCards.map((card) => {
              const BadgeIcon = card.badgeIcon
              return (
                <motion.div
                  key={card.href}
                  variants={item}
                  className="group relative h-64 cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                  onClick={() => router.push(card.href)}
                  role="button"
                  aria-label={`Go to ${card.label}`}
                >
                  <Image
                    src={card.image}
                    alt={card.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/20 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-md">
                      <BadgeIcon className="h-3 w-3" />
                      {card.badge}
                    </span>
                  </div>

                  <div className="absolute right-0 bottom-0 left-0 p-5">
                    <h3 className="mb-1 text-xl leading-tight font-bold text-white">
                      {card.title}
                    </h3>
                    <p className="flex items-center gap-1 text-sm text-white/80">
                      <Zap className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {card.subtitle}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-5 py-10 sm:px-8 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h2 className="text-foreground text-xl font-bold">Quick Actions</h2>
            <p className="text-muted-foreground mt-1 text-sm">Jump straight to what you need</p>
          </div>

          <motion.div
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <motion.div key={action.href} variants={item}>
                  <Link
                    href={action.href}
                    className={`border-border bg-card group flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all hover:-translate-y-1 hover:shadow-md ${action.border}`}
                  >
                    <div
                      className={`rounded-xl p-3 transition-transform duration-300 group-hover:scale-110 ${action.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-semibold">{action.label}</p>
                      <p className="text-muted-foreground mt-0.5 text-xs leading-snug">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* AI Tutor Banner */}
      <section className="border-border border-t px-5 py-10 sm:px-8 md:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative overflow-hidden rounded-2xl bg-[#1E1D2E] px-8 py-10 shadow-xl md:px-12"
          >
            <div className="bg-primary/20 pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 shrink-0 rounded-2xl p-4">
                  <Bot className="text-primary h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white md:text-2xl">24/7 AI Tutoring</h3>
                  <p className="text-muted-foreground mt-1 max-w-md text-sm leading-relaxed">
                    Get instant explanations, homework help, practice quizzes, and concept
                    breakdowns — powered by Claude AI.
                  </p>
                </div>
              </div>
              <Link
                href="/ai-tutor"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 font-semibold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
              >
                Start Free Chat
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
