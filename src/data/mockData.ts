// Mock data for Customer Analytics Platform

export interface CustomerSegment {
  name: string;
  customers: number;
  revenue: number;
  avgCLV: number;
  retentionRate: number;
  color: string;
  rScoreRange: string;
  fScoreRange: string;
  mScoreRange: string;
  treatment: string;
  actions: string[];
}

export interface KPIData {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  trend: number[];
  color: 'primary' | 'success' | 'warning' | 'destructive';
}

export interface TopCustomer {
  id: string;
  name: string;
  segment: string;
  clv: number;
  totalOrders: number;
  lastOrder: string;
  avgOrderValue: number;
}

export interface CountryData {
  country: string;
  flag: string;
  customers: number;
  percentage: number;
}

export const customerSegments: CustomerSegment[] = [
  {
    name: 'Champions',
    customers: 8234,
    revenue: 1240000,
    avgCLV: 1520,
    retentionRate: 95,
    color: 'hsl(var(--chart-1))',
    rScoreRange: '4-5',
    fScoreRange: '4-5',
    mScoreRange: '4-5',
    treatment: 'Reward & Retain',
    actions: ['VIP programs', 'Early access', 'Referral incentives'],
  },
  {
    name: 'Loyal Customers',
    customers: 12456,
    revenue: 680000,
    avgCLV: 890,
    retentionRate: 82,
    color: 'hsl(var(--chart-2))',
    rScoreRange: '3-5',
    fScoreRange: '3-5',
    mScoreRange: '3-5',
    treatment: 'Upsell & Cross-sell',
    actions: ['Product recommendations', 'Loyalty rewards'],
  },
  {
    name: 'Potential Loyalists',
    customers: 9872,
    revenue: 420000,
    avgCLV: 650,
    retentionRate: 68,
    color: 'hsl(var(--chart-5))',
    rScoreRange: '4-5',
    fScoreRange: '1-3',
    mScoreRange: '1-3',
    treatment: 'Nurture & Engage',
    actions: ['Welcome series', 'Educational content', 'Incentives'],
  },
  {
    name: 'At Risk',
    customers: 6543,
    revenue: 380000,
    avgCLV: 720,
    retentionRate: 45,
    color: 'hsl(var(--chart-3))',
    rScoreRange: '1-2',
    fScoreRange: '4-5',
    mScoreRange: '4-5',
    treatment: 'Win Back Campaigns',
    actions: ['Re-engagement emails', 'Special offers', 'Surveys'],
  },
  {
    name: "Can't Lose Them",
    customers: 4321,
    revenue: 520000,
    avgCLV: 1180,
    retentionRate: 38,
    color: 'hsl(var(--chart-4))',
    rScoreRange: '1-2',
    fScoreRange: '4-5',
    mScoreRange: '4-5',
    treatment: 'Aggressive Retention',
    actions: ['Personal outreach', 'Exclusive deals', 'Feedback'],
  },
  {
    name: 'Hibernating',
    customers: 8765,
    revenue: 180000,
    avgCLV: 280,
    retentionRate: 22,
    color: 'hsl(var(--chart-6))',
    rScoreRange: '1-2',
    fScoreRange: '2-3',
    mScoreRange: '2-3',
    treatment: 'Reactivation',
    actions: ['Winback campaigns', 'Surveys'],
  },
  {
    name: 'New Customers',
    customers: 5432,
    revenue: 210000,
    avgCLV: 380,
    retentionRate: 58,
    color: 'hsl(var(--chart-7))',
    rScoreRange: '4-5',
    fScoreRange: '1',
    mScoreRange: '1-2',
    treatment: 'Onboarding & Activation',
    actions: ['Welcome bonus', 'Tutorials', 'First purchase incentives'],
  },
  {
    name: 'Lost Customers',
    customers: 3456,
    revenue: 45000,
    avgCLV: 120,
    retentionRate: 5,
    color: 'hsl(var(--chart-8))',
    rScoreRange: '1-2',
    fScoreRange: '1-2',
    mScoreRange: '1-2',
    treatment: 'Low-effort Retention',
    actions: ['Minimal spend', 'Occasional check-ins'],
  },
];

export const kpiData: KPIData[] = [
  {
    title: 'Total Revenue',
    value: '$2,475,000',
    change: 17.11,
    changeLabel: '$362,750',
    trend: [40, 45, 42, 55, 48, 60, 58, 65, 70, 68, 72, 78],
    color: 'primary',
  },
  {
    title: 'Total Customers',
    value: '52,431',
    change: 18.59,
    changeLabel: '8,234',
    trend: [30, 35, 38, 42, 45, 48, 52, 55, 58, 62, 65, 70],
    color: 'success',
  },
  {
    title: 'Average CLV',
    value: '$458',
    change: -9.45,
    changeLabel: '$48',
    trend: [60, 58, 55, 52, 50, 48, 52, 50, 48, 45, 42, 40],
    color: 'warning',
  },
  {
    title: 'Retention Rate',
    value: '68.4%',
    change: 11.39,
    changeLabel: '7.2%',
    trend: [45, 48, 52, 55, 58, 60, 62, 65, 68, 70, 72, 75],
    color: 'success',
  },
];

export const topCustomers: TopCustomer[] = [
  { id: 'C001', name: 'Acme Corporation', segment: 'Champions', clv: 45200, totalOrders: 156, lastOrder: '2026-01-18', avgOrderValue: 289 },
  { id: 'C002', name: 'TechFlow Inc.', segment: 'Champions', clv: 42800, totalOrders: 142, lastOrder: '2026-01-17', avgOrderValue: 301 },
  { id: 'C003', name: 'Global Dynamics', segment: 'Champions', clv: 38900, totalOrders: 128, lastOrder: '2026-01-15', avgOrderValue: 304 },
  { id: 'C004', name: 'Innovate Labs', segment: 'Loyal Customers', clv: 35200, totalOrders: 115, lastOrder: '2026-01-16', avgOrderValue: 306 },
  { id: 'C005', name: 'NextGen Solutions', segment: 'Champions', clv: 32100, totalOrders: 108, lastOrder: '2026-01-14', avgOrderValue: 297 },
  { id: 'C006', name: 'Quantum Systems', segment: 'Loyal Customers', clv: 29800, totalOrders: 98, lastOrder: '2026-01-13', avgOrderValue: 304 },
  { id: 'C007', name: 'Peak Performance', segment: 'Champions', clv: 28500, totalOrders: 92, lastOrder: '2026-01-12', avgOrderValue: 310 },
  { id: 'C008', name: 'Elite Enterprises', segment: 'Loyal Customers', clv: 26200, totalOrders: 88, lastOrder: '2026-01-11', avgOrderValue: 298 },
];

export const countryData: CountryData[] = [
  { country: 'United States', flag: '🇺🇸', customers: 45548, percentage: 32 },
  { country: 'United Kingdom', flag: '🇬🇧', customers: 38256, percentage: 27 },
  { country: 'Brazil', flag: '🇧🇷', customers: 34522, percentage: 24 },
  { country: 'Canada', flag: '🇨🇦', customers: 31482, percentage: 17 },
];

export const segmentDistribution = customerSegments.map(s => ({
  name: s.name,
  value: s.customers,
  color: s.color,
}));

export const revenueBySegment = customerSegments.map(s => ({
  name: s.name,
  revenue: s.revenue,
  color: s.color,
}));

export const monthlyTrend = [
  { month: 'Jul', revenue: 180000, customers: 42000 },
  { month: 'Aug', revenue: 195000, customers: 44500 },
  { month: 'Sep', revenue: 210000, customers: 46200 },
  { month: 'Oct', revenue: 225000, customers: 48100 },
  { month: 'Nov', revenue: 248000, customers: 50300 },
  { month: 'Dec', revenue: 275000, customers: 52431 },
];

export const rfmHeatmapData = [
  { r: 5, f: 5, m: 5, count: 1234 },
  { r: 5, f: 5, m: 4, count: 892 },
  { r: 5, f: 4, m: 5, count: 756 },
  { r: 4, f: 5, m: 5, count: 678 },
  { r: 5, f: 4, m: 4, count: 1456 },
  { r: 4, f: 4, m: 4, count: 2345 },
  { r: 3, f: 3, m: 3, count: 4567 },
  { r: 2, f: 2, m: 2, count: 3456 },
  { r: 1, f: 1, m: 1, count: 2123 },
];

export const sessionMetrics = {
  avgDuration: '25m 32s',
  durationChange: 12.3,
  bounceRate: '42.3%',
  bounceChange: -3.2,
  avgFrequency: '5.2',
  frequencyChange: 8,
};
