import { motion } from 'framer-motion';
import { MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  target?: string;
  targetValue?: number;
  progress?: number;
  chartData?: number[];
  delay?: number;
}

export function MetricCard({
  title,
  value,
  change,
  target,
  targetValue,
  progress,
  chartData,
  delay = 0,
}: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between mb-2">
            <p className="text-2xl font-bold">{value}</p>
            <div
              className={cn(
                'flex items-center gap-1 text-sm font-medium',
                isPositive ? 'text-success' : 'text-destructive'
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {isPositive ? '+' : ''}
                {change}% from last month
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          {chartData && (
            <div className="flex items-end gap-1 h-12 my-3">
              {chartData.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${(value / Math.max(...chartData)) * 100}%` }}
                  transition={{ duration: 0.4, delay: delay + index * 0.05 }}
                  className={cn(
                    'flex-1 rounded-sm',
                    index === chartData.length - 1 ? 'bg-destructive' : 'bg-primary'
                  )}
                />
              ))}
            </div>
          )}

          {/* Target Progress */}
          {target && progress !== undefined && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">{target}</span>
                <span className="font-medium">{targetValue}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
