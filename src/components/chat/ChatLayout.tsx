
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
  const [currentEventSource, setCurrentEventSource] = useState<EventSource | null>(null);

  const startSSEConnection = (conversationId: string) => {
    // Close existing connection if any
    if (currentEventSource) {
      currentEventSource.close();
    }

    const eventSource = new EventSource(`/conversation?conversation_id=${conversationId}`, {
      withCredentials: false
    });
    
    eventSource.onmessage = (event) => {
      try {
        console.log('SSE message received:', event.data);
        
        // Check for [DONE] marker
        if (event.data.trim() === '[DONE]') {
          console.log('SSE connection ended with [DONE]');
          eventSource.close();
          setCurrentEventSource(null);
          return;
        }

        const data = JSON.parse(event.data);
        
        if (data.type === 'message' || data.message) {
          const newMessage: ChatMessage = {
            message_id: data.message_id || data.id || `msg_${Date.now()}`,
            session_id: data.session_id || conversationId,
            role: data.role || data.author?.role || 'assistant',
            content: data.content || data.message?.content?.parts?.[0] || '',
            reasoning_content: data.reasoning_content,
            tools: data.tools || [],
            tool_call: data.tool_call || [],
            is_streaming: data.is_streaming || false,
            finish_reason: data.finish_reason,
            timestamp: new Date(data.timestamp || data.create_time * 1000 || Date.now()),
            buttons: data.buttons || [],
          };
          
          setMessages(prev => {
            const exists = prev.find(msg => msg.message_id === newMessage.message_id);
            if (exists) return prev;
            return [...prev, newMessage];
          });
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error, 'Raw data:', event.data);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
      setCurrentEventSource(null);
    };

    setCurrentEventSource(eventSource);
  };

  useEffect(() => {
    // Start SSE connection when component mounts
    startSSEConnection(sessionId);

    return () => {
      if (currentEventSource) {
        currentEventSource.close();
        setCurrentEventSource(null);
      }
    };
  }, [sessionId]);

  const handleButtonClick = (buttonId: string, action: string, data?: any) => {
    setActiveComponent(action);
    setComponentData(data);
  };

  const handleNewMessageSent = (conversationId: string) => {
    // Restart SSE connection for the new message
    startSSEConnection(conversationId);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/2 border-r border-gray-200">
        <ChatSidebar
          messages={messages}
          sessionId={sessionId}
          onNewSession={onNewSession}
          onButtonClick={handleButtonClick}
          onNewMessageSent={handleNewMessageSent}
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
