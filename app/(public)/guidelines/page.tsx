import type { Metadata } from 'next'
import { BookOpen, Heart, GraduationCap, Shield, Check, X } from 'lucide-react'
import { PageHeader } from 'components/public/PageHeader'
import { ContentSection } from 'components/public/ContentSection'

export const metadata: Metadata = {
  title: 'Community Guidelines — ClassMate',
  description:
    'Learn about the standards and values that make ClassMate a safe and supportive learning community.',
}

const guidelines = [
  {
    title: 'Respect & Kindness',
    icon: <Heart className="h-4 w-4" />,
    color: 'bg-semantic-error/10 text-semantic-error',
    description:
      'ClassMate thrives when everyone feels welcome and valued. Treat every member — regardless of their background, level of knowledge, or opinion — with courtesy and empathy.',
    dos: [
      'Use constructive, encouraging language',
      'Acknowledge different perspectives and learning styles',
      'Offer help to students who are struggling',
      "Celebrate others' successes and progress",
    ],
    donts: [
      'Use offensive, discriminatory, or harassing language',
      'Mock or belittle others for asking questions',
      'Engage in personal attacks or arguments',
      'Share or amplify harmful content',
    ],
  },
  {
    title: 'Academic Integrity',
    icon: <GraduationCap className="h-4 w-4" />,
    color: 'bg-semantic-warning/10 text-semantic-warning',
    description:
      'ClassMate is a platform for genuine learning and collaboration. Academic honesty is the foundation of a credible education and a trustworthy community.',
    dos: [
      'Share your own original work and ideas',
      'Cite sources when referencing external material',
      'Help others understand concepts, not just answers',
      'Report suspected cheating through proper channels',
    ],
    donts: [
      "Submit others' work as your own",
      'Share exam answers or assessment solutions',
      'Offer or accept payment for academic work',
      'Plagiarise content from any source',
    ],
  },
  {
    title: 'Safety & Privacy',
    icon: <Shield className="h-4 w-4" />,
    color: 'bg-accent text-primary',
    description:
      'Everyone deserves a safe space to learn. Protecting the privacy and wellbeing of all users is a shared responsibility.',
    dos: [
      'Keep personal contact details private',
      'Report suspicious or abusive behaviour',
      'Use platform tools to communicate with peers',
      "Respect others' privacy and personal boundaries",
    ],
    donts: [
      'Share personal information about other users',
      'Solicit private contact details from students',
      'Post spam, scams, or misleading content',
      'Attempt to access accounts or data unauthorised',
    ],
  },
]

export default function GuidelinesPage() {
  return (
    <>
      <PageHeader
        title="Community Guidelines"
        description="These guidelines exist to keep ClassMate a safe, inclusive, and productive place for every student."
        badge="Last updated: April 2026"
        icon={<BookOpen className="h-5 w-5" />}
      />

      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="space-y-5">
          <p className="text-muted-foreground text-sm leading-relaxed">
            By using ClassMate, you agree to uphold these community standards. Violations may result
            in content removal, account suspension, or permanent removal from the platform.
          </p>

          {guidelines.map((section) => (
            <ContentSection key={section.title} title={section.title}>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${section.color}`}
                  >
                    {section.icon}
                  </span>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {section.description}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                      <Check className="text-semantic-success h-3.5 w-3.5" />
                      Do
                    </p>
                    <ul className="space-y-1.5">
                      {section.dos.map((item) => (
                        <li
                          key={item}
                          className="text-muted-foreground flex items-start gap-2 text-sm"
                        >
                          <span className="bg-semantic-success mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="text-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                      <X className="text-semantic-error h-3.5 w-3.5" />
                      Don&apos;t
                    </p>
                    <ul className="space-y-1.5">
                      {section.donts.map((item) => (
                        <li
                          key={item}
                          className="text-muted-foreground flex items-start gap-2 text-sm"
                        >
                          <span className="bg-semantic-error mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </ContentSection>
          ))}
        </div>
      </div>
    </>
  )
}
