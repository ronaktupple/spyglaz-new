// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import { Textarea } from '@/components/ui/textarea';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// import { useToast } from '@/hooks/use-toast';
// import { useAuth } from '@/hooks/useAuth';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { markActionPromptsSeen } from '@/store/slices/authSlice';
// import Cookies from 'js-cookie';
// import { ChevronDown, Copy, Database, Download, Mail, Maximize2, Paperclip, Send, UserPlus, Zap, X, File, Image, FileText, FileVideo, FileAudio, Archive, Code, FileSpreadsheet, Presentation, Square, ThumbsUp, ThumbsDown } from 'lucide-react';
// import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
// import Markdown from 'react-markdown';
// // @ts-ignore - remark-gfm doesn't have type definitions
// import remarkGfm from 'remark-gfm';
// // @ts-ignore - react-syntax-highlighter doesn't have type definitions
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// // @ts-ignore - react-syntax-highlighter doesn't have type definitions
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { ActionPromptsSidebar } from './ActionPromptsSidebar';
// import { ChartVisualization } from './ChartVisualization.jsx';
// import { DetailedListView } from './DetailedListView.jsx';
// import { EmailDrafting } from './EmailDrafting.jsx';
// import { ErrorFallback } from './ErrorFallback.jsx';
// import { GoldenMoment } from './GoldenMoment.jsx';
// import GeneratedFilesDisplay from './GeneratedFilesDisplay.jsx';
// import StatusDisplay from './StatusDisplay.jsx';
// import StreamingHtmlRenderer from './StreamingHtmlRenderer';

// import { getChatSession, updateChatSession } from '@/services/chatSessionsApi';
// import { config } from '@/config/env';

// // Utility function to detect and format producer list responses
// const formatProducerListResponse = (content: string): string => {
//   // Check if this looks like a producer list response
//   if (content.includes('TOP PRODUCERS FOR LARGE CASES') ||
//     content.includes('Tier 1 - Highest Probability') ||
//     content.includes('Producer 72') ||
//     content.includes('Combined Score:')) {

//     // Convert the text format to markdown table format
//     const lines = content.split('\n');
//     let formattedContent = '';
//     let currentTier = '';
//     let tableRows: string[] = [];

//     for (const line of lines) {
//       const trimmedLine = line.trim();

//       if (trimmedLine.includes('TOP PRODUCERS FOR LARGE CASES')) {
//         formattedContent += `## ${trimmedLine}\n\n`;
//       } else if (trimmedLine.includes('Tier 1 - Highest Probability')) {
//         currentTier = 'Tier 1 - Highest Probability (80+ Combined Score)';
//         formattedContent += `### ${currentTier}\n\n`;
//         formattedContent += `| Rank | Producer | Combined Score | Life Score | Annuity Score | YTD Performance |\n`;
//         formattedContent += `|------|----------|----------------|------------|---------------|-----------------|\n`;
//       } else if (trimmedLine.includes('Tier 2 - High Probability')) {
//         currentTier = 'Tier 2 - High Probability (75-80 Combined Score)';
//         formattedContent += `### ${currentTier}\n\n`;
//         formattedContent += `| Rank | Producer | Primary Focus | Notes |\n`;
//         formattedContent += `|------|----------|---------------|-------|\n`;
//       } else if (trimmedLine.includes('Tier 3 - Good Probability')) {
//         currentTier = 'Tier 3 - Good Probability (70-75 Combined Score)';
//         formattedContent += `### ${currentTier}\n\n`;
//         formattedContent += `| Rank | Producer | Focus Area | Notes |\n`;
//         formattedContent += `|------|----------|------------|-------|\n`;
//       } else if (trimmedLine.match(/^\d+\.\s+Producer\s+\d+/)) {
//         // Parse producer entries
//         const match = trimmedLine.match(/^(\d+)\.\s+Producer\s+(\d+)(?:\s*-\s*(.+))?/);
//         if (match) {
//           const rank = match[1];
//           const producerId = match[2];
//           const details = match[3] || '';

//           if (currentTier.includes('Tier 1')) {
//             // Parse Tier 1 format: "Producer 72 - Combined Score: 82.5 (Life: 84, Annuity: 81) - YTD: $1,235,452"
//             const scoreMatch = details.match(/Combined Score:\s*([\d.]+)\s*\(Life:\s*(\d+),\s*Annuity:\s*(\d+)\)\s*-\s*(.+)/);
//             if (scoreMatch) {
//               const combinedScore = scoreMatch[1];
//               const lifeScore = scoreMatch[2];
//               const annuityScore = scoreMatch[3];
//               const ytd = scoreMatch[4];
//               formattedContent += `| ${rank} | Producer ${producerId} | ${combinedScore} | ${lifeScore} | ${annuityScore} | ${ytd} |\n`;
//             } else {
//               formattedContent += `| ${rank} | Producer ${producerId} | - | - | - | ${details} |\n`;
//             }
//           } else {
//             // Parse Tier 2/3 format: "Producer 45 - Primary Focus: Life Insurance"
//             const focusMatch = details.match(/Primary Focus:\s*(.+)/);
//             if (focusMatch) {
//               formattedContent += `| ${rank} | Producer ${producerId} | ${focusMatch[1]} | - |\n`;
//             } else {
//               formattedContent += `| ${rank} | Producer ${producerId} | - | ${details} |\n`;
//             }
//           }
//         }
//       } else if (trimmedLine.includes('Key Insights:')) {
//         formattedContent += `\n### Key Insights\n\n`;
//       } else if (trimmedLine.includes('Recommended Action:')) {
//         formattedContent += `\n### Recommended Action\n\n`;
//       } else if (trimmedLine.startsWith('- ') && (content.includes('Key Insights') || content.includes('Recommended Action'))) {
//         formattedContent += `- ${trimmedLine.substring(2)}\n`;
//       } else if (trimmedLine && !trimmedLine.includes('Tier') && !trimmedLine.match(/^\d+\.\s+Producer/)) {
//         // Add other content as regular text
//         if (!trimmedLine.includes('TOP PRODUCERS') && !trimmedLine.includes('Key Insights') && !trimmedLine.includes('Recommended Action')) {
//           formattedContent += `${trimmedLine}\n`;
//         }
//       }
//     }

//     return formattedContent;
//   }

//   return content;
// };

// interface Message {
//   id: string;
//   type: 'user' | 'ai';
//   content: string;
//   timestamp: Date;
//   contentBlocks?: ContentBlock[];
//   isTyping?: boolean;
//   isStreaming?: boolean;
//   attachments?: FileAttachment[];
//   originalCommand?: string;
// }

// interface ContentBlock {
//   type: 'table' | 'email' | 'chart' | 'error' | 'tool_result' | 'thinking' | 'response' | 'files';
//   data: any;
// }

// interface FileAttachment {
//   id: string;
//   file: File;
//   preview?: string;
//   type: 'image' | 'document' | 'video' | 'audio' | 'archive' | 'code' | 'spreadsheet' | 'presentation' | 'other';
//   size: string;
// }

// export const ChatInterface = ({ sessionId }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [showDetailedView, setShowDetailedView] = useState(false);
//   const [detailedViewData, setDetailedViewData] = useState<any>(null);
//   const [showScrollButtons, setShowScrollButtons] = useState(false);
//   const [isAtTop, setIsAtTop] = useState(true);
//   const [isAtBottom, setIsAtBottom] = useState(false);
//   const [isActionPromptsSidebarOpen, setIsActionPromptsSidebarOpen] = useState(false);
//   const [isChatLoading, setIsChatLoading] = useState(false);
//   const [isStreaming, setIsStreaming] = useState(false);
//   const [streamingControllerRef, setStreamingControllerRef] = useState<AbortController | null>(null);
//   const [currentStatus, setCurrentStatus] = useState<string | null>(null);
//   const [markdownKey, setMarkdownKey] = useState(0);

//   const mapStatusToDisplayText = (statusContent: string): string => {
//     const content = statusContent.toLowerCase();

//     if (content.includes('agent is analyzing your request')) {
//       return 'Analyzing your request...';
//     }
//     if (content.includes('agent has completed analysis')) {
//       return 'Processing your request...';
//     }
//     return 'Processing your request...';
//   };

//   const [isLoadingSession, setIsLoadingSession] = useState(false);
//   const [isNewSession, setIsNewSession] = useState(false);
//   const [firstUserMessage, setFirstUserMessage] = useState<string>('');
//   const [activeSessionId, setActiveSessionId] = useState<string | undefined>(sessionId);

//   const [attachments, setAttachments] = useState<FileAttachment[]>([]);
//   const [isDragOver, setIsDragOver] = useState(false);
//   const [showGoldenMoment, setShowGoldenMoment] = useState(false);
//   const [streamingMarkdown, setStreamingMarkdown] = useState<Map<string, string>>(new Map());
//   const [messageFeedback, setMessageFeedback] = useState<Map<string, 'thumbsUp' | 'thumbsDown' | null>>(new Map());
//   const chatContainerRef = React.useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { toast } = useToast();
//   const { isAuthenticated } = useAuth();
//   const dispatch = useAppDispatch();
//   const hasSeenActionPrompts = useAppSelector((state: any) => state.auth.hasSeenActionPrompts);
//   const { user } = useAppSelector((state: any) => state.auth);

//   const getFileType = (file: File): FileAttachment['type'] => {
//     const extension = file.name.split('.').pop()?.toLowerCase();
//     const mimeType = file.type;

//     if (mimeType.startsWith('image/')) return 'image';
//     if (mimeType.startsWith('video/')) return 'video';
//     if (mimeType.startsWith('audio/')) return 'audio';
//     if (mimeType.startsWith('text/')) return 'document';
//     if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('powerpoint')) return 'document';
//     if (mimeType.includes('excel') || mimeType.includes('spreadsheet') || mimeType.includes('csv')) return 'spreadsheet';
//     if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
//     if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'archive';
//     if (mimeType.includes('json') || mimeType.includes('xml') || mimeType.includes('yaml') ||
//       extension === 'js' || extension === 'ts' || extension === 'py' || extension === 'java' ||
//       extension === 'cpp' || extension === 'c' || extension === 'html' || extension === 'css') return 'code';

//     return 'other';
//   };

//   const formatFileSize = (bytes: number): string => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   const validateFile = (file: File): { isValid: boolean; error?: string } => {
//     const fileType = getFileType(file);
//     const isImage = fileType === 'image';
//     const maxSize = isImage ? 10 * 1024 * 1024 : 50 * 1024 * 1024;

//     if (file.size > maxSize) {
//       const sizeLimit = isImage ? '10MB' : '50MB';
//       return { isValid: false, error: `File size exceeds ${sizeLimit} limit (${formatFileSize(file.size)})` };
//     }

//     return { isValid: true };
//   };

//   const handleFileSelect = useCallback((files: FileList | null) => {
//     if (!files) return;

//     const newAttachments: FileAttachment[] = [];
//     const maxFiles = 10;

//     if (files.length > maxFiles) {
//       toast({
//         title: "Too Many Files",
//         description: `Please select no more than ${maxFiles} files at once`,
//         variant: "destructive"
//       });
//       return;
//     }

//     Array.from(files).forEach(file => {
//       const validation = validateFile(file);
//       if (!validation.isValid) {
//         toast({
//           title: "File Upload Error",
//           description: validation.error,
//           variant: "destructive"
//         });
//         return;
//       }

//       const attachment: FileAttachment = {
//         id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
//         file,
//         type: getFileType(file),
//         size: formatFileSize(file.size)
//       };

//       if (attachment.type === 'image') {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           setAttachments(prev => prev.map(att =>
//             att.id === attachment.id
//               ? { ...att, preview: e.target?.result as string }
//               : att
//           ));
//         };
//         reader.readAsDataURL(file);
//       }

//       newAttachments.push(attachment);
//     });

//     if (newAttachments.length > 0) {
//       setAttachments(prev => [...prev, ...newAttachments]);
//       toast({
//         title: "Files Added",
//         description: `${newAttachments.length} file(s) added successfully. You can now send them with your message.`
//       });
//     }
//   }, [toast]);

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragOver(true);
//   }, []);

//   const handleDragLeave = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragOver(false);
//   }, []);

//   const handleDrop = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragOver(false);
//     handleFileSelect(e.dataTransfer.files);
//   }, [handleFileSelect]);

//   const removeAttachment = (id: string) => {
//     setAttachments(prev => prev.filter(att => att.id !== id));
//   };

//   // Memoized Markdown component for better performance
//   const MemoizedMarkdown = useMemo(() => {
//     return React.memo(({ content, messageId, keyValue }: { content: string; messageId: string; keyValue: number }) => {
//       console.log('MemoizedMarkdown rendering:', { messageId, keyValue, contentLength: content.length });
//       return (
//         <Markdown
//           key={`${messageId}-${keyValue}-${content.length}`}
//           remarkPlugins={[remarkGfm]}
//           components={{
//             code({ node, className, children, ...props }: any) {
//               const match = /language-(\w+)/.exec(className || '');
//               const language = match ? match[1] : '';
//               const isInline = !className?.includes('language-');

//               if (!isInline && language) {
//                 return (
//                   <div className="relative">
//                     <div className="flex items-center justify-between bg-muted px-3 py-2 text-xs text-muted-foreground border-b border-border">
//                       <span className="font-medium">{language.toUpperCase()}</span>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="h-6 px-2 text-xs hover:bg-background/50"
//                         onClick={() => {
//                           navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
//                           toast({
//                             title: "Copied!",
//                             description: "Code copied to clipboard",
//                             duration: 2000,
//                           });
//                         }}
//                       >
//                         <Copy className="w-3 h-3 mr-1" />
//                         Copy
//                       </Button>
//                     </div>
//                     <SyntaxHighlighter
//                       style={oneDark as any}
//                       language={language}
//                       PreTag="div"
//                       className="!mt-0 !rounded-b-lg"
//                       customStyle={{
//                         margin: 0,
//                         borderRadius: '0 0 0.5rem 0.5rem',
//                         fontSize: '0.875rem',
//                         lineHeight: '1.5',
//                       }}
//                     >
//                       {String(children).replace(/\n$/, '')}
//                     </SyntaxHighlighter>
//                   </div>
//                 );
//               }

//               return (
//                 <code className={`${className} bg-muted px-1.5 py-0.5 rounded text-xs font-mono`} {...props}>
//                   {children}
//                 </code>
//               );
//             },
//             table({ children, ...props }: any) {
//               return (
//                 <div className="my-4 overflow-x-auto">
//                   <table className="w-full border-collapse border border-border rounded-lg" {...props}>
//                     {children}
//                   </table>
//                 </div>
//               );
//             },
//             thead({ children, ...props }: any) {
//               return (
//                 <thead className="bg-muted/50" {...props}>
//                   {children}
//                 </thead>
//               );
//             },
//             tbody({ children, ...props }: any) {
//               return (
//                 <tbody {...props}>
//                   {children}
//                 </tbody>
//               );
//             },
//             tr({ children, ...props }: any) {
//               return (
//                 <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors" {...props}>
//                   {children}
//                 </tr>
//               );
//             },
//             th({ children, ...props }: any) {
//               return (
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-foreground border-r border-border/50 last:border-r-0" {...props}>
//                   {children}
//                 </th>
//               );
//             },
//             td({ children, ...props }: any) {
//               return (
//                 <td className="py-3 px-4 text-sm text-foreground border-r border-border/30 last:border-r-0" {...props}>
//                   {children}
//                 </td>
//               );
//             },
//           }}
//         >
//           {content}
//         </Markdown>
//       );
//     });
//   }, [markdownKey, toast]);

//   const getFileIcon = (type: FileAttachment['type']) => {
//     switch (type) {
//       case 'image': return <Image className="w-4 h-4" />;
//       case 'document': return <FileText className="w-4 h-4" />;
//       case 'video': return <FileVideo className="w-4 h-4" />;
//       case 'audio': return <FileAudio className="w-4 h-4" />;
//       case 'archive': return <Archive className="w-4 h-4" />;
//       case 'code': return <Code className="w-4 h-4" />;
//       case 'spreadsheet': return <FileSpreadsheet className="w-4 h-4" />;
//       case 'presentation': return <Presentation className="w-4 h-4" />;
//       default: return <File className="w-4 h-4" />;
//     }
//   };

//   const FileUploadButton = ({ className = "" }: { className?: string }) => (
//     <Button
//       variant="outline"
//       size="sm"
//       className={`h-8 px-2 shrink-0 rounded-full border border-border transition-all duration-300 ease-out hover:px-3 group overflow-hidden gap-0 hover:gap-2 ${className} ${attachments.length > 0 ? 'bg-primary/10 border-primary/30' : ''}`}
//       onClick={() => fileInputRef.current?.click()}
//       title="Upload files (drag & drop also supported)"
//     >
//       <Paperclip className={`w-4 h-4 shrink-0 ${attachments.length > 0 ? 'text-primary' : ''}`} />
//       <span className="text-xs whitespace-nowrap opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all duration-300 ease-out overflow-hidden">
//         {attachments.length > 0 ? `${attachments.length} file(s)` : 'Upload file'}
//       </span>
//     </Button>
//   );

//   const HiddenFileInput = () => (
//     <input
//       ref={fileInputRef}
//       type="file"
//       multiple
//       accept="*/*"
//       onChange={(e) => handleFileSelect(e.target.files)}
//       className="hidden"
//     />
//   );

//   const FileAttachmentsPreview = () => {
//     if (attachments.length === 0) return null;

//     return (
//       <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/50">
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-xs font-medium text-muted-foreground">
//             Attachments ({attachments.length})
//           </span>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="h-6 px-2 text-xs"
//             onClick={() => setAttachments([])}
//           >
//             Clear all
//           </Button>
//         </div>
//         <div className="space-y-2">
//           {attachments.map((attachment) => (
//             <div
//               key={attachment.id}
//               className="flex items-center gap-2 p-2 bg-background/50 rounded border border-border/30 hover:bg-background/70 transition-colors"
//             >
//               <div className="flex items-center gap-2 flex-1 min-w-0">
//                 {attachment.preview ? (
//                   <img
//                     src={attachment.preview}
//                     alt={attachment.file.name}
//                     className="w-8 h-8 object-cover rounded"
//                   />
//                 ) : (
//                   <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
//                     {getFileIcon(attachment.type)}
//                   </div>
//                 )}
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs font-medium truncate">{attachment.file.name}</p>
//                   <p className="text-xs text-muted-foreground">{attachment.size}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-1">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary"
//                   onClick={() => {
//                     // Preview file in new tab
//                     const url = URL.createObjectURL(attachment.file);
//                     window.open(url, '_blank');
//                   }}
//                   title="Preview file"
//                 >
//                   <File className="w-3 h-3" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
//                   onClick={() => removeAttachment(attachment.id)}
//                   title="Remove file"
//                 >
//                   <X className="w-3 h-3" />
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="mt-2 text-xs text-muted-foreground text-center">
//           Files will be sent with your message. Click send to upload and share.
//           <br />
//           <span className="text-xs text-muted-foreground/70">
//             Max file size: 10MB (images) / 50MB (others) • Max files: 10
//           </span>
//         </div>
//       </div>
//     );
//   };

//   React.useEffect(() => {
//     const handler = () => {
//       setMessages([]);
//       setInputMessage('');
//       setShowDetailedView(false);
//       setDetailedViewData(null);
//       setActiveSessionId(undefined);
//       setIsNewSession(false);
//     };

//     const stopStreamingHandler = () => {
//       stopStreaming();
//     };

//     window.addEventListener('start-new-chat', handler as EventListener);
//     window.addEventListener('stop-streaming', stopStreamingHandler as EventListener);
//     return () => {
//       window.removeEventListener('start-new-chat', handler as EventListener);
//       window.removeEventListener('stop-streaming', stopStreamingHandler as EventListener);
//     };
//   }, []);

//   React.useEffect(() => {
//     if (typeof window === 'undefined') return;
//     if (sessionStorage.getItem('start-new-chat') === '1') {
//       setMessages([]);
//       setInputMessage('');
//       setShowDetailedView(false);
//       setDetailedViewData(null);
//       setActiveSessionId(undefined);
//       setIsNewSession(false);
//       sessionStorage.removeItem('start-new-chat');
//     }
//   }, []);

//   React.useEffect(() => {
//     const textareas = document.querySelectorAll('textarea');
//     textareas.forEach(textarea => {
//       if (textarea.value) {
//         textarea.style.height = 'auto';
//         textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
//       } else {
//         textarea.style.height = 'auto';
//       }
//     });
//   }, [inputMessage]);

//   React.useEffect(() => {
//     setMarkdownKey(prev => prev + 1);
//   }, [messages]);

//   React.useEffect(() => {
//     const openHandler = () => {
//       setMessages([]);
//       setInputMessage('');
//       setShowDetailedView(false);
//       setDetailedViewData(null);
//       setActiveSessionId(undefined);
//       setTimeout(() => scrollToBottom(), 0);
//     };
//     window.addEventListener('open-sample-chat', openHandler as EventListener);
//     return () => {
//       window.removeEventListener('open-sample-chat', openHandler as EventListener);
//     };
//   }, []);

//   React.useEffect(() => {
//     setActiveSessionId(sessionId);
//   }, [sessionId]);

//   React.useEffect(() => {
//     const chatContainer = chatContainerRef.current;
//     if (!chatContainer) return;

//     const handleScroll = () => {
//       const { scrollTop, scrollHeight, clientHeight } = chatContainer;
//       const isAtTopNow = scrollTop <= 50;
//       const isAtBottomNow = scrollTop + clientHeight >= scrollHeight - 50;

//       setIsAtTop(isAtTopNow);
//       setIsAtBottom(isAtBottomNow);
//       const hasScrollableContent = scrollHeight > clientHeight;
//       setShowScrollButtons(hasScrollableContent && (!isAtTopNow || !isAtBottomNow));
//     };

//     chatContainer.addEventListener('scroll', handleScroll);
//     handleScroll();

//     const handleResize = () => handleScroll();
//     window.addEventListener('resize', handleResize);

//     return () => {
//       chatContainer.removeEventListener('scroll', handleScroll);
//       window.removeEventListener('resize', handleResize);
//     };
//   }, [messages]);

//   React.useEffect(() => {
//     if (isAuthenticated && !hasSeenActionPrompts) {
//       setIsActionPromptsSidebarOpen(true);
//       dispatch(markActionPromptsSeen());
//     }
//   }, [isAuthenticated, hasSeenActionPrompts, dispatch]);

//   const scrollToTop = () => {
//     chatContainerRef.current?.scrollTo({
//       top: 0,
//       behavior: 'smooth'
//     });
//   };

//   const scrollToBottom = () => {
//     chatContainerRef.current?.scrollTo({
//       top: chatContainerRef.current.scrollHeight,
//       behavior: 'smooth'
//     });
//   };

//   const stopStreaming = () => {
//     if (streamingControllerRef) {
//       streamingControllerRef.abort();
//       setStreamingControllerRef(null);
//     }
//     setIsStreaming(false);
//     setIsChatLoading(false);
//     setCurrentStatus(null);
//     setMessages(prev => prev.map(msg =>
//       msg.isTyping
//         ? {
//           ...msg,
//           isTyping: false,
//           isStreaming: false,
//           content: msg.content || 'Response stopped by user. You can continue the conversation or ask a new question.'
//         }
//         : msg
//     ));
//   };

//   const handleRetryMessage = (originalCommand: string) => {
//     setInputMessage(originalCommand);

//     handleExecuteCommand(originalCommand);

//     toast({
//       title: "Retrying Request",
//       description: "Re-executing the same request...",
//       duration: 2000,
//     });
//   };

//   const handleFeedback = (messageId: string, feedbackType: 'thumbsUp' | 'thumbsDown') => {
//     setMessageFeedback(prev => {
//       const newMap = new Map(prev);
//       const currentFeedback = newMap.get(messageId);

//       // If clicking the same feedback, remove it (toggle off)
//       if (currentFeedback === feedbackType) {
//         newMap.set(messageId, null);
//       } else {
//         // Otherwise, set the new feedback
//         newMap.set(messageId, feedbackType);
//       }

//       return newMap;
//     });
//   };

//   const handleSendMessage = () => {
//     if (!inputMessage.trim() && attachments.length === 0) return;

//     const isNewSessionNow = !activeSessionId;

//     if (isNewSessionNow) {
//       setIsNewSession(true);
//       const firstMessage = inputMessage.trim() || (attachments.length > 0 ? `Uploaded ${attachments.length} file(s)` : '');
//       setFirstUserMessage(firstMessage);
//       const tempSessionId = `temp-${Date.now()}`;
//       const newTitle = generateTitleFromMessage(firstMessage);

//       const tempSession = {
//         session_id: tempSessionId,
//         title: newTitle,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//         message_count: 1,
//         user_id: user?.id || '',
//         status: 'active',
//         memory_state: {
//           activities_count: 0,
//           email_drafts_count: 0,
//           profiles_count: 0
//         },
//         uploaded_files_count: attachments.length,
//         active: true,
//         isTemporary: true
//       };

//       window.dispatchEvent(new CustomEvent('new-session-created', { detail: tempSession }));

//       sessionStorage.setItem('current-session', JSON.stringify(tempSession));
//     }

//     const messageContent = inputMessage.trim() || (attachments.length > 0 ? `Uploaded ${attachments.length} file(s)` : '');

//     const newMessage: Message = {
//       id: Date.now().toString(),
//       type: 'user',
//       content: messageContent,
//       timestamp: new Date(),
//       attachments: attachments.length > 0 ? [...attachments] : undefined
//     };

//     setMessages(prev => [...prev, newMessage]);
//     const commandToSend = inputMessage.trim() || (attachments.length > 0 ? `Please analyze these ${attachments.length} file(s)` : '');
//     handleExecuteCommand(commandToSend, attachments.length > 0 ? attachments : undefined, true);

//     setAttachments([]);
//   };

//   const generateTitleFromMessage = (message: string): string => {
//     let title = message.trim();

//     title = title.replace(/^(show|analyze|find|get|list|create|generate|help me with|can you|please)\s+/i, '');

//     title = title.charAt(0).toUpperCase() + title.slice(1);

//     if (title.length > 50) {
//       title = title.substring(0, 47) + '...';
//     }

//     if (title.length < 3) {
//       title = 'New Chat';
//     }

//     return title;
//   };
//   const cleanStreamingContent = (content: string): string => {
//     let cleaned = content;

//     cleaned = cleaned.replace(/<tool_call>([\s\S]*?)<\/tool_call>/g, (match, codeContent) => {
//       let cleanCode = codeContent
//         .replace(/\\n/g, '\n')
//         .replace(/\\"/g, '"')
//         .replace(/\\\\/g, '\\')
//         .trim();

//       return `\n\n\`\`\`python\n${cleanCode}\n\`\`\`\n\n`;
//     });

//     cleaned = cleaned.replace(/<tool_start>[\s\S]*?<\/tool_start>/g, '');
//     cleaned = cleaned.replace(/<tool_result>[\s\S]*?<\/tool_result>/g, '');

//     cleaned = cleaned.replace(/data:\s*\{[^}]*\}/g, '');
//     cleaned = cleaned.replace(/\\n/g, '\n');
//     cleaned = cleaned.replace(/\\"/g, '"');
//     cleaned = cleaned.replace(/\\\\/g, '\\');

//     cleaned = formatStructuredContent(cleaned);

//     cleaned = cleaned.replace(/\s+/g, ' ');
//     cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');
//     cleaned = cleaned.trim();

//     return cleaned;
//   };

//   const formatStructuredContent = (content: string): string => {
//     let formatted = content;

//     formatted = formatted.replace(/(HIGH|MEDIUM|LOW)\s+([A-Z\s]+)\s+\([^)]+\)/g, '## $1 $2');

//     formatted = formatted.replace(/KEY INSIGHTS:/g, '## Key Insights');

//     formatted = formatted.replace(/-\s*Producer\s+(\d+):\s*([^-]+?)\s*-\s*Score\s+(\d+)/g,
//       '- **Producer $1**: $2 - **Score**: $3');

//     formatted = formatted.replace(/-\s*Producer\s+(\d+):\s*([^-]+?)\s*-\s*Score\s+(\d+)\s*$/gm,
//       '- **Producer $1**: $2 - **Score**: $3');

//     formatted = formatted.replace(/-\s*Producer\s+(\d+):\s*([^-\n]+?)\s*-\s*Score\s+(\d+)\s*$/gm,
//       '- **Producer $1**: $2 - **Score**: $3');

//     formatted = formatted.replace(/^-\s*([A-Z][^:]+):\s*/gm, '- **$1**: ');

//     formatted = formatted.replace(/^(\d+)\.\s*/gm, '$1. ');

//     formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '**$1**');

//     formatted = formatted.replace(/\b(Score|Producer|YTD)\s+(\d+)/g, '**$1**: $2');

//     formatted = formatted.replace(/\$([0-9,]+)/g, '**$$$1**');

//     formatted = formatted.replace(/(\d+%|percent)/g, '**$1**');

//     formatted = formatted.replace(/(\d+)\s+producers?\s+are\s+currently\s+([^-]+?)\s+and\s+could\s+expand\s+into\s+([^.]+)/g,
//       '- **$1 producers** are currently **$2** and could expand into **$3**');

//     formatted = formatted.replace(/ML\s+cross-sell\s+propensity\s+scores\s+range\s+from\s+(\d+)-(\d+)/g,
//       'ML cross-sell propensity scores range from **$1-$2**');

//     formatted = formatted.replace(/These\s+(\d+)\s+producers\s+represent\s+([^.]+)/g,
//       'These **$1 producers** represent $2');

//     formatted = formatted.replace(/SALES ORGANIZATION PERFORMANCE REPORT/g, '## Sales Organization Performance Report');
//     formatted = formatted.replace(/SUMMARY TOTALS:/g, '### Summary Totals');
//     formatted = formatted.replace(/DETAILED REGIONAL ANALYSIS:/g, '### Detailed Regional Analysis');
//     formatted = formatted.replace(/PERFORMANCE RANKINGS:/g, '### Performance Rankings');

//     formatted = formatted.replace(/print\('([^']+)'\)/g, '```\nprint(\'$1\')\n```');

//     // Remove header formatting - let StreamingHtmlRenderer handle it
//     // formatted = formatted.replace(/(##[^\n]+)/g, '\n\n$1\n');
//     // formatted = formatted.replace(/(###[^\n]+)/g, '\n\n$1\n');

//     formatted = formatted.replace(/\n{3,}/g, '\n\n');

//     return formatted;
//   };

//   const handleStreamingRecovery = async (
//     command: string,
//     aiMessageId: string,
//     retryCount: number = 0
//   ): Promise<void> => {
//     const maxRetries = 3;

//     if (retryCount >= maxRetries) {
//       setMessages(prev => prev.map(msg =>
//         msg.id === aiMessageId
//           ? {
//             ...msg,
//             content: 'Connection failed after multiple retry attempts. Please try again.',
//             isTyping: false,
//             isStreaming: false
//           }
//           : msg
//       ));
//       return;
//     }

//     try {
//       setMessages(prev => prev.map(msg =>
//         msg.id === aiMessageId
//           ? {
//             ...msg,
//             content: `Connection interrupted. Retrying... (${retryCount + 1}/${maxRetries})`,
//             isTyping: false,
//             isStreaming: true
//           }
//           : msg
//       ));

//       await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));

//       await handleExecuteCommand(command);
//     } catch (error) {
//       console.error(`Recovery attempt ${retryCount + 1} failed:`, error);

//       await handleStreamingRecovery(command, aiMessageId, retryCount + 1);
//     }
//   };

//   const parseToolResult = (content: string): ContentBlock | null => {
//     try {
//       if (content.includes('|') && content.includes('\n')) {
//         const lines = content.split('\n').filter(line => line.trim());
//         if (lines.length >= 2) {
//           const hasHeaders = lines[0].includes('|');
//           const hasSeparator = lines[1].includes('---');

//           if (hasHeaders && hasSeparator) {
//             const headers = lines[0].split('|').filter(cell => cell.trim()).map(cell => cell.trim());
//             const rows = lines.slice(2).map(line =>
//               line.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
//             );

//             return {
//               type: 'table',
//               data: {
//                 title: 'Tool Result Data',
//                 columns: headers,
//                 rows: rows,
//                 detailedData: rows.map((row, index) => {
//                   const obj: any = { id: (index + 1).toString() };
//                   headers.forEach((header, colIndex) => {
//                     obj[header] = row[colIndex] || '';
//                   });
//                   return obj;
//                 })
//               }
//             };
//           }
//         }
//       }

//       if (content.includes('\n') && content.includes(':')) {
//         const lines = content.split('\n').filter(line => line.trim());
//         if (lines.length >= 3) {
//           const hasStructuredData = lines.some(line => line.includes(':') && line.split(':').length >= 2);
//           if (hasStructuredData) {
//             const dataRows = lines.map(line => {
//               const parts = line.split(':').map(part => part.trim());
//               if (parts.length >= 2) {
//                 return [parts[0], parts.slice(1).join(':')];
//               }
//               return [line, ''];
//             });

//             const columns = [...new Set(dataRows.map(row => row[0]))];
//             const rows = dataRows.map(row => [row[0], row[1]]);



//           }
//         }
//       }

//       if (content.includes('**') && content.includes('\n')) {
//         const lines = content.split('\n').filter(line => line.trim());
//         const boldLines = lines.filter(line => line.includes('**'));

//         if (boldLines.length >= 2) {
//           const headers = boldLines.map(line => {
//             const match = line.match(/\*\*(.*?)\*\*/);
//             return match ? match[1].trim() : line.trim();
//           });

//           const dataLines = lines.filter(line => !line.includes('**') && line.trim() && line.includes(':'));
//           if (dataLines.length > 0) {
//             const rows = dataLines.map(line => {
//               const parts = line.split(':').map(part => part.trim());
//               if (parts.length >= 2) {
//                 return [parts[0], parts.slice(1).join(':')];
//               }
//               return [line, ''];
//             });


//           }
//         }
//       }


//       if (content.includes('chart') || content.includes('graph') || content.includes('visualization') ||
//         content.includes('performance') || content.includes('trend') || content.includes('analysis')) {
//         return {
//           type: 'chart',
//           data: {
//             title: 'Data Analysis & Visualization',
//             imageUrl: '/placeholder-chart.png',
//             description: content
//           }
//         };
//       }


//       if (content.includes('📊') || content.includes('📈') || content.includes('📉') ||
//         content.includes('Key Findings') || content.includes('Summary') || content.includes('Statistics')) {
//         return {
//           type: 'chart',
//           data: {
//             title: 'Data Summary & Insights',
//             imageUrl: '/placeholder-chart.png',
//             description: content
//           }
//         };
//       }

//       if (content.includes('image') || content.includes('photo') || content.includes('picture') ||
//         content.includes('screenshot') || content.includes('diagram') || content.includes('illustration')) {
//         return {
//           type: 'chart',
//           data: {
//             title: 'Visual Content',
//             imageUrl: '/placeholder.svg',
//             description: content
//           }
//         };
//       }

//       if (content.includes('🖼️') || content.includes('📷') || content.includes('🎨') ||
//         content.includes('Visual') || content.includes('Diagram') || content.includes('Layout')) {
//         return {
//           type: 'chart',
//           data: {
//             title: 'Visual Representation',
//             imageUrl: '/placeholder.svg',
//             description: content
//           }
//         };
//       }

//       return {
//         type: 'response',
//         data: { content }
//       };
//     } catch (error) {
//       console.warn('Failed to parse tool result:', error);
//       return null;
//     }
//   };

//   const handleExecuteCommand = async (command: string, attachments?: FileAttachment[], skipUserMessage: boolean = false) => {
//     if (command.toLowerCase().trim() === 'golden moment') {
//       setShowGoldenMoment(true);

//       const demoResponse: Message = {
//         id: (Date.now() + 1).toString(),
//         type: 'ai',
//         content: "🎉 Congrats, Taylor! Sales ninja mode activated — 45 activities completed and crushing goals.!",
//         timestamp: new Date(),
//       };

//       // Only add user message if not skipping (when called from handleSendMessage)
//       if (!skipUserMessage) {
//         const newMessage: Message = {
//           id: Date.now().toString(),
//           type: 'user',
//           content: command,
//           timestamp: new Date(),
//         };
//         setMessages(prev => [...prev, newMessage, demoResponse]);
//       } else {
//         setMessages(prev => [...prev, demoResponse]);
//       }

//       setInputMessage('');
//       setTimeout(() => {
//         scrollToBottom();
//       }, 0);
//       return;
//     }

//     if (isStreaming) {
//       console.warn('Already streaming, ignoring new request');
//       return;
//     }

//     setIsChatLoading(true);
//     setIsStreaming(true);

//     const abortController = new AbortController();
//     setStreamingControllerRef(abortController);

//     const newMessage: Message = {
//       id: Date.now().toString(),
//       type: 'user',
//       content: command,
//       timestamp: new Date(),
//     };

//     const typingId = (Date.now() + 0.5).toString();
//     const aiMessageId = (Date.now() + 1).toString();

//     const messagesToAdd = skipUserMessage
//       ? [{
//         id: typingId,
//         type: 'ai' as const,
//         content: '',
//         timestamp: new Date(),
//         isTyping: true,
//       }]
//       : [
//         newMessage,
//         {
//           id: typingId,
//           type: 'ai' as const,
//           content: '',
//           timestamp: new Date(),
//           isTyping: true,
//         },
//       ];

//     setMessages(prev => [...prev, ...messagesToAdd]);
//     setInputMessage('');

//     setTimeout(() => {
//       scrollToBottom();
//     }, 0);

//     let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
//     let isReaderReleased = false;
//     let retryCount = 0;
//     const maxRetries = 3;

//     const cleanupReader = () => {
//       if (reader && !isReaderReleased) {
//         try {
//           reader.releaseLock();
//           isReaderReleased = true;
//         } catch (releaseError) {
//           console.warn('Reader already released or in invalid state:', releaseError);
//         }
//       }
//     };

//     const attemptStreaming = async (): Promise<void> => {
//       try {
//         const token = Cookies.get('access_token');
//         if (!token) {
//           throw new Error('No access token found');
//         }

//         let currentSessionId = sessionId || activeSessionId;

//         if (!currentSessionId) {
//           const previousAiMessages = messages.filter(msg => msg.type === 'ai');
//           for (const msg of previousAiMessages) {
//             if (msg.contentBlocks) {
//               for (const block of msg.contentBlocks) {
//                 if (block.type === 'response' && block.data.session_id) {
//                   currentSessionId = block.data.session_id;
//                   break;
//                 }
//               }
//             }

//             if (!currentSessionId && msg.content) {
//               const sessionMatch = msg.content.match(/"session_id":\s*"([^"]+)"/);
//               if (sessionMatch) {
//                 currentSessionId = sessionMatch[1];
//                 break;
//               }
//             }
//           }
//         }

//         let response: Response;

//         if (attachments && attachments.length > 0) {
//           const formData = new FormData();
//           formData.append('message', command);
//           formData.append('stream', 'false');
//           if (currentSessionId) {
//             formData.append('session_id', currentSessionId);
//           }

//           attachments.forEach((attachment, index) => {
//             formData.append(`file${index}`, attachment.file);
//           });

//           response = await fetch(`${config.isDevelopment ? config.api.devProxyUrl : config.api.baseUrl}/agent/chat`, {
//             method: 'POST',
//             headers: {
//               'Authorization': `Bearer ${token}`,
//             },
//             body: formData,
//             signal: abortController.signal,
//           });
//         } else {
//           response = await fetch(`${config.isDevelopment ? config.api.devProxyUrl : config.api.baseUrl}/agent/chat`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//               message: command,
//               stream: false,
//               ...(currentSessionId && { session_id: currentSessionId }),
//             }),
//             signal: abortController.signal,
//           });
//         }

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         if (!response.body) {
//           throw new Error('No response body');
//         }

//         const contentType = response.headers.get('content-type');
//         if (!contentType || !contentType.includes('text/event-stream')) {
//           console.warn('Response is not streaming, falling back to regular response');
//           const text = await response.text();
//           setMessages(prev => prev.map(msg =>
//             msg.id === aiMessageId
//               ? { ...msg, content: text, isTyping: false, isStreaming: false }
//               : msg
//           ));
//           return;
//         }

//         setMessages(prev => [
//           ...prev.filter(m => m.id !== typingId),
//           {
//             id: aiMessageId,
//             type: 'ai',
//             content: 'Processing your request...',
//             timestamp: new Date(),
//             contentBlocks: [],
//             isTyping: true,
//             isStreaming: true,
//             originalCommand: command
//           },
//         ]);

//         reader = response.body.getReader();
//         const decoder = new TextDecoder();
//         let buffer = '';
//         let currentContent = '';
//         let contentBlocks: ContentBlock[] = [];
//         let isFirstResponse = true;
//         let lastActivityTime = Date.now();
//         let receivedSessionId: string | null = null;

//         const heartbeatInterval = setInterval(() => {
//           const timeSinceLastActivity = Date.now() - lastActivityTime;
//           if (timeSinceLastActivity > 30000) { 
//             console.warn('Stream heartbeat timeout, attempting recovery');
//             clearInterval(heartbeatInterval);
//             throw new Error('Stream connection timeout');
//           }
//         }, 10000);

//         try {
//           while (true) {
//             const { done, value } = await reader.read();

//             if (done) {
//               break;
//             }

//             lastActivityTime = Date.now();
//             const chunk = decoder.decode(value, { stream: false });
//             buffer += chunk;

//             const lines = buffer.split('\n');
//             buffer = lines.pop() || '';

//             for (const line of lines) {
//               if (line.trim() && line.startsWith('data: ')) {
//                 try {
//                   const eventData = JSON.parse(line.slice(6));

//                   if (eventData.type === 'start' && eventData.session_id) {
//                     receivedSessionId = eventData.session_id;

//                     const sessionBlock: ContentBlock = {
//                       type: 'response',
//                       data: { session_id: receivedSessionId }
//                     };

//                     if (!contentBlocks.some(block => block.type === 'response' && block.data.session_id)) {
//                       contentBlocks = [...contentBlocks, sessionBlock];
//                     }
//                   }

//                   if (eventData.session_id && isNewSession && firstUserMessage) {
//                     const newTitle = generateTitleFromMessage(firstUserMessage);

//                     const newSession = {
//                       session_id: eventData.session_id,
//                       title: newTitle,
//                       created_at: new Date().toISOString(),
//                       updated_at: new Date().toISOString(),
//                       message_count: 1,
//                       user_id: user?.id || '',
//                       status: 'active',
//                       memory_state: {
//                         activities_count: 0,
//                         email_drafts_count: 0,
//                         profiles_count: 0
//                       },
//                       uploaded_files_count: 0,
//                       active: true
//                     };

//                     updateChatSession(eventData.session_id, newTitle).then(() => {
//                       window.dispatchEvent(new CustomEvent('session-updated', { detail: newSession }));
//                       window.dispatchEvent(new Event('refresh-chat-sessions'));
//                       setIsNewSession(false);
//                       setFirstUserMessage('');
//                     }).catch(error => {
//                       console.error('Failed to update session title:', error);
//                     });
//                   }

//                   if (eventData.type === 'thinking') {
//                     continue;
//                   } else if (eventData.type === 'status' || eventData.type === 'heartbeat') {
//                     const displayText = mapStatusToDisplayText(eventData.content);
//                     setCurrentStatus(displayText);
//                     continue;
//                   } else if (eventData.type === 'response') {
//                     if (isFirstResponse) {
//                       currentContent = eventData.content || '';
//                       isFirstResponse = false;
//                     } else {
//                       currentContent += eventData.content || '';
//                     }

//                     setStreamingMarkdown(prev => new Map(prev.set(aiMessageId, currentContent)));

//                     const cleanedContent = cleanStreamingContent(currentContent);

//                     setMessages(prev => prev.map(msg =>
//                       msg.id === aiMessageId
//                         ? { ...msg, content: cleanedContent, isTyping: false, isStreaming: true }
//                         : msg
//                     ));

//                     setMarkdownKey(prev => prev + 1);

//                     console.log('AI Response content updated:', {
//                       messageId: aiMessageId,
//                       contentLength: cleanedContent.length,
//                       hasMarkdown: cleanedContent.includes('#') || cleanedContent.includes('**') || cleanedContent.includes('|'),
//                       contentPreview: cleanedContent.substring(0, 100) + '...'
//                     });

//                     const responseBlock: ContentBlock = {
//                       type: 'response',
//                       data: {
//                         content: cleanedContent,
//                         ...(receivedSessionId && { session_id: receivedSessionId })
//                       }
//                     };

//                     const filteredBlocks = contentBlocks.filter(block =>
//                       !(block.type === 'response' && block.data.content)
//                     );
//                     contentBlocks = [...filteredBlocks, responseBlock];

//                     setMessages(prev => prev.map(msg =>
//                       msg.id === aiMessageId
//                         ? { ...msg, contentBlocks: contentBlocks }
//                         : msg
//                     ));

//                   } else if (eventData.type === 'tool_result') {
//                     const toolResultBlock = parseToolResult(eventData.content || '');
//                     if (toolResultBlock) {
//                       contentBlocks = [...contentBlocks, toolResultBlock];

//                       setMessages(prev => prev.map(msg =>
//                         msg.id === aiMessageId
//                           ? { ...msg, contentBlocks: contentBlocks }
//                           : msg
//                       ));
//                     }
//                   } else if (eventData.type === 'files') {
//                     console.log('Files event received:', eventData.content);

//                     const fileBlock: ContentBlock = {
//                       type: 'files',
//                       data: {
//                         files: eventData.content?.files || [],
//                         file_count: eventData.content?.file_count || 0
//                       }
//                     };
//                     contentBlocks = [...contentBlocks, fileBlock];

//                     setMessages(prev => prev.map(msg =>
//                       msg.id === aiMessageId
//                         ? { ...msg, contentBlocks: contentBlocks }
//                         : msg
//                     ));
//                   } else if (eventData.type === 'complete') {
//                     if (eventData.session_id) {
//                       receivedSessionId = eventData.session_id;

//                       setActiveSessionId(receivedSessionId);

//                       const sessionBlock: ContentBlock = {
//                         type: 'response',
//                         data: { session_id: receivedSessionId }
//                       };

//                       if (!contentBlocks.some(block => block.type === 'response' && block.data.session_id)) {
//                         contentBlocks = [...contentBlocks, sessionBlock];
//                       }
//                     }
//                     break;
//                   } else if (eventData.type === 'end') {
//                     break;
//                   }
//                 } catch (parseError) {
//                   console.warn('Failed to parse SSE data:', parseError, 'Line:', line);

//                 }
//               }
//             }
//           }
//         } finally {
//           clearInterval(heartbeatInterval);
//           cleanupReader();
//         }

//       } catch (error) {
//         if (error instanceof Error && error.name === 'AbortError') {

//           return;
//         }

//         console.error(`Streaming attempt ${retryCount + 1} failed:`, error);

//         cleanupReader();

//         if (retryCount < maxRetries &&
//           (error instanceof Error &&
//             (error.message.includes('timeout') ||
//               error.message.includes('connection') ||
//               error.message.includes('network')))) {

//           retryCount++;
//           setMessages(prev => prev.map(msg =>
//             msg.id === aiMessageId
//               ? { ...msg, content: `Connection interrupted. Retrying... (${retryCount}/${maxRetries})`, isTyping: false, isStreaming: true, originalCommand: command }
//               : msg
//           ));

//           await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));

//           return attemptStreaming();
//         } else {
//           throw error;
//         }
//       }
//     };

//     try {
//       await attemptStreaming();
//     } catch (error) {
//       if (error instanceof Error && error.name === 'AbortError') {

//         return;
//       }

//       console.error('Chat execution error:', error);

//       setMessages(prev => prev.map(msg =>
//         msg.id === aiMessageId
//           ? {
//             ...msg,
//             content: `Error: ${error instanceof Error ? error.message : 'Failed to process request'}`,
//             isTyping: false,
//             isStreaming: false,
//             originalCommand: command
//           }
//           : msg
//       ));
//     } finally {
//       cleanupReader();

//         const finalStreamingContent = streamingMarkdown.get(aiMessageId);
//         setMessages(prev => prev.map(msg =>
//           msg.id === aiMessageId
//             ? {
//               ...msg,
//               content: finalStreamingContent || msg.content,
//               isStreaming: false,
//               isTyping: false,
//               originalCommand: command
//             }
//             : msg
//         ));

//       setStreamingMarkdown(prev => {
//         const newMap = new Map(prev);
//         const messageIds = Array.from(newMap.keys());
//         if (messageIds.length > 10) {
//           const messagesToKeep = messageIds.slice(-10);
//           messageIds.forEach(id => {
//             if (!messagesToKeep.includes(id)) {
//               newMap.delete(id);
//             }
//           });
//         }
//         return newMap;
//       });

//       setIsChatLoading(false);
//       setIsStreaming(false); 
//       setStreamingControllerRef(null);
//       setCurrentStatus(null); 
//       setTimeout(() => {
//         scrollToBottom();
//       }, 100);
//     }
//   };

//   const handleEmailAgent = (agentId?: string) => {
//     toast({
//       title: "Email Agent",
//       description: `Email functionality for Agent ${agentId || 'selected agent'} would be implemented here`
//     });
//   };

//   const handleScheduleTouchpoint = (agentId: string) => {
//     toast({
//       title: "Schedule Touchpoint",
//       description: `Calendar integration would open for Agent ${agentId}`
//     });
//   };

//   const handleAssignFollowUp = (agentId: string) => {
//     toast({
//       title: "Assign Follow-Up",
//       description: `Team assignment dialog would open for Agent ${agentId}`
//     });
//   };

//   const handleShowDetailedView = (data: any) => {
//     const sampleItem = data.detailedData[0];
//     const dynamicColumns = Object.keys(sampleItem)
//       .filter(key => key !== 'id')
//       .map(key => ({
//         key,
//         label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
//         sortable: true
//       }));

//     setDetailedViewData({
//       title: data.title,
//       data: data.detailedData,
//       columns: dynamicColumns
//     });
//     setShowDetailedView(true);
//   };

//   const convertTableToCSV = (tableData: any) => {
//     if (!tableData || !tableData.columns || !tableData.rows) {
//       return '';
//     }

//     const headers = tableData.columns.slice(0, -1);

//     const csvRows = tableData.rows.map((row: string[]) =>
//       row.slice(0, -1).map(cell => {
//         if (typeof cell === 'string' && cell.includes(',')) {
//           return `"${cell}"`;
//         }
//         return cell;
//       }).join(',')
//     );

//     const csvContent = [headers.join(','), ...csvRows].join('\n');
//     return csvContent;
//   };

//   const downloadCSV = (tableData: any) => {
//     const csvContent = convertTableToCSV(tableData);
//     if (!csvContent) {
//       toast({
//         title: "Error",
//         description: "No data available to download",
//         variant: "destructive",
//       });
//       return;
//     }

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);

//     link.setAttribute('href', url);
//     link.setAttribute('download', `${tableData.title || 'table-data'}.csv`);
//     link.style.visibility = 'hidden';

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     URL.revokeObjectURL(url);

//     toast({
//       title: "Success",
//       description: "CSV file downloaded successfully",
//     });
//   };

//   const copyTableData = (tableData: any) => {
//     if (!tableData || !tableData.columns || !tableData.rows) {
//       toast({
//         title: "Error",
//         description: "No data available to copy",
//         variant: "destructive",
//       });
//       return;
//     }

//     const formatTableForCleanCopy = (data: any) => {
//       const headers = data.columns.slice(0, -1);
//       const rows = data.rows.map((row: string[]) => row.slice(0, -1));

//       const columnWidths = headers.map((header: string, colIndex: number) => {
//         let maxWidth = header.length;
//         rows.forEach(row => {
//           if (row[colIndex] && row[colIndex].toString().length > maxWidth) {
//             maxWidth = row[colIndex].toString().length;
//           }
//         });
//         return maxWidth;
//       });

//       let tableText = '';

//       headers.forEach((header: string, index: number) => {
//         tableText += header.padEnd(columnWidths[index] + 2);
//       });
//       tableText += '\n';

//       headers.forEach((header: string, index: number) => {
//         tableText += '-'.repeat(columnWidths[index]) + '  ';
//       });
//       tableText += '\n';

//       rows.forEach(row => {
//         row.forEach((cell: string, index: number) => {
//           tableText += (cell || '').padEnd(columnWidths[index] + 2);
//         });
//         tableText += '\n';
//       });

//       return tableText;
//     };

//     const tableText = formatTableForCleanCopy(tableData);

//     navigator.clipboard.writeText(tableText).then(() => {
//       toast({
//         title: "Success",
//         description: "Table copied in clean format",
//       });
//     }).catch(() => {
//       const textArea = document.createElement('textarea');
//       textArea.value = tableText;
//       textArea.style.position = 'fixed';
//       textArea.style.left = '-999999px';
//       textArea.style.top = '-999999px';
//       document.body.appendChild(textArea);
//       textArea.focus();
//       textArea.select();

//       try {
//         document.execCommand('copy');
//         toast({
//           title: "Success",
//           description: "Table copied in clean format",
//         });
//       } catch (err) {
//         toast({
//           title: "Error",
//           description: "Failed to copy data to clipboard",
//           variant: "destructive",
//         });
//       }

//       document.body.removeChild(textArea);
//     });
//   };

//   const renderContentBlock = (block: ContentBlock) => {
//     if (block.type === 'table') {
//       return (
//         <Card className="mt-4 p-4 shadow-soft">
//           <div className="flex items-center justify-between mb-3">
//             <h4 className="font-semibold text-foreground">{block.data.title}</h4>
//             <div className="flex gap-0.5">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="border-0 shadow-none hover:bg-transparent focus-visible:ring-0"
//                 onClick={() => downloadCSV(block.data)}
//                 title="Download CSV"
//                 aria-label="Download CSV"
//               >
//                 <Download className="w-4 h-4" />
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="border-0 shadow-none hover:bg-transparent focus-visible:ring-0"
//                 onClick={() => copyTableData(block.data)}
//                 title="Copy"
//                 aria-label="Copy"
//               >
//                 <Copy className="w-4 h-4" />
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="border-0 shadow-none hover:bg-transparent focus-visible:ring-0"
//                 onClick={() => handleEmailAgent('all')}
//                 title="Email"
//                 aria-label="Email"
//               >
//                 <Mail className="w-4 h-4" />
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="border-0 shadow-none hover:bg-transparent focus-visible:ring-0"
//                 onClick={() => toast({ title: "Sync to CRM", description: "CRM sync functionality coming soon" })}
//                 title="Sync to CRM"
//                 aria-label="Sync to CRM"
//               >
//                 <Database className="w-4 h-4" />
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="border-0 shadow-none hover:bg-transparent focus-visible:ring-0"
//                 onClick={() => handleAssignFollowUp('all')}
//                 title="Assign Follow-Up"
//                 aria-label="Assign Follow-Up"
//               >
//                 <UserPlus className="w-4 h-4" />
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="border-0 shadow-none hover:bg-transparent focus-visible:ring-0"
//                 onClick={() => handleShowDetailedView(block.data)}
//                 title="Full-screen detailed view"
//                 aria-label="Full-screen detailed view"
//               >
//                 <Maximize2 className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-border">
//                   {block.data.columns.slice(0, -1).map((col: string, index: number) => (
//                     <th key={index} className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">
//                       {col}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {block.data.rows.map((row: string[], rowIndex: number) => (
//                   <tr key={rowIndex} className="border-b border-border/50 hover:bg-muted/30 transition-fast">
//                     {row.slice(0, -1).map((cell: string, cellIndex: number) => (
//                       <td key={cellIndex} className="py-3 px-3 text-sm">
//                         {cellIndex === 2 ? (
//                           <Badge variant={cell.includes('High') ? 'destructive' : cell.includes('Medium') ? 'secondary' : 'outline'}>
//                             {cell}
//                           </Badge>
//                         ) : (
//                           cell
//                         )}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//         </Card>
//       );
//     }

//     if (block.type === 'email') {
//       return (
//         <EmailDrafting
//           recipient={block.data.recipient}
//           drafts={block.data.drafts}
//           onSend={(draftId) => toast({ title: "Email Sent", description: `Draft ${draftId} sent successfully` })}
//           onCopy={(draftId) => toast({ title: "Copied", description: "Email content copied to clipboard" })}
//           onDownload={(draftId) => toast({ title: "Download Started", description: "Word document is downloading" })}
//           onRegenerate={() => toast({ title: "Regenerating", description: "Creating new email variations" })}
//         />
//       );
//     }

//     if (block.type === 'chart') {
//       return (
//         <ChartVisualization
//           title={block.data.title}
//           imageUrl={block.data.imageUrl}
//           description={block.data.description}
//         />
//       );
//     }

//     if (block.type === 'error') {
//       return (
//         <ErrorFallback
//           type={block.data.type}
//           message={block.data.message}
//           suggestions={block.data.suggestions}
//         />
//       );
//     }

//     if (block.type === 'tool_result') {
//       return (
//         <Card className="mt-4 p-4 shadow-soft bg-green-50 border-green-200">
//           <div className="flex items-center gap-2 mb-2">
//             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//             <span className="text-sm font-medium text-green-700">Tool Result</span>
//           </div>
//           <div className="text-sm text-green-800 whitespace-pre-wrap">{block.data.content}</div>
//         </Card>
//       );
//     }

//     if (block.type === 'files') {
//       return <GeneratedFilesDisplay files={block.data.files} />;
//     }

//     return null;
//   };

//   useEffect(() => {
//     const loadChatSession = async () => {
//       if (!sessionId) {
//         setMessages([]);
//         return;
//       }

//       setIsLoadingSession(true);
//       try {
//         const response = await getChatSession(sessionId);
//         if (response.success && response.messages) {
//           const convertedMessages: Message[] = [];
//           const allFiles = response.files || [];
//           response.messages.forEach((msg: any, index: number) => {
//             if (msg.user_message) {
//               convertedMessages.push({
//                 id: msg.message_id || `msg_${index}`,
//                 type: 'user',
//                 content: msg.user_message,
//                 timestamp: new Date(msg.timestamp),
//                 attachments: msg.files_attached || []
//               });
//             }

//             if (msg.agent_response) {
//               const contentBlocks: ContentBlock[] = [];

//               if (msg.files_attached && msg.files_attached.length > 0) {
//                 console.log('Message has files_attached:', msg.files_attached);

//                 const messageFiles = allFiles.filter((file: any) =>
//                   msg.files_attached.includes(file.filename)
//                 );

//                 console.log('Matched files for message:', messageFiles);

//                 if (messageFiles.length > 0) {
//                   const fileBlock: ContentBlock = {
//                     type: 'files',
//                     data: {
//                       files: messageFiles,
//                       file_count: messageFiles.length
//                     }
//                   };
//                   contentBlocks.push(fileBlock);
//                   console.log('Added file block to contentBlocks:', fileBlock);
//                 }
//               }

//               convertedMessages.push({
//                 id: `ai_${index}`,
//                 type: 'ai',
//                 content: msg.agent_response,
//                 timestamp: new Date(msg.timestamp),
//                 attachments: msg.files_attached || [],
//                 contentBlocks: contentBlocks
//               });
//             }
//           });

//           if (allFiles.length > 0) {
//             const usedFiles = new Set();
//             convertedMessages.forEach(msg => {
//               if (msg.contentBlocks) {
//                 msg.contentBlocks.forEach(block => {
//                   if (block.type === 'files' && block.data.files) {
//                     block.data.files.forEach((file: any) => {
//                       usedFiles.add(file.filename);
//                     });
//                   }
//                 });
//               }
//             });

//             const unusedFiles = allFiles.filter((file: any) => !usedFiles.has(file.filename));
//             if (unusedFiles.length > 0) {
//               console.log('Adding unused files to last message:', unusedFiles);

//               if (convertedMessages.length > 0) {
//                 const lastMessage = convertedMessages[convertedMessages.length - 1];
//                 if (lastMessage.type === 'ai') {
//                   const fileBlock: ContentBlock = {
//                     type: 'files',
//                     data: {
//                       files: unusedFiles,
//                       file_count: unusedFiles.length
//                     }
//                   };
//                   lastMessage.contentBlocks = [...(lastMessage.contentBlocks || []), fileBlock];
//                 }
//               }
//             }
//           }

//           setMessages(convertedMessages);

//         }
//       } catch (error) {
//         console.error('Error loading chat session:', error);

//       } finally {
//         setIsLoadingSession(false);
//       }
//     };

//     loadChatSession();
//   }, [sessionId]);

//   return (
//     <div className="flex-1 flex flex-col h-screen relative">
//       <div className="border-b border-border bg-background/80 backdrop-blur-sm px-6 py-4">
//         <div className="flex items-center justify-between">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className="h-auto p-0 justify-start hover:bg-transparent text-left pointer-events-auto"
//                 style={{ transition: 'none' }}
//               >
//                 <div className="flex items-center gap-2">
//                   <span className="text-lg font-semibold text-foreground">ARIA Acta-1</span>
//                   <ChevronDown className="w-4 h-4 text-muted-foreground" />
//                 </div>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent
//               align="start"
//               className="w-[600px] p-4 bg-background border border-border z-[60]"
//             >
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-2 h-2 bg-gradient-primary rounded-full animate-pulse"></div>
//                   <span className="font-semibold text-foreground">About ARIA Acta-1</span>
//                 </div>
//                 <p className="text-sm text-muted-foreground leading-relaxed">
//                   ARIA Acta-1 is our most advanced AI system, built on our Agentic Responsive Intelligent Architecture (ARIA). It combines powerful reasoning, adaptive decision-making, and contextual understanding to help you optimize distribution relationships and accelerate growth. ARIA Acta-1 is LLM-agnostic and leverages the newest and most powerful models available to deliver unmatched performance.
//                 </p>
//               </div>
//             </DropdownMenuContent>
//           </DropdownMenu>

//       <Sheet open={isActionPromptsSidebarOpen} onOpenChange={setIsActionPromptsSidebarOpen}>
//             <SheetTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="gap-2 h-8 px-3 rounded-full border border-border hover:border-primary/50 transition-all duration-200"
//               >
//                 <Zap className="w-4 h-4" />
//                 <span className="text-sm">Power Prompts</span>
//               </Button>
//             </SheetTrigger>

//             <SheetContent side="right" className="w-[30rem] max-w-[30rem] min-w-[30rem] p-0">
//               <ActionPromptsSidebar
//                 showWelcome={!hasSeenActionPrompts}
//                 onPromptClick={(prompt) => {
//                   setInputMessage(prompt);
//                   setIsActionPromptsSidebarOpen(false);
//                 }}
//               />
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>

//       {/* Chat Messages */}
//       <div
//         ref={chatContainerRef}
//         className={`flex-1 overflow-y-auto p-6 pb-6 space-y-12 relative transition-all duration-500 ${isDragOver ? 'bg-muted/50' : ''}`}
//         style={{
//           maxWidth: '100%',
//           alignSelf: 'center',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           width: '-webkit-fill-available',
//           maxHeight: '100vh',
//           overflowY: 'auto',
//         }}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//       >
//           <div
//             className={`flex-1 overflow-y-auto p-6 pb-6 space-y-12 relative ${isDragOver ? 'bg-muted/50' : ''}`}
//           style={{
//             maxWidth: '940px',
//             alignSelf: 'center',
//             marginTop: 'auto',
//             width: '-webkit-fill-available',
//           }}
//         >
//           {/* Drag and Drop Overlay */}
//           {isDragOver && (
//             <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center z-50">
//               <div className="text-center">
//                 <Paperclip className="w-12 h-12 text-primary mx-auto mb-2 animate-bounce" />
//                 <p className="text-lg font-medium text-primary">Drop files here to upload</p>
//                 <p className="text-sm text-muted-foreground">Supports all file formats (10MB images, 50MB others)</p>
//                 <p className="text-xs text-muted-foreground/70 mt-1">Images, documents, videos, audio, archives, code files, and more</p>
//               </div>
//             </div>
//           )}

//           {messages.length === 0 && (
//             <div className="flex items-center justify-center min-h-[60vh]">
//               <div className="w-full max-w-2xl animate-fade-in">
//                 <div className="text-center mb-6">
//                   {/* <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Good to see you {user.username}</h1> */}
//                   <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Good to see you Taylor!</h1>
//                 </div>
//                 <div
//                   className={`liquid-glass rounded-2xl px-6 py-5 relative ${isDragOver ? 'bg-primary/10 border-2 border-dashed border-primary/50' : ''}`}
//                   onDragOver={handleDragOver}
//                   onDragLeave={handleDragLeave}
//                   onDrop={handleDrop}
//                 >
//                   {/* Drag and Drop Overlay for Empty State */}
//                   {isDragOver && (
//                     <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary/50 rounded-xl flex items-center justify-center z-50">
//                       <div className="text-center">
//                         <Paperclip className="w-8 h-8 text-primary mx-auto mb-2 animate-bounce" />
//                         <p className="text-sm font-medium text-primary">Drop files here to upload</p>
//                         <p className="text-xs text-muted-foreground/70">All file types supported</p>
//                       </div>
//                     </div>
//                   )}
//                   <div className="flex flex-col gap-3">
//                     <div className="w-full">
//                       <Textarea
//                         value={inputMessage}
//                         onChange={(e) => setInputMessage(e.target.value)}
//                         placeholder={isChatLoading ? "Processing..." : "Ask anything"}
//                         className="min-h-[48px] max-h-32 bg-transparent border-none focus:ring-0 focus:outline-none text-sm placeholder:text-muted-foreground/70 resize-none overflow-y-auto"
//                         disabled={isChatLoading}
//                         onKeyDown={(e) => {
//                           if (e.key === 'Enter' && !e.shiftKey && !isChatLoading) {
//                             e.preventDefault();
//                             handleSendMessage();
//                           }
//                         }}
//                         onInput={(e) => {
//                           const target = e.target as HTMLTextAreaElement;
//                           target.style.height = 'auto';
//                           target.style.height = Math.min(target.scrollHeight, 128) + 'px';
//                         }}
//                       />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div className="flex gap-2 items-center">
//                         <FileUploadButton />


//                       </div>

//                       <div className="flex gap-3 items-center">

//                         <Button
//                           onClick={handleSendMessage}
//                           size="sm"
//                           className="h-8 w-8 p-0 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 rounded-full"
//                           disabled={(!inputMessage.trim() && attachments.length === 0) || isChatLoading}
//                         >
//                           {isChatLoading ? (
//                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                           ) : (
//                             <Send className="w-4 h-4" />
//                           )}
//                         </Button>
//                       </div>
//                     </div>
//                     <FileAttachmentsPreview />
//                   </div>
//                 </div>
//               </div>
//               <HiddenFileInput />
//             </div>
//           )}

//       {isLoadingSession && (
//             <div className="flex justify-center py-8">
//               <div className="flex items-center gap-3 text-muted-foreground">
//                 <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
//                 <span className="text-sm">Loading chat session...</span>
//               </div>
//             </div>
//           )}

//           {messages.map((message, index) => (
//             <div
//               key={message.id}
//               className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in group`}
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               <div className={`flex flex-col max-w-3xl ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
//                 <Card className={`${message.type === 'user'
//                   ? 'p-4 hover-lift bg-gradient-chat-user text-foreground shadow-soft'
//                   : 'p-0 border-0 shadow-none bg-transparent'
//                   }`}>
//                     {message.isTyping ? (
//                     <div className="flex items-center gap-2">
//                       <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/70 animate-blink" />
//                       <span className="animate-blink-slow animate-pulse text-sm">
//                         {currentStatus || 'Thinking...'}
//                       </span>
//                     </div>
//                   ) : (
//                     <div className="relative">
//                       {message.type === 'ai' ? (
//                         <StreamingHtmlRenderer
//                           messageId={message.id}
//                           content={message.content}
//                           streamingContent={streamingMarkdown.get(message.id)}
//                         />
//                       ) : (
//                         <p className="text-sm leading-relaxed">{message.content}</p>
//                       )}

//                       {/* Feedback and action buttons for AI messages when not typing/streaming */}
//                       {message.type === 'ai' && !message.isTyping && !message.isStreaming && message.content && (
//                         <div className="mt-3 flex items-center justify-between">
//                           {/* Left side - Feedback and Copy buttons */}
//                           <div className="flex items-center gap-1">
//                             {/* Thumbs Up */}
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className={`h-7 w-7 p-0 hover:bg-green-500/10 transition-all duration-200 ${
//                                 messageFeedback.get(message.id) === 'thumbsUp' 
//                                   ? 'text-gray-700 bg-gray-200' 
//                                   : 'text-muted-foreground hover:text-green-500'
//                               }`}
//                               onClick={() => handleFeedback(message.id, 'thumbsUp')}
//                               title="Thumbs up"
//                             >
//                               <ThumbsUp className="w-4 h-4" />
//                             </Button>

//                             {/* Thumbs Down */}
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className={`h-7 w-7 p-0 hover:bg-red-500/10 transition-all duration-200 ${
//                                 messageFeedback.get(message.id) === 'thumbsDown' 
//                                   ? 'text-gray-700 bg-gray-200' 
//                                   : 'text-muted-foreground hover:text-red-500'
//                               }`}
//                               onClick={() => handleFeedback(message.id, 'thumbsDown')}
//                               title="Thumbs down"
//                             >
//                               <ThumbsDown className="w-4 h-4" />
//                             </Button>

//                             {/* Copy button */}
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200"
//                               onClick={() => {
//                                 const contentToCopy = streamingMarkdown.get(message.id) || message.content;
//                                 navigator.clipboard.writeText(contentToCopy);
//                                 toast({
//                                   title: "Copied!",
//                                   description: "Message content copied to clipboard",
//                                   duration: 2000,
//                                 });
//                               }}
//                               title="Copy message"
//                             >
//                               <Copy className="w-4 h-4" />
//                             </Button>
//                           </div>

//                           {/* Right side - Retry button */}
//                           {message.originalCommand && (
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className="h-7 px-3 text-xs hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/30 transition-all duration-200"
//                               onClick={() => handleRetryMessage(message.originalCommand)}
//                               title="Retry this request"
//                             >
//                               <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                               </svg>
//                               Retry
//                             </Button>
//                           )}
//                         </div>
//                       )}

//                       {message.isStreaming && (
//                         <div className="absolute bottom-0 right-0 flex items-center gap-2 text-xs text-muted-foreground">
//                           <div className="flex items-center gap-1">
//                             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
//                             <span>Streaming</span>
//                           </div>
//                           {message.content.includes('Connection interrupted') && (
//                             <Button
//                               onClick={() => handleStreamingRecovery(message.content, message.id)}
//                               variant="outline"
//                               size="sm"
//                               className="h-5 px-2 text-xs rounded-full"
//                             >
//                               Retry
//                             </Button>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Status Display for AI messages */}
//                   {/* {message.type === 'ai' && currentStatus && message.isStreaming && (
//                     <StatusDisplay status={currentStatus} type="status" />
//                   )} */}
//                 </Card>

//                 {message.contentBlocks?.map((block, index) => (
//                   <div key={index} className="w-full">
//                     {renderContentBlock(block)}
//                   </div>
//                 ))}

//                 {/* Render attachments if any */}
//                 {message.attachments && message.attachments.length > 0 && (
//                   <div className="mt-3 space-y-2">
//                     <div className="text-xs text-muted-foreground mb-2">
//                       {message.attachments.length} file(s) attached
//                     </div>
//                     {message.attachments.map((attachment) => {
//                       if (!attachment.file) {
//                         return null;
//                       }

//                       return (
//                         <div
//                           key={attachment.id}
//                           className="flex items-center gap-2 p-2 bg-muted/30 rounded border border-border/30 hover:bg-muted/50 transition-colors"
//                         >
//                           <div className="flex items-center gap-2 flex-1 min-w-0">
//                             {attachment.preview ? (
//                               <img
//                                 src={attachment.preview}
//                                 alt={attachment.file?.name || 'File'}
//                                 className="w-8 h-8 object-cover rounded"
//                               />
//                             ) : (
//                               <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
//                                 {getFileIcon(attachment.type)}
//                               </div>
//                             )}
//                             <div className="flex-1 min-w-0">
//                               <p className="text-xs font-medium truncate">{attachment.file?.name || 'Unknown file'}</p>
//                               <p className="text-xs text-muted-foreground flex items-center gap-2">
//                                 <span>{attachment.size}</span>
//                                 <span className="text-muted-foreground/50">•</span>
//                                 <span className="capitalize">{attachment.type}</span>
//                               </p>
//                             </div>
//                           </div>

//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Scroll to Bottom Button */}
//       {showScrollButtons && !isAtBottom && (
//         <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 z-50">
//           <Button
//             onClick={scrollToBottom}
//             variant="outline"
//             size="sm"
//             className="h-10 w-10 p-0 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-all duration-200 animate-fade-in"
//             title="Scroll to bottom"
//           >
//             <ChevronDown className="w-4 h-4" />
//           </Button>
//         </div>
//       )}

//       {/* Golden Moment - Single Location Above Chat Input */}
//       {showGoldenMoment && (
//         <div className="flex justify-center mb-4">
//           <GoldenMoment
//             isVisible={showGoldenMoment}
//             onComplete={() => setShowGoldenMoment(false)}
//           />
//         </div>
//       )}

//       {/* Floating Chat Input */}
//       {messages.length > 0 && (
//         <div className="relative top-0 left-0 right-0 flex justify-center px-6 z-50 mb-6">
//           <div
//             className={`w-full max-w-4xl liquid-glass rounded-2xl px-4 py-3 ${isDragOver ? 'bg-primary/10 border-2 border-dashed border-primary/50' : ''}`}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDrop}
//           >
//             <div className="flex flex-col gap-3">
//               {/* Drag and Drop Overlay for Floating Input */}
//               {isDragOver && (
//                 <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary/50 rounded-xl flex items-center justify-center z-50">
//                   <div className="text-center">
//                     <Paperclip className="w-8 h-8 text-primary mx-auto mb-2 animate-bounce" />
//                     <p className="text-sm font-medium text-primary">Drop files here to upload</p>
//                     <p className="text-xs text-muted-foreground/70">All file types supported</p>
//                   </div>
//                 </div>
//               )}

//               {/* Input Field */}
//               <div className="w-full">
//                 <Textarea
//                   value={inputMessage}
//                   onChange={(e) => setInputMessage(e.target.value)}
//                   placeholder={isChatLoading ? "Processing..." : "Ask anything (try 'golden moment' for a demo!)"}
//                   className="min-h-[40px] max-h-32 bg-transparent border-none focus:ring-0 focus:outline-none text-sm placeholder:text-muted-foreground/70 resize-none overflow-y-auto"
//                   disabled={isChatLoading}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter' && !e.shiftKey && !isChatLoading) {
//                       e.preventDefault();
//                       handleSendMessage();
//                     }
//                   }}
//                   onInput={(e) => {
//                     const target = e.target as HTMLTextAreaElement;
//                     target.style.height = 'auto';
//                     target.style.height = Math.min(target.scrollHeight, 128) + 'px';
//                   }}
//                 />
//               </div>

//               {/* Buttons Row */}
//               <div className="flex items-center justify-between">
//                 {/* Left side - Upload button and Tools dropdown */}
//                 <div className="flex gap-2 items-center">
//                   <FileUploadButton />
//                 </div>

//                 {/* Right side - Send button */}
//                 <div className="flex gap-3 items-center">
//                   <Button
//                     onClick={handleSendMessage}
//                     size="sm"
//                     className="h-8 w-8 p-0 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 rounded-full"
//                     disabled={(!inputMessage.trim() && attachments.length === 0) || isChatLoading}
//                   >
//                     {isChatLoading ? (
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     ) : (
//                       <Send className="w-4 h-4" />
//                     )}
//                   </Button>

//                   {/* Stop Streaming Button */}
//                   {isStreaming && (
//                     <div onClick={stopStreaming} className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer">
//                       <Square className="w-3 h-3 text-gray-700 fill-current" />
//                     </div>
//                   )}
//                 </div>
//                 <FileAttachmentsPreview />
//               </div>
//             </div>
//             <HiddenFileInput />
//           </div>
//         </div>
//       )}

//       {detailedViewData && (
//         <DetailedListView
//           isOpen={showDetailedView}
//           onClose={() => setShowDetailedView(false)}
//           title={detailedViewData.title}
//           data={detailedViewData.data}
//           columns={detailedViewData.columns}
//           onEmailAgent={handleEmailAgent}
//           onScheduleTouchpoint={handleScheduleTouchpoint}
//           onAssignFollowUp={handleAssignFollowUp}
//           onSyncToCRM={() => toast({ title: "Syncing to CRM", description: "Agent data is being synchronized" })}
//           onDownloadCSV={() => {
//             if (detailedViewData && detailedViewData.data) {
//               const csvContent = convertTableToCSV({
//                 title: detailedViewData.title,
//                 columns: detailedViewData.columns.map(col => col.label),
//                 rows: detailedViewData.data.map(item =>
//                   detailedViewData.columns.map(col => item[col.key])
//                 )
//               });

//               if (csvContent) {
//                 const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//                 const link = document.createElement('a');
//                 const url = URL.createObjectURL(blob);

//                 link.setAttribute('href', url);
//                 link.setAttribute('download', `${detailedViewData.title || 'detailed-data'}.csv`);
//                 link.style.visibility = 'hidden';

//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);

//                 URL.revokeObjectURL(url);

//                 toast({
//                   title: "Success",
//                   description: "CSV file downloaded successfully",
//                 });
//               } else {
//                 toast({
//                   title: "Error",
//                   description: "No data available to download",
//                   variant: "destructive",
//                 });
//               }
//             }
//           }}
//           allowDrillDown={detailedViewData.title.toLowerCase().includes('firm')}
//         />
//       )}
//     </div>
//   );
// };


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { markActionPromptsSeen } from '@/store/slices/authSlice';
import Cookies from 'js-cookie';
import { ChevronDown, Copy, Database, Download, Mail, Maximize2, Paperclip, Send, UserPlus, Zap, X, File, Image, FileText, FileVideo, FileAudio, Archive, Code, FileSpreadsheet, Presentation, Square, ThumbsUp, ThumbsDown } from 'lucide-react';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Markdown from 'react-markdown';
// @ts-ignore - remark-gfm doesn't have type definitions
import remarkGfm from 'remark-gfm';
// @ts-ignore - react-syntax-highlighter doesn't have type definitions
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore - react-syntax-highlighter doesn't have type definitions
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ActionPromptsSidebar } from './ActionPromptsSidebar';
import { ChartVisualization } from './ChartVisualization.jsx';
import { DetailedListView } from './DetailedListView.jsx';
import { EmailDrafting } from './EmailDrafting.jsx';
import { ErrorFallback } from './ErrorFallback.jsx';
import { GoldenMoment } from './GoldenMoment.jsx';
import GeneratedFilesDisplay from './GeneratedFilesDisplay.jsx';
import StatusDisplay from './StatusDisplay.jsx';
import StreamingHtmlRenderer from './StreamingHtmlRenderer';

import { getChatSession, updateChatSession } from '@/services/chatSessionsApi';
import { config } from '@/config/env';
import staticPromptAndResponse from '../../data/staticPromptAndResponse.json';

// const isProductionMode = true;

// Utility function to detect and format producer list responses
const formatProducerListResponse = (content: string): string => {
  // Check if this looks like a producer list response
  if (content.includes('TOP PRODUCERS FOR LARGE CASES') ||
    content.includes('Tier 1 - Highest Probability') ||
    content.includes('Producer 72') ||
    content.includes('Combined Score:')) {

    // Convert the text format to markdown table format
    const lines = content.split('\n');
    let formattedContent = '';
    let currentTier = '';
    let tableRows: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine.includes('TOP PRODUCERS FOR LARGE CASES')) {
        formattedContent += `## ${trimmedLine}\n\n`;
      } else if (trimmedLine.includes('Tier 1 - Highest Probability')) {
        currentTier = 'Tier 1 - Highest Probability (80+ Combined Score)';
        formattedContent += `### ${currentTier}\n\n`;
        formattedContent += `| Rank | Producer | Combined Score | Life Score | Annuity Score | YTD Performance |\n`;
        formattedContent += `|------|----------|----------------|------------|---------------|-----------------|\n`;
      } else if (trimmedLine.includes('Tier 2 - High Probability')) {
        currentTier = 'Tier 2 - High Probability (75-80 Combined Score)';
        formattedContent += `### ${currentTier}\n\n`;
        formattedContent += `| Rank | Producer | Primary Focus | Notes |\n`;
        formattedContent += `|------|----------|---------------|-------|\n`;
      } else if (trimmedLine.includes('Tier 3 - Good Probability')) {
        currentTier = 'Tier 3 - Good Probability (70-75 Combined Score)';
        formattedContent += `### ${currentTier}\n\n`;
        formattedContent += `| Rank | Producer | Focus Area | Notes |\n`;
        formattedContent += `|------|----------|------------|-------|\n`;
      } else if (trimmedLine.match(/^\d+\.\s+Producer\s+\d+/)) {
        // Parse producer entries
        const match = trimmedLine.match(/^(\d+)\.\s+Producer\s+(\d+)(?:\s*-\s*(.+))?/);
        if (match) {
          const rank = match[1];
          const producerId = match[2];
          const details = match[3] || '';

          if (currentTier.includes('Tier 1')) {
            // Parse Tier 1 format: "Producer 72 - Combined Score: 82.5 (Life: 84, Annuity: 81) - YTD: $1,235,452"
            const scoreMatch = details.match(/Combined Score:\s*([\d.]+)\s*\(Life:\s*(\d+),\s*Annuity:\s*(\d+)\)\s*-\s*(.+)/);
            if (scoreMatch) {
              const combinedScore = scoreMatch[1];
              const lifeScore = scoreMatch[2];
              const annuityScore = scoreMatch[3];
              const ytd = scoreMatch[4];
              formattedContent += `| ${rank} | Producer ${producerId} | ${combinedScore} | ${lifeScore} | ${annuityScore} | ${ytd} |\n`;
            } else {
              formattedContent += `| ${rank} | Producer ${producerId} | - | - | - | ${details} |\n`;
            }
          } else {
            // Parse Tier 2/3 format: "Producer 45 - Primary Focus: Life Insurance"
            const focusMatch = details.match(/Primary Focus:\s*(.+)/);
            if (focusMatch) {
              formattedContent += `| ${rank} | Producer ${producerId} | ${focusMatch[1]} | - |\n`;
            } else {
              formattedContent += `| ${rank} | Producer ${producerId} | - | ${details} |\n`;
            }
          }
        }
      } else if (trimmedLine.includes('Key Insights:')) {
        formattedContent += `\n### Key Insights\n\n`;
      } else if (trimmedLine.includes('Recommended Action:')) {
        formattedContent += `\n### Recommended Action\n\n`;
      } else if (trimmedLine.startsWith('- ') && (content.includes('Key Insights') || content.includes('Recommended Action'))) {
        formattedContent += `- ${trimmedLine.substring(2)}\n`;
      } else if (trimmedLine && !trimmedLine.includes('Tier') && !trimmedLine.match(/^\d+\.\s+Producer/)) {
        // Add other content as regular text
        if (!trimmedLine.includes('TOP PRODUCERS') && !trimmedLine.includes('Key Insights') && !trimmedLine.includes('Recommended Action')) {
          formattedContent += `${trimmedLine}\n`;
        }
      }
    }

    return formattedContent;
  }

  return content;
};

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  contentBlocks?: ContentBlock[];
  isTyping?: boolean;
  isStreaming?: boolean;
  attachments?: FileAttachment[];
  originalCommand?: string;
}

interface ContentBlock {
  type: 'table' | 'email' | 'chart' | 'error' | 'tool_result' | 'thinking' | 'response' | 'files';
  data: any;
}

interface FileAttachment {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'document' | 'video' | 'audio' | 'archive' | 'code' | 'spreadsheet' | 'presentation' | 'other';
  size: string;
}

export const ChatInterface = ({ sessionId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [detailedViewData, setDetailedViewData] = useState<any>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isActionPromptsSidebarOpen, setIsActionPromptsSidebarOpen] = useState(false);
  const [isProductionMode, setIsProductionMode] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingControllerRef, setStreamingControllerRef] = useState<AbortController | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [markdownKey, setMarkdownKey] = useState(0);



  const mapStatusToDisplayText = (statusContent: string): string => {
    const content = statusContent.toLowerCase();

    // Progressive status messages based on API response content
    if (content.includes('starting agent')) {
      return 'Got it! We\'re reviewing your request…';
    }
    if (content.includes('agent is preparing to process your request')) {
      return 'Analyzing the details…';
    }
    if (content.includes('agent is analyzing your request')) {
      return 'Connecting the dots, this may take a few moments.';
    }
    if (content.includes('agent has completed analysis')) {
      return 'Finding the most relevant information for you.';
    }
    if (content.includes('agent is using') || content.includes('tool execution')) {
      return 'Running deep analysis, hang tight.';
    }
    if (content.includes('agent is planning next moves') || content.includes('agent is refining approach')) {
      return 'Synthesizing insights…';
    }
    if (content.includes('agent execution completed') || content.includes('preparing response')) {
      return 'Almost there, finalizing your results.';
    }
    if (content.includes('agent completed request')) {
      return 'Polishing your response so it\'s easy to read.';
    }
    if (content.includes('agent still working')) {
      return 'Almost there, finalizing your results.';
    }

    // Default fallback
    return 'Got it! We\'re reviewing your request…';
  };

  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isNewSession, setIsNewSession] = useState(false);
  const [firstUserMessage, setFirstUserMessage] = useState<string>('');
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(sessionId);

  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showGoldenMoment, setShowGoldenMoment] = useState(false);
  const [streamingMarkdown, setStreamingMarkdown] = useState<Map<string, string>>(new Map());
  const [messageFeedback, setMessageFeedback] = useState<Map<string, 'thumbsUp' | 'thumbsDown' | null>>(new Map());
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const hasSeenActionPrompts = useAppSelector((state: any) => state.auth.hasSeenActionPrompts);
  const { user } = useAppSelector((state: any) => state.auth);

  const getFileType = (file: File): FileAttachment['type'] => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type;

    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('text/')) return 'document';
    if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('powerpoint')) return 'document';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet') || mimeType.includes('csv')) return 'spreadsheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'archive';
    if (mimeType.includes('json') || mimeType.includes('xml') || mimeType.includes('yaml') ||
      extension === 'js' || extension === 'ts' || extension === 'py' || extension === 'java' ||
      extension === 'cpp' || extension === 'c' || extension === 'html' || extension === 'css') return 'code';

    return 'other';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const fileType = getFileType(file);
    const isImage = fileType === 'image';
    const maxSize = isImage ? 10 * 1024 * 1024 : 50 * 1024 * 1024;

    if (file.size > maxSize) {
      const sizeLimit = isImage ? '10MB' : '50MB';
      return { isValid: false, error: `File size exceeds ${sizeLimit} limit (${formatFileSize(file.size)})` };
    }

    return { isValid: true };
  };

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newAttachments: FileAttachment[] = [];
    const maxFiles = 10;

    if (files.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `Please select no more than ${maxFiles} files at once`,
        variant: "destructive"
      });
      return;
    }

    Array.from(files).forEach(file => {
      const validation = validateFile(file);
      if (!validation.isValid) {
        toast({
          title: "File Upload Error",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }

      const attachment: FileAttachment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        type: getFileType(file),
        size: formatFileSize(file.size)
      };

      if (attachment.type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachments(prev => prev.map(att =>
            att.id === attachment.id
              ? { ...att, preview: e.target?.result as string }
              : att
          ));
        };
        reader.readAsDataURL(file);
      }

      newAttachments.push(attachment);
    });

    if (newAttachments.length > 0) {
      setAttachments(prev => [...prev, ...newAttachments]);
      toast({
        title: "Files Added",
        description: `${newAttachments.length} file(s) added successfully. You can now send them with your message.`
      });
    }
  }, [toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  // Memoized Markdown component for better performance
  const MemoizedMarkdown = useMemo(() => {
    return React.memo(({ content, messageId, keyValue }: { content: string; messageId: string; keyValue: number }) => {
      console.log('MemoizedMarkdown rendering:', { messageId, keyValue, contentLength: content.length });
      return (
        <Markdown
          key={`${messageId}-${keyValue}-${content.length}`}
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              const isInline = !className?.includes('language-');

              if (!isInline && language) {
                return (
                  <div className="relative">
                    <div className="flex items-center justify-between bg-muted px-3 py-2 text-xs text-muted-foreground border-b border-border">
                      <span className="font-medium">{language.toUpperCase()}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs hover:bg-background/50"
                        onClick={() => {
                          navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                          toast({
                            title: "Copied!",
                            description: "Code copied to clipboard",
                            duration: 2000,
                          });
                        }}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <SyntaxHighlighter
                      style={oneDark as any}
                      language={language}
                      PreTag="div"
                      className="!mt-0 !rounded-b-lg"
                      customStyle={{
                        margin: 0,
                        borderRadius: '0 0 0.5rem 0.5rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                );
              }

              return (
                <code className={`${className} bg-muted px-1.5 py-0.5 rounded text-xs font-mono`} {...props}>
                  {children}
                </code>
              );
            },
            table({ children, ...props }: any) {
              return (
                <div className="my-4 overflow-x-auto">
                  <table className="w-full border-collapse border border-border rounded-lg" {...props}>
                    {children}
                  </table>
                </div>
              );
            },
            thead({ children, ...props }: any) {
              return (
                <thead className="bg-muted/50" {...props}>
                  {children}
                </thead>
              );
            },
            tbody({ children, ...props }: any) {
              return (
                <tbody {...props}>
                  {children}
                </tbody>
              );
            },
            tr({ children, ...props }: any) {
              return (
                <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors" {...props}>
                  {children}
                </tr>
              );
            },
            th({ children, ...props }: any) {
              return (
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground border-r border-border/50 last:border-r-0" {...props}>
                  {children}
                </th>
              );
            },
            td({ children, ...props }: any) {
              return (
                <td className="py-3 px-4 text-sm text-foreground border-r border-border/30 last:border-r-0" {...props}>
                  {children}
                </td>
              );
            },
          }}
        >
          {content}
        </Markdown>
      );
    });
  }, [markdownKey, toast]);

  const getFileIcon = (type: FileAttachment['type']) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'video': return <FileVideo className="w-4 h-4" />;
      case 'audio': return <FileAudio className="w-4 h-4" />;
      case 'archive': return <Archive className="w-4 h-4" />;
      case 'code': return <Code className="w-4 h-4" />;
      case 'spreadsheet': return <FileSpreadsheet className="w-4 h-4" />;
      case 'presentation': return <Presentation className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const FileUploadButton = ({ className = "" }: { className?: string }) => (
    <Button
      variant="outline"
      size="sm"
      className={`h-8 px-2 shrink-0 rounded-full border border-border transition-all duration-300 ease-out hover:px-3 group overflow-hidden gap-0 hover:gap-2 ${className} ${attachments.length > 0 ? 'bg-primary/10 border-primary/30' : ''}`}
      onClick={() => fileInputRef.current?.click()}
      title="Upload files (drag & drop also supported)"
    >
      <Paperclip className={`w-4 h-4 shrink-0 ${attachments.length > 0 ? 'text-primary' : ''}`} />
      <span className="text-xs whitespace-nowrap opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all duration-300 ease-out overflow-hidden">
        {attachments.length > 0 ? `${attachments.length} file(s)` : 'Upload file'}
      </span>
    </Button>
  );

  const HiddenFileInput = () => (
    <input
      ref={fileInputRef}
      type="file"
      multiple
      accept="*/*"
      onChange={(e) => handleFileSelect(e.target.files)}
      className="hidden"
    />
  );

  const FileAttachmentsPreview = () => {
    if (attachments.length === 0) return null;

    return (
      <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            Attachments ({attachments.length})
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setAttachments([])}
          >
            Clear all
          </Button>
        </div>
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-2 p-2 bg-background/50 rounded border border-border/30 hover:bg-background/70 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {attachment.preview ? (
                  <img
                    src={attachment.preview}
                    alt={attachment.file.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                    {getFileIcon(attachment.type)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{attachment.file.name}</p>
                  <p className="text-xs text-muted-foreground">{attachment.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary"
                  onClick={() => {
                    // Preview file in new tab
                    const url = URL.createObjectURL(attachment.file);
                    window.open(url, '_blank');
                  }}
                  title="Preview file"
                >
                  <File className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => removeAttachment(attachment.id)}
                  title="Remove file"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Files will be sent with your message. Click send to upload and share.
          <br />
          <span className="text-xs text-muted-foreground/70">
            Max file size: 10MB (images) / 50MB (others) • Max files: 10
          </span>
        </div>
      </div>
    );
  };

  React.useEffect(() => {
    const handler = () => {
      setMessages([]);
      setInputMessage('');
      setShowDetailedView(false);
      setDetailedViewData(null);
      setActiveSessionId(undefined);
      setIsNewSession(false);
    };

    const stopStreamingHandler = () => {
      stopStreaming();
    };

    window.addEventListener('start-new-chat', handler as EventListener);
    window.addEventListener('stop-streaming', stopStreamingHandler as EventListener);
    return () => {
      window.removeEventListener('start-new-chat', handler as EventListener);
      window.removeEventListener('stop-streaming', stopStreamingHandler as EventListener);
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('start-new-chat') === '1') {
      setMessages([]);
      setInputMessage('');
      setShowDetailedView(false);
      setDetailedViewData(null);
      setActiveSessionId(undefined);
      setIsNewSession(false);
      sessionStorage.removeItem('start-new-chat');
    }
  }, []);

  React.useEffect(() => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      if (textarea.value) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
      } else {
        textarea.style.height = 'auto';
      }
    });
  }, [inputMessage]);

  React.useEffect(() => {
    setMarkdownKey(prev => prev + 1);
  }, [messages]);

  React.useEffect(() => {
    const openHandler = () => {
      setMessages([]);
      setInputMessage('');
      setShowDetailedView(false);
      setDetailedViewData(null);
      setActiveSessionId(undefined);
      setTimeout(() => scrollToBottom(), 0);
    };
    window.addEventListener('open-sample-chat', openHandler as EventListener);
    return () => {
      window.removeEventListener('open-sample-chat', openHandler as EventListener);
    };
  }, []);

  React.useEffect(() => {
    setActiveSessionId(sessionId);
  }, [sessionId]);

  React.useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isAtTopNow = scrollTop <= 50;
      const isAtBottomNow = scrollTop + clientHeight >= scrollHeight - 50;

      setIsAtTop(isAtTopNow);
      setIsAtBottom(isAtBottomNow);
      const hasScrollableContent = scrollHeight > clientHeight;
      setShowScrollButtons(hasScrollableContent && (!isAtTopNow || !isAtBottomNow));
    };

    chatContainer.addEventListener('scroll', handleScroll);
    handleScroll();

    const handleResize = () => handleScroll();
    window.addEventListener('resize', handleResize);

    return () => {
      chatContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [messages]);

  React.useEffect(() => {
    if (isAuthenticated && !hasSeenActionPrompts) {
      setIsActionPromptsSidebarOpen(true);
      dispatch(markActionPromptsSeen());
    }
  }, [isAuthenticated, hasSeenActionPrompts, dispatch]);

  const scrollToTop = () => {
    chatContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  const stopStreaming = () => {
    if (streamingControllerRef) {
      streamingControllerRef.abort();
      setStreamingControllerRef(null);
    }
    setIsStreaming(false);
    setIsChatLoading(false);
    setCurrentStatus(null);
    setMessages(prev => prev.map(msg =>
      msg.isTyping
        ? {
          ...msg,
          isTyping: false,
          isStreaming: false,
          content: msg.content || 'Response stopped by user. You can continue the conversation or ask a new question.'
        }
        : msg
    ));
  };

  const handleRetryMessage = (originalCommand: string) => {
    setInputMessage(originalCommand);

    handleExecuteCommand(originalCommand);

    toast({
      title: "Retrying Request",
      description: "Re-executing the same request...",
      duration: 2000,
    });
  };

  const handleFeedback = (messageId: string, feedbackType: 'thumbsUp' | 'thumbsDown') => {
    setMessageFeedback(prev => {
      const newMap = new Map(prev);
      const currentFeedback = newMap.get(messageId);

      // If clicking the same feedback, remove it (toggle off)
      if (currentFeedback === feedbackType) {
        newMap.set(messageId, null);
      } else {
        // Otherwise, set the new feedback
        newMap.set(messageId, feedbackType);
      }

      return newMap;
    });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() && attachments.length === 0) return;

    const isNewSessionNow = !activeSessionId;

    if (isNewSessionNow) {
      setIsNewSession(true);
      const firstMessage = inputMessage.trim() || (attachments.length > 0 ? `Uploaded ${attachments.length} file(s)` : '');
      setFirstUserMessage(firstMessage);
      const tempSessionId = `temp-${Date.now()}`;
      const newTitle = generateTitleFromMessage(firstMessage);

      const tempSession = {
        session_id: tempSessionId,
        title: newTitle,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        message_count: 1,
        user_id: user?.id || '',
        status: 'active',
        memory_state: {
          activities_count: 0,
          email_drafts_count: 0,
          profiles_count: 0
        },
        uploaded_files_count: attachments.length,
        active: true,
        isTemporary: true
      };

      window.dispatchEvent(new CustomEvent('new-session-created', { detail: tempSession }));

      sessionStorage.setItem('current-session', JSON.stringify(tempSession));
    }

    const messageContent = inputMessage.trim() || (attachments.length > 0 ? `Uploaded ${attachments.length} file(s)` : '');

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };

    setMessages(prev => [...prev, newMessage]);
    const commandToSend = inputMessage.trim() || (attachments.length > 0 ? `Please analyze these ${attachments.length} file(s)` : '');
    handleExecuteCommand(commandToSend, attachments.length > 0 ? attachments : undefined, true);

    setAttachments([]);
  };

  const generateTitleFromMessage = (message: string): string => {
    let title = message.trim();

    title = title.replace(/^(show|analyze|find|get|list|create|generate|help me with|can you|please)\s+/i, '');

    title = title.charAt(0).toUpperCase() + title.slice(1);

    if (title.length > 50) {
      title = title.substring(0, 47) + '...';
    }

    if (title.length < 3) {
      title = 'New Chat';
    }

    return title;
  };
  const cleanStreamingContent = (content: string): string => {
    let cleaned = content;

    cleaned = cleaned.replace(/<tool_call>([\s\S]*?)<\/tool_call>/g, (match, codeContent) => {
      let cleanCode = codeContent
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .trim();

      return `\n\n\`\`\`python\n${cleanCode}\n\`\`\`\n\n`;
    });

    cleaned = cleaned.replace(/<tool_start>[\s\S]*?<\/tool_start>/g, '');
    cleaned = cleaned.replace(/<tool_result>[\s\S]*?<\/tool_result>/g, '');

    cleaned = cleaned.replace(/data:\s*\{[^}]*\}/g, '');
    cleaned = cleaned.replace(/\\n/g, '\n');
    cleaned = cleaned.replace(/\\"/g, '"');
    cleaned = cleaned.replace(/\\\\/g, '\\');

    // Apply producer list formatting first as it detects specific patterns
    cleaned = formatProducerListResponse(cleaned);
    cleaned = formatStructuredContent(cleaned);

    // cleaned = cleaned.replace(/\s+/g, ' ');
    // cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');
    cleaned = cleaned.trim();

    return cleaned;
  };

  const formatStructuredContent = (content: string): string => {
    let formatted = content;

    formatted = formatted.replace(/(HIGH|MEDIUM|LOW)\s+([A-Z\s]+)\s+\([^)]+\)/g, '## $1 $2');

    formatted = formatted.replace(/KEY INSIGHTS:/g, '## Key Insights');

    formatted = formatted.replace(/-\s*Producer\s+(\d+):\s*([^-]+?)\s*-\s*Score\s+(\d+)/g,
      '- **Producer $1**: $2 - **Score**: $3');

    formatted = formatted.replace(/-\s*Producer\s+(\d+):\s*([^-]+?)\s*-\s*Score\s+(\d+)\s*$/gm,
      '- **Producer $1**: $2 - **Score**: $3');

    formatted = formatted.replace(/-\s*Producer\s+(\d+):\s*([^-\n]+?)\s*-\s*Score\s+(\d+)\s*$/gm,
      '- **Producer $1**: $2 - **Score**: $3');

    formatted = formatted.replace(/^-\s*([A-Z][^:]+):\s*/gm, '- **$1**: ');

    formatted = formatted.replace(/^(\d+)\.\s*/gm, '$1. ');

    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '**$1**');

    formatted = formatted.replace(/\b(Score|Producer|YTD)\s+(\d+)/g, '**$1**: $2');

    formatted = formatted.replace(/\$([0-9,]+)/g, '**$$$1**');

    formatted = formatted.replace(/(\d+%|percent)/g, '**$1**');

    formatted = formatted.replace(/(\d+)\s+producers?\s+are\s+currently\s+([^-]+?)\s+and\s+could\s+expand\s+into\s+([^.]+)/g,
      '- **$1 producers** are currently **$2** and could expand into **$3**');

    formatted = formatted.replace(/ML\s+cross-sell\s+propensity\s+scores\s+range\s+from\s+(\d+)-(\d+)/g,
      'ML cross-sell propensity scores range from **$1-$2**');

    formatted = formatted.replace(/These\s+(\d+)\s+producers\s+represent\s+([^.]+)/g,
      'These **$1 producers** represent $2');

    formatted = formatted.replace(/SALES ORGANIZATION PERFORMANCE REPORT/g, '## Sales Organization Performance Report');
    formatted = formatted.replace(/SUMMARY TOTALS:/g, '### Summary Totals');
    formatted = formatted.replace(/DETAILED REGIONAL ANALYSIS:/g, '### Detailed Regional Analysis');
    formatted = formatted.replace(/PERFORMANCE RANKINGS:/g, '### Performance Rankings');

    formatted = formatted.replace(/print\('([^']+)'\)/g, '```\nprint(\'$1\')\n```');

    // Remove header formatting - let StreamingHtmlRenderer handle it
    // formatted = formatted.replace(/(##[^\n]+)/g, '\n\n$1\n');
    // formatted = formatted.replace(/(###[^\n]+)/g, '\n\n$1\n');

    formatted = formatted.replace(/\n{3,}/g, '\n\n');

    return formatted;
  };

  const handleStreamingRecovery = async (
    command: string,
    aiMessageId: string,
    retryCount: number = 0
  ): Promise<void> => {
    const maxRetries = 3;

    if (retryCount >= maxRetries) {
      setMessages(prev => prev.map(msg =>
        msg.id === aiMessageId
          ? {
            ...msg,
            content: 'Connection failed after multiple retry attempts. Please try again.',
            isTyping: false,
            isStreaming: false
          }
          : msg
      ));
      return;
    }

    try {
      setMessages(prev => prev.map(msg =>
        msg.id === aiMessageId
          ? {
            ...msg,
            content: `Connection interrupted. Retrying... (${retryCount + 1}/${maxRetries})`,
            isTyping: false,
            isStreaming: true
          }
          : msg
      ));

      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));

      await handleExecuteCommand(command);
    } catch (error) {
      console.error(`Recovery attempt ${retryCount + 1} failed:`, error);

      await handleStreamingRecovery(command, aiMessageId, retryCount + 1);
    }
  };

  const parseToolResult = (content: string): ContentBlock | null => {
    try {
      if (content.includes('|') && content.includes('\n')) {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length >= 2) {
          const hasHeaders = lines[0].includes('|');
          const hasSeparator = lines[1].includes('---');

          if (hasHeaders && hasSeparator) {
            const headers = lines[0].split('|').filter(cell => cell.trim()).map(cell => cell.trim());
            const rows = lines.slice(2).map(line =>
              line.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
            );

            return {
              type: 'table',
              data: {
                title: 'Tool Result Data',
                columns: headers,
                rows: rows,
                detailedData: rows.map((row, index) => {
                  const obj: any = { id: (index + 1).toString() };
                  headers.forEach((header, colIndex) => {
                    obj[header] = row[colIndex] || '';
                  });
                  return obj;
                })
              }
            };
          }
        }
      }

      if (content.includes('\n') && content.includes(':')) {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length >= 3) {
          const hasStructuredData = lines.some(line => line.includes(':') && line.split(':').length >= 2);
          if (hasStructuredData) {
            const dataRows = lines.map(line => {
              const parts = line.split(':').map(part => part.trim());
              if (parts.length >= 2) {
                return [parts[0], parts.slice(1).join(':')];
              }
              return [line, ''];
            });

            const columns = [...new Set(dataRows.map(row => row[0]))];
            const rows = dataRows.map(row => [row[0], row[1]]);



          }
        }
      }

      if (content.includes('**') && content.includes('\n')) {
        const lines = content.split('\n').filter(line => line.trim());
        const boldLines = lines.filter(line => line.includes('**'));

        if (boldLines.length >= 2) {
          const headers = boldLines.map(line => {
            const match = line.match(/\*\*(.*?)\*\*/);
            return match ? match[1].trim() : line.trim();
          });

          const dataLines = lines.filter(line => !line.includes('**') && line.trim() && line.includes(':'));
          if (dataLines.length > 0) {
            const rows = dataLines.map(line => {
              const parts = line.split(':').map(part => part.trim());
              if (parts.length >= 2) {
                return [parts[0], parts.slice(1).join(':')];
              }
              return [line, ''];
            });


          }
        }
      }


      if (content.includes('chart') || content.includes('graph') || content.includes('visualization') ||
        content.includes('performance') || content.includes('trend') || content.includes('analysis')) {
        return {
          type: 'chart',
          data: {
            title: 'Data Analysis & Visualization',
            imageUrl: '/placeholder-chart.png',
            description: content
          }
        };
      }


      if (content.includes('📊') || content.includes('📈') || content.includes('📉') ||
        content.includes('Key Findings') || content.includes('Summary') || content.includes('Statistics')) {
        return {
          type: 'chart',
          data: {
            title: 'Data Summary & Insights',
            imageUrl: '/placeholder-chart.png',
            description: content
          }
        };
      }

      if (content.includes('image') || content.includes('photo') || content.includes('picture') ||
        content.includes('screenshot') || content.includes('diagram') || content.includes('illustration')) {
        return {
          type: 'chart',
          data: {
            title: 'Visual Content',
            imageUrl: '/placeholder.svg',
            description: content
          }
        };
      }

      if (content.includes('🖼️') || content.includes('📷') || content.includes('🎨') ||
        content.includes('Visual') || content.includes('Diagram') || content.includes('Layout')) {
        return {
          type: 'chart',
          data: {
            title: 'Visual Representation',
            imageUrl: '/placeholder.svg',
            description: content
          }
        };
      }

      return {
        type: 'response',
        data: { content }
      };
    } catch (error) {
      console.warn('Failed to parse tool result:', error);
      return null;
    }
  };

  const simulateStaticResponse = async (responseString: string, command: string, skipUserMessage: boolean, currentSessionId?: string, attachments?: FileAttachment[]) => {
    setIsChatLoading(true);
    setIsStreaming(true);

    const abortController = new AbortController();
    setStreamingControllerRef(abortController);

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: command,
      timestamp: new Date(),
      attachments: attachments && attachments.length > 0 ? [...attachments] : undefined
    };

    const typingId = (Date.now() + 0.5).toString();
    const aiMessageId = (Date.now() + 1).toString();

    const messagesToAdd = skipUserMessage
      ? [{
        id: typingId,
        type: 'ai' as const,
        content: '',
        timestamp: new Date(),
        isTyping: true,
      }]
      : [
        newMessage,
        {
          id: typingId,
          type: 'ai' as const,
          content: '',
          timestamp: new Date(),
          isTyping: true,
        },
      ];

    setMessages(prev => [...prev, ...messagesToAdd]);
    setInputMessage('');

    setTimeout(() => {
      scrollToBottom();
    }, 0);

    const lines = responseString.split('\n\n');
    let buffer = '';
    let currentContent = '';
    let contentBlocks: ContentBlock[] = [];
    let receivedSessionId = currentSessionId || null;

    for (const line of lines) {
      if (abortController.signal.aborted) {
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 50));

      if (line.trim() && line.startsWith('data: ')) {
        try {
          const eventData = JSON.parse(line.slice(6));

          if (eventData.type === 'start' && eventData.session_id) {
            receivedSessionId = eventData.session_id;

            const sessionBlock: ContentBlock = {
              type: 'response',
              data: { session_id: receivedSessionId }
            };

            if (!contentBlocks.some(block => block.type === 'response' && block.data.session_id)) {
              contentBlocks = [...contentBlocks, sessionBlock];
            }
          }

          if (eventData.type === 'status') {
            setCurrentStatus(mapStatusToDisplayText(eventData.content));
          } else if (eventData.type === 'response') {
            currentContent += eventData.content;
            setCurrentStatus(null);
          } else if (eventData.type === 'files') {
            const filesBlock: ContentBlock = {
              type: 'files',
              data: {
                files: eventData.content.files,
                count: eventData.content.file_count
              }
            };
            contentBlocks = [...contentBlocks, filesBlock];
          } else if (eventData.type === 'complete') {
            setIsChatLoading(false);
            setIsStreaming(false);
            setCurrentStatus(null);
            if (eventData.session_id) {
              receivedSessionId = eventData.session_id;
            }
          }

          setMessages(prev => prev.map(msg => {
            if (msg.id === typingId) {
              return {
                id: aiMessageId,
                type: 'ai',
                content: cleanStreamingContent(currentContent),
                timestamp: new Date(),
                contentBlocks: contentBlocks,
                isTyping: false,
                isStreaming: true,
                originalCommand: command
              };
            }
            if (msg.id === aiMessageId) {
              return {
                ...msg,
                content: cleanStreamingContent(currentContent),
                contentBlocks: contentBlocks,
                isTyping: false,
                isStreaming: true
              };
            }
            return msg;
          }));

          setTimeout(() => {
            scrollToBottom();
          }, 0);

        } catch (e) {
          console.warn('Error parsing static line:', line, e);
        }
      }
    }
    setIsStreaming(false);
    setIsChatLoading(false);
    setCurrentStatus(null);

    setMessages(prev => prev.map(msg =>
      msg.id === aiMessageId
        ? { ...msg, isStreaming: false }
        : msg
    ));
  };


  const handleExecuteCommand = async (command: string, attachments?: FileAttachment[], skipUserMessage: boolean = false) => {
    if (!isProductionMode && !command.toLowerCase().trim().startsWith('golden moment')) {
      let matchedResponse = null;

      for (const section of staticPromptAndResponse) {
        for (const prompt of section.prompts) {
          const promptLabel = prompt.label.toLowerCase();
          const promptDesc = prompt.description.toLowerCase();
          const cmd = command.toLowerCase();

          if (cmd.includes(promptLabel) || promptLabel.includes(cmd) ||
            cmd.includes(promptDesc) || promptDesc.includes(cmd)) {
            matchedResponse = prompt.response;
            break;
          }
        }
        if (matchedResponse) break;
      }

      if (matchedResponse) {
        simulateStaticResponse(matchedResponse, command, skipUserMessage, activeSessionId, attachments);
        return;
      } else {
        // Optional: you could return here if you want to enforce NO API calls in dev mode
        // But for now, if no match, maybe falling back to API or just doing nothing is safer?
        // Let's assume we fall back to API if no static match found, or we could force a default.
        // For this task, "api call...aem j rakhavano che" implies keep API logic if prod is true.
        // If prod is false, "static response show karvano che". 
        // If no match found, I will let it fall through to API or maybe log/warn. 
        // Let's fallback to API for unmatched commands to be safe, or maybe the user WANTS strict static.
        // User said: "isProductionMode = false hoy tyare ... static response show karvano che"
        // I'll stick to: match -> static. no match -> API (default behavior).
      }
    }

    if (command.toLowerCase().trim() === 'golden moment') {
      setShowGoldenMoment(true);

      const demoResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "🎉 Congrats, Taylor! Sales ninja mode activated — 45 activities completed and crushing goals.!",
        timestamp: new Date(),
      };

      // Only add user message if not skipping (when called from handleSendMessage)
      if (!skipUserMessage) {
        const newMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: command,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage, demoResponse]);
      } else {
        setMessages(prev => [...prev, demoResponse]);
      }

      setInputMessage('');
      setTimeout(() => {
        scrollToBottom();
      }, 0);
      return;
    }

    // Development mode restriction
    if (config.isDevelopment && command.toLowerCase().trim() !== 'power prompt') {
      const devResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "⚠️ Development Mode is active.\nSwitch to Production Mode for real-time operations...",
        timestamp: new Date(),
      };

      if (!skipUserMessage) {
        const newMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: command,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage, devResponse]);
      } else {
        setMessages(prev => [...prev, devResponse]);
      }

      setInputMessage('');
      setTimeout(() => {
        scrollToBottom();
      }, 0);
      return;
    }

    if (isStreaming) {
      console.warn('Already streaming, ignoring new request');
      return;
    }

    setIsChatLoading(true);
    setIsStreaming(true);

    const abortController = new AbortController();
    setStreamingControllerRef(abortController);

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: command,
      timestamp: new Date(),
    };

    const typingId = (Date.now() + 0.5).toString();
    const aiMessageId = (Date.now() + 1).toString();

    const messagesToAdd = skipUserMessage
      ? [{
        id: typingId,
        type: 'ai' as const,
        content: '',
        timestamp: new Date(),
        isTyping: true,
      }]
      : [
        newMessage,
        {
          id: typingId,
          type: 'ai' as const,
          content: '',
          timestamp: new Date(),
          isTyping: true,
        },
      ];

    setMessages(prev => [...prev, ...messagesToAdd]);
    setInputMessage('');

    setTimeout(() => {
      scrollToBottom();
    }, 0);

    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
    let isReaderReleased = false;
    let retryCount = 0;
    const maxRetries = 3;

    const cleanupReader = () => {
      if (reader && !isReaderReleased) {
        try {
          reader.releaseLock();
          isReaderReleased = true;
        } catch (releaseError) {
          console.warn('Reader already released or in invalid state:', releaseError);
        }
      }
    };

    const attemptStreaming = async (): Promise<void> => {
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          throw new Error('No access token found');
        }

        let currentSessionId = sessionId || activeSessionId;

        if (!currentSessionId) {
          const previousAiMessages = messages.filter(msg => msg.type === 'ai');
          for (const msg of previousAiMessages) {
            if (msg.contentBlocks) {
              for (const block of msg.contentBlocks) {
                if (block.type === 'response' && block.data.session_id) {
                  currentSessionId = block.data.session_id;
                  break;
                }
              }
            }

            if (!currentSessionId && msg.content) {
              const sessionMatch = msg.content.match(/"session_id":\s*"([^"]+)"/);
              if (sessionMatch) {
                currentSessionId = sessionMatch[1];
                break;
              }
            }
          }
        }

        let response: Response;

        if (attachments && attachments.length > 0) {
          const formData = new FormData();
          formData.append('message', command);
          formData.append('stream', 'false');
          if (currentSessionId) {
            formData.append('session_id', currentSessionId);
          }

          attachments.forEach((attachment, index) => {
            formData.append(`file${index}`, attachment.file);
          });

          response = await fetch(`${config.isDevelopment ? config.api.devProxyUrl : config.api.baseUrl}/agent/chat`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
            signal: abortController.signal,
          });
        } else {
          response = await fetch(`${config.isDevelopment ? config.api.devProxyUrl : config.api.baseUrl}/agent/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              message: command,
              stream: false,
              ...(currentSessionId && { session_id: currentSessionId }),
            }),
            signal: abortController.signal,
          });
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error('No response body');
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('text/event-stream')) {
          console.warn('Response is not streaming, falling back to regular response');
          const text = await response.text();
          setMessages(prev => prev.map(msg =>
            msg.id === aiMessageId
              ? { ...msg, content: text, isTyping: false, isStreaming: false }
              : msg
          ));
          return;
        }

        setMessages(prev => [
          ...prev.filter(m => m.id !== typingId),
          {
            id: aiMessageId,
            type: 'ai',
            content: 'Processing your request...',
            timestamp: new Date(),
            contentBlocks: [],
            isTyping: true,
            isStreaming: true,
            originalCommand: command
          },
        ]);

        reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let currentContent = '';
        let contentBlocks: ContentBlock[] = [];
        let isFirstResponse = true;
        let lastActivityTime = Date.now();
        let receivedSessionId: string | null = null;

        const heartbeatInterval = setInterval(() => {
          const timeSinceLastActivity = Date.now() - lastActivityTime;
          if (timeSinceLastActivity > 30000) {
            console.warn('Stream heartbeat timeout, attempting recovery');
            clearInterval(heartbeatInterval);
            throw new Error('Stream connection timeout');
          }
        }, 10000);

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            lastActivityTime = Date.now();
            const chunk = decoder.decode(value, { stream: false });
            buffer += chunk;

            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.trim() && line.startsWith('data: ')) {
                try {
                  const eventData = JSON.parse(line.slice(6));

                  if (eventData.type === 'start' && eventData.session_id) {
                    receivedSessionId = eventData.session_id;

                    const sessionBlock: ContentBlock = {
                      type: 'response',
                      data: { session_id: receivedSessionId }
                    };

                    if (!contentBlocks.some(block => block.type === 'response' && block.data.session_id)) {
                      contentBlocks = [...contentBlocks, sessionBlock];
                    }
                  }

                  if (eventData.session_id && isNewSession && firstUserMessage) {
                    const newTitle = generateTitleFromMessage(firstUserMessage);

                    const newSession = {
                      session_id: eventData.session_id,
                      title: newTitle,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      message_count: 1,
                      user_id: user?.id || '',
                      status: 'active',
                      memory_state: {
                        activities_count: 0,
                        email_drafts_count: 0,
                        profiles_count: 0
                      },
                      uploaded_files_count: 0,
                      active: true
                    };

                    updateChatSession(eventData.session_id, newTitle).then(() => {
                      window.dispatchEvent(new CustomEvent('session-updated', { detail: newSession }));
                      window.dispatchEvent(new Event('refresh-chat-sessions'));
                      setIsNewSession(false);
                      setFirstUserMessage('');
                    }).catch(error => {
                      console.error('Failed to update session title:', error);
                    });
                  }

                  if (eventData.type === 'thinking') {
                    continue;
                  } else if (eventData.type === 'status' || eventData.type === 'heartbeat') {
                    const displayText = mapStatusToDisplayText(eventData.content);
                    setCurrentStatus(displayText);
                    continue;
                  } else if (eventData.type === 'response') {
                    if (isFirstResponse) {
                      currentContent = eventData.content || '';
                      isFirstResponse = false;
                    } else {
                      currentContent += eventData.content || '';
                    }

                    setStreamingMarkdown(prev => new Map(prev.set(aiMessageId, currentContent)));

                    const cleanedContent = cleanStreamingContent(currentContent);

                    setMessages(prev => prev.map(msg =>
                      msg.id === aiMessageId
                        ? { ...msg, content: cleanedContent, isTyping: false, isStreaming: true }
                        : msg
                    ));

                    setMarkdownKey(prev => prev + 1);

                    console.log('AI Response content updated:', {
                      messageId: aiMessageId,
                      contentLength: cleanedContent.length,
                      hasMarkdown: cleanedContent.includes('#') || cleanedContent.includes('**') || cleanedContent.includes('|'),
                      contentPreview: cleanedContent.substring(0, 100) + '...'
                    });

                    const responseBlock: ContentBlock = {
                      type: 'response',
                      data: {
                        content: cleanedContent,
                        ...(receivedSessionId && { session_id: receivedSessionId })
                      }
                    };

                    const filteredBlocks = contentBlocks.filter(block =>
                      !(block.type === 'response' && block.data.content)
                    );
                    contentBlocks = [...filteredBlocks, responseBlock];

                    setMessages(prev => prev.map(msg =>
                      msg.id === aiMessageId
                        ? { ...msg, contentBlocks: contentBlocks }
                        : msg
                    ));

                  } else if (eventData.type === 'tool_result') {
                    const toolResultBlock = parseToolResult(eventData.content || '');
                    if (toolResultBlock) {
                      contentBlocks = [...contentBlocks, toolResultBlock];

                      setMessages(prev => prev.map(msg =>
                        msg.id === aiMessageId
                          ? { ...msg, contentBlocks: contentBlocks }
                          : msg
                      ));
                    }
                  } else if (eventData.type === 'files') {
                    console.log('Files event received:', eventData.content);

                    const fileBlock: ContentBlock = {
                      type: 'files',
                      data: {
                        files: eventData.content?.files || [],
                        file_count: eventData.content?.file_count || 0
                      }
                    };
                    contentBlocks = [...contentBlocks, fileBlock];

                    setMessages(prev => prev.map(msg =>
                      msg.id === aiMessageId
                        ? { ...msg, contentBlocks: contentBlocks }
                        : msg
                    ));
                  } else if (eventData.type === 'complete') {
                    if (eventData.session_id) {
                      receivedSessionId = eventData.session_id;

                      setActiveSessionId(receivedSessionId);

                      const sessionBlock: ContentBlock = {
                        type: 'response',
                        data: { session_id: receivedSessionId }
                      };

                      if (!contentBlocks.some(block => block.type === 'response' && block.data.session_id)) {
                        contentBlocks = [...contentBlocks, sessionBlock];
                      }
                    }
                    break;
                  } else if (eventData.type === 'end') {
                    break;
                  }
                } catch (parseError) {
                  console.warn('Failed to parse SSE data:', parseError, 'Line:', line);

                }
              }
            }
          }
        } finally {
          clearInterval(heartbeatInterval);
          cleanupReader();
        }

      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {

          return;
        }

        console.error(`Streaming attempt ${retryCount + 1} failed:`, error);

        cleanupReader();

        if (retryCount < maxRetries &&
          (error instanceof Error &&
            (error.message.includes('timeout') ||
              error.message.includes('connection') ||
              error.message.includes('network')))) {

          retryCount++;
          setMessages(prev => prev.map(msg =>
            msg.id === aiMessageId
              ? { ...msg, content: `Connection interrupted. Retrying... (${retryCount}/${maxRetries})`, isTyping: false, isStreaming: true, originalCommand: command }
              : msg
          ));

          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));

          return attemptStreaming();
        } else {
          throw error;
        }
      }
    };

    try {
      await attemptStreaming();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {

        return;
      }

      console.error('Chat execution error:', error);

      setMessages(prev => prev.map(msg =>
        msg.id === aiMessageId
          ? {
            ...msg,
            content: `Error: ${error instanceof Error ? error.message : 'Failed to process request'}`,
            isTyping: false,
            isStreaming: false,
            originalCommand: command
          }
          : msg
      ));
    } finally {
      cleanupReader();

      const finalStreamingContent = streamingMarkdown.get(aiMessageId);
      setMessages(prev => prev.map(msg =>
        msg.id === aiMessageId
          ? {
            ...msg,
            content: finalStreamingContent || msg.content,
            isStreaming: false,
            isTyping: false,
            originalCommand: command
          }
          : msg
      ));

      setStreamingMarkdown(prev => {
        const newMap = new Map(prev);
        const messageIds = Array.from(newMap.keys());
        if (messageIds.length > 10) {
          const messagesToKeep = messageIds.slice(-10);
          messageIds.forEach(id => {
            if (!messagesToKeep.includes(id)) {
              newMap.delete(id);
            }
          });
        }
        return newMap;
      });

      setIsChatLoading(false);
      setIsStreaming(false);
      setStreamingControllerRef(null);
      setCurrentStatus(null);
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };

  const handleEmailAgent = (agentId?: string) => {
    toast({
      title: "Email Agent",
      description: `Email functionality for Agent ${agentId || 'selected agent'} would be implemented here`
    });
  };

  const handleScheduleTouchpoint = (agentId: string) => {
    toast({
      title: "Schedule Touchpoint",
      description: `Calendar integration would open for Agent ${agentId}`
    });
  };

  const handleAssignFollowUp = (agentId: string) => {
    toast({
      title: "Assign Follow-Up",
      description: `Team assignment dialog would open for Agent ${agentId}`
    });
  };

  const handleShowDetailedView = (data: any) => {
    const sampleItem = data.detailedData[0];
    const dynamicColumns = Object.keys(sampleItem)
      .filter(key => key !== 'id')
      .map(key => ({
        key,
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        sortable: true
      }));

    setDetailedViewData({
      title: data.title,
      data: data.detailedData,
      columns: dynamicColumns
    });
    setShowDetailedView(true);
  };

  const convertTableToCSV = (tableData: any) => {
    if (!tableData || !tableData.columns || !tableData.rows) {
      return '';
    }

    const headers = tableData.columns.slice(0, -1);

    const csvRows = tableData.rows.map((row: string[]) =>
      row.slice(0, -1).map(cell => {
        if (typeof cell === 'string' && cell.includes(',')) {
          return `"${cell}"`;
        }
        return cell;
      }).join(',')
    );

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    return csvContent;
  };

  const downloadCSV = (tableData: any) => {
    const csvContent = convertTableToCSV(tableData);
    if (!csvContent) {
      toast({
        title: "Error",
        description: "No data available to download",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${tableData.title || 'table-data'}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "CSV file downloaded successfully",
    });
  };

  const copyTableData = (tableData: any) => {
    if (!tableData || !tableData.columns || !tableData.rows) {
      toast({
        title: "Error",
        description: "No data available to copy",
        variant: "destructive",
      });
      return;
    }

    const formatTableForCleanCopy = (data: any) => {
      const headers = data.columns.slice(0, -1);
      const rows = data.rows.map((row: string[]) => row.slice(0, -1));

      const columnWidths = headers.map((header: string, colIndex: number) => {
        let maxWidth = header.length;
        rows.forEach(row => {
          if (row[colIndex] && row[colIndex].toString().length > maxWidth) {
            maxWidth = row[colIndex].toString().length;
          }
        });
        return maxWidth;
      });

      let tableText = '';

      headers.forEach((header: string, index: number) => {
        tableText += header.padEnd(columnWidths[index] + 2);
      });
      tableText += '\n';

      headers.forEach((header: string, index: number) => {
        tableText += '-'.repeat(columnWidths[index]) + '  ';
      });
      tableText += '\n';

      rows.forEach(row => {
        row.forEach((cell: string, index: number) => {
          tableText += (cell || '').padEnd(columnWidths[index] + 2);
        });
        tableText += '\n';
      });

      return tableText;
    };

    const tableText = formatTableForCleanCopy(tableData);

    navigator.clipboard.writeText(tableText).then(() => {
      toast({
        title: "Success",
        description: "Table copied in clean format",
      });
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = tableText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        toast({
          title: "Success",
          description: "Table copied in clean format",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to copy data to clipboard",
          variant: "destructive",
        });
      }

      document.body.removeChild(textArea);
    });
  };

  const renderContentBlock = (block: ContentBlock) => {
    if (block.type === 'table') {
      return (
        <Card className="mt-4 p-4 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground">{block.data.title}</h4>
            <div className="flex gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="border-0 shadow-none hover:bg-transparent focus-visible:ring-0"
                onClick={() => downloadCSV(block.data)}
                title="Download CSV"
                aria-label="Download CSV"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="border-0 shadow-none hover:bg-transparent focus-visible:ring-0"
                onClick={() => copyTableData(block.data)}
                title="Copy"
                aria-label="Copy"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="border-0 shadow-none hover:bg-transparent focus-visible:ring-0"
                onClick={() => handleEmailAgent('all')}
                title="Email"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="border-0 shadow-none hover:bg-transparent focus-visible:ring-0"
                onClick={() => toast({ title: "Sync to CRM", description: "CRM sync functionality coming soon" })}
                title="Sync to CRM"
                aria-label="Sync to CRM"
              >
                <Database className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="border-0 shadow-none hover:bg-transparent focus-visible:ring-0"
                onClick={() => handleAssignFollowUp('all')}
                title="Assign Follow-Up"
                aria-label="Assign Follow-Up"
              >
                <UserPlus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="border-0 shadow-none hover:bg-transparent focus-visible:ring-0"
                onClick={() => handleShowDetailedView(block.data)}
                title="Full-screen detailed view"
                aria-label="Full-screen detailed view"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {block.data.columns.slice(0, -1).map((col: string, index: number) => (
                    <th key={index} className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.data.rows.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex} className="border-b border-border/50 hover:bg-muted/30 transition-fast">
                    {row.slice(0, -1).map((cell: string, cellIndex: number) => (
                      <td key={cellIndex} className="py-3 px-3 text-sm">
                        {cellIndex === 2 ? (
                          <Badge variant={cell.includes('High') ? 'destructive' : cell.includes('Medium') ? 'secondary' : 'outline'}>
                            {cell}
                          </Badge>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </Card>
      );
    }

    if (block.type === 'email') {
      return (
        <EmailDrafting
          recipient={block.data.recipient}
          drafts={block.data.drafts}
          onSend={(draftId) => toast({ title: "Email Sent", description: `Draft ${draftId} sent successfully` })}
          onCopy={(draftId) => toast({ title: "Copied", description: "Email content copied to clipboard" })}
          onDownload={(draftId) => toast({ title: "Download Started", description: "Word document is downloading" })}
          onRegenerate={() => toast({ title: "Regenerating", description: "Creating new email variations" })}
        />
      );
    }

    if (block.type === 'chart') {
      return (
        <ChartVisualization
          title={block.data.title}
          imageUrl={block.data.imageUrl}
          description={block.data.description}
        />
      );
    }

    if (block.type === 'error') {
      return (
        <ErrorFallback
          type={block.data.type}
          message={block.data.message}
          suggestions={block.data.suggestions}
        />
      );
    }

    if (block.type === 'tool_result') {
      return (
        <Card className="mt-4 p-4 shadow-soft bg-green-50 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-700">Tool Result</span>
          </div>
          <div className="text-sm text-green-800 whitespace-pre-wrap">{block.data.content}</div>
        </Card>
      );
    }

    if (block.type === 'files') {
      return <GeneratedFilesDisplay files={block.data.files} />;
    }

    return null;
  };

  useEffect(() => {
    const loadChatSession = async () => {
      if (!sessionId) {
        setMessages([]);
        return;
      }

      setIsLoadingSession(true);
      try {
        const response = await getChatSession(sessionId);
        if (response.success && response.messages) {
          const convertedMessages: Message[] = [];
          const allFiles = response.files || [];
          response.messages.forEach((msg: any, index: number) => {
            if (msg.user_message) {
              convertedMessages.push({
                id: msg.message_id || `msg_${index}`,
                type: 'user',
                content: msg.user_message,
                timestamp: new Date(msg.timestamp),
                attachments: msg.files_attached || []
              });
            }

            if (msg.agent_response) {
              const contentBlocks: ContentBlock[] = [];

              if (msg.files_attached && msg.files_attached.length > 0) {
                console.log('Message has files_attached:', msg.files_attached);

                const messageFiles = allFiles.filter((file: any) =>
                  msg.files_attached.includes(file.filename)
                );

                console.log('Matched files for message:', messageFiles);

                if (messageFiles.length > 0) {
                  const fileBlock: ContentBlock = {
                    type: 'files',
                    data: {
                      files: messageFiles,
                      file_count: messageFiles.length
                    }
                  };
                  contentBlocks.push(fileBlock);
                  console.log('Added file block to contentBlocks:', fileBlock);
                }
              }

              convertedMessages.push({
                id: `ai_${index}`,
                type: 'ai',
                content: msg.agent_response,
                timestamp: new Date(msg.timestamp),
                attachments: msg.files_attached || [],
                contentBlocks: contentBlocks
              });
            }
          });

          if (allFiles.length > 0) {
            const usedFiles = new Set();
            convertedMessages.forEach(msg => {
              if (msg.contentBlocks) {
                msg.contentBlocks.forEach(block => {
                  if (block.type === 'files' && block.data.files) {
                    block.data.files.forEach((file: any) => {
                      usedFiles.add(file.filename);
                    });
                  }
                });
              }
            });

            const unusedFiles = allFiles.filter((file: any) => !usedFiles.has(file.filename));
            if (unusedFiles.length > 0) {
              console.log('Adding unused files to last message:', unusedFiles);

              if (convertedMessages.length > 0) {
                const lastMessage = convertedMessages[convertedMessages.length - 1];
                if (lastMessage.type === 'ai') {
                  const fileBlock: ContentBlock = {
                    type: 'files',
                    data: {
                      files: unusedFiles,
                      file_count: unusedFiles.length
                    }
                  };
                  lastMessage.contentBlocks = [...(lastMessage.contentBlocks || []), fileBlock];
                }
              }
            }
          }

          setMessages(convertedMessages);

        }
      } catch (error) {
        console.error('Error loading chat session:', error);

      } finally {
        setIsLoadingSession(false);
      }
    };

    loadChatSession();
  }, [sessionId]);

  return (
    <div className="flex-1 flex flex-col h-screen relative">
      <div className="border-b border-border bg-background/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-0 justify-start hover:bg-transparent text-left pointer-events-auto"
                style={{ transition: 'none' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-foreground">ARIA Acta-1</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[600px] p-4 bg-background border border-border z-[60]"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-gradient-primary rounded-full animate-pulse"></div>
                  <span className="font-semibold text-foreground">About ARIA Acta-1</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ARIA Acta-1 is our most advanced AI system, built on our Agentic Responsive Intelligent Architecture (ARIA). It combines powerful reasoning, adaptive decision-making, and contextual understanding to help you optimize distribution relationships and accelerate growth. ARIA Acta-1 is LLM-agnostic and leverages the newest and most powerful models available to deliver unmatched performance.
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-3">
            <Sheet open={isActionPromptsSidebarOpen} onOpenChange={setIsActionPromptsSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 h-8 px-3 rounded-full border border-border hover:border-primary/50 transition-all duration-200"
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Power Prompts</span>
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[30rem] max-w-[30rem] min-w-[30rem] p-0">
                <ActionPromptsSidebar
                  showWelcome={!hasSeenActionPrompts}
                  onPromptClick={(prompt) => {
                    setInputMessage(prompt);
                    setIsActionPromptsSidebarOpen(false);
                  }}
                />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2 w-[178px]">
              <Switch
                checked={isProductionMode}
                onCheckedChange={setIsProductionMode}
              />
              <span className="text-sm text-muted-foreground">
                {isProductionMode ? 'Production Mode' : 'Development Mode'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto p-6 pb-6 space-y-12 relative transition-all duration-500 ${isDragOver ? 'bg-muted/50' : ''}`}
        style={{
          maxWidth: '100%',
          alignSelf: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '-webkit-fill-available',
          maxHeight: '100vh',
          overflowY: 'auto',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className={`flex-1 overflow-y-auto p-6 pb-6 space-y-12 relative ${isDragOver ? 'bg-muted/50' : ''}`}
          style={{
            maxWidth: '940px',
            alignSelf: 'center',
            marginTop: 'auto',
            width: '-webkit-fill-available',
          }}
        >
          {/* Drag and Drop Overlay */}
          {isDragOver && (
            <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center z-50">
              <div className="text-center">
                <Paperclip className="w-12 h-12 text-primary mx-auto mb-2 animate-bounce" />
                <p className="text-lg font-medium text-primary">Drop files here to upload</p>
                <p className="text-sm text-muted-foreground">Supports all file formats (10MB images, 50MB others)</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Images, documents, videos, audio, archives, code files, and more</p>
              </div>
            </div>
          )}

          {messages.length === 0 && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-full max-w-2xl animate-fade-in">
                <div className="text-center mb-6">
                  {/* <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Good to see you {user.username}</h1> */}
                  <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Good to see you Taylor!</h1>
                </div>
                <div
                  className={`liquid-glass rounded-2xl px-6 py-5 relative ${isDragOver ? 'bg-primary/10 border-2 border-dashed border-primary/50' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {/* Drag and Drop Overlay for Empty State */}
                  {isDragOver && (
                    <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary/50 rounded-xl flex items-center justify-center z-50">
                      <div className="text-center">
                        <Paperclip className="w-8 h-8 text-primary mx-auto mb-2 animate-bounce" />
                        <p className="text-sm font-medium text-primary">Drop files here to upload</p>
                        <p className="text-xs text-muted-foreground/70">All file types supported</p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-3">
                    <div className="w-full">
                      <Textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={isChatLoading ? "Processing..." : "Ask anything"}
                        className="min-h-[48px] max-h-32 bg-transparent border-none focus:ring-0 focus:outline-none text-sm placeholder:text-muted-foreground/70 resize-none overflow-y-auto"
                        disabled={isChatLoading}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && !isChatLoading) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <FileUploadButton />


                      </div>

                      <div className="flex gap-3 items-center">

                        <Button
                          onClick={handleSendMessage}
                          size="sm"
                          className="h-8 w-8 p-0 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 rounded-full"
                          disabled={(!inputMessage.trim() && attachments.length === 0) || isChatLoading}
                        >
                          {isChatLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <FileAttachmentsPreview />
                  </div>
                </div>
              </div>
              <HiddenFileInput />
            </div>
          )}

          {isLoadingSession && (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading chat session...</span>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in group`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`flex flex-col max-w-3xl ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                <Card className={`${message.type === 'user'
                  ? 'p-4 hover-lift bg-gradient-chat-user text-foreground shadow-soft'
                  : 'p-0 border-0 shadow-none bg-transparent'
                  }`}>
                  {message.isTyping ? (
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/70 animate-blink" />
                      <span className="animate-blink-slow animate-pulse text-sm">
                        {currentStatus || 'Thinking...'}
                      </span>
                    </div>
                  ) : (
                    <div className="relative">
                      {message.type === 'ai' ? (
                        <StreamingHtmlRenderer
                          messageId={message.id}
                          content={message.content}
                          streamingContent={streamingMarkdown.get(message.id)}
                        />
                      ) : (
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      )}

                      {/* Feedback and action buttons for AI messages when not typing/streaming */}
                      {message.type === 'ai' && !message.isTyping && !message.isStreaming && message.content && (
                        <div className="mt-3 flex items-center justify-between">
                          {/* Left side - Feedback and Copy buttons */}
                          <div className="flex items-center gap-1">
                            {/* Thumbs Up */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-7 w-7 p-0 hover:bg-green-500/10 transition-all duration-200 ${messageFeedback.get(message.id) === 'thumbsUp'
                                ? 'text-gray-700 bg-gray-200'
                                : 'text-muted-foreground hover:text-green-500'
                                }`}
                              onClick={() => handleFeedback(message.id, 'thumbsUp')}
                              title="Thumbs up"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </Button>

                            {/* Thumbs Down */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-7 w-7 p-0 hover:bg-red-500/10 transition-all duration-200 ${messageFeedback.get(message.id) === 'thumbsDown'
                                ? 'text-gray-700 bg-gray-200'
                                : 'text-muted-foreground hover:text-red-500'
                                }`}
                              onClick={() => handleFeedback(message.id, 'thumbsDown')}
                              title="Thumbs down"
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </Button>

                            {/* Copy button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                              onClick={() => {
                                const contentToCopy = streamingMarkdown.get(message.id) || message.content;
                                navigator.clipboard.writeText(contentToCopy);
                                toast({
                                  title: "Copied!",
                                  description: "Message content copied to clipboard",
                                  duration: 2000,
                                });
                              }}
                              title="Copy message"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Right side - Retry button */}
                          {message.originalCommand && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-3 text-xs hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/30 transition-all duration-200"
                              onClick={() => handleRetryMessage(message.originalCommand)}
                              title="Retry this request"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Retry
                            </Button>
                          )}
                        </div>
                      )}

                      {message.isStreaming && (
                        <div className="absolute bottom-0 right-0 flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span>Streaming</span>
                          </div>
                          {message.content.includes('Connection interrupted') && (
                            <Button
                              onClick={() => handleStreamingRecovery(message.content, message.id)}
                              variant="outline"
                              size="sm"
                              className="h-5 px-2 text-xs rounded-full"
                            >
                              Retry
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status Display for AI messages */}
                  {/* {message.type === 'ai' && currentStatus && message.isStreaming && (
                    <StatusDisplay status={currentStatus} type="status" />
                  )} */}
                </Card>

                {message.contentBlocks?.map((block, index) => (
                  <div key={index} className="w-full">
                    {renderContentBlock(block)}
                  </div>
                ))}

                {/* Render attachments if any */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="text-xs text-muted-foreground mb-2">
                      {message.attachments.length} file(s) attached
                    </div>
                    {message.attachments.map((attachment) => {
                      if (!attachment.file) {
                        return null;
                      }

                      return (
                        <div
                          key={attachment.id}
                          className="flex items-center gap-2 p-2 bg-muted/30 rounded border border-border/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {attachment.preview ? (
                              <img
                                src={attachment.preview}
                                alt={attachment.file?.name || 'File'}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                                {getFileIcon(attachment.type)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{attachment.file?.name || 'Unknown file'}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <span>{attachment.size}</span>
                                <span className="text-muted-foreground/50">•</span>
                                <span className="capitalize">{attachment.type}</span>
                              </p>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButtons && !isAtBottom && (
        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            onClick={scrollToBottom}
            variant="outline"
            size="sm"
            className="h-10 w-10 p-0 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-all duration-200 animate-fade-in"
            title="Scroll to bottom"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Golden Moment - Single Location Above Chat Input */}
      {showGoldenMoment && (
        <div className="flex justify-center mb-4">
          <GoldenMoment
            isVisible={showGoldenMoment}
            onComplete={() => setShowGoldenMoment(false)}
          />
        </div>
      )}

      {/* Floating Chat Input */}
      {messages.length > 0 && (
        <div className="relative top-0 left-0 right-0 flex justify-center px-6 z-50 mb-6">
          <div
            className={`w-full max-w-4xl liquid-glass rounded-2xl px-4 py-3 ${isDragOver ? 'bg-primary/10 border-2 border-dashed border-primary/50' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col gap-3">
              {/* Drag and Drop Overlay for Floating Input */}
              {isDragOver && (
                <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary/50 rounded-xl flex items-center justify-center z-50">
                  <div className="text-center">
                    <Paperclip className="w-8 h-8 text-primary mx-auto mb-2 animate-bounce" />
                    <p className="text-sm font-medium text-primary">Drop files here to upload</p>
                    <p className="text-xs text-muted-foreground/70">All file types supported</p>
                  </div>
                </div>
              )}

              {/* Input Field */}
              <div className="w-full">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={isChatLoading ? "Processing..." : "Ask anything (try 'golden moment' for a demo!)"}
                  className="min-h-[40px] max-h-32 bg-transparent border-none focus:ring-0 focus:outline-none text-sm placeholder:text-muted-foreground/70 resize-none overflow-y-auto"
                  disabled={isChatLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !isChatLoading) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                  }}
                />
              </div>

              {/* Buttons Row */}
              <div className="flex items-center justify-between">
                {/* Left side - Upload button and Tools dropdown */}
                <div className="flex gap-2 items-center">
                  <FileUploadButton />
                </div>

                {/* Right side - Send button */}
                <div className="flex gap-3 items-center">
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="h-8 w-8 p-0 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 rounded-full"
                    disabled={(!inputMessage.trim() && attachments.length === 0) || isChatLoading}
                  >
                    {isChatLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>

                  {/* Stop Streaming Button */}
                  {isStreaming && (
                    <div onClick={stopStreaming} className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer">
                      <Square className="w-3 h-3 text-gray-700 fill-current" />
                    </div>
                  )}
                </div>
                <FileAttachmentsPreview />
              </div>
            </div>
            <HiddenFileInput />
          </div>
        </div>
      )}

      {detailedViewData && (
        <DetailedListView
          isOpen={showDetailedView}
          onClose={() => setShowDetailedView(false)}
          title={detailedViewData.title}
          data={detailedViewData.data}
          columns={detailedViewData.columns}
          onEmailAgent={handleEmailAgent}
          onScheduleTouchpoint={handleScheduleTouchpoint}
          onAssignFollowUp={handleAssignFollowUp}
          onSyncToCRM={() => toast({ title: "Syncing to CRM", description: "Agent data is being synchronized" })}
          onDownloadCSV={() => {
            if (detailedViewData && detailedViewData.data) {
              const csvContent = convertTableToCSV({
                title: detailedViewData.title,
                columns: detailedViewData.columns.map(col => col.label),
                rows: detailedViewData.data.map(item =>
                  detailedViewData.columns.map(col => item[col.key])
                )
              });

              if (csvContent) {
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);

                link.setAttribute('href', url);
                link.setAttribute('download', `${detailedViewData.title || 'detailed-data'}.csv`);
                link.style.visibility = 'hidden';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(url);

                toast({
                  title: "Success",
                  description: "CSV file downloaded successfully",
                });
              } else {
                toast({
                  title: "Error",
                  description: "No data available to download",
                  variant: "destructive",
                });
              }
            }
          }}
          allowDrillDown={detailedViewData.title.toLowerCase().includes('firm')}
        />
      )}
    </div>
  );
};