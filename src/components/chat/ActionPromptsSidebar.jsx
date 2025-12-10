import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Users,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Target,
  Mail,
  Activity,
  BarChart3,
  TrendingDown,
  Star,
  List,
  Zap
} from 'lucide-react';

const actionPromptsData = [
  {
    title: "What can I help you with today?.",
    prompts: [
      { label: "Find Opportunities", icon: Search, variant: "default", description: "Create a list of producers who are most likely to submit a large case life or annuity policy within the next 30 days. " },
      { label: "Agent Cross-Sell", icon: Users, variant: "secondary", description: "Create a list of my producers who currently sell one product line (life or annuity), but are likely to sell more than one product line in the future." },
      { label: "Plan Follow-Ups", icon: Calendar, variant: "accent", description: "Create a list of producers who had cases pay within the last week, arranged by premium in descending order. " }
    ]
  },
  {
    title: "Choose where to focus:",
    prompts: [
      { label: "At-Risk Producers", icon: AlertTriangle, variant: "default", description: "Create a current list of my top producers by premium sold who are most at risk of leaving." },
      { label: "Future Top Producers", icon: TrendingUp, variant: "secondary", description: "Create a list of my current producers who are most likely to achieve top producer status within the next two years. " },
      { label: "Rising New Agents", icon: Target, variant: "accent", description: "Create a list of my producers contracted less than one year ago, who are likely to experience business growth of 30%*, year-over-year." }
    ]
  },
  {
    title: "Ready to accelerate growth?",
    prompts: [
      { label: "Producer Progression ", icon: Star, variant: "default", description: "Create a list of producers with next-step progression delays over 3 days" },
      { label: "Engagement Data ", icon: Mail, variant: "secondary", description: "Provide me with lists of producers that engage the most with our company's agent portal, attend our monthly agent trainings and attend our live company events, year to date.  " },
    ]
  },
  {
    title: "Want quick intelligence?",
    prompts: [
      { label: "Distribution Insights", icon: BarChart3, variant: "default", description: "Generate a report of my total year-to-date premium by sales organization versus their annual sales goal for each group, as well as the total amount of pending business for each group." },
      { label: "Trend Analysis", icon: TrendingDown, variant: "secondary", description: "Create a line graph of my sales organizations' life and annuity premium sales over the last five years." },
      { label: "Create Sales Charts", icon: Star, variant: "accent", description: "Create a separate pie chart for each product type showing year-to-date sales by product.  Include a detailed breakdown of all life insurance and annuity products sold this year. " }
    ]
  },
  {
    title: "What should I work on for you?",
    prompts: [
      { label: "Build Task List", icon: List, variant: "default", description: "Considering my At-Risk Producers, Find Opportunities List, Future Top Producers List, and Rising New Agents List, recommend the optimal sequence of tasks my team should complete this week to achieve the greatest impact.  " },
      { label: "Highlight Opportunities", icon: Zap, variant: "secondary", description: "Create a list of all of my producers whose birthdays, contracting anniversaries, or who had their first paid policy occur this week." }
    ]
  }
];

export const ActionPromptsSidebar = ({ onPromptClick, showWelcome = false }) => {
  return (
    <div className="h-full flex flex-col bg-muted/30 min-w-[30rem]">
      <div className="p-6 border-b border-border">
        {/* <h2 className="text-lg font-semibold text-foreground">What can I help you with?</h2> */}
        {showWelcome && (
          <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-foreground/80">
              👋 Welcome! I'm here to help you manage your insurance business more effectively.
              Choose from the options below to get started, or ask me anything about your producers, policies, or performance data.
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {actionPromptsData.map((group, groupIndex) => (
          <Card key={groupIndex} className="p-4 bg-background border border-border/50 shadow-sm">
            <h3 className="text-sm font-medium text-foreground mb-3">
              {group.title}
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {group.prompts.map((prompt, promptIndex) => (
                <Button
                  key={promptIndex}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs rounded-full border border-border/40 hover:border-border transition-all duration-200 justify-start gap-2 px-3 bg-muted/50 hover:bg-muted"
                  onClick={() => onPromptClick(prompt.description)}
                >
                  <prompt.icon className="w-3 h-3 shrink-0" />
                  <span className="truncate">{prompt.label}</span>
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
