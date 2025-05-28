
import { useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useBusinessData } from "@/hooks/useBusinessData";
import { useNavigate } from "react-router-dom";
import BusinessHeader from "@/components/business/BusinessHeader";
import AddVisitForm from "@/components/business/AddVisitForm";
import CustomerList from "@/components/business/CustomerList";
import BusinessStats from "@/components/business/BusinessStats";

const BusinessDashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const {
    businessProfile,
    customers,
    loading,
    handleAddVisit,
    handleRedeemReward
  } = useBusinessData(profile);

  const handleSignOut = async () => {
    await signOut();
  };

  // Show loading state while business profile is being fetched
  if (!businessProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
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
