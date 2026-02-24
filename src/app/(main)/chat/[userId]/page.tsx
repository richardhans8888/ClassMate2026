import { Button } from "@/components/ui/Button";
import {
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Mic,
  Send,
  Smile,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// Mock Messages
const messages = [
  {
    id: 1,
    senderId: 2, // Other user
    content: "Hey, are you free to discuss the React project?",
    time: "10:30 AM",
    type: "text",
  },
  {
    id: 2,
    senderId: 1, // Current user
    content: "Yeah sure! I'm just finishing up some docs.",
    time: "10:32 AM",
    type: "text",
  },
  {
    id: 3,
    senderId: 2,
    content: "Great. I was wondering about the state management part.",
    time: "10:33 AM",
    type: "text",
  },
  {
    id: 4,
    senderId: 2,
    content: "Should we use Context or Redux?",
    time: "10:33 AM",
    type: "text",
  },
  {
    id: 5,
    senderId: 1,
    content:
      "I think Zustand would be perfect for this scale. It's much simpler.",
    time: "10:35 AM",
    type: "text",
  },
  {
    id: 6,
    senderId: 1,
    content: "Here's a link to the docs:",
    time: "10:35 AM",
    type: "text",
  },
  {
    id: 7,
    senderId: 1,
    content: "https://github.com/pmndrs/zustand",
    time: "10:35 AM",
    type: "link",
  },
  {
    id: 8,
    senderId: 2,
    content: "Oh nice, checking it out now!",
    time: "10:36 AM",
    type: "text",
  },
];

export default function ChatConversationPage({
  params,
}: {
  params: { userId: string };
}) {
  // In a real app, we would fetch user details based on params.userId
  const user = {
    id: params.userId,
    name: "Sarah Chen",
    status: "Online",
    avatar: "S",
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-3">
          <Link href="/chat" className="md:hidden">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
            {user.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-gray-500">{user.status}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <div className="flex justify-center my-4">
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            Today
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === 1;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p
                  className={`text-[10px] mt-1 text-right ${isMe ? "text-blue-100" : "text-gray-400"}`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 shrink-0"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full pl-4 pr-10 py-3 bg-gray-50 border-transparent focus:bg-white border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1.5 h-7 w-7 text-gray-400"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          {/* If text input is empty show Mic, else show Send */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 shrink-0"
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button size="icon" className="rounded-full shrink-0 h-10 w-10">
            <Send className="h-5 w-5 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
