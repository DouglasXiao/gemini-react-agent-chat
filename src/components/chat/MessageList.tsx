
import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import type { ChatMessage } from './ChatApp';

interface MessageListProps {
  messages: ChatMessage[];
  onButtonClick: (buttonId: string, action: string, data?: any) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, onButtonClick }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.message_id}
          message={message}
          onButtonClick={onButtonClick}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
