import { motion } from 'framer-motion';
import { KPICard } from '@/components/dashboard/KPICard';
import { CustomerDemographics } from '@/components/dashboard/CustomerDemographics';
import { SegmentationChart } from '@/components/dashboard/SegmentationChart';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { kpiData, sessionMetrics } from '@/data/mockData';

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
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
