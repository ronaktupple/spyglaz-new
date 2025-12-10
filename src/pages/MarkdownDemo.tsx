import React from 'react';
import { StreamingMarkdownDemo } from '@/components/chat/StreamingMarkdownDemo';
import StreamingTestDemo from '@/components/chat/StreamingTestDemo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MarkdownDemo: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Streaming Response Renderers Comparison</h1>
      
      <Tabs defaultValue="html" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="html">New HTML Renderer</TabsTrigger>
          <TabsTrigger value="markdown">Original Markdown Renderer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="html" className="mt-6">
          <StreamingTestDemo />
        </TabsContent>
        
        <TabsContent value="markdown" className="mt-6">
          <StreamingMarkdownDemo />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarkdownDemo;
