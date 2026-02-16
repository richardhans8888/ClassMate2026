import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ForumCard } from '@/components/features/forums/ForumCard';
import { Plus, Search, Filter } from 'lucide-react';

const forumPosts = [
  {
    id: 1,
    title: "Understanding React Hooks: useEffect vs useLayoutEffect",
    author: "Sarah Chen",
    category: "Computer Science",
    replies: 45,
    views: 1205,
    upvotes: 128,
    tags: ["React", "JavaScript", "Web Dev"],
    createdAt: "2 hours ago"
  },
  {
    id: 2,
    title: "Calculus II: Integration by Parts Help",
    author: "Mike Ross",
    category: "Mathematics",
    replies: 32,
    views: 890,
    upvotes: 56,
    tags: ["Calculus", "Math", "Homework"],
    createdAt: "5 hours ago"
  },
  {
    id: 3,
    title: "Best resources for learning Python in 2024?",
    author: "Jessica Pearson",
    category: "Programming",
    replies: 28,
    views: 1500,
    upvotes: 95,
    tags: ["Python", "Resources", "Beginner"],
    createdAt: "1 day ago"
  },
  {
    id: 4,
    title: "How to prepare for History finals?",
    author: "Harvey Specter",
    category: "History",
    replies: 15,
    views: 450,
    upvotes: 24,
    tags: ["History", "Study Tips", "Exam Prep"],
    createdAt: "2 days ago"
  },
  {
    id: 5,
    title: "Physics: Understanding Quantum Entanglement",
    author: "Louis Litt",
    category: "Physics",
    replies: 67,
    views: 2300,
    upvotes: 210,
    tags: ["Physics", "Quantum Mechanics", "Science"],
    createdAt: "3 days ago"
  }
];

const categories = [
  "All Topics",
  "Mathematics",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Literature",
  "Languages"
];

export default function ForumsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forum Hub</h1>
          <p className="text-gray-600 mt-1">Join the discussion and learn together.</p>
        </div>
        <Link href="/forums/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics..."
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 flex items-center mb-3">
                <Filter className="mr-2 h-4 w-4" />
                Categories
              </h3>
              {categories.map((category, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`category-${index}`}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked={index === 0}
                  />
                  <label htmlFor={`category-${index}`} className="text-sm text-gray-700 cursor-pointer select-none">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">Community Guidelines</h3>
            <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
              <li>Be respectful and kind</li>
              <li>Stay on topic</li>
              <li>No spam or self-promotion</li>
              <li>Cite your sources</li>
            </ul>
          </div>
        </div>

        {/* Forum List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{forumPosts.length}</span> discussions
            </div>
            <select className="border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
              <option>Newest First</option>
              <option>Most Popular</option>
              <option>Most Upvoted</option>
              <option>Unanswered</option>
            </select>
          </div>

          <div className="space-y-4">
            {forumPosts.map((post) => (
              <ForumCard
                key={post.id}
                {...post}
              />
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Button variant="outline">Load More Discussions</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
