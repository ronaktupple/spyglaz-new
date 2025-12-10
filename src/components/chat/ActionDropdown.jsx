import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Download, Copy, Mail, Database, UserPlus } from 'lucide-react';

export const ActionDropdown = ({
  onEmailAgent,
  onDownloadCSV,
  onCopy,
  onSyncToCRM,
  onAssignFollowUp,
  variant = 'outline',
  size = 'sm'
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 border-0 shadow-none hover:bg-transparent focus-visible:ring-0" aria-label="Actions">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border border-border z-[60]">
        <DropdownMenuItem onClick={onDownloadCSV}>
          <Download className="w-4 h-4 mr-2" />
          Download CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCopy}>
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEmailAgent}>
          <Mail className="w-4 h-4 mr-2" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSyncToCRM}>
          <Database className="w-4 h-4 mr-2" />
          Sync to CRM
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAssignFollowUp}>
          <UserPlus className="w-4 h-4 mr-2" />
          Assign Follow-Up
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
