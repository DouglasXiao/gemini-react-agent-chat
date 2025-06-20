
import React from 'react';
import type { ChatMessage } from './ChatApp';

interface MessageBubbleProps {
  message: ChatMessage;
  onButtonClick: (buttonId: string, action: string, data?: any) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onButtonClick }) => {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
          message.role === 'user' ? 'bg-blue-500' : 'bg-gray-600'
        }`}>
          {message.role === 'user' ? 'U' : 'AI'}
        </div>
        
        <div className={`rounded-lg p-3 ${
          message.role === 'user' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <div className="whitespace-pre-wrap">{message.content}</div>
          
          {message.files && message.files.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.files.map((file, index) => (
                <div key={index} className="text-sm opacity-80">
                  📎 {file.name}
                </div>
              ))}
            </div>
          )}

          {message.buttons && message.buttons.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.buttons.map((button) => (
                <button
                  key={button.id}
                  onClick={() => onButtonClick(button.id, button.action, button.data)}
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {button.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
