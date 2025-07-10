
import React, { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { ChatLayout } from './ChatLayout';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export interface ChatMessage {
  message_id: string;
  session_id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  reasoning_content?: string;
  tools?: any[];
  tool_call?: any[];
  is_streaming: boolean;
  finish_reason?: 'stop' | 'interrupt';
  timestamp: Date;
  files?: File[];
  buttons?: Array<{
    id: string;
    label: string;
    action: string;
    data?: any;
  }>;
}

export const ChatApp: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleChatStart = (newSessionId: string, initialMessages: ChatMessage[]) => {
    setSessionId(newSessionId);
    setMessages(initialMessages);
  };

  const handleNewSession = () => {
    setSessionId(null);
    setMessages([]);
  };

  const handleSessionSelect = (selectedSessionId: string) => {
    // Mock loading selected session - replace with actual implementation
    setSessionId(selectedSessionId);
    setMessages([]);
    console.log('Loading session:', selectedSessionId);
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full">
        <AppSidebar 
          onNewSession={handleNewSession}
          onSessionSelect={handleSessionSelect}
        />
        
        <SidebarInset className="flex-1">
          {!sessionId ? (
            <WelcomeScreen onChatStart={handleChatStart} />
          ) : (
            <ChatLayout 
              sessionId={sessionId}
              initialMessages={messages}
              onNewSession={handleNewSession}
            />
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
