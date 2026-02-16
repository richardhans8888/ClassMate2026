import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, MessageSquare, TrendingUp, BookOpen, Star, Flame, Trophy } from 'lucide-react';

// Mock Data
const trendingForums = [
  {
    id: 1,
    title: "Understanding React Hooks: useEffect vs useLayoutEffect",
    author: "Sarah Chen",
    category: "Computer Science",
    replies: 45,
    views: 1205,
    tags: ["React", "JavaScript", "Web Dev"]
  },
  {
    id: 2,
    title: "Calculus II: Integration by Parts Help",
    author: "Mike Ross",
    category: "Mathematics",
    replies: 32,
    views: 890,
    tags: ["Calculus", "Math", "Homework"]
  },
  {
    id: 3,
    title: "Best resources for learning Python in 2024?",
    author: "Jessica Pearson",
    category: "Programming",
    replies: 28,
    views: 1500,
    tags: ["Python", "Resources", "Beginner"]
  }
];

const userStats = {
  points: 1250,
  streak: 15,
  rank: "Scholar",
  nextRank: "Master",
  progress: 75
};

const featuredMaterials = [
  {
    id: 1,
    title: "Complete Guide to Linear Algebra",
    author: "Prof. Specter",
    subject: "Mathematics",
    rating: 4.8,
    downloads: 340
  },
  {
    id: 2,
    title: "Physics 101: Mechanics Cheat Sheet",
    author: "Rachel Zane",
    subject: "Physics",
    rating: 4.9,
    downloads: 520
  }
];

export default function Home() {
  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section */}
      <section className="bg-white border-b py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn Better, <span className="text-blue-600">Together</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of students connecting, sharing, and succeeding. 
            Ask questions, share materials, and master your subjects with AI assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/forums">
              <Button size="lg" className="w-full sm:w-auto">
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Trending Forums */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="mr-2 h-6 w-6 text-blue-600" />
                Trending Discussions
              </h2>
              <Link href="/forums" className="text-blue-600 hover:underline text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {trendingForums.map((forum) => (
                <div key={forum.id} className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      {forum.category}
                    </span>
                    <span className="text-sm text-gray-500">{forum.views} views</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                    <Link href={`/forums/${forum.id}`}>{forum.title}</Link>
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>By {forum.author}</span>
                      <span className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {forum.replies} replies
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {forum.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Materials */}
          <section>
             <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <BookOpen className="mr-2 h-6 w-6 text-green-600" />
                Featured Materials
              </h2>
              <Link href="/materials" className="text-blue-600 hover:underline text-sm font-medium">
                Browse Library
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredMaterials.map((material) => (
                <div key={material.id} className="bg-white p-5 rounded-xl border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 text-sm font-medium">
                      <Star className="h-3 w-3 fill-current mr-1" />
                      {material.rating}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{material.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{material.subject} • by {material.author}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Download ({material.downloads})
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Stats Card */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
              Your Progress
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Rank</span>
                <span className="font-semibold text-blue-600">{userStats.rank}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${userStats.progress}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 text-right">{userStats.points} points to next rank</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">{userStats.points}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Total Points</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600 flex items-center justify-center">
                    {userStats.streak} <Flame className="h-5 w-5 ml-1 fill-current" />
                  </div>
                  <div className="text-xs text-orange-600 uppercase tracking-wide">Day Streak</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white shadow-md">
            <h3 className="text-lg font-bold mb-2">Need Help?</h3>
            <p className="text-blue-100 text-sm mb-4">
              Get instant answers from our AI Tutor or book a session with an expert.
            </p>
            <div className="space-y-2">
              <Link href="/ai-tutor">
                <Button variant="secondary" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with AI Tutor
                </Button>
              </Link>
              <Link href="/tutors">
                <Button variant="secondary" className="w-full justify-start bg-blue-500 text-white border-none hover:bg-blue-400">
                  <User className="mr-2 h-4 w-4" />
                  Find a Human Tutor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
