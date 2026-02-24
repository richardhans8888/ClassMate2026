import { ActiveStudyRooms } from "@/components/features/forums/ActiveStudyRooms";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ForumCard } from "@/components/features/forums/ForumCard";
import { Plus, Search, Filter } from "lucide-react";

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
    createdAt: "2 hours ago",
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
    createdAt: "5 hours ago",
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
    createdAt: "1 day ago",
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
    createdAt: "2 days ago",
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
    createdAt: "3 days ago",
  },
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
  "Languages",
];

export default function ForumsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ActiveStudyRooms />
    </div>
  );
}
