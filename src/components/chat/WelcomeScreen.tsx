
import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { MessageInput } from './MessageInput';
import { ExampleCards } from './ExampleCards';
import { createChatRequest, sendChatMessage } from '../../utils/chatApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronDown } from 'lucide-react';
import type { ChatMessage } from './ChatApp';

interface WelcomeScreenProps {
  onChatStart: (sessionId: string, messages: ChatMessage[]) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onChatStart }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('prompt-agent');

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
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      {/* Top section with agent selector */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <div className="flex justify-start">
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-64 h-11 bg-white border-0 rounded-xl shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm text-gray-900">
                    {selectedAgent === 'prompt-agent' ? 'Prompt agent' : 'Visual agent'}
                  </span>
                  <span className="text-xs text-gray-500 font-normal">
                    {selectedAgent === 'prompt-agent' ? '提示智能体' : '视觉智能体'}
                  </span>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="w-64 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50">
              <SelectItem 
                value="prompt-agent" 
                className="rounded-lg p-3 pl-8 cursor-pointer hover:bg-gray-50 focus:bg-gray-50 data-[highlighted]:bg-gray-50"
              >
                <div className="flex flex-col items-start w-full">
                  <div className="font-semibold text-sm text-gray-900">Prompt agent</div>
                  <div className="text-xs text-gray-500 mt-1">适用于文本分析和对话任务</div>
                </div>
              </SelectItem>
              <SelectItem 
                value="visual-agent" 
                className="rounded-lg p-3 pl-8 cursor-pointer hover:bg-gray-50 focus:bg-gray-50 data-[highlighted]:bg-gray-50"
              >
                <div className="flex flex-col items-start w-full">
                  <div className="font-semibold text-sm text-gray-900">Visual agent</div>
                  <div className="text-xs text-gray-500 mt-1">适用于图像分析和视觉推理</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-semibold text-gray-900 mb-2">
              {selectedAgent === 'prompt-agent' ? '文本分析助手' : '视觉分析助手'}
            </h1>
            <p className="text-lg text-gray-600">
              {selectedAgent === 'prompt-agent' 
                ? '你好！我是您的专属智能分析助手，请将您的任务描述和需要分析的文本一起输入，然后发送给我。'
                : '你好！我是您的专属视觉分析助手，请上传图片或描述您的视觉分析需求，然后发送给我。'
              }
            </p>
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
    </div>
  );
};
