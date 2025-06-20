
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TextAnalysisComponent } from './components/TextAnalysisComponent';
import { ModelSelectionComponent } from './components/ModelSelectionComponent';

interface RightPanelProps {
  activeComponent: string | null;
  componentData: any;
  onClose: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  activeComponent,
  componentData,
  onClose,
}) => {
  const renderComponent = () => {
    if (!activeComponent) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg">点击对话中的按钮查看详细内容</p>
          </div>
        </div>
      );
    }

    switch (activeComponent) {
      case 'text_analysis':
        return <TextAnalysisComponent data={componentData} />;
      case 'model_selection':
        return <ModelSelectionComponent data={componentData} />;
      default:
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">未知组件</h3>
            <p className="text-gray-600">组件类型: {activeComponent}</p>
            {componentData && (
              <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-sm overflow-auto">
                {JSON.stringify(componentData, null, 2)}
              </pre>
            )}
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-white">
      {activeComponent && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">详细信息</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="h-full overflow-y-auto">
        {renderComponent()}
      </div>
    </div>
  );
};
