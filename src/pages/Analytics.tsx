import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { TrendingUp, DollarSign, Users, Target, Upload } from 'lucide-react';

const Analytics = () => {
  const { segments, monthlyTrend, totalRevenue, totalCustomers, averageCLV, isImported } = useAnalyticsData();

  const revenueData = segments.map((s) => ({
    name: s.name.length > 12 ? s.name.slice(0, 10) + '...' : s.name,
    revenue: s.revenue / 1000,
    customers: s.customers / 100,
  }));

  const clvData = segments.map((s) => ({ name: s.name, clv: s.avgCLV }));

  const stats = [
    { 
      title: 'Total Revenue', 
      value: `$${(totalRevenue / 1000000).toFixed(2)}M`, 
      icon: DollarSign, 
      change: isImported ? 'Live data' : '+17.1%' 
    },
    { 
      title: 'Total Customers', 
      value: totalCustomers.toLocaleString(), 
      icon: Users, 
      change: isImported ? 'Live data' : '+18.5%' 
    },
    { 
      title: 'Avg. CLV', 
      value: `$${averageCLV.toLocaleString()}`, 
      icon: TrendingUp, 
      change: isImported ? 'Live data' : '-9.4%' 
    },
    { 
      title: 'Active Segments', 
      value: segments.length.toString(), 
      icon: Target, 
      change: isImported ? 'Live data' : '8 segments' 
    },
  ];

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
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            {isImported 
              ? 'Revenue and customer insights from your imported data' 
              : 'Revenue and customer insights across segments'}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={`mt-2 ${
                    stat.change === 'Live data' 
                      ? 'text-success' 
                      : stat.change.startsWith('+') 
                        ? 'text-success' 
                        : 'text-destructive'
                  }`}
                >
                  {stat.change}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Segment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Revenue by Segment (in $K)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                                <p className="font-medium">{label}</p>
                                <p className="text-sm text-muted-foreground">
                                  Revenue: ${payload[0].value}K
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                              <p className="font-medium mb-2">{label}</p>
                              {payload.map((entry, index) => (
                                <p key={index} className="text-sm" style={{ color: entry.color }}>
                                  {entry.name}: {entry.value?.toLocaleString()}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                      name="Revenue ($)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="customers"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--success))' }}
                      name="Customers"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* CLV Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Average CLV by Segment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {clvData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clvData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                              <p className="font-medium">{label}</p>
                              <p className="text-sm text-muted-foreground">
                                Avg CLV: ${payload[0].value}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="clv" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Analytics;
