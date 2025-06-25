
import React, { useState } from 'react';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import { createChatRequest, sendChatMessage } from '../../utils/chatApi';
import type { ChatMessage } from './ChatApp';

interface ChatSidebarProps {
  messages: ChatMessage[];
  sessionId: string;
  onNewSession: () => void;
  onButtonClick: (buttonId: string, action: string, data?: any) => void;
  onNewMessageSent?: (conversationId: string) => void;
  onMessageClick?: (message: ChatMessage) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  sessionId,
  onNewSession,
  onButtonClick,
  onNewMessageSent,
  onMessageClick,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && files.length === 0) return;

    setIsLoading(true);
    
    try {
      // Get the last message ID as parent_message_id
      const lastMessage = messages[messages.length - 1];
      const parentMessageId = lastMessage?.message_id || 'client-created-root';
      
      const chatRequest = createChatRequest(newMessage, sessionId, parentMessageId);
      const { conversationId } = await sendChatMessage(chatRequest);

      // Add user message to the messages list immediately
      const userMessage: ChatMessage = {
        message_id: chatRequest.messages[0].id,
        session_id: sessionId,
        role: 'user',
        content: newMessage,
        is_streaming: false,
        timestamp: new Date(),
        files: files.length > 0 ? files : undefined,
      };

      // Notify parent component about new message sent
      if (onNewMessageSent && conversationId) {
        onNewMessageSent(conversationId);
      }

      setNewMessage('');
      setFiles([]);
    } catch (error) {
      console.error('Send message error:', error);
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

      <MessageList 
        messages={messages} 
        onButtonClick={onButtonClick} 
        onMessageClick={onMessageClick}
      />

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
