
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

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
      id: 'Claude 3 Opus',
      name: 'Claude 3 Opus',
      description: '优秀的理解和创作能力'
    }
  ];

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">好的，准备工作已经完成。请选择一个模型来生成初步回答。</h3>
        <p className="text-gray-600">选择模型：</p>
      </div>

      <div className="space-y-3">
        {models.map((model) => (
          <Card
            key={model.id}
            className={`p-4 cursor-pointer transition-all border-2 ${
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
                <Check className="h-5 w-5 text-blue-500" />
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <Button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => console.log('开始分析', selectedModel)}
        >
          ▶ 开始分析
        </Button>
      </div>
    </div>
  );
};
