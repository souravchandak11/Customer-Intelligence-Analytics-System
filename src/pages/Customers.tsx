import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { Search, Download, ArrowUpDown, Eye, Mail, MoreHorizontal, Upload } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const segmentColors: Record<string, string> = {
  'Champions': 'bg-primary text-primary-foreground',
  'Loyal Customers': 'bg-success text-success-foreground',
  'Potential Loyalists': 'bg-info text-info-foreground',
  'At Risk': 'bg-warning text-warning-foreground',
  "Can't Lose Them": 'bg-destructive text-destructive-foreground',
  'Hibernating': 'bg-muted text-muted-foreground',
  'New Customers': 'bg-accent text-accent-foreground',
  'Lost Customers': 'bg-secondary text-secondary-foreground',
};

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const { topCustomers, segments, isImported } = useAnalyticsData();

  const filteredCustomers = useMemo(() => {
    return topCustomers.filter((customer) => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSegment = 
        segmentFilter === 'all' || customer.segment === segmentFilter;
      
      return matchesSearch && matchesSegment;
    });
  }, [topCustomers, searchQuery, segmentFilter]);

  const uniqueSegments = useMemo(() => {
    return [...new Set(topCustomers.map((c) => c.segment))];
  }, [topCustomers]);

  const handleExport = () => {
    const headers = ['Customer ID', 'Name', 'Segment', 'CLV', 'Total Orders', 'Avg Order Value', 'Last Order'];
    const csvContent = [
      headers.join(','),
      ...filteredCustomers.map((c) => 
        [c.id, `"${c.name}"`, c.segment, c.clv, c.totalOrders, c.avgOrderValue, c.lastOrder].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Data Source Alert */}
      {!isImported && (
        <Alert className="border-primary/30 bg-primary/5">
          <Upload className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Viewing <Badge variant="secondary">Sample Data</Badge>
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link to="/import">Import Your Data</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Top Customers</h1>
          <p className="text-muted-foreground">
            {isImported ? 'Customers ranked by calculated RFM scores' : 'Top 100 customers ranked by Customer Lifetime Value'}
          </p>
        </div>
        <Button className="gap-2" onClick={handleExport}>
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Segments</SelectItem>
                  {uniqueSegments.map((seg) => (
                    <SelectItem key={seg} value={seg}>{seg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="font-semibold">Customer ID</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Segment</TableHead>
                  <TableHead className="font-semibold text-right">CLV</TableHead>
                  <TableHead className="font-semibold text-right">Orders</TableHead>
                  <TableHead className="font-semibold text-right">Avg Order</TableHead>
                  <TableHead className="font-semibold">Last Order</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No customers found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <TableCell className="font-medium text-muted-foreground">
                        {customer.id}
                      </TableCell>
                      <TableCell className="font-semibold">{customer.name}</TableCell>
                      <TableCell>
                        <Badge className={segmentColors[customer.segment] || 'bg-secondary'}>
                          {customer.segment}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ${customer.clv.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">{customer.totalOrders}</TableCell>
                      <TableCell className="text-right">${customer.avgOrderValue}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(customer.lastOrder).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Eye className="w-4 h-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Mail className="w-4 h-4" />
                              Send Email
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>Showing {filteredCustomers.length} of {topCustomers.length} customers</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
