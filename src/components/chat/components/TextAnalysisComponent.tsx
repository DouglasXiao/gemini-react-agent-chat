
import React from 'react';

interface TextAnalysisComponentProps {
  data: any;
}

export const TextAnalysisComponent: React.FC<TextAnalysisComponentProps> = ({ data }) => {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-6">文本分析任务</h3>
      
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">原始输入变量</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono">
            {JSON.stringify(data || { task: "123", text: "123" }, null, 2)}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">分析结果</h4>
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">情感倾向</h5>
              <p className="text-sm text-gray-600 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                混合情感 - 包含正面和负面评价
              </p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">关键信息</h5>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono">
                {`{
  "positive": ["界面流畅", "设计美观"],
  "negative": ["速度慢", "功能复杂"]
}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
