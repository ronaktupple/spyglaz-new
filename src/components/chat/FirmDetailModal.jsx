import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Users, TrendingUp, DollarSign, MapPin, Calendar, Activity, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FirmDetailModal = ({
  isOpen,
  onClose,
  firmData
}) => {
  if (!firmData) return null;

  // Map the dynamic data to expected fields
  const mappedFirmData = {
    name: firmData.name || firmData.firmName || 'Unknown Firm',
    totalPremium: firmData.totalPremium || '$0',
    producerCount: firmData.producerCount || 0,
    avgCaseSize: firmData.avgCaseSize || '$0',
    lapseRate: firmData.lapseRate || '0%',
    territory: firmData.territory || 'Unknown',
    licenseStates: firmData.licenseStates || [],
    trainingCompletion: firmData.trainingCompletion || '0%',
    lastActivity: firmData.lastActivity || 'Unknown',
    crossSellOpportunity: firmData.crossSellOpportunity || 'None',
    commissionIssues: firmData.commissionIssues || 'None'
  };

  // Mock producer data for the firm
  const mockProducers = [
    {
      id: '1',
      name: 'John Smith',
      premium: '$12.5M',
      caseCount: 45,
      lapseRate: '1.8%',
      lastActivity: '2024-01-20',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      premium: '$15.2M',
      caseCount: 38,
      lapseRate: '2.1%',
      lastActivity: '2024-01-18',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Mike Davis',
      premium: '$8.7M',
      caseCount: 22,
      lapseRate: '3.2%',
      lastActivity: '2023-12-15',
      status: 'At Risk'
    },
    {
      id: '4',
      name: 'Lisa Chen',
      premium: '$18.9M',
      caseCount: 52,
      lapseRate: '1.5%',
      lastActivity: '2024-01-22',
      status: 'Top Performer'
    }
  ];

  const productMix = [
    { product: 'Variable Annuities', percentage: '45%', premium: '$66.2M' },
    { product: 'Indexed Annuities', percentage: '30%', premium: '$44.2M' },
    { product: 'Life Insurance', percentage: '20%', premium: '$29.4M' },
    { product: 'Fixed Annuities', percentage: '5%', premium: '$7.4M' }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Top Performer':
        return 'default';
      case 'Active':
        return 'secondary';
      case 'At Risk':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col liquid-glass">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {mappedFirmData.name} - Detailed Analysis
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="producers">Producers</TabsTrigger>
            <TabsTrigger value="products">Product Mix</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Premium</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mappedFirmData.totalPremium}</div>
                  <p className="text-xs text-muted-foreground">Annual premium volume</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Producers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mappedFirmData.producerCount}</div>
                  <p className="text-xs text-muted-foreground">Active producers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Case Size</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mappedFirmData.avgCaseSize}</div>
                  <p className="text-xs text-muted-foreground">Per case average</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Territory Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Territory</label>
                    <p className="text-sm">{mappedFirmData.territory}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">License States</label>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {Array.isArray(mappedFirmData.licenseStates) ? mappedFirmData.licenseStates.map((state) => (
                        <Badge key={state} variant="outline" className="text-xs">
                          {state}
                        </Badge>
                      )) : (
                        <span className="text-muted-foreground text-xs">Not specified</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Lapse Rate</label>
                    <p className="text-sm">
                      <Badge variant={parseFloat(mappedFirmData.lapseRate) > 2.5 ? 'destructive' : 'secondary'}>
                        {mappedFirmData.lapseRate}
                      </Badge>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Training Completion</label>
                    <p className="text-sm">{mappedFirmData.trainingCompletion}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Activity</label>
                    <p className="text-sm flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {mappedFirmData.lastActivity}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Cross-Sell Opportunity</label>
                    <p className="text-sm">
                      {mappedFirmData.crossSellOpportunity !== 'None' ? (
                        <Badge variant="default">{mappedFirmData.crossSellOpportunity}</Badge>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Commission Issues</label>
                    <p className="text-sm">
                      {mappedFirmData.commissionIssues !== 'None' ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {mappedFirmData.commissionIssues}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="producers" className="overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle>Associated Producers</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producer Name</TableHead>
                      <TableHead>Premium Volume</TableHead>
                      <TableHead>Case Count</TableHead>
                      <TableHead>Lapse Rate</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProducers.map((producer) => (
                      <TableRow key={producer.id}>
                        <TableCell className="font-medium">{producer.name}</TableCell>
                        <TableCell>{producer.premium}</TableCell>
                        <TableCell>{producer.caseCount}</TableCell>
                        <TableCell>
                          <Badge variant={parseFloat(producer.lapseRate) > 2.5 ? 'destructive' : 'secondary'}>
                            {producer.lapseRate}
                          </Badge>
                        </TableCell>
                        <TableCell>{producer.lastActivity}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadge(producer.status)}>
                            {producer.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle>Product Mix Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Type</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Premium Volume</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productMix.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.product}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.percentage}</Badge>
                        </TableCell>
                        <TableCell>{product.premium}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
