
import React from 'react';
import { FileButtons } from './FileButtons';

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  onSubmit: () => void;
  isLoading: boolean;
  compact?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  files,
  setFiles,
  onSubmit,
  isLoading,
  compact = false
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="输入消息..."
        className={`w-full pr-20 border border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:ring-blue-500 ${
          compact ? 'min-h-[60px] p-3' : 'min-h-[120px] p-4 text-base'
        }`}
        disabled={isLoading}
      />
      
      <div className="absolute bottom-3 left-3 flex gap-2">
        <FileButtons files={files} setFiles={setFiles} isLoading={isLoading} />
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading || (!message.trim() && files.length === 0)}
        className="absolute bottom-3 right-3 h-8 w-8 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ▶
      </button>
    </div>
  );
};
