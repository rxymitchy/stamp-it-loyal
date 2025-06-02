
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useCustomerData } from "@/hooks/useCustomerData";
import TabNavigation from "@/components/customer/TabNavigation";
import CustomerStats from "@/components/customer/CustomerStats";
import BusinessProgressList from "@/components/customer/BusinessProgressList";
import RewardsCatalog from "@/components/customer/RewardsCatalog";
import RedemptionHistory from "@/components/customer/RedemptionHistory";
import CustomerProfile from "@/components/customer/CustomerProfile";
import LoyaltyCard from "@/components/customer/LoyaltyCard";
import StampsDisplay from "@/components/customer/StampsDisplay";

const CustomerDashboard = () => {
  const { profile, signOut, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const {
    customerProfile,
    businesses,
    rewards,
    redemptions,
    stamps,
    totalVisits,
    totalPoints,
    loading,
    error,
    redeemReward,
    claimReward,
    refetch
  } = useCustomerData(profile);

  const handleSignOut = async () => {
    try {
      console.log('Customer dashboard sign out triggered');
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      // Force navigation even if sign out fails
      navigate('/');
    }
  };

  const handleRetry = () => {
    console.log('Retry button clicked, refetching data...');
    refetch();
  };

  // Show error state with retry option
  if (error && !loading && !authLoading) {
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

  // Show loading state
  if (loading || authLoading || !profile) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">
              Welcome, {customerProfile?.full_name || profile?.email?.split('@')[0] || 'Customer'}
            </h1>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <LoyaltyCard 
              customerName={customerProfile?.full_name || profile?.email?.split('@')[0] || 'Customer'}
              stamps={stamps}
              onClaimReward={claimReward}
            />
            <CustomerStats 
              totalPoints={totalPoints}
              totalVisits={totalVisits}
              businessCount={businesses.length}
              rewardsCount={redemptions.length}
            />
            <BusinessProgressList businesses={businesses} />
          </div>
        )}

        {/* Stamps Tab */}
        {activeTab === 'stamps' && (
          <div className="space-y-6">
            <StampsDisplay 
              stamps={stamps}
              onClaimReward={claimReward}
            />
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <RewardsCatalog 
              rewards={rewards}
              totalPoints={totalPoints}
              onRedeemReward={redeemReward}
            />
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <RedemptionHistory redemptions={redemptions} />
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <CustomerProfile 
              customerProfile={customerProfile}
              userEmail={profile?.email || ''}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
