import { Button } from '@/components/ui/Button';
import { Send, Bot, Sparkles, Book, RotateCcw } from 'lucide-react';

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "History",
  "Literature"
];

const examplePrompts = [
  "Explain quantum entanglement like I'm 5",
  "Solve this calculus problem: ∫ x^2 dx",
  "Write a summary of Romeo and Juliet",
  "Debug this React useEffect code"
];

export default function AITutorPage() {
  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-64px)] flex flex-col md:flex-row gap-6">
      {/* Sidebar / Configuration */}
      <div className="w-full md:w-80 space-y-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">AI Tutor</h2>
              <p className="text-xs text-gray-500">Powered by GPT-4</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject Context</label>
              <select className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="">General Knowledge</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Learning Style</label>
              <select className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="balanced">Balanced</option>
                <option value="socratic">Socratic (Ask questions)</option>
                <option value="simple">Simplified (ELI5)</option>
                <option value="detailed">Detailed/Academic</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset Conversation
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-6 rounded-xl text-white shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            <h3 className="font-bold">Pro Tip</h3>
          </div>
          <p className="text-purple-100 text-sm">
            Try asking the AI to quiz you on a topic to test your knowledge before an exam!
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome Message */}
          <div className="flex gap-4 max-w-3xl">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Bot className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border">
                <p className="text-gray-800">
                  Hello! I'm your AI Tutor. I can help you understand complex topics, solve problems, or prepare for exams. What are we learning today?
                </p>
              </div>
            </div>
          </div>
          
          {/* Example User Message */}
          <div className="flex gap-4 max-w-3xl ml-auto flex-row-reverse">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <span className="font-bold">R</span>
            </div>
            <div className="space-y-2">
              <div className="bg-purple-600 p-4 rounded-2xl rounded-tr-none text-white shadow-sm">
                <p>Can you explain the Pythagorean theorem?</p>
              </div>
            </div>
          </div>
          
          {/* Example AI Response */}
          <div className="flex gap-4 max-w-3xl">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Bot className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border">
                <p className="text-gray-800 mb-2">
                  Certainly! The Pythagorean theorem is a fundamental relation in Euclidean geometry among the three sides of a right triangle.
                </p>
                <p className="text-gray-800 mb-2">
                  It states that the area of the square whose side is the hypotenuse (the side opposite the right angle) is equal to the sum of the areas of the squares on the other two sides.
                </p>
                <div className="bg-white p-3 rounded border font-mono text-sm my-2">
                  a² + b² = c²
                </div>
                <p className="text-gray-800">
                  Where <strong>c</strong> represents the length of the hypotenuse and <strong>a</strong> and <strong>b</strong> the lengths of the triangle's other two sides.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Prompts (shown when near empty or idle) */}
        <div className="px-6 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {examplePrompts.map((prompt, index) => (
              <button 
                key={index}
                className="whitespace-nowrap px-4 py-2 bg-gray-50 hover:bg-gray-100 border rounded-full text-xs text-gray-600 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-gray-50">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="w-full pl-4 pr-12 py-3 bg-white border-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
            <Button 
              size="icon" 
              className="absolute right-2 bg-purple-600 hover:bg-purple-700 h-9 w-9 rounded-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">
            AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}
