import React, { useState } from 'react';
import { Search, Heart, MoreHorizontal, Grid3X3, List, FolderOpen, Filter, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DetailedPromptCard {
  id: string;
  title: string;
  promptContent: string;
  usageInstructions: string;
  tags: string[];
  usageCount: number;
  isFavorited: boolean;
}

const mockDetailedPrompts: DetailedPromptCard[] = [
  {
    id: '1',
    title: '招聘要求撰写',
    promptContent: '我希望通过面试招聘(工作角色)的专业人员，请提供(工作角色)的 10 个多选题、单选性一点式、5 个问题涉及(能力1)、3 个问题涉及(能力2)、2 个问题涉及(能力3)。',
    usageInstructions: '适用于 HR 和招聘经理快速生成针对性面试题目。可根据具体岗位要求调整能力维度和题目数量分配，提高招聘效率和准确性。',
    tags: ['4个变量', 'ChatGPT', '应聘', '职业规划'],
    usageCount: 8,
    isFavorited: false
  },
  {
    id: '2',
    title: '绘制图画',
    promptContent: 'Draw a beautiful asian girl, standing and posing style digital painting with traditional Chinese ink wash painting techniques, elegant composition, flowing brushstrokes.',
    usageInstructions: '专门用于生成具有中国传统水墨画风格的人物肖像，适合艺术创作和文化主题设计项目，可调整人物姿态和构图要求。',
    tags: ['MidJourney', '创意', '绘图'],
    usageCount: 1,
    isFavorited: false
  },
  {
    id: '3',
    title: '生成周报',
    promptContent: '请帮我把以下面工作内容导写成一篇完整的周报，用 Markdown 格式以分点列表的形式输出：（工作内容）',
    usageInstructions: '快速将工作要点整理成规范的周报格式，支持 Markdown 输出，适合各类职场人士提高工作汇报效率。',
    tags: ['1个变量', 'DeepSeek', '周报'],
    usageCount: 24,
    isFavorited: true
  },
  {
    id: '4',
    title: '扮演小说家',
    promptContent: '',
    usageInstructions: '',
    tags: ['MidJourney', '创意', '绘图'],
    usageCount: 1,
    isFavorited: false
  },
  {
    id: '5',
    title: '数据分析报告',
    promptContent: '',
    usageInstructions: '',
    tags: ['数据分析', 'Python', '报告'],
    usageCount: 15,
    isFavorited: false
  },
  {
    id: '6',
    title: '代码重构优化',
    promptContent: '',
    usageInstructions: '',
    tags: ['编程', '优化', '代码'],
    usageCount: 7,
    isFavorited: false
  }
];

export const AIPromptsLibraryDetailed: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [prompts, setPrompts] = useState(mockDetailedPrompts);

  const toggleFavorite = (id: string) => {
    setPrompts(prev => prev.map(prompt => 
      prompt.id === id ? { ...prompt, isFavorited: !prompt.isFavorited } : prompt
    ));
  };

  const getTagColor = (tag: string) => {
    if (tag.includes('变量')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (['ChatGPT', 'DeepSeek', 'MidJourney'].includes(tag)) return 'bg-green-100 text-green-700 border-green-200';
    if (['创意', '绘图', '编程', '优化'].includes(tag)) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (['应聘', '职业规划', '周报'].includes(tag)) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">AI 提示词</h1>
          <p className="text-sm text-gray-600 mt-1">管理和组织你的 AI 提示词库</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            AI 生成
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            + 新建提示词
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 bg-white border-b border-gray-200">
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
              <Filter className="h-4 w-4 mr-1" />
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

      <div className="flex-1 overflow-y-auto p-6">
        {/* Analytics Overview */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              整体分析概要
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800 leading-relaxed">
              当前提示词库包含 <span className="font-semibold">156</span> 个高质量提示词，涵盖创意设计、内容创作、数据分析、编程开发等 <span className="font-semibold">8</span> 个主要领域。其中创意类提示词使用频率最高，平均每个提示词被使用 <span className="font-semibold">23.4</span> 次。最受欢迎的提示词类型为图像生成和文案创作，占总使用量的 <span className="font-semibold">67%</span>。建议继续丰富营销技术类和商业分析类提示词，以提升整体库的实用性和覆盖面。
            </p>
          </CardContent>
        </Card>

        {/* Prompts Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {prompts.map((prompt) => (
            <Card key={prompt.id} className="bg-white hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-medium text-gray-900">
                    {prompt.title}
                  </CardTitle>
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
              </CardHeader>
              
              <CardContent className="space-y-4">
                {prompt.promptContent && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Prompt 内容:</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {prompt.promptContent}
                    </p>
                  </div>
                )}
                
                {prompt.usageInstructions && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">使用说明:</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {prompt.usageInstructions}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2">
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
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    使用 {prompt.usageCount} 次
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};