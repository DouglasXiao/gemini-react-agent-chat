
import React, { useRef } from 'react';

interface FileButtonsProps {
  files: File[];
  setFiles: (files: File[]) => void;
  isLoading: boolean;
}

export const FileButtons: React.FC<FileButtonsProps> = ({ files, setFiles, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (type: 'file' | 'image' | 'video') => {
    const inputRef = type === 'file' ? fileInputRef : type === 'image' ? imageInputRef : videoInputRef;
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles([...files, ...selectedFiles]);
  };

  return (
    <>
      <button
        onClick={() => handleFileSelect('file')}
        disabled={isLoading}
        className="h-8 w-8 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        title="上传文件"
      >
        📎
      </button>
      <button
        onClick={() => handleFileSelect('image')}
        disabled={isLoading}
        className="h-8 w-8 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        title="上传图片"
      >
        🖼️
      </button>
      <button
        onClick={() => handleFileSelect('video')}
        disabled={isLoading}
        className="h-8 w-8 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        title="上传视频"
      >
        🎬
      </button>

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
    </>
  );
};
