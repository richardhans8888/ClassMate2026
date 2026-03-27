import { Button } from '@/components/ui/button'
import { FileText, Download, Star } from 'lucide-react'

interface MaterialCardProps {
  id: number | string
  title: string
  author: string
  subject: string
  type: string
  rating: number
  downloads: number
  uploadedAt: string
  onDownload?: (id: number | string) => void
}

export function MaterialCard({
  id: _id,
  title,
  author,
  subject,
  type,
  rating,
  downloads,
  uploadedAt,
  onDownload,
}: MaterialCardProps) {
  return (
    <div className="border-border bg-card flex h-full flex-col rounded-xl border p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="bg-accent text-accent-foreground rounded-lg p-3">
          <FileText className="h-6 w-6" />
        </div>
        <div className="bg-semantic-warning/10 text-semantic-warning flex items-center rounded px-2 py-1 text-xs font-bold">
          <Star className="mr-1 h-3 w-3 fill-current" />
          {rating}
        </div>
      </div>

      <div className="mb-4 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs font-semibold tracking-wide uppercase">
            {type}
          </span>
          <span className="text-muted-foreground text-xs">• {subject}</span>
        </div>
        <h3 className="text-foreground mb-1 line-clamp-2 font-bold" title={title}>
          {title}
        </h3>
        <p className="text-muted-foreground text-xs">
          By {author} • {uploadedAt}
        </p>
      </div>

      <div className="border-border mt-auto border-t pt-4">
        <div className="text-muted-foreground mb-3 flex items-center justify-between text-sm">
          <span>{downloads} downloads</span>
        </div>
        <Button
          variant="outline"
          className="group hover:border-primary hover:text-primary flex w-full items-center justify-center gap-2 rounded-lg"
          onClick={() => onDownload?.(_id)}
        >
          <Download className="group-hover:text-primary h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  )
}
