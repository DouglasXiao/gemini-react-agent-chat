
import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { MessageInput } from './MessageInput';
import { ExampleCards } from './ExampleCards';
import { createChatRequest, sendChatMessage } from '../../utils/chatApi';
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
      const chatRequest = createChatRequest(message);
      const { conversationId } = await sendChatMessage(chatRequest);

      if (!conversationId) {
        throw new Error('No conversation ID received');
      }

      const userMessage: ChatMessage = {
        message_id: chatRequest.messages[0].id,
        session_id: conversationId,
        role: 'user',
        content: message,
        is_streaming: false,
        timestamp: new Date(),
        files: files.length > 0 ? files : undefined,
      };

      onChatStart(conversationId, [userMessage]);
      
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
