
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Plus, Paperclip, Image, Video } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { toast } from 'sonner';
import type { ChatMessage } from './ChatInterface';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      toast.error('发送消息失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">对话任务</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onNewSession}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          新对话
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <Avatar className="w-8 h-8 flex-shrink-0">
                <div className={`w-full h-full rounded-full flex items-center justify-center text-white text-sm font-medium ${
                  message.role === 'user' ? 'bg-blue-500' : 'bg-gray-600'
                }`}>
                  {message.role === 'user' ? 'U' : 'AI'}
                </div>
              </Avatar>
              
              <div className={`rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {/* File attachments */}
                {message.files && message.files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.files.map((file, index) => (
                      <div key={index} className="text-sm opacity-80">
                        📎 {file.name}
                      </div>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                {message.buttons && message.buttons.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.buttons.map((button) => (
                      <Button
                        key={button.id}
                        variant="outline"
                        size="sm"
                        onClick={() => onButtonClick(button.id, button.action, button.data)}
                        className="w-full"
                      >
                        {button.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        {/* Selected Files */}
        {files.length > 0 && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">已选择文件：</div>
            {files.map((file, index) => (
              <div key={index} className="text-sm text-gray-700">
                📎 {file.name}
              </div>
            ))}
          </div>
        )}

        <div className="relative">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="输入消息..."
            className="pr-20 min-h-[60px] resize-none"
            disabled={isLoading}
          />
          
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileSelect}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || (!newMessage.trim() && files.length === 0)}
              className="h-8 w-8 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
