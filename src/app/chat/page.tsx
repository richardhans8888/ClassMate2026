import { Send } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center p-8 h-full">
      <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
        <Send className="h-10 w-10 text-blue-600 ml-1" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a conversation</h2>
      <p className="text-gray-500 max-w-md">
        Choose a contact from the list to start chatting, sharing files, or making voice calls.
      </p>
    </div>
  );
}
