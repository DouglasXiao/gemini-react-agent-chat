
import React, { useState } from 'react';

interface ModelSelectionComponentProps {
  data: any;
}

export const ModelSelectionComponent: React.FC<ModelSelectionComponentProps> = ({ data }) => {
  const [selectedModel, setSelectedModel] = useState('Doubao-pro-32k');

  const models = [
    {
      id: 'Doubao-pro-32k',
      name: 'Doubao-pro-32k',
      description: '适合复杂推理和长文本处理'
    },
    {
      id: 'GPT-4',
      name: 'GPT-4',
      description: '强大的通用模型，适合多种任务'
    },
    {
      id: 'Claude-3-Opus',
      name: 'Claude 3 Opus',
      description: '优秀的理解和创作能力'
    }
  ];

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">选择分析模型</h3>
        <p className="text-gray-600">请选择一个模型来生成分析结果</p>
      </div>

      <div className="space-y-3">
        {models.map((model) => (
          <div
            key={model.id}
            className={`p-4 cursor-pointer transition-all border-2 rounded-lg ${
              selectedModel === model.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedModel(model.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{model.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{model.description}</p>
              </div>
              {selectedModel === model.id && (
                <div className="h-5 w-5 text-blue-500">✓</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          onClick={() => console.log('开始分析', selectedModel)}
        >
          ▶ 开始分析
        </button>
      </div>
    </div>
  );
};
