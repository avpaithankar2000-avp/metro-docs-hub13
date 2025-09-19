import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// Employee Pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeDocuments, { DocumentDetail } from "./pages/employee/Documents";
import EmployeeAlerts from "./pages/employee/Alerts";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUpload from "./pages/admin/Upload";
import AdminReview from "./pages/admin/ReviewDocuments";
import AdminUsers from "./pages/admin/UserManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* Employee Routes */}
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/documents" element={<EmployeeDocuments />} />
          <Route path="/employee/documents/:id" element={<DocumentDetail />} />
          <Route path="/employee/summaries" element={<EmployeeDocuments />} />
          <Route path="/employee/alerts" element={<EmployeeAlerts />} />
          <Route path="/employee/settings" element={<EmployeeDashboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/upload" element={<AdminUpload />} />
          <Route path="/admin/review" element={<AdminReview />} />
          <Route path="/admin/review/:id" element={<AdminReview />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/analytics" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
