import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  MessageSquare,
  Eye,
  ArrowBigUp,
  Share2,
  MoreHorizontal,
  User,
} from "lucide-react";
import Link from "next/link";

// Mock Data for a single post
const post = {
  id: 1,
  title: "Understanding React Hooks: useEffect vs useLayoutEffect",
  author: "Sarah Chen",
  authorRole: "Student",
  category: "Computer Science",
  content: `
    I'm struggling to understand the practical differences between useEffect and useLayoutEffect in React. 
    
    I know that useLayoutEffect fires synchronously after all DOM mutations, but when should I actually use it over useEffect?
    
    Most tutorials say "use useEffect unless you have a specific reason not to", but I'm looking for concrete examples where useLayoutEffect is absolutely necessary.
    
    Can anyone provide a real-world scenario?
  `,
  replies: 45,
  views: 1205,
  upvotes: 128,
  tags: ["React", "JavaScript", "Web Dev"],
  createdAt: "2 hours ago",
};

const comments = [
  {
    id: 101,
    author: "David Kim",
    authorRole: "Tutor",
    content:
      "Great question! The main difference is timing. `useEffect` runs asynchronously after the render is painted to the screen. `useLayoutEffect` runs synchronously after the render but before it's painted. You should use `useLayoutEffect` when you need to measure DOM elements (like width/height) and then adjust state based on that measurement to prevent a visual flicker.",
    upvotes: 42,
    createdAt: "1 hour ago",
    isAccepted: true,
  },
  {
    id: 102,
    author: "Emily Blunt",
    authorRole: "Student",
    content:
      "To add to David's point, think of `useLayoutEffect` as the version you use when you want to block the browser from painting until your code finishes running. It's rare but essential for smooth animations or layout calculations.",
    upvotes: 15,
    createdAt: "45 mins ago",
    isAccepted: false,
  },
];

export default function ForumPostPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/forums"
        className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Forums
      </Link>

      {/* Main Post */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{post.author}</h3>
                <p className="text-xs text-gray-500">
                  {post.authorRole} • {post.createdAt}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                {post.category}
              </span>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="prose max-w-none text-gray-700 mb-6 whitespace-pre-line">
            {post.content}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-blue-600 px-2"
              >
                <ArrowBigUp className="h-6 w-6 mr-1" />
                <span className="font-medium">{post.upvotes}</span>
              </Button>
              <div className="flex items-center text-gray-500">
                <MessageSquare className="h-5 w-5 mr-2" />
                <span>{post.replies} Replies</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Eye className="h-5 w-5 mr-2" />
                <span>{post.views} Views</span>
              </div>
            </div>
            <Button variant="ghost" className="text-gray-500">
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Reply Section */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Post a Reply</h3>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <textarea
            rows={4}
            placeholder="What are your thoughts? Add to the discussion..."
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          ></textarea>
          <div className="flex justify-end">
            <Button>Post Reply</Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900">
          {comments.length} Answers
        </h3>

        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`bg-white p-6 rounded-xl border shadow-sm ${comment.isAccepted ? "border-green-200 ring-1 ring-green-100" : ""}`}
          >
            {comment.isAccepted && (
              <div className="mb-4 text-green-600 text-sm font-semibold flex items-center">
                <div className="bg-green-100 rounded-full p-1 mr-2">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                Accepted Answer
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">
                  {comment.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">
                    {comment.author}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {comment.authorRole} • {comment.createdAt}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-gray-700 mb-4 text-sm leading-relaxed">
              {comment.content}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-blue-600 px-0"
              >
                <ArrowBigUp className="h-5 w-5 mr-1" />
                <span>{comment.upvotes} Helpful</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 px-0">
                Reply
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
