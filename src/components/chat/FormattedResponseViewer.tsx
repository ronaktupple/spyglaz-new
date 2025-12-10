import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Eye, Code } from 'lucide-react';

interface StreamingEvent {
  type: 'status' | 'heartbeat' | 'response' | 'complete' | 'error';
  content: string;
  session_id?: string;
  user_id?: string;
  metadata?: any;
  timestamp?: string;
}

interface FormattedResponseViewerProps {
  rawData?: string;
  events?: StreamingEvent[];
  className?: string;
}

export const FormattedResponseViewer: React.FC<FormattedResponseViewerProps> = ({
  rawData = '',
  events = [],
  className = ''
}) => {
  const [formattedEvents, setFormattedEvents] = useState<StreamingEvent[]>([]);
  const [rawInput, setRawInput] = useState(rawData);
  const [isFormatted, setIsFormatted] = useState(false);

  // Parse raw data into events
  const parseRawData = (raw: string): StreamingEvent[] => {
    const parsedEvents: StreamingEvent[] = [];
    const lines = raw.split(/\r?\n/);
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || !trimmedLine.startsWith('data:')) continue;
      
      try {
        const jsonText = trimmedLine.slice(5).trim(); // Remove 'data: '
        const obj = JSON.parse(jsonText);
        parsedEvents.push({
          ...obj,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        // Try to fix common JSON issues
        try {
          let fixedJson = trimmedLine.slice(5).trim();
          fixedJson = fixedJson.replace(/(['"])?([a-zA-Z0-9_]+)\1\s*:/g, '"$2":');
          fixedJson = fixedJson.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
          const obj = JSON.parse(fixedJson);
          parsedEvents.push({
            ...obj,
            timestamp: new Date().toISOString()
          });
        } catch (err2) {
          console.warn('Skipping malformed JSON line:', trimmedLine);
        }
      }
    }
    
    return parsedEvents;
  };

  // Merge consecutive response events
  const mergeConsecutiveEvents = (events: StreamingEvent[]): StreamingEvent[] => {
    const merged: StreamingEvent[] = [];
    
    for (const event of events) {
      const lastEvent = merged[merged.length - 1];
      
      if (lastEvent && lastEvent.type === 'response' && event.type === 'response') {
        // Merge consecutive response events
        lastEvent.content += event.content || '';
      } else {
        merged.push({ ...event });
      }
    }
    
    return merged;
  };

  // Format the events
  const formatEvents = () => {
    const parsed = rawInput ? parseRawData(rawInput) : events;
    const merged = mergeConsecutiveEvents(parsed);
    setFormattedEvents(merged);
    setIsFormatted(true);
  };

  // Auto-format when rawData prop changes
  useEffect(() => {
    if (rawData) {
      setRawInput(rawData);
      formatEvents();
    }
  }, [rawData]);

  // Auto-format when events prop changes
  useEffect(() => {
    if (events.length > 0) {
      formatEvents();
    }
  }, [events]);

  const getBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case 'status': return 'default';
      case 'heartbeat': return 'secondary';
      case 'response': return 'outline';
      case 'complete': return 'default';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'status': return 'bg-green-100 text-green-800 border-green-200';
      case 'heartbeat': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'response': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'complete': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`w-full ${className}`}>
      <Tabs defaultValue="formatted" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="formatted" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Formatted View
          </TabsTrigger>
          <TabsTrigger value="raw" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Raw Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="formatted" className="mt-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Agent Log — Formatted</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={formatEvents}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Refresh
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {formattedEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No events to display. Paste raw data in the Raw Data tab and click "Format & Render".
                </div>
              ) : (
                formattedEvents.map((event, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg border bg-card">
                    <Badge 
                      variant={getBadgeVariant(event.type)}
                      className={`${getBadgeColor(event.type)} min-w-[80px] justify-center`}
                    >
                      {event.type.toUpperCase()}
                    </Badge>
                    
                    <div className="flex-1 min-w-0">
                      {event.type === 'complete' ? (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">{event.content}</div>
                          {(event.session_id || event.user_id) && (
                            <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                              session_id: {event.session_id || 'N/A'} | user_id: {event.user_id || 'N/A'}
                            </div>
                          )}
                          {event.metadata && (
                            <details className="text-xs">
                              <summary className="cursor-pointer font-medium">Metadata (click to expand)</summary>
                              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                                {JSON.stringify(event.metadata, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      ) : event.type === 'response' ? (
                        <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                          {event.content}
                        </pre>
                      ) : (
                        <div className="text-sm">{event.content}</div>
                      )}
                      
                      {event.timestamp && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="raw" className="mt-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Raw Input</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(rawInput)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    onClick={formatEvents}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Format & Render
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Paste your raw streaming data here..."
                className="min-h-[300px] font-mono text-sm"
                rows={15}
              />
              
              <p className="text-sm text-muted-foreground">
                Tip: After clicking "Format & Render", the formatted view will appear in the Formatted View tab.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormattedResponseViewer;
