
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { useAutoLogout } from "@/hooks/useAutoLogout";
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
  const { user, profile, loading, error } = useAuth();
  
  // Use session management hooks
  useSessionTimeout();
  useAutoLogout();
  
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-amber-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-purple-600 to-amber-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-amber-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
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
  const { user, profile, loading, error } = useAuth();
  
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-amber-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Application Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-600 to-amber-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-amber-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
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
