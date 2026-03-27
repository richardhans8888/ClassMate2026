import type { Metadata } from 'next'
import { MessageSquare, Mail, Clock, MapPin } from 'lucide-react'
import { PageHeader } from 'components/public/PageHeader'
import { ContactForm } from 'components/public/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us — ClassMate',
  description:
    'Get in touch with the ClassMate team. We typically respond within 1–2 business days.',
}

const contactDetails = [
  {
    icon: <Mail className="h-4 w-4" />,
    label: 'Email',
    value: 'support@classmate.app',
  },
  {
    icon: <Clock className="h-4 w-4" />,
    label: 'Response Time',
    value: '1–2 business days',
  },
  {
    icon: <MapPin className="h-4 w-4" />,
    label: 'Location',
    value: 'Auckland, New Zealand',
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        description="Have a question, found a bug, or just want to say hello? We'd love to hear from you."
        badge="We typically respond within 1–2 business days"
        icon={<MessageSquare className="h-5 w-5" />}
      />

      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div>
              <h2 className="text-foreground mb-1 text-base font-semibold">Get in touch</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Use the form to send us a message. Select the category that best describes your
                enquiry so we can route it to the right team.
              </p>
            </div>

            <div className="space-y-3">
              {contactDetails.map((detail) => (
                <div key={detail.label} className="flex items-center gap-3">
                  <span className="bg-accent text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    {detail.icon}
                  </span>
                  <div>
                    <p className="text-muted-foreground text-xs">{detail.label}</p>
                    <p className="text-foreground text-sm font-medium">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-border bg-muted/30 rounded-xl border p-4">
              <p className="text-muted-foreground text-xs leading-relaxed">
                For urgent account or safety issues, please include &ldquo;URGENT&rdquo; in your
                message subject and we will prioritise your request.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  )
}
