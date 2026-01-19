import { motion } from 'framer-motion';
import { ArrowRight, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { countryData } from '@/data/mockData';

export function CustomerDemographics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Customer Demographics</CardTitle>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Tabs defaultValue="country" className="w-auto">
              <TabsList className="bg-secondary">
                <TabsTrigger value="country" className="text-xs">Country</TabsTrigger>
                <TabsTrigger value="device" className="text-xs">Device Type</TabsTrigger>
                <TabsTrigger value="gender" className="text-xs">Gender</TabsTrigger>
              </TabsList>
            </Tabs>
            <Select defaultValue="month">
              <SelectTrigger className="w-32 ml-auto">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* World Map Visualization */}
            <div className="relative bg-secondary/30 rounded-xl p-4 min-h-[200px] flex items-center justify-center">
              {/* Simplified world map representation using dots */}
              <div className="relative w-full h-48">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Dot pattern representing world map */}
                  {Array.from({ length: 40 }, (_, row) =>
                    Array.from({ length: 80 }, (_, col) => {
                      const x = col * 5 + 2.5;
                      const y = row * 5 + 2.5;
                      // Create continent-like patterns
                      const isLand =
                        (x > 50 && x < 150 && y > 30 && y < 100) || // North America
                        (x > 80 && x < 140 && y > 100 && y < 180) || // South America
                        (x > 180 && x < 280 && y > 20 && y < 120) || // Europe/Africa
                        (x > 270 && x < 380 && y > 40 && y < 160); // Asia/Australia
                      
                      if (!isLand) return null;
                      
                      return (
                        <circle
                          key={`${row}-${col}`}
                          cx={x}
                          cy={y}
                          r={1.5}
                          className="fill-muted-foreground/30"
                        />
                      );
                    })
                  )}
                  {/* Highlighted points for main countries */}
                  <circle cx={100} cy={60} r={4} className="fill-primary animate-pulse-soft" />
                  <circle cx={220} cy={50} r={4} className="fill-chart-2 animate-pulse-soft" />
                  <circle cx={110} cy={140} r={4} className="fill-chart-3 animate-pulse-soft" />
                  <circle cx={90} cy={45} r={4} className="fill-chart-5 animate-pulse-soft" />
                </svg>
                {/* Cute illustration overlay */}
                <div className="absolute bottom-2 left-4 w-16 h-20">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Country List */}
            <div className="space-y-4">
              {countryData.map((country, index) => (
                <div key={country.country} className="flex items-center gap-3">
                  <span className="text-xl">{country.flag}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{country.country}</span>
                      <span className="text-sm text-muted-foreground">
                        {country.customers.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${country.percentage}%` }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full mt-4 gap-2">
                See More Details
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
