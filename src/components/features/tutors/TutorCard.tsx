import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Star, Clock, Video, Award } from "lucide-react";

interface TutorCardProps {
  id: number | string;
  name: string;
  subject: string;
  specialties: string[];
  rating: number;
  reviews: number;
  hourlyRate: number;
  bio: string;
  avatar: string;
  available: boolean;
}

export function TutorCard({
  id,
  name,
  subject,
  specialties,
  rating,
  reviews,
  hourlyRate,
  bio,
  avatar,
  available,
}: TutorCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
              {avatar}
            </div>
            {available && (
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
            <p className="text-blue-600 font-medium">{subject} Tutor</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 font-bold">
            <Star className="h-4 w-4 fill-current mr-1" />
            {rating}
            <span className="text-xs font-normal text-yellow-600 ml-1">
              ({reviews})
            </span>
          </div>
          <p className="text-gray-900 font-bold mt-2">${hourlyRate}/hr</p>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{bio}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {specialties.slice(0, 3).map((specialty) => (
          <span
            key={specialty}
            className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600"
          >
            {specialty}
          </span>
        ))}
        {specialties.length > 3 && (
          <span className="bg-gray-50 px-2 py-1 rounded text-xs text-gray-500">
            +{specialties.length - 3} more
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <Link href={`/tutors/${id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Profile
          </Button>
        </Link>
        <Button className="w-full">Book Session</Button>
      </div>
    </div>
  );
}
