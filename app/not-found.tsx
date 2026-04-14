import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/back-button'

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="border-border bg-card w-full max-w-md rounded-2xl border p-10 text-center shadow-lg">
        <FileQuestion className="text-primary mx-auto mb-6 h-12 w-12 opacity-80" />

        <p className="text-primary font-playfair mb-2 text-8xl font-bold tracking-tight">404</p>

        <h1 className="text-foreground mb-3 text-2xl font-semibold">Page not found</h1>

        <p className="text-muted-foreground mx-auto mb-8 max-w-xs text-sm leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to
          view it.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <BackButton />
        </div>
      </div>
    </div>
  )
}
