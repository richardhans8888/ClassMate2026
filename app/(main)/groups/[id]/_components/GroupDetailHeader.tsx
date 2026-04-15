import { ArrowLeft, Users, Lock, Globe } from 'lucide-react'

interface GroupDetailHeaderProps {
  name: string
  subject: string
  description: string | null
  memberCount: number
  maxMembers: number | null
  isPrivate: boolean
  onBack: () => void
}

export function GroupDetailHeader({
  name,
  subject,
  description,
  memberCount,
  maxMembers,
  isPrivate,
  onBack,
}: GroupDetailHeaderProps) {
  return (
    <div className="border-border bg-card border-b p-6">
      <button
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Groups
      </button>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="border-border bg-muted text-muted-foreground rounded-full border px-2.5 py-1 text-xs font-bold">
            {subject.toUpperCase()}
          </span>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              isPrivate
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            }`}
          >
            {isPrivate ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
            {isPrivate ? 'Private' : 'Public'}
          </span>
        </div>

        <h1 className="text-foreground text-2xl font-bold">{name}</h1>

        {description && <p className="text-muted-foreground text-sm">{description}</p>}

        <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
          <Users className="h-4 w-4" />
          <span>
            {memberCount}
            {maxMembers ? ` / ${maxMembers}` : ''} member{memberCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
