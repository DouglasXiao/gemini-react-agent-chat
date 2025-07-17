import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2 } from 'lucide-react';

interface PromptTemplate {
  name: string;
  content: string;
  variable_list: Record<string, string>;
}

interface PromptVariableEditorProps {
  data: PromptTemplate;
}

export const PromptVariableEditor: React.FC<PromptVariableEditorProps> = ({ data }) => {
  const [variables, setVariables] = useState<Record<string, string>>(data.variable_list);
  const [editingVariable, setEditingVariable] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleVariableClick = (variableName: string) => {
    setEditingVariable(variableName);
    setEditValue(variables[variableName] || '');
    setIsDialogOpen(true);
  };

  const handleSaveVariable = () => {
    if (editingVariable) {
      setVariables(prev => ({
        ...prev,
        [editingVariable]: editValue
      }));
    }
    setIsDialogOpen(false);
    setEditingVariable(null);
    setEditValue('');
  };

  const renderContentWithVariables = (content: string) => {
    const parts = content.split(/({{[^}]+}})/g);
    
    return parts.map((part, index) => {
      const variableMatch = part.match(/{{([^}]+)}}/);
      
      if (variableMatch) {
        const variableName = variableMatch[1];
        const variableValue = variables[variableName] || '';
        
        return (
          <span key={index} className="relative inline-flex items-center">
            <span
              className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors inline-flex items-center gap-1 border border-blue-200 dark:border-blue-700"
              onClick={() => handleVariableClick(variableName)}
            >
              <span className="font-medium">{'{\u007b'}</span>
              <span className="text-xs uppercase tracking-wide">{variableName}</span>
              <span className="font-medium">{'}\u007d'}</span>
              <Edit2 className="w-3 h-3 ml-1 opacity-60" />
            </span>
            {variableValue && (
              <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-sm border border-green-200 dark:border-green-700">
                {variableValue}
              </span>
            )}
          </span>
        );
      }
      
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">变量内容</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-medium text-foreground mb-2">{data.name}</h3>
            <div className="text-sm text-muted-foreground leading-relaxed">
              {renderContentWithVariables(data.content)}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-foreground mb-3">变量列表</h4>
            <div className="space-y-2">
              {Object.entries(variables).map(([name, value]) => (
                <div
                  key={name}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm text-foreground">{name}</div>
                    {value && (
                      <div className="text-xs text-muted-foreground mt-1 truncate">
                        {value}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVariableClick(name)}
                    className="ml-2"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>编辑变量</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="variable-name">变量名称</Label>
              <Input
                id="variable-name"
                value={editingVariable || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variable-value">变量值</Label>
              <Input
                id="variable-value"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="请输入变量值"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveVariable}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};