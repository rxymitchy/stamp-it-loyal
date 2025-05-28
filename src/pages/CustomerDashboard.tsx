
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useCustomerData } from "@/hooks/useCustomerData";
import TabNavigation from "@/components/customer/TabNavigation";
import CustomerStats from "@/components/customer/CustomerStats";
import BusinessProgressList from "@/components/customer/BusinessProgressList";
import RewardsCatalog from "@/components/customer/RewardsCatalog";
import RedemptionHistory from "@/components/customer/RedemptionHistory";
import CustomerProfile from "@/components/customer/CustomerProfile";

const CustomerDashboard = () => {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const {
    customerProfile,
    businesses,
    rewards,
    redemptions,
    totalVisits,
    totalPoints,
    redeemReward
  } = useCustomerData(profile);

  if (profile?.role !== 'customer') {
    navigate('/');
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  if (!customerProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Welcome, {customerProfile.full_name || 'Customer'}</h1>
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
            <CustomerStats 
              totalPoints={totalPoints}
              totalVisits={totalVisits}
              businessCount={businesses.length}
              rewardsCount={redemptions.length}
            />
            <BusinessProgressList businesses={businesses} />
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
