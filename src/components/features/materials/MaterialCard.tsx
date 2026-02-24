import { Button } from "@/components/ui/Button";
import { FileText, Download, Star } from "lucide-react";

interface MaterialCardProps {
  id: number | string;
  title: string;
  author: string;
  subject: string;
  type: string;
  rating: number;
  downloads: number;
  uploadedAt: string;
}

export function MaterialCard({
  id,
  title,
  author,
  subject,
  type,
  rating,
  downloads,
  uploadedAt,
}: MaterialCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
          <FileText className="h-6 w-6" />
        </div>
        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 text-xs font-bold">
          <Star className="h-3 w-3 fill-current mr-1" />
          {rating}
        </div>
      </div>

      <div className="mb-4 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase tracking-wide">
            {type}
          </span>
          <span className="text-xs text-gray-400">• {subject}</span>
        </div>
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2" title={title}>
          {title}
        </h3>
        <p className="text-xs text-gray-500">
          By {author} • {uploadedAt}
        </p>
      </div>

      <div className="pt-4 border-t mt-auto">
        <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
          <span>{downloads} downloads</span>
        </div>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 group hover:border-blue-500 hover:text-blue-600"
        >
          <Download className="h-4 w-4 group-hover:text-blue-600" />
          Download
        </Button>
      </div>
    </div>
  );
}
