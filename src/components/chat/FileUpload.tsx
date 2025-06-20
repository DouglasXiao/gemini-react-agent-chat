
import React from 'react';

interface FileUploadProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ files, setFiles }) => {
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  if (files.length === 0) return null;

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-2">已上传文件：</h3>
      <div className="space-y-2">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
            <span className="text-sm text-gray-600 truncate">{file.name}</span>
            <button
              onClick={() => removeFile(index)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              移除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
