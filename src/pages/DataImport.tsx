import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, FileSpreadsheet, Trash2, Calendar, Users, DollarSign } from 'lucide-react';
import { CSVUploader } from '@/components/import/CSVUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomerStore } from '@/stores/customerStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const DataImport = () => {
  const navigate = useNavigate();
  const { 
    isUsingImportedData, 
    lastImportDate, 
    importedRecordCount,
    customers,
    segmentStats,
    clearData,
    getTotalRevenue,
  } = useCustomerStore();

  const handleImportComplete = () => {
    navigate('/');
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Data Import</h1>
        <p className="text-muted-foreground mt-1">
          Upload customer transaction data to calculate RFM scores and generate insights
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* CSV Uploader */}
        <div className="lg:col-span-2">
          <CSVUploader onImportComplete={handleImportComplete} />
        </div>

        {/* Current Data Status */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  Data Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Source</span>
                  <Badge variant={isUsingImportedData ? 'default' : 'secondary'}>
                    {isUsingImportedData ? 'Imported' : 'Sample Data'}
                  </Badge>
                </div>
                
                {isUsingImportedData && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        Last Import
                      </span>
                      <span className="text-sm font-medium">
                        {formatDate(lastImportDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <FileSpreadsheet className="h-3.5 w-3.5" />
                        Transactions
                      </span>
                      <span className="text-sm font-medium">
                        {importedRecordCount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" />
                        Customers
                      </span>
                      <span className="text-sm font-medium">
                        {customers.length.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <DollarSign className="h-3.5 w-3.5" />
                        Total Revenue
                      </span>
                      <span className="text-sm font-medium">
                        ${getTotalRevenue().toLocaleString()}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear Imported Data
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Clear imported data?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove all imported transaction data and revert to sample data.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={clearData}>
                              Clear Data
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Segments Summary */}
          {isUsingImportedData && segmentStats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Calculated Segments</CardTitle>
                  <CardDescription>Based on RFM analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {segmentStats.map((segment) => (
                      <div 
                        key={segment.name}
                        className="flex items-center justify-between py-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: segment.color }}
                          />
                          <span className="text-sm">{segment.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {segment.customers}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Help Card */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">How RFM Scoring Works</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong className="text-foreground">Recency (R):</strong> Days since last purchase
                </p>
                <p>
                  <strong className="text-foreground">Frequency (F):</strong> Total number of purchases
                </p>
                <p>
                  <strong className="text-foreground">Monetary (M):</strong> Total spend amount
                </p>
                <p className="pt-2 text-xs">
                  Each metric is scored 1-5 using quintiles. Customers are then 
                  assigned to segments based on their combined RFM scores.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DataImport;
