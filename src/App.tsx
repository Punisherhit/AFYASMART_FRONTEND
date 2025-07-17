import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import LabDashboard from "./pages/LabDashboard";
import EmergencyDashboard from "./pages/EmergencyDashboard";
import ReceptionDashboard from "./pages/ReceptionDashboard";
import TriageDashboard from "./pages/TriageDashboard";
import RadiologyDashboard from "./pages/RadiologyDashboard";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import BillingDashboard from "./pages/BillingDashboard";
import SurgeryDashboard from "./pages/SurgeryDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES BELOW THE CATCH-ALL "*" ROUTE */}
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/lab-dashboard" element={<LabDashboard />} />
          <Route path="/emergency-dashboard" element={<EmergencyDashboard />} />
          <Route path="/reception-dashboard" element={<ReceptionDashboard />} />
          <Route path="/triage-dashboard" element={<TriageDashboard />} />
          <Route path="/radiology-dashboard" element={<RadiologyDashboard />} />
          <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
          <Route path="/billing-dashboard" element={<BillingDashboard />} />
          <Route path="/surgery-dashboard" element={<SurgeryDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
