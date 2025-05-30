
import { useCustomerProfile } from './customer/useCustomerProfile';
import { useVisitHistory } from './customer/useVisitHistory';
import { useRewards } from './customer/useRewards';
import { useStamps } from './customer/useStamps';

export const useCustomerData = (profile: any) => {
  const { customerProfile, loading: profileLoading, error: profileError, refetch: refetchProfile } = useCustomerProfile(profile);
  const { businesses, totalVisits, totalPoints, loading: visitsLoading, error: visitsError, refetch: refetchVisits } = useVisitHistory(customerProfile);
  const { rewards, redemptions, loading: rewardsLoading, error: rewardsError, redeemReward, refetch: refetchRewards } = useRewards(customerProfile, totalPoints, (value) => {
    console.log('Total points updated:', value);
  });
  const { stamps, loading: stampsLoading, error: stampsError, claimReward, refetch: refetchStamps } = useStamps(customerProfile);

  const loading = profileLoading || visitsLoading || rewardsLoading || stampsLoading;
  const error = profileError || visitsError || rewardsError || stampsError;

  const refetch = () => {
    refetchProfile();
    if (customerProfile) {
      refetchVisits();
      refetchRewards();
      refetchStamps();
    }
  };

  return {
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
  };
};
