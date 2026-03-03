import { Search } from "lucide-react";
import Link from "next/link";

const contacts = [
  {
    id: 1,
    name: "Sarah Chen",
    lastMessage: "Thanks for the help with React!",
    time: "2m ago",
    unread: 2,
    online: true,
    avatar: "S",
  },
  {
    id: 2,
    name: "Mike Ross",
    lastMessage: "Did you finish the calculus assignment?",
    time: "1h ago",
    unread: 0,
    online: false,
    avatar: "M",
  },
  {
    id: 3,
    name: "Jessica Pearson",
    lastMessage: "The study group is meeting at 5 PM.",
    time: "3h ago",
    unread: 0,
    online: true,
    avatar: "J",
  },
  {
    id: 4,
    name: "Harvey Specter",
    lastMessage: "I uploaded the history notes.",
    time: "1d ago",
    unread: 0,
    online: false,
    avatar: "H",
  },
];

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-64px)]">
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden h-full flex">
        {/* Sidebar - Contacts */}
        <div className="w-full md:w-80 border-r flex flex-col h-full hidden md:flex">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <Link href={`/chat/${contact.id}`} key={contact.id}>
                <div
                  className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors ${contact.unread > 0 ? "bg-blue-50/50" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg">
                        {contact.avatar}
                      </div>
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {contact.name}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {contact.time}
                        </span>
                      </div>
                      <p
                        className={`text-sm truncate ${contact.unread > 0 ? "text-gray-900 font-medium" : "text-gray-500"}`}
                      >
                        {contact.lastMessage}
                      </p>
                    </div>
                    {contact.unread > 0 && (
                      <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {contact.unread}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full">{children}</div>
      </div>
    </div>
  );
}
