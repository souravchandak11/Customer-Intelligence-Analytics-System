// RFM Score Calculator Utility

export interface TransactionData {
  customerId: string;
  customerName: string;
  transactionDate: string;
  amount: number;
  orderId?: string;
}

export interface CustomerRFM {
  id: string;
  name: string;
  recency: number; // Days since last purchase
  frequency: number; // Total number of purchases
  monetary: number; // Total spend
  rScore: number; // 1-5
  fScore: number; // 1-5
  mScore: number; // 1-5
  rfmScore: number; // Combined score
  segment: string;
  clv: number;
  totalOrders: number;
  lastOrder: string;
  avgOrderValue: number;
}

export interface RFMSegmentStats {
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

// RFM Segment definitions based on score combinations
const segmentDefinitions = [
  {
    name: 'Champions',
    rRange: [4, 5],
    fRange: [4, 5],
    mRange: [4, 5],
    color: 'hsl(var(--chart-1))',
    treatment: 'Reward & Retain',
    actions: ['VIP programs', 'Early access', 'Referral incentives'],
    retentionRate: 95,
  },
  {
    name: 'Loyal Customers',
    rRange: [3, 5],
    fRange: [3, 5],
    mRange: [3, 5],
    color: 'hsl(var(--chart-2))',
    treatment: 'Upsell & Cross-sell',
    actions: ['Product recommendations', 'Loyalty rewards'],
    retentionRate: 82,
  },
  {
    name: 'Potential Loyalists',
    rRange: [4, 5],
    fRange: [1, 3],
    mRange: [1, 3],
    color: 'hsl(var(--chart-5))',
    treatment: 'Nurture & Engage',
    actions: ['Welcome series', 'Educational content', 'Incentives'],
    retentionRate: 68,
  },
  {
    name: 'At Risk',
    rRange: [1, 2],
    fRange: [4, 5],
    mRange: [4, 5],
    color: 'hsl(var(--chart-3))',
    treatment: 'Win Back Campaigns',
    actions: ['Re-engagement emails', 'Special offers', 'Surveys'],
    retentionRate: 45,
  },
  {
    name: "Can't Lose Them",
    rRange: [1, 2],
    fRange: [3, 5],
    mRange: [4, 5],
    color: 'hsl(var(--chart-4))',
    treatment: 'Aggressive Retention',
    actions: ['Personal outreach', 'Exclusive deals', 'Feedback'],
    retentionRate: 38,
  },
  {
    name: 'Hibernating',
    rRange: [1, 2],
    fRange: [2, 3],
    mRange: [2, 3],
    color: 'hsl(var(--chart-6))',
    treatment: 'Reactivation',
    actions: ['Winback campaigns', 'Surveys'],
    retentionRate: 22,
  },
  {
    name: 'New Customers',
    rRange: [4, 5],
    fRange: [1, 1],
    mRange: [1, 2],
    color: 'hsl(var(--chart-7))',
    treatment: 'Onboarding & Activation',
    actions: ['Welcome bonus', 'Tutorials', 'First purchase incentives'],
    retentionRate: 58,
  },
  {
    name: 'Lost Customers',
    rRange: [1, 2],
    fRange: [1, 2],
    mRange: [1, 2],
    color: 'hsl(var(--chart-8))',
    treatment: 'Low-effort Retention',
    actions: ['Minimal spend', 'Occasional check-ins'],
    retentionRate: 5,
  },
];

// Calculate quintile scores (1-5) based on value distribution
function calculateQuintileScore(value: number, values: number[], isRecency: boolean = false): number {
  const sorted = [...values].sort((a, b) => a - b);
  const quintiles = [
    sorted[Math.floor(sorted.length * 0.2)],
    sorted[Math.floor(sorted.length * 0.4)],
    sorted[Math.floor(sorted.length * 0.6)],
    sorted[Math.floor(sorted.length * 0.8)],
  ];

  let score: number;
  if (value <= quintiles[0]) score = 1;
  else if (value <= quintiles[1]) score = 2;
  else if (value <= quintiles[2]) score = 3;
  else if (value <= quintiles[3]) score = 4;
  else score = 5;

  // For recency, lower is better (more recent), so invert the score
  return isRecency ? 6 - score : score;
}

// Determine segment based on RFM scores
function determineSegment(rScore: number, fScore: number, mScore: number): string {
  // Check against segment definitions in order
  for (const seg of segmentDefinitions) {
    const rMatch = rScore >= seg.rRange[0] && rScore <= seg.rRange[1];
    const fMatch = fScore >= seg.fRange[0] && fScore <= seg.fRange[1];
    const mMatch = mScore >= seg.mRange[0] && mScore <= seg.mRange[1];
    
    if (rMatch && fMatch && mMatch) {
      return seg.name;
    }
  }
  
  // Fallback segmentation based on average score
  const avgScore = (rScore + fScore + mScore) / 3;
  if (avgScore >= 4) return 'Champions';
  if (avgScore >= 3) return 'Loyal Customers';
  if (avgScore >= 2) return 'Hibernating';
  return 'Lost Customers';
}

// Main RFM calculation function
export function calculateRFMScores(transactions: TransactionData[]): CustomerRFM[] {
  if (transactions.length === 0) return [];

  const today = new Date();
  
  // Group transactions by customer
  const customerMap = new Map<string, {
    name: string;
    transactions: { date: Date; amount: number }[];
  }>();

  transactions.forEach((t) => {
    const existing = customerMap.get(t.customerId);
    const txDate = new Date(t.transactionDate);
    
    if (existing) {
      existing.transactions.push({ date: txDate, amount: t.amount });
    } else {
      customerMap.set(t.customerId, {
        name: t.customerName,
        transactions: [{ date: txDate, amount: t.amount }],
      });
    }
  });

  // Calculate raw RFM values for each customer
  const customerRawData: {
    id: string;
    name: string;
    recency: number;
    frequency: number;
    monetary: number;
    lastOrder: Date;
  }[] = [];

  customerMap.forEach((data, customerId) => {
    const lastPurchase = data.transactions.reduce(
      (latest, t) => (t.date > latest ? t.date : latest),
      data.transactions[0].date
    );
    
    const recency = Math.floor((today.getTime() - lastPurchase.getTime()) / (1000 * 60 * 60 * 24));
    const frequency = data.transactions.length;
    const monetary = data.transactions.reduce((sum, t) => sum + t.amount, 0);

    customerRawData.push({
      id: customerId,
      name: data.name,
      recency,
      frequency,
      monetary,
      lastOrder: lastPurchase,
    });
  });

  // Extract values for quintile calculation
  const recencyValues = customerRawData.map((c) => c.recency);
  const frequencyValues = customerRawData.map((c) => c.frequency);
  const monetaryValues = customerRawData.map((c) => c.monetary);

  // Calculate RFM scores and determine segments
  const customerRFM: CustomerRFM[] = customerRawData.map((customer) => {
    const rScore = calculateQuintileScore(customer.recency, recencyValues, true);
    const fScore = calculateQuintileScore(customer.frequency, frequencyValues);
    const mScore = calculateQuintileScore(customer.monetary, monetaryValues);
    const rfmScore = rScore * 100 + fScore * 10 + mScore;
    const segment = determineSegment(rScore, fScore, mScore);
    
    // Calculate CLV (simplified: 3x annual value projection)
    const avgOrderValue = customer.monetary / customer.frequency;
    const annualProjection = avgOrderValue * customer.frequency * (365 / Math.max(customer.recency, 1));
    const clv = Math.round(annualProjection * 3);

    return {
      id: customer.id,
      name: customer.name,
      recency: customer.recency,
      frequency: customer.frequency,
      monetary: customer.monetary,
      rScore,
      fScore,
      mScore,
      rfmScore,
      segment,
      clv,
      totalOrders: customer.frequency,
      lastOrder: customer.lastOrder.toISOString().split('T')[0],
      avgOrderValue: Math.round(avgOrderValue),
    };
  });

  return customerRFM.sort((a, b) => b.rfmScore - a.rfmScore);
}

// Generate segment statistics from RFM data
export function generateSegmentStats(customers: CustomerRFM[]): RFMSegmentStats[] {
  const segmentGroups = new Map<string, CustomerRFM[]>();

  customers.forEach((customer) => {
    const existing = segmentGroups.get(customer.segment) || [];
    existing.push(customer);
    segmentGroups.set(customer.segment, existing);
  });

  return segmentDefinitions.map((def) => {
    const segmentCustomers = segmentGroups.get(def.name) || [];
    const revenue = segmentCustomers.reduce((sum, c) => sum + c.monetary, 0);
    const avgCLV = segmentCustomers.length > 0
      ? Math.round(segmentCustomers.reduce((sum, c) => sum + c.clv, 0) / segmentCustomers.length)
      : 0;

    const rScores = segmentCustomers.map((c) => c.rScore);
    const fScores = segmentCustomers.map((c) => c.fScore);
    const mScores = segmentCustomers.map((c) => c.mScore);

    return {
      name: def.name,
      customers: segmentCustomers.length,
      revenue,
      avgCLV,
      retentionRate: def.retentionRate,
      color: def.color,
      rScoreRange: rScores.length > 0 ? `${Math.min(...rScores)}-${Math.max(...rScores)}` : `${def.rRange[0]}-${def.rRange[1]}`,
      fScoreRange: fScores.length > 0 ? `${Math.min(...fScores)}-${Math.max(...fScores)}` : `${def.fRange[0]}-${def.fRange[1]}`,
      mScoreRange: mScores.length > 0 ? `${Math.min(...mScores)}-${Math.max(...mScores)}` : `${def.mRange[0]}-${def.mRange[1]}`,
      treatment: def.treatment,
      actions: def.actions,
    };
  }).filter((s) => s.customers > 0);
}

// Parse and validate CSV data
export function parseTransactionCSV(
  data: Record<string, unknown>[],
  columnMapping: {
    customerId: string;
    customerName: string;
    transactionDate: string;
    amount: string;
    orderId?: string;
  }
): { transactions: TransactionData[]; errors: string[] } {
  const transactions: TransactionData[] = [];
  const errors: string[] = [];

  data.forEach((row, index) => {
    try {
      const customerId = String(row[columnMapping.customerId] || '').trim();
      const customerName = String(row[columnMapping.customerName] || '').trim();
      const transactionDate = String(row[columnMapping.transactionDate] || '').trim();
      const amountStr = String(row[columnMapping.amount] || '').replace(/[^0-9.-]/g, '');
      const amount = parseFloat(amountStr);

      if (!customerId) {
        errors.push(`Row ${index + 1}: Missing customer ID`);
        return;
      }
      if (!customerName) {
        errors.push(`Row ${index + 1}: Missing customer name`);
        return;
      }
      if (!transactionDate || isNaN(new Date(transactionDate).getTime())) {
        errors.push(`Row ${index + 1}: Invalid date format`);
        return;
      }
      if (isNaN(amount) || amount <= 0) {
        errors.push(`Row ${index + 1}: Invalid amount`);
        return;
      }

      transactions.push({
        customerId,
        customerName,
        transactionDate,
        amount,
        orderId: columnMapping.orderId ? String(row[columnMapping.orderId] || '') : undefined,
      });
    } catch (e) {
      errors.push(`Row ${index + 1}: Parse error`);
    }
  });

  return { transactions, errors };
}
