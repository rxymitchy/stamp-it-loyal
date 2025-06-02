
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBusinessData } from "@/hooks/useBusinessData";
import { useAdvancedBusinessData } from "@/hooks/useAdvancedBusinessData";
import { useStampManagement } from "@/hooks/business/useStampManagement";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BusinessSidebar from "@/components/business/sidebar/BusinessSidebar";
import DashboardOverview from "@/components/business/dashboard/DashboardOverview";
import CustomerManagement from "@/components/business/customers/CustomerManagement";
import RewardsManagement from "@/components/business/rewards/RewardsManagement";
import AnalyticsDashboard from "@/components/business/analytics/AnalyticsDashboard";
import BusinessSettings from "@/components/business/settings/BusinessSettings";

const BusinessDashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const {
    businessProfile,
    customers,
    loading,
    error,
    handleAddVisit,
    handleRedeemReward,
    refetch
  } = useBusinessData(profile);

  const {
    data: advancedData,
    loading: advancedLoading,
    createReward,
    updateReward,
    deleteReward,
    toggleReward,
    exportCustomersCSV,
    refetch: refetchAdvanced
  } = useAdvancedBusinessData(businessProfile);

  const { addStampToCustomer } = useStampManagement(businessProfile);

  const handleSignOut = async () => {
    try {
      console.log('Business user signing out...');
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error in BusinessDashboard:', error);
    }
  };

  const handleRetry = () => {
    refetch();
    refetchAdvanced();
  };

  const handleUpdateBusinessProfile = async (updatedProfile: any) => {
    // This would be implemented in the useBusinessData hook
    console.log('Updating business profile:', updatedProfile);
  };

  const handleSearchCustomer = (phone: string) => {
    // Filter customers by phone number
    console.log('Searching for customer:', phone);
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
  const totalRewards = customers.reduce((sum, c) => sum + c.rewards_earned, 0);

  // Mock recent activity
  const recentActivity = customers.slice(0, 5).map(customer => ({
    id: customer.id,
    type: 'visit' as const,
    customerName: customer.full_name,
    timestamp: '2 hours ago'
  }));

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview
            totalCustomers={customers.length}
            totalVisits={totalVisits}
            totalRewards={totalRewards}
            recentActivity={recentActivity}
          />
        );
      case 'customers':
        return (
          <CustomerManagement
            customers={customers}
            onSearchCustomer={handleSearchCustomer}
            onAddVisit={handleAddVisit}
            onAddStamp={addStampToCustomer}
            onExportCustomers={() => exportCustomersCSV(customers)}
          />
        );
      case 'rewards':
        return (
          <RewardsManagement
            rewards={advancedData.rewards}
            onCreateReward={createReward}
            onUpdateReward={updateReward}
            onDeleteReward={deleteReward}
            onToggleReward={toggleReward}
          />
        );
      case 'analytics':
        return <AnalyticsDashboard data={advancedData.analytics} />;
      case 'settings':
        return (
          <BusinessSettings
            businessProfile={businessProfile}
            onUpdateProfile={handleUpdateBusinessProfile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <BusinessSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={handleSignOut}
        businessName={businessProfile.business_name}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
