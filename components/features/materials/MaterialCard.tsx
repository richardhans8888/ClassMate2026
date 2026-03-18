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
    <div className="flex h-full flex-col rounded-xl border bg-white p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
          <FileText className="h-6 w-6" />
        </div>
        <div className="flex items-center rounded bg-yellow-50 px-2 py-1 text-xs font-bold text-yellow-700">
          <Star className="mr-1 h-3 w-3 fill-current" />
          {rating}
        </div>
      </div>

      <div className="mb-4 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold tracking-wide text-gray-600 uppercase">
            {type}
          </span>
          <span className="text-xs text-gray-400">• {subject}</span>
        </div>
        <h3 className="mb-1 line-clamp-2 font-bold text-gray-900" title={title}>
          {title}
        </h3>
        <p className="text-xs text-gray-500">
          By {author} • {uploadedAt}
        </p>
      </div>

      <div className="mt-auto border-t pt-4">
        <div className="mb-3 flex items-center justify-between text-sm text-gray-500">
          <span>{downloads} downloads</span>
        </div>
        <Button
          variant="outline"
          className="group flex w-full items-center justify-center gap-2 rounded-lg hover:border-blue-500 hover:text-blue-600"
          onClick={() => onDownload?.(_id)}
        >
          <Download className="h-4 w-4 group-hover:text-blue-600" />
          Download
        </Button>
      </div>
    </div>
  )
}
