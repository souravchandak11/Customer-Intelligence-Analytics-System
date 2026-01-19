import { useMemo } from 'react';
import { useCustomerStore } from '@/stores/customerStore';
import { 
  customerSegments as mockSegments, 
  topCustomers as mockTopCustomers,
  kpiData as mockKpiData,
  monthlyTrend as mockMonthlyTrend,
  countryData as mockCountryData,
  sessionMetrics as mockSessionMetrics,
  KPIData,
  CustomerSegment,
  TopCustomer,
} from '@/data/mockData';

export function useAnalyticsData() {
  const { 
    isUsingImportedData, 
    customers: importedCustomers, 
    segmentStats: importedSegments,
    getTotalRevenue,
    getTotalCustomers,
    getAverageCLV,
  } = useCustomerStore();

  const data = useMemo(() => {
    if (!isUsingImportedData || importedCustomers.length === 0) {
      // Return mock data
      return {
        isImported: false,
        segments: mockSegments,
        topCustomers: mockTopCustomers,
        kpiData: mockKpiData,
        monthlyTrend: mockMonthlyTrend,
        countryData: mockCountryData,
        sessionMetrics: mockSessionMetrics,
        totalRevenue: 2475000,
        totalCustomers: 52431,
        averageCLV: 458,
      };
    }

    // Transform imported data
    const totalRevenue = getTotalRevenue();
    const totalCustomers = getTotalCustomers();
    const averageCLV = getAverageCLV();

    // Map segment stats to CustomerSegment format
    const segments: CustomerSegment[] = importedSegments.map((seg) => ({
      name: seg.name,
      customers: seg.customers,
      revenue: seg.revenue,
      avgCLV: seg.avgCLV,
      retentionRate: seg.retentionRate,
      color: seg.color,
      rScoreRange: seg.rScoreRange,
      fScoreRange: seg.fScoreRange,
      mScoreRange: seg.mScoreRange,
      treatment: seg.treatment,
      actions: seg.actions,
    }));

    // Map imported customers to TopCustomer format
    const topCustomers: TopCustomer[] = importedCustomers.slice(0, 100).map((c) => ({
      id: c.id,
      name: c.name,
      segment: c.segment,
      clv: c.clv,
      totalOrders: c.totalOrders,
      lastOrder: c.lastOrder,
      avgOrderValue: c.avgOrderValue,
    }));

    // Generate dynamic KPI data
    const kpiData: KPIData[] = [
      {
        title: 'Total Revenue',
        value: `$${(totalRevenue / 1000).toFixed(0)}K`,
        change: 0, // Would need historical data to calculate
        changeLabel: 'Imported data',
        trend: generateTrendData(totalRevenue),
        color: 'primary',
      },
      {
        title: 'Total Customers',
        value: totalCustomers.toLocaleString(),
        change: 0,
        changeLabel: 'Imported data',
        trend: generateTrendData(totalCustomers),
        color: 'success',
      },
      {
        title: 'Average CLV',
        value: `$${averageCLV.toLocaleString()}`,
        change: 0,
        changeLabel: 'Imported data',
        trend: generateTrendData(averageCLV),
        color: 'warning',
      },
      {
        title: 'Retention Rate',
        value: calculateRetentionRate(segments) + '%',
        change: 0,
        changeLabel: 'Imported data',
        trend: generateTrendData(68),
        color: 'success',
      },
    ];

    return {
      isImported: true,
      segments,
      topCustomers,
      kpiData,
      monthlyTrend: mockMonthlyTrend, // Would need time-series data
      countryData: mockCountryData, // Would need geo data
      sessionMetrics: mockSessionMetrics, // Would need session data
      totalRevenue,
      totalCustomers,
      averageCLV,
    };
  }, [isUsingImportedData, importedCustomers, importedSegments, getTotalRevenue, getTotalCustomers, getAverageCLV]);

  return data;
}

// Helper to generate mock trend data
function generateTrendData(baseValue: number): number[] {
  const points = 12;
  const trend: number[] = [];
  let value = baseValue * 0.7;
  
  for (let i = 0; i < points; i++) {
    value += (baseValue * 0.3) / points + (Math.random() - 0.5) * (baseValue * 0.05);
    trend.push(Math.round(value));
  }
  
  return trend;
}

// Calculate weighted retention rate from segments
function calculateRetentionRate(segments: CustomerSegment[]): string {
  if (segments.length === 0) return '0';
  
  const totalCustomers = segments.reduce((sum, s) => sum + s.customers, 0);
  const weightedRetention = segments.reduce(
    (sum, s) => sum + s.retentionRate * s.customers,
    0
  );
  
  return (weightedRetention / totalCustomers).toFixed(1);
}
