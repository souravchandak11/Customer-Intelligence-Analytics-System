import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  trend: number[];
  color: 'primary' | 'success' | 'warning' | 'destructive';
  isPrimary?: boolean;
  delay?: number;
}

export function KPICard({
  title,
  value,
  change,
  changeLabel,
  trend,
  color,
  isPrimary = false,
  delay = 0,
}: KPICardProps) {
  const isPositive = change >= 0;

  // Simple sparkline SVG
  const sparklinePath = () => {
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min || 1;
    const width = 120;
    const height = 40;
    const points = trend.map((value, index) => {
      const x = (index / (trend.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card
        className={cn(
          'overflow-hidden transition-all hover:card-shadow-lg',
          isPrimary ? 'gradient-primary text-primary-foreground' : 'bg-card'
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <span
              className={cn(
                'text-sm font-medium',
                isPrimary ? 'text-primary-foreground/80' : 'text-muted-foreground'
              )}
            >
              {title}
            </span>
            <ArrowRight
              className={cn(
                'w-4 h-4',
                isPrimary ? 'text-primary-foreground/60' : 'text-muted-foreground'
              )}
            />
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p
                className={cn(
                  'text-2xl font-bold mb-2',
                  isPrimary ? 'text-primary-foreground' : 'text-foreground'
                )}
              >
                {value}
              </p>

              {/* Sparkline */}
              <svg
                viewBox="0 0 120 40"
                className={cn(
                  'w-28 h-10',
                  isPrimary ? 'stroke-primary-foreground/60' : color === 'success' ? 'stroke-success' : color === 'destructive' || color === 'warning' ? 'stroke-warning' : 'stroke-primary'
                )}
                fill="none"
                strokeWidth="2"
              >
                <path d={sparklinePath()} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="text-right">
              <div
                className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  isPrimary
                    ? 'text-primary-foreground'
                    : isPositive
                    ? 'text-success'
                    : 'text-destructive'
                )}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {isPositive ? '+' : ''}
                  {change}%
                </span>
              </div>
              <span
                className={cn(
                  'text-xs',
                  isPrimary ? 'text-primary-foreground/60' : 'text-muted-foreground'
                )}
              >
                {changeLabel}
              </span>
            </div>
          </div>

          {/* Time Range Selector */}
          <div
            className={cn(
              'flex gap-1 mt-4 text-xs',
              isPrimary ? 'text-primary-foreground/60' : 'text-muted-foreground'
            )}
          >
            {['1D', '1W', '1M', '3M', '6M', '1Y'].map((period, index) => (
              <button
                key={period}
                className={cn(
                  'px-2 py-1 rounded transition-colors',
                  index === 4
                    ? isPrimary
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-primary text-primary-foreground'
                    : 'hover:bg-primary/10'
                )}
              >
                {period}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
