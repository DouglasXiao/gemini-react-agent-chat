
import React from 'react';

interface ExampleCardsProps {
  onExampleClick: (message: string) => void;
}

export const ExampleCards: React.FC<ExampleCardsProps> = ({ onExampleClick }) => {
  const examples = [
    {
      title: '情感分析',
      description: '分析文本中的情感倾向和观点',
      message: '分析报告摘要并识别正面和负面评价。'
    },
    {
      title: '关键信息提取',
      description: '识别并提取重要信息点',
      message: '提取文本中的关键信息和主要观点。'
    },
    {
      title: '内容总结',
      description: '生成简洁的内容摘要',
      message: '对文本内容进行总结和归纳。'
    }
  ];

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {examples.map((example) => (
        <div
          key={example.title}
          className="p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onExampleClick(example.message)}
        >
          <h3 className="font-medium text-gray-900 mb-2">{example.title}</h3>
          <p className="text-sm text-gray-600">{example.description}</p>
        </div>
      ))}
    </div>
  );
};
