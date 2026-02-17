import { ChatInterface } from '@/components/features/ai-tutor/ChatInterface';
import { VoiceMode } from '@/components/features/ai-tutor/VoiceMode';

export default function AITutorPage() {
  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#0B0D12]">
      <ChatInterface />
      <VoiceMode />
    </div>
  );
}
