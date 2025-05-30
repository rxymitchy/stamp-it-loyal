
import { useBusinessProfile } from './business/useBusinessProfile';
import { useCustomers } from './business/useCustomers';
import { useVisitManagement } from './business/useVisitManagement';
import { useRewardManagement } from './business/useRewardManagement';

export const useBusinessData = (profile: any) => {
  const { businessProfile, loading: profileLoading, error: profileError, refetch: refetchProfile } = useBusinessProfile(profile);
  const { customers, loading: customersLoading, error: customersError, refetch: refetchCustomers } = useCustomers(businessProfile);
  const { handleAddVisit, loading: visitLoading } = useVisitManagement(businessProfile, refetchCustomers);
  const { handleRedeemReward } = useRewardManagement(businessProfile, refetchCustomers);

  const loading = profileLoading || customersLoading || visitLoading;
  const error = profileError || customersError;

  const refetch = () => {
    refetchProfile();
    refetchCustomers();
  };

  return {
    businessProfile,
    customers,
    loading,
    error,
    handleAddVisit,
    handleRedeemReward,
    refetch
  };
};
