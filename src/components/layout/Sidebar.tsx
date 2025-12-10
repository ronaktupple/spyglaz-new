import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppSelector } from '@/store/hooks';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Plus, MessageSquare, TrendingUp, Users, Mail, Calendar, Filter, Bot, Search, Library, FileText, BookOpen, Archive, BarChart3, PieChart, Download, Image, FileSpreadsheet, MessageCircle, MoreHorizontal, Share, Edit, Trash2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import logo from '@/assets/logo.svg';
import logoDark from '@/assets/logo-dark.svg';
import { getChatSessions, updateChatSession, deleteChatSession } from '@/services/chatSessionsApi';

interface ChatSession {
  session_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  user_id: string;
  status?: string;
  memory_state?: {
    activities_count: number;
    email_drafts_count: number;
    profiles_count: number;
  };
  uploaded_files_count: number;
  active?: boolean;
  isTemporary?: boolean;
}

const quickPrompts = [
  { icon: TrendingUp, label: "Top producers at risk", color: "destructive" },
  { icon: Users, label: "Future top producers", color: "accent" },
  { icon: Mail, label: "Recent email opens", color: "secondary" },
  { icon: Calendar, label: "Upcoming renewals", color: "primary" },
];



const downloadedFiles = [
  { id: 1, type: "chart", title: "Q4 Revenue Analysis", icon: BarChart3, thumbnail: "bg-blue-500", downloadedAt: "2 hours ago" },
  { id: 2, type: "document", title: "Producer Performance Report", icon: FileText, thumbnail: "bg-green-500", downloadedAt: "1 day ago" },
  { id: 3, type: "chart", title: "Regional Territory Breakdown", icon: PieChart, thumbnail: "bg-purple-500", downloadedAt: "2 days ago" },
  { id: 4, type: "spreadsheet", title: "Email Campaign Data", icon: FileSpreadsheet, thumbnail: "bg-orange-500", downloadedAt: "3 days ago" },
  { id: 5, type: "image", title: "Brand Guidelines", icon: Image, thumbnail: "bg-pink-500", downloadedAt: "1 week ago" },
  { id: 6, type: "chart", title: "Sales Funnel Metrics", icon: TrendingUp, thumbnail: "bg-cyan-500", downloadedAt: "1 week ago" },
  { id: 7, type: "document", title: "Market Analysis Q3", icon: FileText, thumbnail: "bg-indigo-500", downloadedAt: "2 weeks ago" },
  { id: 8, type: "chart", title: "Customer Satisfaction", icon: BarChart3, thumbnail: "bg-red-500", downloadedAt: "3 weeks ago" },
];

export const Sidebar = ({ selectedSessionId }) => {
  const { user, isAuthenticated } = useAppSelector((state: any) => state.auth);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isConversationActionsOpen, setIsConversationActionsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<ChatSession | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);

  useEffect(() => {
    const fetchChatSessions = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await getChatSessions();
        if (response.success && response.sessions) {
          setChatSessions(response.sessions);
        }
      } catch (err) {
        setError('Failed to load chat sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchChatSessions();
  }, [isAuthenticated]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const filteredSessions = chatSessions.filter(session =>
    searchQuery === '' ||
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupSessionsByDate = (sessions: ChatSession[]) => {
    const groups: Record<string, ChatSession[]> = {};
    sessions.forEach(session => {
      const date = new Date(session.created_at);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey: string;
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Earlier';
      } else {
        groupKey = 'Earlier';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(session);
    });
    
    return groups;
  };

  const groupedSessions = groupSessionsByDate(filteredSessions);

  // Function to get current session data from the chat interface
  const getCurrentSessionData = () => {
    // Check if we're on a new chat (no selectedSessionId)
    if (!selectedSessionId) {
      // Check if there's a current session in localStorage or sessionStorage
      const currentSessionData = sessionStorage.getItem('current-session');
      if (currentSessionData) {
        try {
          return JSON.parse(currentSessionData);
        } catch (e) {
          return null;
        }
      }
      return null;
    }
    
    // If we have a selectedSessionId, find it in the existing sessions
    return chatSessions.find(session => session.session_id === selectedSessionId) || null;
  };

  // Update current session when selectedSessionId changes
  useEffect(() => {
    const currentSessionData = getCurrentSessionData();
    setCurrentSession(currentSessionData);
  }, [selectedSessionId, chatSessions]);

  const handleSessionSelect = (sessionId: string) => {
    setChatSessions(prev => prev.map(s => ({ ...s, active: s.session_id === sessionId })));
    navigate(`/chat/${sessionId}`);
    setIsSearchDialogOpen(false);
    setSearchQuery(''); 
  };

  // Handle new chat
  const handleNewChat = () => {
    setChatSessions(prev => prev.map(s => ({ ...s, active: false })));
    setCurrentSession(null); // Clear current session when starting new chat
    sessionStorage.removeItem('current-session'); // Clear sessionStorage
    navigate('/');
    setSearchQuery('');
    
    window.dispatchEvent(new Event('stop-streaming'));
    
    window.dispatchEvent(new Event('start-new-chat'));
    sessionStorage.setItem('start-new-chat', '1');
  };

  useEffect(() => {
    if (selectedSessionId) {
      setChatSessions(prev => prev.map(s => ({ ...s, active: s.session_id === selectedSessionId })));
    } else {
      setChatSessions(prev => prev.map(s => ({ ...s, active: false })));
    }
  }, [selectedSessionId]);

  useEffect(() => {
    if (!isSearchDialogOpen) {
      setSearchQuery('');
    }
  }, [isSearchDialogOpen]);

  const handleConversationAction = (action: string, session: ChatSession) => {
    setSelectedConversation(session);
    setRenameValue(session.title);
    
    switch (action) {
      case 'share':
        console.log('Sharing conversation:', session.title);
        break;
      case 'rename':
        setIsConversationActionsOpen(true);
        break;
      case 'archive':
        console.log('Archiving conversation:', session.title);
        break;
      case 'delete':
        setIsDeleteModalOpen(true);
        break;
    }
  };

  const handleRename = async () => {
    if (selectedConversation && renameValue.trim()) {
      setIsRenaming(true);
      try {
        const response = await updateChatSession(selectedConversation.session_id, renameValue.trim());
        
        if (response.success) {
          setChatSessions(prev => prev.map(s => 
            s.session_id === selectedConversation.session_id 
              ? { ...s, title: renameValue.trim() }
              : s
          ));
          setIsConversationActionsOpen(false);
          setSelectedConversation(null);
          setRenameValue('');
        } else {
          console.error('Failed to update conversation title:', response.message);
        }
      } catch (error) {
        console.error('Error updating conversation title:', error);
      } finally {
        setIsRenaming(false);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedConversation) {
      setIsDeleting(true);
      try {
        const response = await deleteChatSession(selectedConversation.session_id);
        
        if (response.success) {
          setChatSessions(prev => prev.filter(s => s.session_id !== selectedConversation.session_id));
          setIsDeleteModalOpen(false);
          setSelectedConversation(null);
        
          if (selectedConversation.active) {
            navigate('/');
          }
        } else {
          console.error('Failed to delete conversation:', response.message);
        }
      } catch (error) {
        console.error('Error deleting conversation:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  useEffect(() => {
    const handleOpen = () => {
      setChatSessions(prev => prev.map(s => ({ ...s, active: s.title.includes('Top producers at risk') })));
    };
    const handleNew = () => {
      handleNewChat();
    };
    const handleRefresh = async () => {
      if (isAuthenticated) {
        try {
          const response = await getChatSessions();
          if (response.success && response.sessions) {
            setChatSessions(response.sessions);
          }
        } catch (err) {
          console.error('Failed to refresh chat sessions:', err);
        }
      }
    };
    const handleNewSessionCreated = (event: CustomEvent) => {
      const newSession = event.detail;
      if (newSession) {
        setCurrentSession(newSession);
        // Add to chat sessions if not already present
        setChatSessions(prev => {
          const exists = prev.some(s => s.session_id === newSession.session_id);
          if (!exists) {
            return [newSession, ...prev];
          }
          return prev;
        });
      }
    };
    
    const handleSessionUpdated = (event: CustomEvent) => {
      const updatedSession = event.detail;
      if (updatedSession) {
        setCurrentSession(updatedSession);
        // Replace temporary session with real session
        setChatSessions(prev => {
          return prev.map(session => 
            session.isTemporary ? updatedSession : session
          ).filter(session => !session.isTemporary);
        });
      }
    };
    
    window.addEventListener('open-sample-chat', handleOpen as EventListener);
    window.addEventListener('start-new-chat', handleNew as EventListener);
    window.addEventListener('refresh-chat-sessions', handleRefresh as EventListener);
    window.addEventListener('new-session-created', handleNewSessionCreated as EventListener);
    window.addEventListener('session-updated', handleSessionUpdated as EventListener);
    return () => {
      window.removeEventListener('open-sample-chat', handleOpen as EventListener);
      window.removeEventListener('start-new-chat', handleNew as EventListener);
      window.removeEventListener('refresh-chat-sessions', handleRefresh as EventListener);
      window.removeEventListener('new-session-created', handleNewSessionCreated as EventListener);
      window.removeEventListener('session-updated', handleSessionUpdated as EventListener);
    };
  }, [isAuthenticated]);

  return (
    <div className="w-80 bg-gradient-soft border-r border-border h-full flex flex-col animate-slide-in-left">
      {/* Logo and Title */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img src="/favicon.svg" alt="Spyglaz Logo" className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && user && user.username && (
              <Link to="/profile">
                <Avatar className="w-8 h-8 hover-scale cursor-pointer">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                    {/* {user.username ? user.username.split(' ').map(n => n[0]).join('') : user.username?.charAt(0)?.toUpperCase() || 'U'} */}
                   TQ
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        </div>

        {/* New Chat Section */}
        <div className="space-y-3">
          <Button className="w-full justify-start" variant="premium" onClick={handleNewChat}>
            <Plus className="w-4 h-4 mr-3" />
            New chat
          </Button>

          <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full hover:bg-foreground/5 transition-colors justify-start" variant="ghost">
                <Search className="w-4 h-4 mr-3" />
                Search chats
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
              <div className="p-4 border-b border-border">
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-0 shadow-none focus-visible:outline-none focus:outline-none !focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-none text-base"
                />
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {Object.entries(groupedSessions).map(([dateGroup, sessions]) => (
                  <div key={dateGroup} className="px-4 py-2">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">{dateGroup}</h4>
                    <div className="space-y-1">
                      {sessions.map((session) => (
                        <div 
                          key={session.session_id} 
                          className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted/50 cursor-pointer group"
                          onClick={() => handleSessionSelect(session.session_id)}
                        >
                          <MessageCircle className='w-4 h-4 text-foreground' />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-foreground block truncate">{session.title}</span>
                            {/* <span className="text-xs text-muted-foreground">
                              {formatTimestamp(session.created_at)} • {session.message_count} message{session.message_count !== 1 ? 's' : ''}
                            </span> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full hover:bg-foreground/5 transition-colors justify-start" variant="ghost">
                <Library className="w-4 h-4 mr-3" />
                Library
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[1000px] sm:w-[1200px] max-w-[90vw] min-w-[32rem]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Library className="w-5 h-5" />
                  Downloads Library
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">{downloadedFiles.length} files downloaded</p>
                  <Button size="sm" variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                  {downloadedFiles.map((file) => (
                    <Card key={file.id} className="p-0 cursor-pointer hover:shadow-md transition-all hover-lift group">
                      {/* Thumbnail */}
                      <div className={`h-32 ${file.thumbnail} rounded-t-lg flex items-center justify-center relative overflow-hidden`}>
                        <file.icon className="w-8 h-8 text-white/80" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <Download className="absolute top-2 right-2 w-4 h-4 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Content */}
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground truncate mb-1">
                              {file.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {file.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {file.downloadedAt}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Button 
            className="w-full justify-start hover:bg-foreground/5 transition-colors" 
            variant="ghost"
            onClick={() => navigate('/audit-layer')}
          >
            <FileSpreadsheet className="w-4 h-4 mr-3" />
            Audit Layer
          </Button>
        </div>
      </div>



      {/* Chat History */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">Recent Conversations</h3>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-1">
          {loading ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              Loading conversations...
            </div>
          ) : error ? (
            <div className="px-2 py-4 text-center text-sm text-destructive">
              {error}
            </div>
          ) : chatSessions.length === 0 && !currentSession ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No conversations yet
            </div>
          ) : (
            <>
              {/* Current Session - Show at the top if it exists and is not in the regular sessions */}
              {/* {currentSession && (!chatSessions.some(s => s.session_id === currentSession.session_id) || currentSession.isTemporary) && (
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-muted-foreground mb-2 px-2">Current Chat</h4>
                  <div className="space-y-1">
                    <div
                      className={`group rounded-md px-2 py-2 cursor-pointer transition-colors bg-foreground/10 font-medium animate-fade-in`}
                      role="button"
                      aria-current="page"
                      tabIndex={0}
                      onClick={() => {
                        handleSessionSelect(currentSession.session_id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSessionSelect(currentSession.session_id);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate text-foreground">
                            {currentSession.title}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground/10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleConversationAction('rename', currentSession)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleConversationAction('delete', currentSession)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}
              
              {/* Regular Sessions */}
              {Object.entries(groupedSessions).map(([dateGroup, sessions]) => (
                <div key={dateGroup} className="mb-4">
                  <h4 className="text-xs font-medium text-muted-foreground mb-2 px-2">{dateGroup}</h4>
                  <div className="space-y-1">
                    {sessions.slice(0, 10).map((session, index) => (
                      <div
                        key={session.session_id}
                        className={`group rounded-md px-2 py-2 cursor-pointer transition-colors ${session.active ? 'bg-foreground/10 font-medium' : 'hover:bg-foreground/5'
                          } animate-fade-in`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        role="button"
                        aria-current={session.active ? 'page' : undefined}
                        tabIndex={0}
                        onClick={() => {
                          handleSessionSelect(session.session_id);
                          if (session.title.includes('Top producers at risk')) {
                            window.dispatchEvent(new Event('open-sample-chat'));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSessionSelect(session.session_id);
                            if (session.title.includes('Top producers at risk')) {
                              window.dispatchEvent(new Event('open-sample-chat'));
                            }
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${session.active ? 'text-foreground' : 'text-foreground'}`}>
                              {session.title}
                            </p>
                            {/* <p className="text-xs text-muted-foreground mt-1">
                              {formatTimestamp(session.created_at)} • {session.message_count} message{session.message_count !== 1 ? 's' : ''}
                            </p> */}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground/10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {/* <DropdownMenuItem onClick={() => handleConversationAction('share', session)}>
                                <Share className="mr-2 h-4 w-4" />
                                Share
                              </DropdownMenuItem> */}
                              <DropdownMenuItem onClick={() => handleConversationAction('rename', session)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {/* <DropdownMenuItem onClick={() => handleConversationAction('archive', session)}>
                                <Archive className="mr-2 h-4 w-4" />
                                Archive
                              </DropdownMenuItem> */}
                              <DropdownMenuItem 
                                onClick={() => handleConversationAction('delete', session)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Logo Section */}
      <div className="p-6 border-t border-border flex justify-center">
        <img src={theme === 'dark' ? logoDark : logo} alt="Spyglaz Logo" className="h-8 w-auto" />
      </div>

             {/* Conversation Actions Modal */}
       <Dialog open={isConversationActionsOpen} onOpenChange={setIsConversationActionsOpen}>
         <DialogContent className="sm:max-w-[425px]">
           <DialogHeader>
             <DialogTitle>Rename Conversation</DialogTitle>
           </DialogHeader>
           <div className="grid gap-4 py-4">
             <div className="grid gap-2">
               <label htmlFor="name" className="text-sm font-medium">
                 Conversation Name
               </label>
               <Input
                 id="name"
                 value={renameValue}
                 onChange={(e) => setRenameValue(e.target.value)}
                 placeholder="Enter conversation name"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     handleRename();
                   }
                 }}
               />
             </div>
           </div>
           <div className="flex justify-end gap-3">
             <Button
               variant="outline"
               onClick={() => {
                 setIsConversationActionsOpen(false);
                 setSelectedConversation(null);
                 setRenameValue('');
               }}
             >
               Cancel
             </Button>
             <Button onClick={handleRename} disabled={isRenaming}>
               {isRenaming ? 'Saving...' : 'Save'}
             </Button>
           </div>
         </DialogContent>
       </Dialog>

       {/* Delete Confirmation Modal */}
       <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
         <DialogContent className="sm:max-w-[425px]">
           <DialogHeader>
             <DialogTitle>Delete chat?</DialogTitle>
           </DialogHeader>
           <div className="py-4">
             <p className="text-sm text-muted-foreground">
               This will delete <strong>{selectedConversation?.title}</strong>.
             </p>
             <p className="text-sm text-muted-foreground mt-2">
               Visit <span className="underline cursor-pointer">settings</span> to delete any memories saved during this chat.
             </p>
           </div>
           <div className="flex justify-end gap-3">
             <Button
               variant="outline"
               onClick={() => {
                 setIsDeleteModalOpen(false);
                 setSelectedConversation(null);
               }}
             >
               Cancel
             </Button>
             <Button 
               variant="destructive" 
               onClick={handleDelete} 
               disabled={isDeleting}
             >
               {isDeleting ? 'Deleting...' : 'Delete'}
             </Button>
           </div>
         </DialogContent>
       </Dialog>
    </div>
  );
};