import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { customerSegments } from '@/data/mockData';

const chartColors = [
  'hsl(243, 75%, 59%)',   // Primary
  'hsl(142, 76%, 36%)',   // Success
  'hsl(199, 89%, 48%)',   // Info
  'hsl(38, 92%, 50%)',    // Warning
  'hsl(0, 84%, 60%)',     // Destructive
  'hsl(280, 65%, 60%)',   // Purple
  'hsl(24, 95%, 53%)',    // Orange
  'hsl(173, 80%, 40%)',   // Teal
];

export function SegmentationChart() {
  const totalCustomers = customerSegments.reduce((sum, s) => sum + s.customers, 0);
  
  const data = customerSegments.map((segment, index) => ({
    name: segment.name,
    value: segment.customers,
    color: chartColors[index % chartColors.length],
    percentage: ((segment.customers / totalCustomers) * 100).toFixed(0),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Customer Segmentation</CardTitle>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {data.value.toLocaleString()} customers ({data.percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="text-xl font-bold">{totalCustomers.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {data.slice(0, 3).map((segment) => (
              <div key={segment.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-muted-foreground">{segment.name}</span>
                </div>
                <span className="font-medium">
                  {segment.value.toLocaleString()} ({segment.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
