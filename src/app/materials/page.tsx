import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { MaterialCard } from '@/components/features/materials/MaterialCard';
import { Search, Filter, Upload, FileText, Download } from 'lucide-react';

const materials = [
  {
    id: 1,
    title: "Calculus I: Limits and Derivatives",
    author: "Mike Ross",
    subject: "Mathematics",
    type: "PDF",
    rating: 4.8,
    downloads: 340,
    uploadedAt: "2 days ago"
  },
  {
    id: 2,
    title: "Organic Chemistry Reaction Mechanisms",
    author: "Walter White",
    subject: "Chemistry",
    type: "Notes",
    rating: 4.9,
    downloads: 520,
    uploadedAt: "1 week ago"
  },
  {
    id: 3,
    title: "Introduction to Algorithms Cheat Sheet",
    author: "Sarah Chen",
    subject: "Computer Science",
    type: "Cheat Sheet",
    rating: 5.0,
    downloads: 890,
    uploadedAt: "3 days ago"
  },
  {
    id: 4,
    title: "World History: The Industrial Revolution",
    author: "Harvey Specter",
    subject: "History",
    type: "Slides",
    rating: 4.5,
    downloads: 210,
    uploadedAt: "5 days ago"
  },
  {
    id: 5,
    title: "Physics: Mechanics Formula Sheet",
    author: "Louis Litt",
    subject: "Physics",
    type: "PDF",
    rating: 4.7,
    downloads: 430,
    uploadedAt: "1 day ago"
  },
  {
    id: 6,
    title: "English Literature: Shakespeare Analysis",
    author: "Donna Paulsen",
    subject: "Literature",
    type: "Essay",
    rating: 4.6,
    downloads: 150,
    uploadedAt: "4 days ago"
  }
];

const subjects = [
  "All Subjects",
  "Mathematics",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Literature",
  "Languages"
];

const types = [
  "All Types",
  "PDF",
  "Notes",
  "Slides",
  "Cheat Sheet",
  "Essay",
  "Exam Paper"
];

export default function MaterialsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Materials</h1>
          <p className="text-gray-600 mt-1">Share and discover resources to boost your learning.</p>
        </div>
        <Link href="/materials/upload">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Material
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
                placeholder="Search resources..."
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center mb-3">
                  <Filter className="mr-2 h-4 w-4" />
                  Subject
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {subjects.map((subject, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`subject-${index}`}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        defaultChecked={index === 0}
                      />
                      <label htmlFor={`subject-${index}`} className="text-sm text-gray-700 cursor-pointer select-none">
                        {subject}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">File Type</h3>
                <div className="space-y-2">
                  {types.map((type, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`type-${index}`}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        defaultChecked={index === 0}
                      />
                      <label htmlFor={`type-${index}`} className="text-sm text-gray-700 cursor-pointer select-none">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-5 rounded-xl border border-green-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-900">Top Contributors</h3>
            </div>
            <ul className="space-y-3 mt-3">
              <li className="flex justify-between text-sm">
                <span className="text-green-800">Sarah Chen</span>
                <span className="font-medium text-green-700">12 uploads</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-green-800">Mike Ross</span>
                <span className="font-medium text-green-700">8 uploads</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-green-800">Jessica Pearson</span>
                <span className="font-medium text-green-700">6 uploads</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm mb-6">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{materials.length}</span> resources
            </div>
            <select className="border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
              <option>Most Popular</option>
              <option>Newest First</option>
              <option>Highest Rated</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {materials.map((material) => (
              <MaterialCard
                key={material.id}
                {...material}
              />
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <Button variant="outline">Load More Resources</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
