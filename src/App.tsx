
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
import Auth from "./pages/Auth";

// Placeholder pages for flow management features
const FlowPreview = () => <div className="p-8"><h1 className="text-2xl font-bold">Flow Preview</h1><p className="mt-4">This is a placeholder for the flow preview page.</p></div>;
const FlowMetrics = () => <div className="p-8"><h1 className="text-2xl font-bold">Flow Analytics</h1><p className="mt-4">This is a placeholder for the flow analytics page.</p></div>;
const FlowVersions = () => <div className="p-8"><h1 className="text-2xl font-bold">Flow Versions</h1><p className="mt-4">This is a placeholder for the flow versions page.</p></div>;
const FlowABTest = () => <div className="p-8"><h1 className="text-2xl font-bold">Flow A/B Testing</h1><p className="mt-4">This is a placeholder for the flow A/B testing page.</p></div>;
const FlowBranding = () => <div className="p-8"><h1 className="text-2xl font-bold">Flow Branding</h1><p className="mt-4">This is a placeholder for the flow branding customization page.</p></div>;

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
            {/* Additional flow management routes */}
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
