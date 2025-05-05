
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import FlowEditor from "./pages/FlowEditor";
import FlowBuilder from "./pages/FlowBuilder";
import FlowPreview from "./pages/FlowPreview";
import FlowMetrics from "./pages/FlowMetrics";
import FlowVersions from "./pages/FlowVersions";
import FlowABTest from "./pages/FlowABTest";
import FlowBranding from "./pages/FlowBranding";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/flow/:id" element={
              <ProtectedRoute>
                <FlowEditor />
              </ProtectedRoute>
            } />
            <Route path="/builder/:id" element={
              <ProtectedRoute>
                <FlowBuilder />
              </ProtectedRoute>
            } />
            <Route path="/builder" element={
              <ProtectedRoute>
                <FlowBuilder />
              </ProtectedRoute>
            } />
            {/* Flow management routes */}
            <Route path="/flow/:id/preview" element={
              <ProtectedRoute>
                <FlowPreview />
              </ProtectedRoute>
            } />
            <Route path="/flow/:id/metrics" element={
              <ProtectedRoute>
                <FlowMetrics />
              </ProtectedRoute>
            } />
            <Route path="/flow/:id/versions" element={
              <ProtectedRoute>
                <FlowVersions />
              </ProtectedRoute>
            } />
            <Route path="/flow/:id/ab-test" element={
              <ProtectedRoute>
                <FlowABTest />
              </ProtectedRoute>
            } />
            <Route path="/flow/:id/branding" element={
              <ProtectedRoute>
                <FlowBranding />
              </ProtectedRoute>
            } />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
