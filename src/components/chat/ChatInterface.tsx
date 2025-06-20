
import React, { useState } from 'react';
import { WelcomeChat } from './WelcomeChat';
import { ChatLayout } from './ChatLayout';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: File[];
  buttons?: Array<{
    id: string;
    label: string;
    action: string;
    data?: any;
  }>;
}

export const ChatInterface: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleChatStart = (newSessionId: string, initialMessages: ChatMessage[]) => {
    setSessionId(newSessionId);
    setMessages(initialMessages);
  };

  if (!sessionId) {
    return <WelcomeChat onChatStart={handleChatStart} />;
  }

  return (
    <ChatLayout 
      sessionId={sessionId}
      initialMessages={messages}
      onNewSession={() => {
        setSessionId(null);
        setMessages([]);
      }}
    />
  );
};
