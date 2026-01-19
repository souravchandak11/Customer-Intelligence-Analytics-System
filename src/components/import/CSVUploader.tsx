import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { parseTransactionCSV, TransactionData } from '@/lib/rfmCalculator';
import { useCustomerStore } from '@/stores/customerStore';

interface ColumnMapping {
  customerId: string;
  customerName: string;
  transactionDate: string;
  amount: string;
  orderId?: string;
}

interface CSVUploaderProps {
  onImportComplete?: () => void;
}

export const CSVUploader = ({ onImportComplete }: CSVUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<Record<string, unknown>[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    customerId: '',
    customerName: '',
    transactionDate: '',
    amount: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<TransactionData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'complete'>('upload');

  const { toast } = useToast();
  const importTransactions = useCustomerStore((state) => state.importTransactions);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a CSV file',
        variant: 'destructive',
      });
      return;
    }

    setFile(file);
    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const columns = results.meta.fields || [];
        setCsvColumns(columns);
        setCsvData(results.data as Record<string, unknown>[]);
        
        // Auto-detect column mappings
        const autoMapping: ColumnMapping = {
          customerId: columns.find((c) => 
            /customer.?id|cust.?id|client.?id|id/i.test(c)
          ) || '',
          customerName: columns.find((c) => 
            /customer.?name|cust.?name|client.?name|name|customer/i.test(c)
          ) || '',
          transactionDate: columns.find((c) => 
            /date|trans.?date|order.?date|purchase.?date/i.test(c)
          ) || '',
          amount: columns.find((c) => 
            /amount|total|value|price|revenue|spend/i.test(c)
          ) || '',
          orderId: columns.find((c) => 
            /order.?id|trans.?id|invoice/i.test(c)
          ),
        };
        
        setColumnMapping(autoMapping);
        setStep('mapping');
        setIsProcessing(false);
      },
      error: (error) => {
        toast({
          title: 'Parse Error',
          description: error.message,
          variant: 'destructive',
        });
        setIsProcessing(false);
      },
    });
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  }, [processFile]);

  const handleValidateMapping = () => {
    if (!columnMapping.customerId || !columnMapping.customerName || 
        !columnMapping.transactionDate || !columnMapping.amount) {
      toast({
        title: 'Missing required mappings',
        description: 'Please map all required columns',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    const { transactions, errors } = parseTransactionCSV(csvData, columnMapping);
    
    setPreviewData(transactions.slice(0, 5));
    setErrors(errors.slice(0, 10));
    setStep('preview');
    setIsProcessing(false);

    if (transactions.length === 0) {
      toast({
        title: 'No valid transactions',
        description: 'Please check your data and column mappings',
        variant: 'destructive',
      });
    }
  };

  const handleImport = () => {
    setIsProcessing(true);
    
    const { transactions, errors: parseErrors } = parseTransactionCSV(csvData, columnMapping);
    
    if (transactions.length === 0) {
      toast({
        title: 'Import failed',
        description: 'No valid transactions found',
        variant: 'destructive',
      });
      setIsProcessing(false);
      return;
    }

    importTransactions(transactions);
    
    setStep('complete');
    setIsProcessing(false);
    
    toast({
      title: 'Import successful!',
      description: `Imported ${transactions.length} transactions. RFM scores calculated.`,
    });

    if (parseErrors.length > 0) {
      toast({
        title: 'Some rows skipped',
        description: `${parseErrors.length} rows had errors and were skipped`,
        variant: 'destructive',
      });
    }
  };

  const resetUploader = () => {
    setFile(null);
    setCsvColumns([]);
    setCsvData([]);
    setColumnMapping({ customerId: '', customerName: '', transactionDate: '', amount: '' });
    setPreviewData([]);
    setErrors([]);
    setStep('upload');
  };

  const downloadSampleCSV = () => {
    const sampleData = `customer_id,customer_name,transaction_date,amount,order_id
C001,Acme Corporation,2026-01-15,1250.00,ORD001
C001,Acme Corporation,2025-12-20,890.50,ORD002
C002,TechFlow Inc.,2026-01-18,2340.00,ORD003
C002,TechFlow Inc.,2026-01-05,1120.00,ORD004
C003,Global Dynamics,2025-11-30,3500.00,ORD005
C004,Innovate Labs,2026-01-10,780.00,ORD006
C005,NextGen Solutions,2025-10-15,450.00,ORD007`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Import Customer Data
        </CardTitle>
        <CardDescription>
          Upload a CSV file with transaction data to calculate RFM scores automatically
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                  ${isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  }
                `}
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-muted-foreground">Processing file...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-foreground font-medium mb-1">
                      Drop your CSV file here
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload">
                      <Button variant="outline" className="cursor-pointer" asChild>
                        <span>Select File</span>
                      </Button>
                    </label>
                  </>
                )}
              </div>

              <div className="flex items-center justify-center gap-2">
                <Button variant="ghost" size="sm" onClick={downloadSampleCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample CSV
                </Button>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Required columns:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Customer ID</Badge>
                  <Badge variant="secondary">Customer Name</Badge>
                  <Badge variant="secondary">Transaction Date</Badge>
                  <Badge variant="secondary">Amount</Badge>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Column Mapping */}
          {step === 'mapping' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">{file?.name}</span>
                  <Badge variant="outline">{csvData.length} rows</Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={resetUploader}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Customer ID *</Label>
                  <Select 
                    value={columnMapping.customerId} 
                    onValueChange={(v) => setColumnMapping((m) => ({ ...m, customerId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvColumns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Customer Name *</Label>
                  <Select 
                    value={columnMapping.customerName} 
                    onValueChange={(v) => setColumnMapping((m) => ({ ...m, customerName: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvColumns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Transaction Date *</Label>
                  <Select 
                    value={columnMapping.transactionDate} 
                    onValueChange={(v) => setColumnMapping((m) => ({ ...m, transactionDate: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvColumns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Amount *</Label>
                  <Select 
                    value={columnMapping.amount} 
                    onValueChange={(v) => setColumnMapping((m) => ({ ...m, amount: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvColumns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={resetUploader}>Cancel</Button>
                <Button onClick={handleValidateMapping} disabled={isProcessing}>
                  {isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Validate & Preview
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Preview */}
          {step === 'preview' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-muted-foreground">
                  Found <strong className="text-foreground">{csvData.length - errors.length}</strong> valid transactions
                </span>
              </div>

              {errors.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">
                      {errors.length} rows with errors (will be skipped)
                    </span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-muted/30 rounded-lg overflow-hidden">
                <div className="text-xs font-medium p-3 border-b border-border bg-muted/50">
                  Preview (first 5 rows)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium">Customer ID</th>
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-right p-3 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, i) => (
                        <tr key={i} className="border-b border-border/50 last:border-0">
                          <td className="p-3 font-mono text-xs">{row.customerId}</td>
                          <td className="p-3">{row.customerName}</td>
                          <td className="p-3">{row.transactionDate}</td>
                          <td className="p-3 text-right">${row.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setStep('mapping')}>Back</Button>
                <Button onClick={handleImport} disabled={isProcessing}>
                  {isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Import & Calculate RFM
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Import Complete!</h3>
              <p className="text-muted-foreground mb-6">
                RFM scores have been calculated and segments assigned
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={resetUploader}>
                  Import More Data
                </Button>
                <Button onClick={onImportComplete}>
                  View Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
