import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Download, Search, Filter, Mail, Calendar, UserPlus, Database, X } from 'lucide-react';
import { ActionDropdown } from './ActionDropdown';
import { FirmDetailModal } from './FirmDetailModal.jsx';

export const DetailedListView = ({
  isOpen,
  onClose,
  title,
  data,
  columns,
  onEmailAgent,
  onScheduleTouchpoint,
  onAssignFollowUp,
  onSyncToCRM = () => console.log('Sync to CRM clicked'),
  onDownloadCSV,
  allowDrillDown = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState({});
  const [showFirmDetail, setShowFirmDetail] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Generate dynamic filter options from data
  const getFilterOptions = (columnKey) => {
    const values = new Set();
    data.forEach(item => {
      const value = item[columnKey];
      if (value && value !== 'None' && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => values.add(v));
        } else {
          values.add(value.toString());
        }
      }
    });
    return Array.from(values).sort();
  };

  const filteredData = data.filter(item => {
    const matchesSearch = Object.values(item).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesFilters = Object.entries(filters).every(([columnKey, filterValue]) => {
      if (!filterValue || filterValue === 'all') return true;
      
      const itemValue = item[columnKey];
      if (!itemValue) return false;
      
      if (Array.isArray(itemValue)) {
        return itemValue.some(v => v.toString().toLowerCase().includes(filterValue.toLowerCase()));
      }
      
      return itemValue.toString().toLowerCase().includes(filterValue.toLowerCase());
    });
    
    return matchesSearch && matchesFilters;
  });

  const sortedData = sortColumn ? filteredData.sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDirection === 'asc' ? result : -result;
  }) : filteredData;

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const getRiskBadgeVariant = (risk) => {
    if (risk?.includes('High')) return 'destructive';
    if (risk?.includes('Medium')) return 'secondary';
    return 'outline';
  };

  const handleRowClick = (item) => {
    if (allowDrillDown && (title.includes('Firm') || title.includes('firm'))) {
      setSelectedFirm(item);
      setShowFirmDetail(true);
    }
  };

  const updateFilter = (columnKey, value) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'all').length;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[80vh] overflow-hidden flex flex-col liquid-glass">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-3 my-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  {columns
                    .filter(col => ['riskLevel', 'trainingStatus', 'issueType', 'emailBounced', 'crossSellOpportunity', 'crossSellFlag'].includes(col.key))
                    .map(column => {
                      const options = getFilterOptions(column.key);
                      if (options.length === 0) return null;
                      
                      return (
                        <div key={column.key} className="space-y-2">
                          <label className="text-sm font-medium">{column.label}</label>
                          <Select 
                            value={filters[column.key] || ''} 
                            onValueChange={(value) => updateFilter(column.key, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={`All ${column.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All {column.label}</SelectItem>
                              {options.map(option => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    })}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <ActionDropdown
            onEmailAgent={() => onEmailAgent('all')}
            onDownloadCSV={onDownloadCSV}
            onCopy={() => console.log('Copy clicked')}
            onSyncToCRM={onSyncToCRM}
            onAssignFollowUp={() => onAssignFollowUp('all')}
          />
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={column.key}
                    className={column.sortable ? 'cursor-pointer hover:text-foreground' : ''}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    {column.label}
                    {sortColumn === column.key && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item) => (
                  <TableRow 
                    key={item.id}
                    className={allowDrillDown && (title.includes('Firm') || title.includes('firm')) ? 'cursor-pointer hover:bg-muted/50' : ''}
                    onClick={() => handleRowClick(item)}
                  >
                     {columns.map((column) => (
                     <TableCell key={column.key} className="min-w-[150px] max-w-[250px]">
                         {column.key === 'riskLevel' ? (
                          <Badge variant={getRiskBadgeVariant(item[column.key])}>
                            {item[column.key]}
                          </Badge>
                        ) : column.key === 'trainingStatus' ? (
                          <Badge variant={
                            item[column.key] === 'Complete' ? 'default' :
                            item[column.key] === 'Incomplete' || item[column.key] === 'Overdue' ? 'destructive' :
                            'secondary'
                          }>
                            {item[column.key]}
                          </Badge>
                        ) : column.key === 'issueType' ? (
                          <Badge variant={
                            item[column.key]?.includes('Lapse') ? 'destructive' :
                            item[column.key]?.includes('Commission') ? 'secondary' :
                            'outline'
                          }>
                            {item[column.key]}
                          </Badge>
                        ) : column.key === 'crossSellFlag' || column.key === 'crossSellOpportunity' ? (
                          item[column.key] && item[column.key] !== 'None' ? (
                            <Badge variant="default">
                              {item[column.key]}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )
                        ) : column.key === 'commissionIssues' ? (
                          item[column.key] && item[column.key] !== 'None' ? (
                            <Badge variant="destructive">
                              {item[column.key]}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )
                        ) : column.key === 'emailBounced' ? (
                          <Badge variant={item[column.key] === 'Yes' ? 'destructive' : 'default'}>
                            {item[column.key]}
                          </Badge>
                        ) : Array.isArray(item[column.key]) ? (
                          <div className="flex gap-1 flex-wrap">
                            {item[column.key].map((state, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {state}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          item[column.key]
                        )}
                      </TableCell>
                   ))}
                 </TableRow>
               ))}
              </TableBody>
            </Table>
            
            {/* Action buttons below table - removed, using header dropdown instead */}
        </div>

        <div className="text-sm text-muted-foreground mt-3">
          Showing {sortedData.length} of {data.length} {title.toLowerCase().includes('firm') ? 'firms' : 'agents'}
          {allowDrillDown && (title.includes('Firm') || title.includes('firm')) && (
            <span className="ml-2 text-xs text-muted-foreground">
              • Click any row to view detailed information
            </span>
          )}
        </div>
        </DialogContent>
      </Dialog>

      <FirmDetailModal
        isOpen={showFirmDetail}
        onClose={() => {
          setShowFirmDetail(false);
          setSelectedFirm(null);
        }}
        firmData={selectedFirm}
      />
    </>
  );
};
