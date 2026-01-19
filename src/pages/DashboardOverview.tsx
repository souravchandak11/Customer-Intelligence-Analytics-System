import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { CustomerDemographics } from '@/components/dashboard/CustomerDemographics';
import { SegmentationChart } from '@/components/dashboard/SegmentationChart';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

const DashboardOverview = () => {
  const { kpiData, sessionMetrics, isImported } = useAnalyticsData();

  return (
    <div className="space-y-6">
      {/* Data Source Indicator */}
      {!isImported && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert className="border-primary/30 bg-primary/5">
            <Upload className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                Viewing <Badge variant="secondary">Sample Data</Badge> — Import your own customer data to see real RFM insights
              </span>
              <Button variant="outline" size="sm" asChild>
                <Link to="/import">Import Data</Link>
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {isImported && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert className="border-success/30 bg-success/5">
            <AlertDescription className="flex items-center gap-2">
              <Badge variant="default" className="bg-success">Live Data</Badge>
              <span>Dashboard is showing insights from your imported customer data</span>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            changeLabel={kpi.changeLabel}
            trend={kpi.trend}
            color={kpi.color}
            isPrimary={index === 0}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Demographics and Segmentation Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CustomerDemographics />
        </div>
        <div>
          <SegmentationChart />
        </div>
      </div>

      {/* Session Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Avg. Session Duration"
          value={sessionMetrics.avgDuration}
          change={sessionMetrics.durationChange}
          target="Target 10m"
          targetValue={55}
          progress={55}
          delay={0.4}
        />
        <MetricCard
          title="Bounce Rate"
          value={sessionMetrics.bounceRate}
          change={sessionMetrics.bounceChange}
          chartData={[45, 52, 48, 60, 55, 42, 38, 45, 50, 48]}
          delay={0.5}
        />
        <MetricCard
          title="Avg. Session Frequency"
          value={sessionMetrics.avgFrequency}
          change={sessionMetrics.frequencyChange}
          target="Target 10"
          targetValue={52}
          progress={52}
          delay={0.6}
        />
      </div>
    </div>
  );
};

export default DashboardOverview;
