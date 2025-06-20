
import React, { useState, useRef } from 'react';
import { FileUpload } from './FileUpload';
import { MessageInput } from './MessageInput';
import { ExampleCards } from './ExampleCards';
import type { ChatMessage } from './ChatApp';

interface WelcomeScreenProps {
  onChatStart: (sessionId: string, messages: ChatMessage[]) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onChatStart }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() && files.length === 0) {
      alert('请输入消息或上传文件');
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('message', message);
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      const response = await fetch('/api/chat/stream_chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const sessionId = data.session_id;

      const userMessage: ChatMessage = {
        message_id: `user_${Date.now()}`,
        session_id: sessionId,
        role: 'user',
        content: message,
        is_streaming: false,
        timestamp: new Date(),
        files: files.length > 0 ? files : undefined,
      };

      onChatStart(sessionId, [userMessage]);
      
    } catch (error) {
      console.error('Chat start error:', error);
      alert('发送消息失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">文本分析助手</h1>
          <p className="text-lg text-gray-600">你好！我是您的专属智能分析助手，请将您的任务描述和需要分析的文本一起输入，然后发送给我。</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-0">
          <FileUpload files={files} setFiles={setFiles} />
          <MessageInput
            message={message}
            setMessage={setMessage}
            files={files}
            setFiles={setFiles}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>

        <ExampleCards onExampleClick={setMessage} />
      </div>
    </div>
  );
};
