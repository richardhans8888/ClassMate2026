import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  badge?: string
  icon?: ReactNode
}

export function PageHeader({ title, description, badge, icon }: PageHeaderProps) {
  return (
    <div className="border-border bg-muted/30 border-b py-12 sm:py-16">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        {icon && (
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            {icon}
          </div>
        )}
        {badge && (
          <div className="border-border bg-background text-muted-foreground mb-3 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
            {badge}
          </div>
        )}
        <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-3 max-w-2xl text-base sm:text-lg">{description}</p>
        )}
      </div>
    </div>
  )
}
