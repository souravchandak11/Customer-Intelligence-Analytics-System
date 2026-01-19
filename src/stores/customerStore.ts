import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  CustomerRFM, 
  RFMSegmentStats, 
  TransactionData,
  calculateRFMScores,
  generateSegmentStats 
} from '@/lib/rfmCalculator';

interface CustomerState {
  // Raw transaction data
  transactions: TransactionData[];
  
  // Calculated RFM data
  customers: CustomerRFM[];
  segmentStats: RFMSegmentStats[];
  
  // Import metadata
  lastImportDate: string | null;
  importedRecordCount: number;
  
  // Data source flag
  isUsingImportedData: boolean;
  
  // Actions
  importTransactions: (transactions: TransactionData[]) => void;
  clearData: () => void;
  getTopCustomers: (limit?: number) => CustomerRFM[];
  getCustomersBySegment: (segment: string) => CustomerRFM[];
  getTotalRevenue: () => number;
  getTotalCustomers: () => number;
  getAverageCLV: () => number;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      transactions: [],
      customers: [],
      segmentStats: [],
      lastImportDate: null,
      importedRecordCount: 0,
      isUsingImportedData: false,

      importTransactions: (transactions) => {
        const customers = calculateRFMScores(transactions);
        const segmentStats = generateSegmentStats(customers);
        
        set({
          transactions,
          customers,
          segmentStats,
          lastImportDate: new Date().toISOString(),
          importedRecordCount: transactions.length,
          isUsingImportedData: true,
        });
      },

      clearData: () => {
        set({
          transactions: [],
          customers: [],
          segmentStats: [],
          lastImportDate: null,
          importedRecordCount: 0,
          isUsingImportedData: false,
        });
      },

      getTopCustomers: (limit = 10) => {
        return get().customers.slice(0, limit);
      },

      getCustomersBySegment: (segment) => {
        return get().customers.filter((c) => c.segment === segment);
      },

      getTotalRevenue: () => {
        return get().customers.reduce((sum, c) => sum + c.monetary, 0);
      },

      getTotalCustomers: () => {
        return get().customers.length;
      },

      getAverageCLV: () => {
        const customers = get().customers;
        if (customers.length === 0) return 0;
        return Math.round(customers.reduce((sum, c) => sum + c.clv, 0) / customers.length);
      },
    }),
    {
      name: 'customer-analytics-storage',
    }
  )
);
