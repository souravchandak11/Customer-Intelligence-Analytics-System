import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import DashboardOverview from "@/pages/DashboardOverview";
import Segments from "@/pages/Segments";
import Customers from "@/pages/Customers";
import Analytics from "@/pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/segments" element={<Segments />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/stats" element={<DashboardOverview />} />
            <Route path="/metrics" element={<Analytics />} />
            <Route path="/reports/rfm" element={<Segments />} />
            <Route path="/reports/clv" element={<Analytics />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
