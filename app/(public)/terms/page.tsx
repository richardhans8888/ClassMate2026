import type { Metadata } from 'next'
import { ScrollText, UserCheck, FileText, AlertTriangle } from 'lucide-react'
import { PageHeader } from 'components/public/PageHeader'
import { ContentSection } from 'components/public/ContentSection'

export const metadata: Metadata = {
  title: 'Terms of Service — ClassMate',
  description: 'Review the terms and conditions for using the ClassMate platform.',
}

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms of Service"
        description="By using ClassMate, you agree to these terms. Please read them carefully before using the platform."
        badge="Last updated: April 2026"
        icon={<ScrollText className="h-5 w-5" />}
      />

      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="space-y-5">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Welcome to ClassMate. By using our platform, you agree to these terms.
          </p>

          <ContentSection title="User Responsibilities">
            <div className="flex items-start gap-3">
              <span className="bg-accent text-primary mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                <UserCheck className="h-3.5 w-3.5" />
              </span>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You agree to use ClassMate for educational purposes only and to maintain academic
                integrity in all interactions. This includes respectful communication with peers and
                platform staff.
              </p>
            </div>
          </ContentSection>

          <ContentSection title="Content Ownership">
            <div className="flex items-start gap-3">
              <span className="bg-accent text-primary mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                <FileText className="h-3.5 w-3.5" />
              </span>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You retain rights to content you create, but grant ClassMate a license to display
                and distribute it on the platform. You are responsible for ensuring you have the
                rights to any content you share.
              </p>
            </div>
          </ContentSection>

          <ContentSection title="Termination">
            <div className="flex items-start gap-3">
              <span className="bg-destructive/10 text-destructive mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                <AlertTriangle className="h-3.5 w-3.5" />
              </span>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We reserve the right to suspend accounts that violate our community guidelines or
                terms of service. Serious or repeated violations may result in permanent removal
                from the platform.
              </p>
            </div>
          </ContentSection>
        </div>
      </div>
    </>
  )
}
