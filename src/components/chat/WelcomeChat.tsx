
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Image, Video, Send, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import type { ChatMessage } from './ChatInterface';

interface WelcomeChatProps {
  onChatStart: (sessionId: string, messages: ChatMessage[]) => void;
}

export const WelcomeChat: React.FC<WelcomeChatProps> = ({ onChatStart }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (type: 'file' | 'image' | 'video') => {
    const inputRef = type === 'file' ? fileInputRef : type === 'image' ? imageInputRef : videoInputRef;
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!message.trim() && files.length === 0) {
      toast.error('请输入消息或上传文件');
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

      // Create initial messages
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date(),
        files: files.length > 0 ? files : undefined,
      };

      onChatStart(sessionId, [userMessage]);
      
    } catch (error) {
      console.error('Chat start error:', error);
      toast.error('发送消息失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">文本分析助手</h1>
          <p className="text-lg text-gray-600">你好！我是您的专属智能分析助手，请将您的任务描述和需要分析的文本一起输入，然后发送给我。</p>
        </div>

        {/* Main Chat Card */}
        <Card className="p-6 shadow-lg border-0">
          {/* File Upload Area */}
          {files.length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">已上传文件：</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                    <span className="text-sm text-gray-600 truncate">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      移除
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Text Input */}
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="输入您的任务描述..."
              className="min-h-[120px] pr-16 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
            
            {/* Upload Buttons */}
            <div className="absolute bottom-3 left-3 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFileSelect('file')}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFileSelect('image')}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                <Image className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFileSelect('video')}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                <Video className="h-4 w-4" />
              </Button>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || (!message.trim() && files.length === 0)}
              className="absolute bottom-3 right-3 h-8 w-8 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={imageInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={videoInputRef}
            type="file"
            multiple
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </Card>

        {/* Example Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setMessage('分析报告摘要并识别正面和负面评价。')}>
            <h3 className="font-medium text-gray-900 mb-2">情感分析</h3>
            <p className="text-sm text-gray-600">分析文本中的情感倾向和观点</p>
          </Card>
          <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setMessage('提取文本中的关键信息和主要观点。')}>
            <h3 className="font-medium text-gray-900 mb-2">关键信息提取</h3>
            <p className="text-sm text-gray-600">识别并提取重要信息点</p>
          </Card>
          <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setMessage('对文本内容进行总结和归纳。')}>
            <h3 className="font-medium text-gray-900 mb-2">内容总结</h3>
            <p className="text-sm text-gray-600">生成简洁的内容摘要</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
