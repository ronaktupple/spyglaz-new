import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const sampleStreamingData = [
  { type: "response", content: "## Sales Report\n| Org | Goal | YTD | %" },
  { type: "response", content": " | --- | --- | --- | -- |" },
  { type: "response", content": " | Northeast | $39M | $13.8M | 35.2% |" },
  { type: "response", content": " | Southeast | $28M | $9.2M | 32.9% |" },
  { type: "response", content": " | Midwest | $31M | $11.5M | 37.1% |" },
  { type: "response", content": " \n\n### Key Insights\n- **Northeast** leads in absolute revenue\n- **Midwest** has highest goal percentage\n- **Southeast** needs attention for growth\n\n### Recommendations\n1. Focus on Southeast market expansion\n2. Maintain Northeast momentum\n3. Analyze Midwest success factors" }
];

export const StreamingMarkdownDemo: React.FC = () => {
  const [responseText, setResponseText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleStartStreaming = () => {
    setResponseText("");
    setIsStreaming(true);
    setCurrentIndex(0);
  };

  const handleStopStreaming = () => {
    setIsStreaming(false);
  };

  useEffect(() => {
    if (isStreaming && currentIndex < sampleStreamingData.length) {
      const timer = setTimeout(() => {
        const chunk = sampleStreamingData[currentIndex];
        if (chunk.type === "response") {
          setResponseText(prev => prev + chunk.content);
        }
        setCurrentIndex(prev => prev + 1);
      }, 500); // Simulate 500ms delay between chunks

      return () => clearTimeout(timer);
    } else if (currentIndex >= sampleStreamingData.length) {
      setIsStreaming(false);
    }
  }, [isStreaming, currentIndex]);

  const StreamingMarkdownRenderer = ({ content }: { content: string }) => {
    return (
      <div className="text-sm leading-relaxed prose prose-sm max-w-none 
        prose-headings:text-foreground prose-headings:font-semibold prose-headings:mb-3 prose-headings:mt-6 prose-headings:first:mt-0
        prose-h1:text-xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-6
        prose-h2:text-lg prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-5 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
        prose-h3:text-base prose-h3:font-semibold prose-h3:mb-2 prose-h3:mt-4
        prose-p:text-foreground prose-p:mb-3 prose-p:leading-relaxed
        prose-strong:font-semibold prose-strong:text-primary
        prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
        prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:border prose-pre:border-border
        prose-blockquote:text-muted-foreground prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:rounded-r
        prose-ul:text-foreground prose-ul:mb-4 prose-ul:pl-4 prose-ul:space-y-1
        prose-ol:text-foreground prose-ol:mb-4 prose-ol:pl-4 prose-ol:space-y-1
        prose-li:text-foreground prose-li:mb-1 prose-li:leading-relaxed
        prose-a:text-primary prose-a:underline prose-a:decoration-primary/50 prose-a:underline-offset-2 prose-a:font-medium
        prose-table:text-foreground prose-table:border-collapse prose-table:w-full prose-table:my-4
        prose-th:border prose-th:border-border prose-th:px-3 prose-th:py-2 prose-th:bg-muted prose-th:text-left prose-th:font-semibold prose-th:text-sm
        prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2 prose-td:text-sm
        prose-hr:border-border prose-hr:my-6">
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  style={oneDark as any}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </Markdown>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Streaming Markdown Demo</h1>
      
      <div className="mb-6 space-x-4">
        <Button 
          onClick={handleStartStreaming} 
          disabled={isStreaming}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isStreaming ? 'Streaming...' : 'Start Streaming Demo'}
        </Button>
        <Button 
          onClick={handleStopStreaming} 
          disabled={!isStreaming}
          variant="outline"
        >
          Stop Streaming
        </Button>
        <Button 
          onClick={() => setResponseText("")} 
          variant="outline"
        >
          Clear
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Formatted Markdown Output</h3>
          <p className="text-sm text-gray-600 mb-2">This shows how your streaming markdown chunks will be rendered</p>
          {isStreaming && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span>Receiving chunks...</span>
            </div>
          )}
        </div>
        
        <div className="min-h-[200px] border rounded-lg p-4 bg-gray-50">
          {responseText ? (
            <StreamingMarkdownRenderer content={responseText} />
          ) : (
            <p className="text-gray-500 italic">Click "Start Streaming Demo" to see markdown content stream in real-time</p>
          )}
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Raw Markdown Content (for debugging)</h3>
        <details className="cursor-pointer">
          <summary className="text-sm text-gray-600 hover:text-gray-800">Click to show/hide raw content</summary>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm whitespace-pre-wrap mt-2">
            {responseText || "No content yet..."}
          </pre>
        </details>
      </Card>
    </div>
  );
};
