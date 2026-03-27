'use client'

import { useState } from 'react'
import { ChevronDown, Rocket, Users, Settings } from 'lucide-react'

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
          'Click "Sign Up" on the homepage and register with your email or Google account. Once verified, you can complete your profile and start exploring the platform.',
      },
      {
        question: 'How do I join a study group?',
        answer:
          'Navigate to the Study Groups section from the main menu. Browse available groups by subject or use the search bar to find a specific group. Click "Join" to become a member.',
      },
      {
        question: 'What is the forum for?',
        answer:
          'The forum is a community space where students can ask academic questions, share resources, and discuss topics. You can upvote helpful answers, follow threads, and contribute to discussions.',
      },
      {
        question: 'How do I earn XP points?',
        answer:
          'You earn XP by participating in the platform — posting in forums, replying to questions, attending study sessions, completing streaks, and getting upvotes on your contributions.',
      },
    ],
  },
  {
    label: 'Tutors & Sessions',
    icon: <Users className="h-4 w-4" />,
    items: [
      {
        question: 'How do I find a tutor?',
        answer:
          'Go to the Tutors section and browse by subject or availability. Each tutor profile shows their expertise, hourly rate, and reviews from past students.',
      },
      {
        question: 'How do I book a tutoring session?',
        answer:
          'On a tutor\'s profile, select an available time slot and click "Book Session". You\'ll receive a confirmation with the session details and any video call links.',
      },
      {
        question: 'Can I become a tutor?',
        answer:
          'Yes! If you have strong subject knowledge, you can apply to become a tutor from your profile settings. The process includes a brief review of your academic background.',
      },
      {
        question: 'What happens if I need to cancel a session?',
        answer:
          'You can cancel a booked session from your schedule. Please cancel at least 24 hours in advance as a courtesy to your tutor. Repeated last-minute cancellations may affect your account standing.',
      },
    ],
  },
  {
    label: 'Account Settings',
    icon: <Settings className="h-4 w-4" />,
    items: [
      {
        question: 'How do I update my profile?',
        answer:
          'Go to your Profile page from the top navigation menu. You can update your display name, bio, avatar, and subject interests from there.',
      },
      {
        question: 'How do I change my password?',
        answer:
          'Visit your Account Settings and select "Change Password". You\'ll need to enter your current password before setting a new one.',
      },
      {
        question: 'How do I delete my account?',
        answer:
          'Account deletion can be requested from Account Settings under "Danger Zone". This action is permanent and will remove all your data from the platform.',
      },
      {
        question: 'Can I change my email address?',
        answer:
          'Yes, you can update your email address in Account Settings. A verification email will be sent to your new address before the change takes effect.',
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
