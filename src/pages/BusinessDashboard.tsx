
import { useAuth } from "@/hooks/useAuth";
import { useBusinessData } from "@/hooks/useBusinessData";
import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw } from "lucide-react";
import BusinessHeader from "@/components/business/BusinessHeader";
import AddVisitForm from "@/components/business/AddVisitForm";
import CustomerList from "@/components/business/CustomerList";
import BusinessStats from "@/components/business/BusinessStats";

const BusinessDashboard = () => {
  const { profile, signOut } = useAuth();
  const {
    businessProfile,
    customers,
    loading,
    error,
    handleAddVisit,
    handleRedeemReward,
    refetch
  } = useBusinessData(profile);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleRetry = () => {
    refetch();
  };

  // Show error state with retry option
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-2">
            <Button onClick={handleRetry} className="bg-gradient-to-r from-purple-600 to-amber-600">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while business profile is being fetched
  if (loading || !businessProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">This should only take a few seconds</p>
        </div>
      </div>
    );
  }

  const totalVisits = customers.reduce((sum, c) => sum + c.visit_count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      <BusinessHeader 
        businessName={businessProfile.business_name}
        onSignOut={handleSignOut}
      />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <AddVisitForm 
          onAddVisit={handleAddVisit}
          loading={loading}
        />

        <CustomerList 
          customers={customers}
          onRedeemReward={handleRedeemReward}
        />

        <BusinessStats 
          totalCustomers={customers.length}
          totalVisits={totalVisits}
        />
      </div>
    </div>
  );
};

export default BusinessDashboard;
