import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, Search, ArrowUpDown, ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react';

// CSV data type
type ProducerData = Record<string, string | number>;

type SortField = string;
type SortDirection = 'asc' | 'desc';

const AuditLayer = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('producer_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [csvData, setCsvData] = useState<ProducerData[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Parse CSV line properly handling quoted values
  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  // Load CSV data
  useEffect(() => {
    const loadCsvData = async () => {
      try {
        const response = await fetch('/producer_master.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
          setLoading(false);
          return;
        }
        
        const headers = parseCSVLine(lines[0]);
        setCsvHeaders(headers);
        
        const data = lines.slice(1).map((line, index) => {
          const values = parseCSVLine(line);
          const row: ProducerData = { id: index + 1 };
          headers.forEach((header, i) => {
            row[header] = values[i] || '';
          });
          return row;
        }).filter(row => Object.keys(row).length > 1);
        
        console.log('Loaded CSV data:', { headers: headers.length, rows: data.length, sampleRow: data[0] });
        setCsvData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading CSV data:', error);
        // Fallback to sample data if CSV loading fails
        const sampleHeaders = ['producer_id', 'producer_name', 'producer_email', 'producer_city', 'producer_state_name', 'ytd_premium_total_fmt', 'ml_risk_category', 'ml_potential_category'];
        const sampleData = [
          { id: 1, producer_id: '1', producer_name: 'Ravi Agarwal', producer_email: 'ravia@gmail.com', producer_city: 'Upper Fairview', producer_state_name: 'Illinois', ytd_premium_total_fmt: '$311,392', ml_risk_category: 'Medium', ml_potential_category: 'Growth' },
          { id: 2, producer_id: '2', producer_name: 'Janet Bianchi', producer_email: 'janet.bianchi@gmail.com', producer_city: 'Newport', producer_state_name: 'New York', ytd_premium_total_fmt: '$3,371,157', ml_risk_category: 'Medium', ml_potential_category: 'Top' },
          { id: 3, producer_id: '3', producer_name: 'Sarah Garcia', producer_email: 'sarah_garcia@gmail.com', producer_city: 'Old Brookfield', producer_state_name: 'Florida', ytd_premium_total_fmt: '$5,613,161', ml_risk_category: 'Medium', ml_potential_category: 'Growth' }
        ];
        setCsvHeaders(sampleHeaders);
        setCsvData(sampleData);
        setLoading(false);
      }
    };

    loadCsvData();
  }, []);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (loading || csvData.length === 0) return [];

    let filtered = csvData.filter(item => {
      const matchesSearch = 
        (item.producer_name && String(item.producer_name).toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.producer_email && String(item.producer_email).toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.producer_city && String(item.producer_city).toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.producer_state_name && String(item.producer_state_name).toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesSearch;
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle different data types
      if (sortField.includes('_raw') || sortField.includes('premium') || sortField.includes('score')) {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (sortField.includes('date')) {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [searchQuery, sortField, sortDirection, csvData, loading]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const handleDownload = () => {
    if (csvHeaders.length === 0) return;
    
    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...filteredAndSortedData.map(row => 
        csvHeaders.map(header => {
          const value = row[header] || '';
          // Escape commas and quotes in CSV
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `producer-master-audit-layer-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };


  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 hover:bg-muted/50 hover:border-muted-foreground/50 transition-all duration-200 hover:shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Meridian Wealth & Life Prediction Drivers Layer (Updated Weekly)
              </h1>
              <p className="text-muted-foreground">
                Comprehensive audit layer of data features driving machine learning predictions
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search agents, advisors and firms"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
            </div>

            <Button onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
            <table className="w-full min-w-max border-collapse">
              <thead className="bg-muted sticky top-0 z-10">
                <tr>
                  {csvHeaders.map((header) => (
                    <th 
                      key={header}
                      className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 transition-colors whitespace-nowrap min-w-[150px] border-r border-border/50"
                      onClick={() => handleSort(header)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[120px]" title={header}>
                          {header.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        {getSortIcon(header)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={csvHeaders.length} className="px-4 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        Loading data...
                      </div>
                    </td>
                  </tr>
                ) : filteredAndSortedData.length === 0 ? (
                  <tr>
                    <td colSpan={csvHeaders.length} className="px-4 py-12 text-center text-muted-foreground">
                      No data found
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedData.map((row, index) => (
                    <tr key={row.id || index} className="hover:bg-muted/30 transition-colors">
                      {csvHeaders.map((header) => (
                        <td 
                          key={header} 
                          className="px-4 py-3 text-sm text-foreground whitespace-nowrap min-w-[150px] border-r border-border/30"
                          title={String(row[header] || '')}
                        >
                          <div className="truncate max-w-[120px]">
                            {header.includes('_fmt') && row[header] ? (
                              <span className="font-mono text-green-600 font-semibold">{String(row[header])}</span>
                            ) : header.includes('_raw') && row[header] && !isNaN(Number(row[header])) ? (
                              <span className="font-mono text-blue-600">{Number(row[header]).toLocaleString()}</span>
                            ) : header.includes('date') && row[header] && row[header] !== '' ? (
                              <span className="text-purple-600">{new Date(String(row[header])).toLocaleDateString()}</span>
                            ) : header.includes('flag') && row[header] ? (
                              <Badge variant={String(row[header]) === 'True' ? 'default' : 'secondary'} className="text-xs">
                                {String(row[header])}
                              </Badge>
                            ) : header.includes('score') && row[header] && !isNaN(Number(row[header])) ? (
                              <span className="font-mono text-orange-600 font-semibold">{Number(row[header])}</span>
                            ) : header.includes('rate') && row[header] ? (
                              <span className="text-cyan-600 font-semibold">{String(row[header])}</span>
                            ) : header.includes('email') && row[header] ? (
                              <span className="text-blue-500 text-xs">{String(row[header])}</span>
                            ) : header.includes('name') && row[header] ? (
                              <span className="font-semibold text-foreground">{String(row[header])}</span>
                            ) : row[header] && String(row[header]).trim() !== '' ? (
                              <span className="text-foreground">{String(row[header])}</span>
                            ) : (
                              <span className="text-muted-foreground/50">-</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-2xl font-bold text-foreground">{filteredAndSortedData.length}</div>
            <div className="text-sm text-muted-foreground">Total Producers</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-foreground">
              {csvHeaders.length}
            </div>
            <div className="text-sm text-muted-foreground">Data Features</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-foreground">
              {filteredAndSortedData.filter(r => r.ml_risk_category === 'High').length}
            </div>
            <div className="text-sm text-muted-foreground">High Risk</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-foreground">
              {filteredAndSortedData.filter(r => r.ml_potential_category === 'Top').length}
            </div>
            <div className="text-sm text-muted-foreground">Top Potential</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuditLayer;
