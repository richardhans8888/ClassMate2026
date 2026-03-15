'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  MessageSquare,
  Cpu,
  FileText,
  BarChart3,
  Quote,
  Search,
  CheckCircle2,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { articles } from '@/lib/data/research-articles'

// Mock Data for the Article
const articleData = {
  title: 'Neural Pathways in Collaborative Learning: Longitudinal Study',
  date: 'Published Oct 25, 2023',
  authors: [
    { name: 'Dr. Elias Thorne', role: 'Oxford Neuroscience Lab', avatar: 'ET' },
    {
      name: 'Stanford University',
      role: 'Affiliate Institution',
      avatar: 'SU',
    },
  ],
  sections: [
    { id: 'abstract', title: 'Abstract' },
    { id: 'methodology', title: 'Methodology' },
    { id: 'results', title: 'Results' },
    { id: 'discussion', title: 'Discussion' },
    { id: 'references', title: 'References' },
  ],
}

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const articleId = Number(params.id)
  const article = articles.find((a) => a.id === articleId)

  const [activeSection, setActiveSection] = useState('abstract')
  const [readingProgress, setReadingProgress] = useState(0)

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      // Update reading progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setReadingProgress(Math.min(100, Math.max(0, progress)))

      // Update active section
      const sections = articleData.sections.map((s) => s.id)
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!article) {
    router.replace('/research')
    return null
  }

  return (
    <div className="min-h-screen bg-[#0F1115] font-sans text-gray-300 selection:bg-blue-500/30">
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-8 px-6 pt-8 pb-20">
        {/* Left Sidebar - Table of Contents */}
        <aside className="sticky top-24 col-span-3 hidden h-[calc(100vh-8rem)] lg:block">
          <div className="flex h-full flex-col rounded-2xl border border-gray-800/50 bg-[#151921] p-6">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="mb-6 -ml-2 rounded-lg text-gray-400 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Feed
              </Button>
            </Link>

            <h3 className="mb-6 text-xs font-bold tracking-wider text-blue-400 uppercase">
              Jump To Section
            </h3>

            <nav className="flex-1 space-y-1">
              {articleData.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
                    setActiveSection(section.id)
                  }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? 'border-l-2 border-blue-500 bg-blue-600/10 text-blue-400'
                      : 'text-gray-500 hover:bg-gray-800/50 hover:text-gray-300'
                  }`}
                >
                  {section.id === 'abstract' && <FileText className="h-4 w-4" />}
                  {section.id === 'methodology' && <Cpu className="h-4 w-4" />}
                  {section.id === 'results' && <BarChart3 className="h-4 w-4" />}
                  {section.id === 'discussion' && <MessageSquare className="h-4 w-4" />}
                  {section.id === 'references' && <Quote className="h-4 w-4" />}
                  {section.title}
                </a>
              ))}
            </nav>

            <div className="mt-auto space-y-6">
              <Button className="w-full rounded-lg rounded-xl bg-blue-600 py-6 font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] hover:bg-blue-700">
                <Quote className="mr-2 h-4 w-4" />
                Cite This Article
              </Button>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-gray-500">
                  <span>Reading Progress</span>
                  <span>{Math.round(readingProgress)}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                  <motion.div
                    className="h-full rounded-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${readingProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="col-span-12 space-y-12 lg:col-span-9">
          {/* Hero Section */}
          <section className="group relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-3xl border border-gray-800 bg-gray-900 p-8 md:p-12">
            <div className="absolute inset-0 z-0">
              {/* Abstract Background Graphic */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/80 to-transparent" />
              <div className="absolute top-0 right-0 p-8 opacity-20">
                <Cpu className="h-64 w-64 rotate-12 text-blue-500" />
              </div>
            </div>

            <div className="relative z-10 max-w-3xl">
              <div className="mb-6 flex items-center gap-3">
                <span className="rounded-full border border-blue-500/20 bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400 backdrop-blur-sm">
                  {article.category.toUpperCase()}
                </span>
                <span className="rounded-full border border-white/5 bg-black/40 px-3 py-1 text-xs font-medium text-gray-400 backdrop-blur-sm">
                  {articleData.date}
                </span>
              </div>

              <h1 className="mb-8 font-serif text-4xl leading-[1.1] font-bold tracking-tight text-white md:text-5xl">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-black/40 py-1.5 pr-4 pl-2 backdrop-blur-sm transition-colors hover:bg-black/60">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                    {article.author.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm leading-none font-bold text-white">
                      {article.author.name}
                    </span>
                    <span className="mt-1 text-[10px] leading-none text-gray-400">
                      {article.source.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Abstract */}
          <section id="abstract" className="scroll-mt-32">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-800" />
              <h2 className="text-sm font-bold tracking-widest text-blue-400 uppercase">
                Abstract
              </h2>
              <div className="h-px flex-1 bg-gray-800" />
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-xl leading-relaxed text-gray-300 first-letter:float-left first-letter:mt-[-10px] first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:text-blue-500">
                This longitudinal study investigates the neurobiological correlates of collaborative
                learning among university students. Using high-resolution functional Magnetic
                Resonance Imaging (fMRI), we monitored neural activity during group-based
                problem-solving tasks over a twenty-four month period. Our findings suggest that
                repeated social-academic interactions strengthen synaptic plasticity in the
                prefrontal cortex, leading to enhanced executive function and long-term retention
                compared to solitary study control groups.
              </p>
            </div>
          </section>

          {/* Methodology */}
          <section id="methodology" className="scroll-mt-32">
            <h2 className="mb-6 text-sm font-bold tracking-widest text-blue-400 uppercase">
              Methodology
            </h2>
            <div className="prose prose-invert prose-lg max-w-none text-gray-400">
              <p className="mb-8">
                A total of 450 subjects (ages 18-24) were randomly assigned to either a
                Collaborative Learning Group (CLG) or a Solitary Study Group (SSG). Over four
                academic semesters, participants engaged in bi-weekly sessions focused on complex
                theoretical physics.
              </p>

              <figure className="group my-12 overflow-hidden rounded-2xl border border-gray-800 bg-[#151921]">
                <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-black">
                  {/* Placeholder for Brain Scan Image */}
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2831&auto=format&fit=crop')] bg-cover bg-center opacity-80 transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 rounded-full rounded-lg bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
                <figcaption className="flex items-center justify-between border-t border-gray-800 bg-[#0F1115] p-4">
                  <span className="text-xs font-bold tracking-wider text-blue-400 uppercase">
                    Figure 1.2: Neural Density Mapping
                  </span>
                  <span className="text-xs text-gray-500 italic">
                    Heatmap illustrating voxel-wise changes in the dorsolateral prefrontal cortex.
                  </span>
                </figcaption>
              </figure>

              <p>
                Data collection included bi-monthly fMRI scans, cognitive aptitude tests, and
                peer-review performance metrics. The study employed a double-blind protocol during
                the evaluation of synaptic connectivity scores to eliminate observer bias.
              </p>
            </div>
          </section>

          {/* Key Results */}
          <section id="results" className="scroll-mt-32">
            <h2 className="mb-6 text-sm font-bold tracking-widest text-blue-400 uppercase">
              Key Results
            </h2>
            <div className="grid gap-4">
              <div className="flex gap-4 rounded-xl border-l-4 border-blue-500 bg-[#151921] p-6 transition-colors hover:bg-[#1A202C]">
                <div className="h-fit rounded-full bg-blue-500/20 p-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-white">Theta Wave Synchronization</h4>
                  <p className="text-sm leading-relaxed text-gray-400">
                    Significant increase (p &lt; 0.05) in theta wave synchronization between
                    participants in the CLG during joint problem-solving tasks, indicating shared
                    cognitive states.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-xl border-l-4 border-blue-500 bg-[#151921] p-6 transition-colors hover:bg-[#1A202C]">
                <div className="h-fit rounded-full bg-blue-500/20 p-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-white">Retention Rates</h4>
                  <p className="text-sm leading-relaxed text-gray-400">
                    Retention rates for complex concepts were 22% higher in collaborative
                    environments compared to solitary study, persisting across 6-month follow-ups.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
