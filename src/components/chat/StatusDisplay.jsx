import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, Clock, Brain, Database, Zap } from 'lucide-react';

const StatusDisplay = ({ status, type = 'status' }) => {
  if (!status) return null;

  const getStatusIcon = (statusText, statusType) => {
    if (statusType === 'heartbeat') {
      return <Clock className="w-4 h-4 text-blue-500" />;
    }
    
    const text = statusText.toLowerCase();
    
    if (text.includes('starting') || text.includes('preparing')) {
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    }
    
    if (text.includes('analyzing') || text.includes('examining') || text.includes('processing')) {
      return <Brain className="w-4 h-4 text-purple-500" />;
    }
    
    if (text.includes('tool') || text.includes('execution') || text.includes('data')) {
      return <Database className="w-4 h-4 text-green-500" />;
    }
    
    if (text.includes('completed') || text.includes('finished')) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    
    if (text.includes('refining') || text.includes('planning')) {
      return <Zap className="w-4 h-4 text-yellow-500" />;
    }
    
    return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
  };

  const getStatusColor = (statusType) => {
    switch (statusType) {
      case 'heartbeat':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'status':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getBadgeVariant = (statusType) => {
    switch (statusType) {
      case 'heartbeat':
        return 'secondary';
      case 'status':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <Card className={`mt-2 p-3 shadow-soft border ${getStatusColor(type)}`}>
      <div className="flex items-center gap-2">
        {getStatusIcon(status, type)}
        <span className="text-sm font-medium">{status}</span>
        <Badge variant={getBadgeVariant(type)} className="text-xs ml-auto">
          {type === 'heartbeat' ? 'Progress' : 'Status'}
        </Badge>
      </div>
    </Card>
  );
};

export default StatusDisplay;
