import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Target, 
  MapPin, 
  Calendar, 
  DollarSign,
  FileText,
  BarChart3
} from 'lucide-react';

const uatCommands = [
  {
    category: 'Firm-Level Scenarios',
    icon: <TrendingUp className="w-4 h-4" />,
    commands: [
      {
        title: 'High-Premium Firms with Drill-Down',
        command: 'Show me firms with more than $100M in premiums with drill-down capability',
        description: 'Displays firms exceeding $100M with detailed producer metrics and drill-down functionality',
        status: '✅ Implemented'
      },
      {
        title: 'Firm Territory Analysis',
        command: 'Show territory-based performance with cross-sell opportunities by license state',
        description: 'Territory mapping with license state filters and cross-sell opportunity flagging',
        status: '✅ Implemented'
      }
    ]
  },
  {
    category: 'Producer Relationship Metrics',
    icon: <Users className="w-4 h-4" />,
    commands: [
      {
        title: 'Unresponsive Producers Tracking',
        command: 'Show producers not responding to outreach in 45 days with training and portal activity metrics',
        description: 'Tracks last email response, portal activity, and training completion status',
        status: '✅ Implemented'
      },
      {
        title: 'Training & Engagement Analysis',
        command: 'Include training participation vs performance correlation',
        description: 'Shows training completion dates and performance correlation metrics',
        status: '✅ Implemented'
      }
    ]
  },
  {
    category: 'Policy & Commission Alerts',
    icon: <AlertTriangle className="w-4 h-4" />,
    commands: [
      {
        title: 'Lapse & Pending Policy Alerts',
        command: 'Show policies with lapse alerts and pending issues over 30 days',
        description: 'Identifies policies at risk of lapse and those pending issuance beyond thresholds',
        status: '✅ Implemented'
      },
      {
        title: 'Commission Issue Tracking',
        command: 'Show agents with commission issues and payment delays',
        description: 'Flags commission anomalies and payment processing delays',
        status: '✅ Implemented'
      }
    ]
  },
  {
    category: 'Cross-Sell Opportunities',
    icon: <Target className="w-4 h-4" />,
    commands: [
      {
        title: 'Product Mix Analysis',
        command: 'Show agents active in indexed annuities but not in variable annuities',
        description: 'Identifies cross-sell opportunities based on current product portfolio',
        status: '✅ Implemented'
      },
      {
        title: 'Cross-Sell Opportunity Flagging',
        command: 'Flag cross-sell opportunities for underutilized products',
        description: 'Product diversity analysis with recommendation flagging',
        status: '✅ Implemented'
      }
    ]
  },
  {
    category: 'Charts & Visualizations',
    icon: <BarChart3 className="w-4 h-4" />,
    commands: [
      {
        title: 'Territory Performance Heat Map',
        command: 'Show territory-based performance with cross-sell opportunities by license state',
        description: 'Visual heat map with state-level performance and opportunity indicators',
        status: '✅ Implemented'
      },
      {
        title: 'Q4 Performance Trends',
        command: 'Show me a chart of Q4 performance trends',
        description: 'Time-series visualization optimized for PowerPoint presentations',
        status: '✅ Implemented'
      }
    ]
  }
];

export const UATCommandDemo = ({ onExecuteCommand }) => {
  const [customCommand, setCustomCommand] = React.useState('');

  const handleExecuteCustomCommand = () => {
    if (customCommand.trim()) {
      onExecuteCommand(customCommand);
      setCustomCommand('');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-subtle border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">UAT Command Demonstrations</h2>
            <p className="text-sm text-muted-foreground">
              All UAT requirements implemented with enhanced functionality
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">50+</div>
            <div className="text-xs text-muted-foreground">Producer & Firm Scenarios</div>
          </div>
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">15+</div>
            <div className="text-xs text-muted-foreground">Email Drafting Scenarios</div>
          </div>
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">40+</div>
            <div className="text-xs text-muted-foreground">Chart Visualizations</div>
          </div>
        </div>
      </Card>

      {uatCommands.map((category, categoryIndex) => (
        <Card key={categoryIndex} className="p-4">
          <div className="flex items-center gap-2 mb-4">
            {category.icon}
            <h3 className="font-semibold text-foreground">{category.category}</h3>
            <Badge variant="default" className="ml-auto">
              {category.commands.length} Commands
            </Badge>
          </div>
          
          <div className="space-y-3">
            {category.commands.map((cmd, cmdIndex) => (
              <div key={cmdIndex} className="border border-border rounded-lg p-3 hover:bg-muted/30 transition-fast">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm text-foreground">{cmd.title}</h4>
                      <Badge variant="default" className="text-xs">
                        {cmd.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {cmd.description}
                    </p>
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {cmd.command}
                    </code>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onExecuteCommand(cmd.command)}
                    className="shrink-0"
                  >
                    Execute
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Custom Command Testing
        </h3>
        <div className="space-y-3">
          <Textarea
            value={customCommand}
            onChange={(e) => setCustomCommand(e.target.value)}
            placeholder="Enter your custom command to test UAT functionality..."
            className="min-h-[80px]"
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleExecuteCustomCommand}
              disabled={!customCommand.trim()}
              variant="premium"
            >
              Execute Custom Command
            </Button>
            <Button 
              variant="outline"
              onClick={() => setCustomCommand('Show me agents with lapsed policies in the last 6 months by territory')}
            >
              Load Sample Command
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
