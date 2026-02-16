import { Button } from '@/components/ui/Button';
import { User, Settings, Award, Clock, BookOpen, MessageSquare, Flame } from 'lucide-react';

const user = {
  name: "Richard",
  email: "richard@student.edu",
  role: "Student",
  joinDate: "September 2023",
  bio: "Computer Science student interested in Web Development and AI.",
  stats: {
    points: 1250,
    streak: 15,
    rank: "Scholar",
    questionsAsked: 24,
    questionsAnswered: 45,
    materialsShared: 3
  },
  achievements: [
    { name: "First Steps", description: "Joined the platform", icon: "🚀" },
    { name: "Helper", description: "Answered 10 questions", icon: "🤝" },
    { name: "Scholar", description: "Reached 1000 points", icon: "🎓" },
    { name: "Consistent", description: "7 day streak", icon: "🔥" }
  ]
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">{user.role} • Joined {user.joinDate}</p>
              <p className="text-gray-700 mt-2 max-w-md">{user.bio}</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button className="flex-1 md:flex-none">Edit Profile</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-bold text-gray-900 mb-4">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{user.stats.points}</div>
                <div className="text-xs text-gray-500 uppercase">Points</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 flex items-center justify-center">
                  {user.stats.streak} <Flame className="h-4 w-4 ml-1" />
                </div>
                <div className="text-xs text-orange-600 uppercase">Day Streak</div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" /> Questions Asked
                </span>
                <span className="font-semibold">{user.stats.questionsAsked}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" /> Questions Answered
                </span>
                <span className="font-semibold">{user.stats.questionsAnswered}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" /> Materials Shared
                </span>
                <span className="font-semibold">{user.stats.materialsShared}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-sm border p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Premium Plan</h3>
            <p className="text-purple-100 text-sm mb-4">
              Upgrade to access exclusive features and unlimited AI tutoring.
            </p>
            <Button variant="secondary" className="w-full">Manage Subscription</Button>
          </div>
        </div>

        {/* Main Content Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {user.achievements.map((achievement, index) => (
                <div key={index} className="flex flex-col items-center text-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="font-semibold text-sm text-gray-900">{achievement.name}</div>
                  <div className="text-xs text-gray-500">{achievement.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-500" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                <div className="bg-blue-100 p-2 rounded-full">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    Replied to <span className="font-medium">"Integration by Parts Help"</span>
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                <div className="bg-green-100 p-2 rounded-full">
                  <BookOpen className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    Uploaded <span className="font-medium">"CS101 Cheat Sheet"</span>
                  </p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Flame className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    Reached <span className="font-medium">15 Day Streak</span>
                  </p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
