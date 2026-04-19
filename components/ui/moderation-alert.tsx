import { AlertTriangle, X } from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
  harassment: 'harassment or threatening language',
  hate_speech: 'hateful or discriminatory content',
  spam: 'spam or repetitive content',
  off_topic: 'off-topic content',
  inappropriate: 'inappropriate content',
  sexual_content: 'sexual content',
  violence: 'violent content',
  self_harm: 'self-harm related content',
}

interface ModerationAlertProps {
  reason: string
  categories?: string[]
  onDismiss?: () => void
}

export function ModerationAlert({ reason, categories, onDismiss }: ModerationAlertProps) {
  const readableCategories = categories?.map((c) => CATEGORY_LABELS[c] ?? c).filter(Boolean)

  return (
    <div
      role="alert"
      className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500 dark:text-red-400" />

        <div className="flex-1 space-y-1">
          <p className="font-semibold">Your post could not be submitted</p>
          <p className="text-sm">
            {reason || 'This content violates our community guidelines and cannot be posted.'}
          </p>

          {readableCategories && readableCategories.length > 0 && (
            <p className="text-sm">
              <span className="font-medium">Flagged for: </span>
              {readableCategories.join(', ')}.
            </p>
          )}

          <p className="text-sm text-red-700 dark:text-red-300">
            Please review your content and try again with appropriate language.
          </p>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 rounded p-0.5 text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
