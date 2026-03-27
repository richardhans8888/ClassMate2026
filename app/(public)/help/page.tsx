import type { Metadata } from 'next'
import { HelpCircle } from 'lucide-react'
import { PageHeader } from 'components/public/PageHeader'
import { HelpFAQ } from 'components/public/HelpFAQ'

export const metadata: Metadata = {
  title: 'Help Center — ClassMate',
  description: 'Find answers to common questions about using the ClassMate platform.',
}

export default function HelpPage() {
  return (
    <>
      <PageHeader
        title="Help Center"
        description="Find answers to common questions about ClassMate. Browse by category or search for a specific topic."
        badge="Frequently Asked Questions"
        icon={<HelpCircle className="h-5 w-5" />}
      />

      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <HelpFAQ />
      </div>
    </>
  )
}
