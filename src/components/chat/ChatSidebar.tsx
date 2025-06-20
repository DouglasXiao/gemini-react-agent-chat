
import React, { useState, useRef, useEffect } from 'react';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import type { ChatMessage } from './ChatApp';

interface ChatSidebarProps {
  messages: ChatMessage[];
  sessionId: string;
  onNewSession: () => void;
  onButtonClick: (buttonId: string, action: string, data?: any) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  sessionId,
  onNewSession,
  onButtonClick,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && files.length === 0) return;

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('message', newMessage);
      formData.append('session_id', sessionId);
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      await fetch('/api/chat/stream_chat', {
        method: 'POST',
        body: formData,
      });

      setNewMessage('');
      setFiles([]);
    } catch (error) {
      alert('发送消息失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">对话任务</h2>
        <button
          onClick={onNewSession}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          + 新对话
        </button>
      </div>

      <MessageList messages={messages} onButtonClick={onButtonClick} />

      <div className="border-t border-gray-200 p-4">
        <MessageInput
          message={newMessage}
          setMessage={setNewMessage}
          files={files}
          setFiles={setFiles}
          onSubmit={handleSendMessage}
          isLoading={isLoading}
          compact={true}
        />
      </div>
    </div>
  );
};
