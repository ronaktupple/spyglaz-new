import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, Copy, Download, RefreshCw } from 'lucide-react';

export const EmailDrafting = ({
  recipient,
  drafts,
  onSend,
  onCopy,
  onDownload,
  onRegenerate
}) => {
  return (
    <Card className="mt-4 p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold text-foreground">Email Draft Comparison</h4>
          <p className="text-sm text-muted-foreground">To: {recipient}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRegenerate}>
          <RefreshCw className="w-4 h-4" />
          Regenerate
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {drafts.map((draft) => (
          <Card key={draft.id} className="p-4 border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Version {draft.variant}</Badge>
                <Badge variant="secondary">{draft.tone}</Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Subject</label>
                <p className="text-sm font-medium">{draft.subject}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-muted-foreground">Message</label>
                <div className="bg-muted/30 rounded-md p-3 text-sm leading-relaxed max-h-48 overflow-y-auto">
                  {draft.content.split('\n').map((line, index) => (
                    <p key={index} className={line.trim() === '' ? 'mb-2' : 'mb-1'}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                variant="premium" 
                size="sm" 
                onClick={() => onSend(draft.id)}
                className="flex-1"
              >
                <Send className="w-3 h-3" />
                Send Now
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onCopy(draft.id)}
              >
                <Copy className="w-3 h-3" />
                Copy
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDownload(draft.id)}
              >
                <Download className="w-3 h-3" />
                Word
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};
