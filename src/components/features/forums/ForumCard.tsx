import Link from "next/link";
import { MessageSquare, Eye, ArrowBigUp } from "lucide-react";

interface ForumCardProps {
  id: number | string;
  title: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  upvotes: number;
  tags: string[];
  createdAt: string;
}

export function ForumCard({
  id,
  title,
  author,
  category,
  replies,
  views,
  upvotes,
  tags,
  createdAt,
}: ForumCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
            {category}
          </span>
          <span className="text-xs text-gray-500">
            • Posted by {author} • {createdAt}
          </span>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
        <Link href={`/forums/${id}`}>{title}</Link>
      </h3>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <ArrowBigUp className="h-5 w-5" />
            <span>{upvotes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{replies} replies</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{views} views</span>
          </div>
        </div>

        <div className="flex gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
