
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TextAnalysisComponentProps {
  data: any;
}

export const TextAnalysisComponent: React.FC<TextAnalysisComponentProps> = ({ data }) => {
  const analysisData = data || {
    sentiment: 'mixed',
    details: ['界面流畅fffff', '速度慢'],
    summary: '用户对设计满意，但对性能有些担忧（感性）不满意。'
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-6">文本分析任务</h3>
      
      <Tabs defaultValue="data" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="data">数据</TabsTrigger>
          <TabsTrigger value="results">多模型结果</TabsTrigger>
        </TabsList>
        
        <TabsContent value="data" className="space-y-6">
          <Card className="p-4">
            <h4 className="font-medium mb-3">原始输入变量</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono">
              {`{
  "task": "123",
  "text": "123"
}`}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-3">最终生成结果</h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">理想回答推理过程</h5>
                <p className="text-sm text-gray-600 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  侧重情感分类，准确识别正面和负面评价。
                </p>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">理想回答</h5>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono">
                  {`{
  "sentiment": "${analysisData.sentiment}",
  "details": [
    "${analysisData.details[0]}",
    "${analysisData.details[1]}"
  ]
}`}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div className="grid gap-4">
            {/* Model A - Doubao */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">🤖</div>
                <h4 className="font-medium">模型A (Doubao)</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">推理过程：</p>
              <p className="text-sm mb-3">侧重情感分类，准确识别正面和负面评价。</p>
              <p className="text-sm text-gray-600 mb-2">回答 (JSON)：</p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm font-mono">
                {`{
  "sentiment": "mixed",
  "details": [
    "界面流畅",
    "速度慢"
  ]
}`}
              </div>
            </Card>

            {/* Model B - GPT-4 */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">🤖</div>
                <h4 className="font-medium">模型B (GPT-4)</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">推理过程：</p>
              <p className="text-sm mb-3">专注于提取关键问题和建议。</p>
              <p className="text-sm text-gray-600 mb-2">回答 (JSON)：</p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm font-mono">
                {`{
  "issues": [
    {
      "feature": "速度",
      "problem": "效果不自然"
    }
  ],
  "suggestion": "优化算法"
}`}
              </div>
            </Card>

            {/* Model C - Claude */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">🤖</div>
                <h4 className="font-medium">模型C (Claude)</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">推理过程：</p>
              <p className="text-sm mb-3">提供更具对话性的综合反馈。</p>
              <p className="text-sm text-gray-600 mb-2">回答 (JSON)：</p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm font-mono">
                {`{
  "summary": "用户对设计满意，但对性能有些担忧（感性）不满意。"
}`}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
