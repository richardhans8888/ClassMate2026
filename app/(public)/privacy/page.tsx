import type { Metadata } from 'next'
import { Shield, Eye, Database, Lock } from 'lucide-react'
import { PageHeader } from 'components/public/PageHeader'
import { ContentSection } from 'components/public/ContentSection'

export const metadata: Metadata = {
  title: 'Privacy Policy — ClassMate',
  description: 'Learn how ClassMate collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        description="We take your privacy seriously. Here's how we collect, use, and protect your personal information."
        badge="Last updated: April 2026"
        icon={<Shield className="h-5 w-5" />}
      />

      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="space-y-5">
          <p className="text-muted-foreground text-sm leading-relaxed">
            At ClassMate, we take your privacy seriously. This policy describes how we collect, use,
            and protect your personal information.
          </p>

          <ContentSection title="Information We Collect">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="bg-accent text-primary mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                  <Eye className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-foreground text-sm font-medium">Account information</p>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    Name, email address, and profile details you provide when registering.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-accent text-primary mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                  <Database className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-foreground text-sm font-medium">Usage data</p>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    Learning progress, forum activity, and how you interact with the platform.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-accent text-primary mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                  <Lock className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-foreground text-sm font-medium">Communication data</p>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    Messages and content shared with peers within the platform.
                  </p>
                </div>
              </li>
            </ul>
          </ContentSection>

          <ContentSection title="How We Use Your Data">
            <p className="text-muted-foreground text-sm leading-relaxed">
              We use your data to provide platform services, improve our features, and facilitate
              connections between students. Your data is never sold to third parties.
            </p>
          </ContentSection>
        </div>
      </div>
    </>
  )
}
