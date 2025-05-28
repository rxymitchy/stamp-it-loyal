
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import BusinessDashboard from "./pages/BusinessDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to={profile?.role === 'business' ? '/business' : '/customer'} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={profile?.role === 'business' ? '/business' : '/customer'} replace /> : <Index />} />
      <Route path="/signin" element={user ? <Navigate to={profile?.role === 'business' ? '/business' : '/customer'} replace /> : <SignIn />} />
      <Route path="/signup" element={user ? <Navigate to={profile?.role === 'business' ? '/business' : '/customer'} replace /> : <SignUp />} />
      <Route path="/email-verification" element={<EmailVerificationPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/business" 
        element={
          <ProtectedRoute requiredRole="business">
            <BusinessDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
