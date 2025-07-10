
import React, { useState, useEffect } from 'react';
import { 
  MessageSquarePlus, 
  ChevronRight, 
  ChevronLeft,
  MessageSquare,
  History
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface AppSidebarProps {
  onNewSession: () => void;
  onSessionSelect?: (sessionId: string) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ 
  onNewSession, 
  onSessionSelect 
}) => {
  const { state, toggleSidebar } = useSidebar();
  const [recentSessions, setRecentSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isCollapsed = state === 'collapsed';

  // Fetch recent chat sessions
  useEffect(() => {
    const fetchRecentSessions = async () => {
      setIsLoading(true);
      try {
        // Mock API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockSessions: ChatSession[] = [
          {
            id: '1',
            title: 'Video Generation Discussion',
            lastMessage: 'Can you help me generate a video?',
            timestamp: new Date(Date.now() - 1000 * 60 * 30)
          },
          {
            id: '2', 
            title: 'UI Design Questions',
            lastMessage: 'How to improve the sidebar design?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
          },
          {
            id: '3',
            title: 'React Components Help',
            lastMessage: 'Best practices for component structure',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
          }
        ];
        setRecentSessions(mockSessions);
      } catch (error) {
        console.error('Failed to fetch recent sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentSessions();
  }, []);

  const handleNewChat = () => {
    onNewSession();
  };

  const handleSessionClick = (sessionId: string) => {
    if (onSessionSelect) {
      onSessionSelect(sessionId);
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="p-2">
        <div className="flex items-center justify-between">
          {/* Product Icon and Name */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-sidebar-foreground">ChatApp</span>
            )}
          </div>
          
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              "h-8 w-8 hover:bg-sidebar-accent",
              isCollapsed ? "hover:bg-sidebar-accent" : ""
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* New Chat Button */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleNewChat}
                  className="w-full justify-start hover:bg-sidebar-accent"
                  title="Start new chat"
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  {!isCollapsed && <span>New chat</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recent Sessions - Only show when expanded */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs text-sidebar-foreground/70 px-2 py-1">
              <div className="flex items-center gap-2">
                <History className="h-3 w-3" />
                Recents
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {isLoading ? (
                  <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                    Loading...
                  </div>
                ) : recentSessions.length > 0 ? (
                  recentSessions.map((session) => (
                    <SidebarMenuItem key={session.id}>
                      <SidebarMenuButton
                        onClick={() => handleSessionClick(session.id)}
                        className="w-full justify-start hover:bg-sidebar-accent group px-2 py-2"
                        title={session.title}
                      >
                        <div className="flex flex-col items-start w-full min-w-0">
                          <span className="text-sm font-medium truncate w-full text-left">
                            {session.title}
                          </span>
                          <span className="text-xs text-sidebar-foreground/50 truncate w-full text-left">
                            {formatTimeAgo(session.timestamp)}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                    No recent chats
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
