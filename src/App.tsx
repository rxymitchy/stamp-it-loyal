
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import { useEffect } from "react";
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
  const { user, profile, loading, error, signOut } = useAuth();
  
  // Use session management hooks
  useSessionTimeout();
  useAutoLogout();

  // Auto-logout on error
  useEffect(() => {
    if (error && !loading) {
      console.log('Auto-logout due to error:', error);
      signOut();
    }
  }, [error, loading, signOut]);
  
  console.log('ProtectedRoute - Loading:', loading, 'User:', !!user, 'Profile:', profile, 'Error:', error);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we load your dashboard</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return <Navigate to="/" replace />;
  }
  
  if (!user || !profile) {
    console.log('Redirecting to signin - No user or profile');
    return <Navigate to="/signin" replace />;
  }
  
  if (requiredRole && profile.role !== requiredRole) {
    console.log('Redirecting due to role mismatch - Required:', requiredRole, 'Actual:', profile.role);
    return <Navigate to={profile.role === 'business' ? '/business' : '/customer'} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, profile, loading, error, signOut } = useAuth();

  // Auto-logout on error
  useEffect(() => {
    if (error && !loading) {
      console.log('Auto-logout due to error:', error);
      signOut();
    }
  }, [error, loading, signOut]);
  
  console.log('AppRoutes - Loading:', loading, 'User:', !!user, 'Profile:', profile, 'Error:', error);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
          <p className="text-sm text-gray-500 mt-2">Initializing application</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          user && profile ? (
            <Navigate to={profile.role === 'business' ? '/business' : '/customer'} replace />
          ) : (
            <Index />
          )
        } 
      />
      <Route 
        path="/signin" 
        element={
          user && profile ? (
            <Navigate to={profile.role === 'business' ? '/business' : '/customer'} replace />
          ) : (
            <SignIn />
          )
        } 
      />
      <Route 
        path="/signup" 
        element={
          user && profile ? (
            <Navigate to={profile.role === 'business' ? '/business' : '/customer'} replace />
          ) : (
            <SignUp />
          )
        } 
      />
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
