import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { customerSegments } from '@/data/mockData';
import { ArrowRight, Users, DollarSign, TrendingUp, Target } from 'lucide-react';

const Segments = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customer Segments</h1>
          <p className="text-muted-foreground">RFM-based customer segmentation with treatment strategies</p>
        </div>
        <Button className="gap-2">
          Export Report
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {customerSegments.map((segment, index) => (
          <motion.div
            key={segment.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="h-full hover:card-shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    {segment.name}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {segment.treatment}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Users className="w-3 h-3" />
                      Customers
                    </div>
                    <p className="text-xl font-bold">{segment.customers.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <DollarSign className="w-3 h-3" />
                      Revenue
                    </div>
                    <p className="text-xl font-bold">${(segment.revenue / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <TrendingUp className="w-3 h-3" />
                      Avg CLV
                    </div>
                    <p className="text-xl font-bold">${segment.avgCLV}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Target className="w-3 h-3" />
                      Retention
                    </div>
                    <p className="text-xl font-bold">{segment.retentionRate}%</p>
                  </div>
                </div>

                {/* RFM Scores */}
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground mb-2">RFM Score Range</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">R: {segment.rScoreRange}</Badge>
                    <Badge variant="outline" className="text-xs">F: {segment.fScoreRange}</Badge>
                    <Badge variant="outline" className="text-xs">M: {segment.mScoreRange}</Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground mb-2">Recommended Actions</p>
                  <div className="flex flex-wrap gap-1">
                    {segment.actions.map((action) => (
                      <Badge key={action} variant="secondary" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Segments;
