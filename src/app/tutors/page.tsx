import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TutorCard } from '@/components/features/tutors/TutorCard';
import { Search, Filter, Calendar } from 'lucide-react';

const tutors = [
  {
    id: 1,
    name: "Dr. Alan Grant",
    subject: "Paleontology",
    specialties: ["Dinosaurs", "Fossils", "Evolutionary Biology"],
    rating: 4.9,
    reviews: 120,
    hourlyRate: 50,
    bio: "Experienced paleontologist with a passion for teaching about prehistoric life. I make learning about dinosaurs fun and engaging!",
    avatar: "AG",
    available: true
  },
  {
    id: 2,
    name: "Ellie Sattler",
    subject: "Botany",
    specialties: ["Paleobotany", "Plant Biology", "Ecology"],
    rating: 5.0,
    reviews: 95,
    hourlyRate: 45,
    bio: "Specializing in ancient plant life and ecosystems. Let's explore the world of plants together!",
    avatar: "ES",
    available: true
  },
  {
    id: 3,
    name: "Ian Malcolm",
    subject: "Mathematics",
    specialties: ["Chaos Theory", "Calculus", "Probability"],
    rating: 4.7,
    reviews: 200,
    hourlyRate: 60,
    bio: "Life finds a way, and so will you with your math problems. I specialize in complex systems and chaos theory.",
    avatar: "IM",
    available: false
  },
  {
    id: 4,
    name: "John Hammond",
    subject: "Business",
    specialties: ["Entrepreneurship", "Management", "Genetics"],
    rating: 4.5,
    reviews: 80,
    hourlyRate: 100,
    bio: "I spare no expense in providing top-tier business tutoring. Learn how to build an empire.",
    avatar: "JH",
    available: true
  }
];

const subjects = [
  "All Subjects",
  "Mathematics",
  "Science",
  "History",
  "Literature",
  "Languages",
  "Business",
  "Computer Science",
  "Art"
];

export default function TutorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find a Tutor</h1>
          <p className="text-gray-600 mt-1">Connect with expert tutors for personalized learning.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            My Schedule
          </Button>
          <Button>Become a Tutor</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tutors..."
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center mb-3">
                  <Filter className="mr-2 h-4 w-4" />
                  Subject
                </h3>
                <select className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Hourly Rate</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">Available Now</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">Weekend</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">Weekday Evenings</span>
                  </label>
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-6">Apply Filters</Button>
          </div>
        </div>

        {/* Tutor List */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="h-full">
                <TutorCard
                  {...tutor}
                  // Manually mapping props if needed, but strict spread works if interface matches
                  name={tutor.name}
                  subject={tutor.subject}
                  specialties={tutor.specialties}
                  rating={tutor.rating}
                  reviews={tutor.reviews}
                  hourlyRate={tutor.hourlyRate}
                  bio={tutor.bio}
                  avatar={tutor.avatar}
                  available={tutor.available}
                  id={tutor.id}
                />
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <Button variant="outline">Load More Tutors</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
