
import { useCustomerProfile } from './customer/useCustomerProfile';
import { useVisitHistory } from './customer/useVisitHistory';
import { useRewards } from './customer/useRewards';

export const useCustomerData = (profile: any) => {
  const { customerProfile, loading: profileLoading, error: profileError, refetch: refetchProfile } = useCustomerProfile(profile);
  const { businesses, totalVisits, totalPoints, loading: visitsLoading, error: visitsError, refetch: refetchVisits } = useVisitHistory(customerProfile);
  const { rewards, redemptions, loading: rewardsLoading, error: rewardsError, redeemReward, refetch: refetchRewards } = useRewards(customerProfile, totalPoints, (value) => {
    // This is a workaround since we can't directly pass setTotalPoints from useVisitHistory
    // In a real scenario, you might want to use a state management solution
    console.log('Total points updated:', value);
  });

  const loading = profileLoading || visitsLoading || rewardsLoading;
  const error = profileError || visitsError || rewardsError;

  const refetch = () => {
    refetchProfile();
    if (customerProfile) {
      refetchVisits();
      refetchRewards();
    }
  };

  return {
    customerProfile,
    businesses,
    rewards,
    redemptions,
    totalVisits,
    totalPoints,
    loading,
    error,
    redeemReward,
    refetch
  };
};
