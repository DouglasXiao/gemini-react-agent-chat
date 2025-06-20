
import React, { useState, useEffect } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { RightPanel } from './RightPanel';
import type { ChatMessage } from './ChatApp';

interface ChatLayoutProps {
  sessionId: string;
  initialMessages: ChatMessage[];
  onNewSession: () => void;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  sessionId,
  initialMessages,
  onNewSession,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [componentData, setComponentData] = useState<any>(null);

  useEffect(() => {
    const eventSource = new EventSource(`/api/chat/session_detail?session_id=${sessionId}`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          const newMessage: ChatMessage = {
            message_id: data.message_id || `msg_${Date.now()}`,
            session_id: data.session_id || sessionId,
            role: data.role || 'assistant',
            content: data.content || '',
            reasoning_content: data.reasoning_content,
            tools: data.tools || [],
            tool_call: data.tool_call || [],
            is_streaming: data.is_streaming || false,
            finish_reason: data.finish_reason,
            timestamp: new Date(data.timestamp || Date.now()),
            buttons: data.buttons || [],
          };
          
          setMessages(prev => {
            const exists = prev.find(msg => msg.message_id === newMessage.message_id);
            if (exists) return prev;
            return [...prev, newMessage];
          });
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [sessionId]);

  const handleButtonClick = (buttonId: string, action: string, data?: any) => {
    setActiveComponent(action);
    setComponentData(data);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/2 border-r border-gray-200">
        <ChatSidebar
          messages={messages}
          sessionId={sessionId}
          onNewSession={onNewSession}
          onButtonClick={handleButtonClick}
        />
      </div>
      <div className="w-1/2">
        <RightPanel
          activeComponent={activeComponent}
          componentData={componentData}
          onClose={() => setActiveComponent(null)}
        />
      </div>
    </div>
  );
};
