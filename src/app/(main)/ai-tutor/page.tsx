import { ChatInterface } from '@/components/features/ai-tutor/ChatInterface';
import { VoiceMode } from '@/components/features/ai-tutor/VoiceMode';

export default function AITutorPage() {
  return (
    <div className="h-[calc(100vh-64px)] w-full bg-[#05050A] p-4 lg:p-6 overflow-hidden">
      <div className="h-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChatInterface />
        <VoiceMode />
      </div>
      
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>
    </div>
  );
}
