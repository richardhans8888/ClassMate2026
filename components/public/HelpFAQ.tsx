'use client'

import { useState } from 'react'
import { ChevronDown, Rocket, BookOpen, Settings } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface Category {
  label: string
  icon: React.ReactNode
  items: FAQItem[]
}

const categories: Category[] = [
  {
    label: 'Getting Started',
    icon: <Rocket className="h-4 w-4" />,
    items: [
      {
        question: 'How do I create an account?',
        answer:
          'Click "Sign Up" on the homepage and register with your email or Google account. Once your account is created, you can complete your profile and start exploring the platform.',
      },
      {
        question: 'What is the forum for?',
        answer:
          'The forum is a community space where students ask academic questions, share resources, and discuss topics. You can upvote helpful answers and contribute to discussions.',
      },
      {
        question: 'How do I join a study group?',
        answer:
          'Navigate to Study Groups from the main menu. Browse available groups by subject or enter an invite code if you have one. Click "Join" to become a member and access the group chat.',
      },
      {
        question: 'How do I connect with other students?',
        answer:
          'Use the Discover page to browse and search for other students. Visit their profile and send a connection request. Once accepted, you can message them directly.',
      },
    ],
  },
  {
    label: 'Features',
    icon: <BookOpen className="h-4 w-4" />,
    items: [
      {
        question: 'How do I use the AI Tutor?',
        answer:
          'Open the AI Tutor from the main menu and type your question. The AI tutor can help explain concepts, answer academic questions, and guide you through problems. Your sessions are saved so you can pick up where you left off.',
      },
      {
        question: 'How do I upload or access study materials?',
        answer:
          'Go to the Materials section to browse shared study resources. To upload your own, click "Upload" and select your file. Supported formats include PDFs and documents.',
      },
      {
        question: 'How do I send a direct message?',
        answer:
          "Go to the Chat section to see your existing conversations, or visit another student's profile and start a new conversation from there.",
      },
      {
        question: 'What is the schedule for?',
        answer:
          'The Schedule page is a personal calendar where you can create and track study events. Use it to plan your sessions and stay organised.',
      },
    ],
  },
  {
    label: 'Account',
    icon: <Settings className="h-4 w-4" />,
    items: [
      {
        question: 'How do I update my profile?',
        answer:
          'Go to your Profile page from the top navigation. You can update your display name, bio, university, major, and other details from there.',
      },
      {
        question: 'How do I change my password?',
        answer:
          'Password changes are handled through your login provider. If you signed up with email and password, you can reset your password from the login page.',
      },
      {
        question: 'How do I report inappropriate content?',
        answer:
          'Use the flag icon on any forum post or reply to report it to our moderation team. We review all reports and take appropriate action.',
      },
      {
        question: 'How do I contact support?',
        answer:
          'Visit the Contact page and fill in the form. We typically respond within 1–2 business days. For urgent issues, include "URGENT" in your message.',
      },
    ],
  },
]

export function HelpFAQ() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleCategoryChange = (index: number) => {
    setActiveCategory(index)
    setOpenIndex(null)
  }

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((cat, i) => (
          <button
            key={cat.label}
            onClick={() => handleCategoryChange(i)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === i
                ? 'border-primary bg-accent text-primary'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {categories[activeCategory]?.items.map((item, i) => (
          <div key={i} className="border-border bg-card rounded-xl border">
            <button
              onClick={() => handleToggle(i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
              aria-expanded={openIndex === i}
            >
              <span className="text-foreground text-sm font-medium">{item.question}</span>
              <ChevronDown
                className={`text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-200 ${
                  openIndex === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="border-border border-t px-5 pt-3 pb-4">
                <p className="text-muted-foreground text-sm leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
