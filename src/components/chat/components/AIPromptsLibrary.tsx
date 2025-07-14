import React, { useState } from 'react';
import { Search, Heart, MoreHorizontal, Grid3X3, List, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface PromptCard {
  id: string;
  title: string;
  description: string;
  tags: string[];
  usageCount: number;
  isFavorited: boolean;
}

const mockPrompts: PromptCard[] = [
  {
    id: '1',
    title: '招聘要求撰写',
    description: '我希望通过面试招聘(工作角色)的专业人员。请提供(工作角色)的 10 个多选题、单选题一点式、5 个问题涉及(能力1)、3 个问题涉及(能力2)、2 个问题涉及(能力3)。',
    tags: ['4个变量', 'ChatGPT', '应聘', '职业规划'],
    usageCount: 8,
    isFavorited: false
  },
  {
    id: '2',
    title: '绘制图画',
    description: 'Draw a beautiful asian girl，standing and posing style digital painting',
    tags: ['MidJourney', '创意', '绘图'],
    usageCount: 1,
    isFavorited: false
  },
  {
    id: '3',
    title: '生成周报',
    description: '请帮我提以下工作内容自动生成一周完整的周报，用 Markdown 格式优分点效率的形式输出：（工作内容）',
    tags: ['1个变量', 'DeepSeek', '周报'],
    usageCount: 24,
    isFavorited: true
  },
  {
    id: '4',
    title: '扮演小说家',
    description: '扮演小说家，根据(主题)撰写富有创意的人人喜的故事。',
    tags: ['1个变量', 'DeepSeek', '创意', '工作'],
    usageCount: 6,
    isFavorited: true
  }
];

export const AIPromptsLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [prompts, setPrompts] = useState(mockPrompts);

  const toggleFavorite = (id: string) => {
    setPrompts(prev => prev.map(prompt => 
      prompt.id === id ? { ...prompt, isFavorited: !prompt.isFavorited } : prompt
    ));
  };

  const getTagColor = (tag: string) => {
    if (tag.includes('变量')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (['ChatGPT', 'DeepSeek', 'MidJourney'].includes(tag)) return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">AI 提示词</h1>
          <p className="text-sm text-gray-600 mt-1">管理和组织你的 AI 提示词库</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            AI 生成
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            + 新建提示词
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索提示词"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-blue-600">
              最新优先
            </Button>
            <Button variant="ghost" size="sm">
              高级筛选
            </Button>
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4 mr-1" />
              收藏
            </Button>
            <Button variant="ghost" size="sm">
              <FolderOpen className="h-4 w-4 mr-1" />
              分类
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-gray-900">{prompt.title}</h3>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(prompt.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Heart 
                      className={`h-4 w-4 ${prompt.isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                    />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {prompt.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className={`text-xs ${getTagColor(tag)}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <span className="text-xs text-gray-500">使用 {prompt.usageCount} 次</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};