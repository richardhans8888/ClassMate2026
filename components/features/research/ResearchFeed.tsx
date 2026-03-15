'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Filter,
  Search,
  Clock,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Building2,
  User,
  ChevronDown,
  Check,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'

// Types for our articles
type ArticleSource = 'University' | 'Professional' | 'Tutor'

interface Article {
  id: number
  title: string
  description: string
  image: string
  category: string
  readTime: string
  timestamp: string
  source: {
    name: string
    type: ArticleSource
    verified: boolean
  }
  author: {
    name: string
    role: string
    avatar: string
  }
  tags: string[]
}

const articles: Article[] = [
  {
    id: 0,
    title: 'Neural Pathways in Collaborative Learning: Longitudinal Study',
    description:
      'This longitudinal study investigates the neurobiological correlates of collaborative learning among university students using high-resolution fMRI monitoring over a 24-month period.',
    image: 'from-blue-900 to-indigo-900',
    category: 'Neuroscience',
    readTime: '15 min read',
    timestamp: 'Just now',
    source: {
      name: 'Oxford Neuroscience Lab',
      type: 'University',
      verified: true,
    },
    author: {
      name: 'Dr. Elias Thorne',
      role: 'Lead Researcher',
      avatar: 'ET',
    },
    tags: ['Neuroscience', 'Learning', 'fMRI'],
  },
  {
    id: 1,
    title: 'The Future of Generative Models in Undergraduate Education',
    description:
      'An in-depth analysis of how large language models are reshaping the curriculum for computer science majors, focusing on ethical considerations and practical applications.',
    image: 'from-blue-600 to-indigo-600',
    category: 'Computer Science',
    readTime: '12 min read',
    timestamp: '2h ago',
    source: {
      name: 'MIT Research Lab',
      type: 'University',
      verified: true,
    },
    author: {
      name: 'Dr. Alan Grant',
      role: 'Lead Researcher',
      avatar: 'AG',
    },
    tags: ['AI', 'Education', 'Ethics'],
  },
  {
    id: 2,
    title: 'CRISPR Applications: Beyond the Genome Editing Hype',
    description:
      'Exploring the practical applications of gene editing in modern immunology and the potential for personalized medicine in the next decade.',
    image: 'from-emerald-600 to-teal-600',
    category: 'Biology',
    readTime: '8 min read',
    timestamp: '5h ago',
    source: {
      name: 'Stanford Medicine',
      type: 'University',
      verified: true,
    },
    author: {
      name: 'Prof. Sarah Jenkins',
      role: 'Clinical Director',
      avatar: 'SJ',
    },
    tags: ['Genetics', 'Medicine', 'BioTech'],
  },
  {
    id: 3,
    title: 'Reinterpreting the Renaissance: A Digital Humanities Approach',
    description:
      'How new digital archiving tools are revealing previously unknown connections between artists and patrons in 15th century Florence.',
    image: 'from-amber-600 to-orange-600',
    category: 'Humanities',
    readTime: '15 min read',
    timestamp: '1d ago',
    source: {
      name: 'Historical Review',
      type: 'Professional',
      verified: true,
    },
    author: {
      name: 'Marcus Chen, PhD',
      role: 'Historian',
      avatar: 'MC',
    },
    tags: ['History', 'Art', 'Digital'],
  },
  {
    id: 4,
    title: 'Quantum Computing: Breaking Down the Qubit Barrier',
    description:
      'Recent breakthroughs in error correction are bringing us closer to stable quantum processors. What does this mean for cryptography?',
    image: 'from-violet-600 to-purple-600',
    category: 'Physics',
    readTime: '10 min read',
    timestamp: '1d ago',
    source: {
      name: 'Physics Today',
      type: 'Professional',
      verified: true,
    },
    author: {
      name: 'Dr. Elena Rodriguez',
      role: 'Quantum Physicist',
      avatar: 'ER',
    },
    tags: ['Quantum', 'Computing', 'Physics'],
  },
  {
    id: 5,
    title: 'Sustainable Urban Planning in the Post-Pandemic Era',
    description:
      "Architects and city planners are rethinking public spaces. A look at the new '15-minute city' concepts emerging in Europe.",
    image: 'from-green-600 to-emerald-600',
    category: 'Architecture',
    readTime: '7 min read',
    timestamp: '2d ago',
    source: {
      name: 'Urban Design Institute',
      type: 'Professional',
      verified: true,
    },
    author: {
      name: 'David Kim',
      role: 'Urban Planner',
      avatar: 'DK',
    },
    tags: ['Urban Planning', 'Sustainability'],
  },
  {
    id: 6,
    title: 'Machine Learning for Climate Change Prediction',
    description:
      'Leveraging deep learning to model complex climate patterns and predict extreme weather events with greater accuracy.',
    image: 'from-cyan-600 to-blue-600',
    category: 'Environmental Science',
    readTime: '9 min read',
    timestamp: '2d ago',
    source: {
      name: 'Climate Action Lab',
      type: 'University',
      verified: true,
    },
    author: {
      name: 'Dr. Emily Chen',
      role: 'Climate Scientist',
      avatar: 'EC',
    },
    tags: ['Climate', 'AI', 'Environment'],
  },
  {
    id: 7,
    title: 'The Psychology of Remote Work: A Longitudinal Study',
    description:
      'Analyzing the long-term effects of remote work on employee well-being, productivity, and team cohesion over a 3-year period.',
    image: 'from-rose-600 to-pink-600',
    category: 'Psychology',
    readTime: '11 min read',
    timestamp: '3d ago',
    source: {
      name: 'Behavioral Insights',
      type: 'Professional',
      verified: true,
    },
    author: {
      name: 'Dr. Michael Ross',
      role: 'Psychologist',
      avatar: 'MR',
    },
    tags: ['Psychology', 'Work', 'Mental Health'],
  },
  {
    id: 8,
    title: 'Advanced Calculus: Visualizing Multivariable Functions',
    description:
      "A tutor's guide to helping students intuitively understand partial derivatives and multiple integrals through 3D visualization.",
    image: 'from-blue-500 to-sky-500',
    category: 'Mathematics',
    readTime: '6 min read',
    timestamp: '3d ago',
    source: {
      name: 'Math Whiz Tutors',
      type: 'Tutor',
      verified: true,
    },
    author: {
      name: 'Sarah Jenkins',
      role: 'Top Rated Tutor',
      avatar: 'SJ',
    },
    tags: ['Calculus', 'Math', 'Education'],
  },
  {
    id: 9,
    title: 'Blockchain in Supply Chain Management',
    description:
      'How distributed ledger technology is increasing transparency and reducing fraud in global logistics networks.',
    image: 'from-orange-500 to-red-500',
    category: 'Business',
    readTime: '8 min read',
    timestamp: '4d ago',
    source: {
      name: 'Global Logistics Review',
      type: 'Professional',
      verified: true,
    },
    author: {
      name: 'James Wilson',
      role: 'Supply Chain Analyst',
      avatar: 'JW',
    },
    tags: ['Blockchain', 'Business', 'Tech'],
  },
  {
    id: 10,
    title: 'Neurolinguistics: How the Brain Processes Second Languages',
    description:
      'New fMRI studies reveal distinct neural pathways for native vs. second language processing in bilingual adults.',
    image: 'from-fuchsia-600 to-pink-600',
    category: 'Linguistics',
    readTime: '14 min read',
    timestamp: '4d ago',
    source: {
      name: 'Cognitive Science Journal',
      type: 'University',
      verified: true,
    },
    author: {
      name: 'Dr. Lisa Wong',
      role: 'Neuroscientist',
      avatar: 'LW',
    },
    tags: ['Linguistics', 'Neuroscience', 'Language'],
  },
  {
    id: 11,
    title: 'Cybersecurity Trends: Zero Trust Architecture',
    description:
      'Why traditional perimeter-based security models are failing and how Zero Trust principles are becoming the new standard.',
    image: 'from-slate-700 to-gray-800',
    category: 'Cybersecurity',
    readTime: '9 min read',
    timestamp: '5d ago',
    source: {
      name: 'Tech Security Weekly',
      type: 'Professional',
      verified: true,
    },
    author: {
      name: 'Alex Mercer',
      role: 'Security Consultant',
      avatar: 'AM',
    },
    tags: ['Security', 'Tech', 'Cyber'],
  },
  {
    id: 12,
    title: 'The Art of Storytelling in Data Visualization',
    description:
      'Transforming raw data into compelling narratives. Best practices for creating dashboards that drive decision-making.',
    image: 'from-yellow-500 to-amber-600',
    category: 'Data Science',
    readTime: '7 min read',
    timestamp: '6d ago',
    source: {
      name: 'Data Viz Daily',
      type: 'Tutor',
      verified: true,
    },
    author: {
      name: 'Elena Rodriguez',
      role: 'Data Science Tutor',
      avatar: 'ER',
    },
    tags: ['Data Science', 'Design', 'Storytelling'],
  },
]

interface FilterDropdownProps {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

function FilterDropdown({ label, value, options, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-400">{label}:</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex min-w-[160px] items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 transition-all hover:bg-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:outline-none dark:border-gray-700 dark:bg-[#1F2937] dark:text-gray-200 dark:hover:bg-[#374151]"
        >
          <span className="truncate">{value}</span>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-[calc(100%-160px)] z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-gray-700 dark:bg-[#1F2937]/95"
          >
            <div className="custom-scrollbar max-h-[300px] overflow-y-auto py-1">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option)
                    setIsOpen(false)
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                    value === option
                      ? 'bg-blue-600 font-medium text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-[#374151] dark:hover:text-white'
                  }`}
                >
                  {option}
                  {value === option && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ResearchFeed() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeSource, setActiveSource] = useState('Any')
  const [searchQuery, setSearchQuery] = useState('')
  const searchParams = useSearchParams()
  const query = (searchParams.get('q') || '').toLowerCase().trim()

  const categories = [
    'All',
    'Neuroscience',
    'Computer Science',
    'Biology',
    'Physics',
    'Humanities',
    'Mathematics',
    'Business',
    'Psychology',
  ]
  const sources = ['Any', 'University', 'Professional', 'Tutor']

  const effectiveQuery = searchQuery.trim().toLowerCase() || query
  const filteredArticles = articles.filter((article) => {
    const categoryMatch = activeCategory === 'All' || article.category === activeCategory
    const sourceMatch = activeSource === 'Any' || article.source.type === activeSource
    const text = `${article.title} ${article.description} ${article.tags.join(' ')}`.toLowerCase()
    const queryMatch = !effectiveQuery || text.includes(effectiveQuery)
    return categoryMatch && sourceMatch && queryMatch
  })

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 md:px-12">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Featured Research & Insights
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Stay updated with the latest academic breakthroughs and educational trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            Live Updates
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="mb-8 flex flex-col items-center gap-6 rounded-2xl border border-gray-200 bg-gray-100 p-3 shadow-lg md:flex-row dark:border-gray-800 dark:bg-[#111827]">
        <div className="flex items-center gap-2 pl-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>

        <div className="flex flex-1 flex-wrap gap-6">
          {/* Subject Filter */}
          <FilterDropdown
            label="Subject"
            value={activeCategory}
            options={categories}
            onChange={setActiveCategory}
          />

          {/* Source Filter */}
          <FilterDropdown
            label="Source"
            value={activeSource}
            options={sources}
            onChange={setActiveSource}
          />
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pr-4 pl-10 text-sm text-gray-800 placeholder-gray-500 transition-colors hover:border-gray-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-[#1F2937] dark:text-gray-200 dark:hover:border-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredArticles.map((article) => (
            <motion.div
              layout
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:border-blue-500/50 hover:shadow-xl dark:border-gray-800 dark:bg-[#1E293B] dark:hover:border-blue-500/50"
            >
              {/* Card Image Header */}
              <div
                className={`h-48 bg-gradient-to-br ${article.image} relative flex flex-col justify-between p-6`}
              >
                <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />

                <div className="relative z-10 flex items-start justify-between">
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                    {article.category}
                  </span>
                </div>

                <div className="relative z-10 flex justify-end">
                  <span className="flex items-center gap-1 rounded bg-black/40 px-2 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                    <Clock className="h-3 w-3" /> {article.timestamp}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className={`rounded-lg p-1.5 ${
                      article.source.type === 'University'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : article.source.type === 'Professional'
                          ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    }`}
                  >
                    {article.source.type === 'University' && <GraduationCap className="h-4 w-4" />}
                    {article.source.type === 'Professional' && <Building2 className="h-4 w-4" />}
                    {article.source.type === 'Tutor' && <User className="h-4 w-4" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1 text-xs font-bold text-gray-900 dark:text-white">
                      {article.source.name}
                      {article.source.verified && <span className="text-blue-500">✓</span>}
                    </span>
                    <span className="text-[10px] tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      {article.source.type}
                    </span>
                  </div>
                </div>

                <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {article.title}
                </h3>

                <p className="mb-6 line-clamp-3 flex-1 text-sm text-gray-600 dark:text-gray-400">
                  {article.description}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {article.author.avatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {article.author.name}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        {article.author.role}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/research/${article.id}`}
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Read Paper <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex justify-center">
        <Link href="/research">
          <Button variant="outline" size="lg" className="rounded-lg px-8">
            Browse All Articles
          </Button>
        </Link>
      </div>
    </div>
  )
}
