import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, List, Mail, RefreshCw } from 'lucide-react';

export const ErrorFallback = ({
  type,
  message,
  suggestions = []
}) => {
  const getIcon = () => {
    switch (type) {
      case 'data-not-found':
        return <Info className="w-5 h-5 text-info" />;
      case 'action-unavailable':
        return <Info className="w-5 h-5 text-warning" />;
      default:
        return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getDefaultSuggestions = () => {
    switch (type) {
      case 'data-not-found':
        return [
          {
            label: 'View Available Lists',
            action: () => console.log('Show available lists'),
            icon: <List className="w-4 h-4" />
          },
          {
            label: 'Try Different Search',
            action: () => console.log('Clear and try again'),
            icon: <RefreshCw className="w-4 h-4" />
          }
        ];
      case 'action-unavailable':
        return [
          {
            label: 'Send Email Instead',
            action: () => console.log('Open email draft'),
            icon: <Mail className="w-4 h-4" />
          },
          {
            label: 'View Available Actions',
            action: () => console.log('Show available actions'),
            icon: <List className="w-4 h-4" />
          }
        ];
      default:
        return [
          {
            label: 'Try Again',
            action: () => window.location.reload(),
            icon: <RefreshCw className="w-4 h-4" />
          }
        ];
    }
  };

  const allSuggestions = suggestions.length > 0 ? suggestions : getDefaultSuggestions();

  return (
    <Card className="mt-4 p-6 bg-muted/30 border-border/50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm text-foreground mb-4">{message}</p>

          {/* {allSuggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Try one of these options:
              </p>
              <div className="flex flex-wrap gap-2">
                {allSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={suggestion.action}
                    className="h-8 text-xs"
                  >
                    {suggestion.icon}
                    {suggestion.label}
                  </Button>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </Card>
  );
};
