
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Reward {
  id: string;
  title: string;
  points_required: number;
  business_name: string;
  business_profile_id: string;
}

interface RedemptionHistory {
  id: string;
  reward_title: string;
  business_name: string;
  points_used: number;
  redemption_date: string;
  status: string;
}

export const useRewards = (customerProfile: any, totalPoints: number, setTotalPoints: (value: number | ((prev: number) => number)) => void) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableRewards = async () => {
    if (!customerProfile) {
      console.log('No customer profile available for fetchAvailableRewards');
      return;
    }

    console.log('Fetching available rewards');
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('rewards')
        .select(`
          *,
          business_profiles!inner(
            business_name
          )
        `)
        .eq('is_active', true)
        .is('customer_profile_id', null); // Only get rewards not yet claimed

      if (error) {
        console.error('Error fetching rewards:', error);
        throw error;
      }

      const formattedRewards = data?.map(reward => ({
        id: reward.id,
        title: reward.title,
        points_required: reward.points_required,
        business_name: reward.business_profiles?.business_name || 'Unknown Business',
        business_profile_id: reward.business_profile_id
      })) || [];

      setRewards(formattedRewards);

      // Also fetch redemption history
      const { data: redemptionData, error: redemptionError } = await supabase
        .from('rewards')
        .select(`
          *,
          business_profiles!inner(
            business_name
          )
        `)
        .eq('customer_profile_id', customerProfile.id)
        .eq('reward_status', 'redeemed');

      if (!redemptionError && redemptionData) {
        const formattedRedemptions = redemptionData.map(redemption => ({
          id: redemption.id,
          reward_title: redemption.title,
          business_name: redemption.business_profiles?.business_name || 'Unknown Business',
          points_used: redemption.points_required,
          redemption_date: redemption.reward_date || new Date().toISOString(),
          status: redemption.reward_status
        }));
        setRedemptions(formattedRedemptions);
      }
    } catch (error: any) {
      console.error('Error in fetchAvailableRewards:', error);
      setError(`Failed to load rewards: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const redeemReward = async (rewardId: string, pointsRequired: number, businessProfileId: string) => {
    if (!customerProfile) return;

    try {
      // Update reward to mark as redeemed
      const { error } = await supabase
        .from('rewards')
        .update({ 
          reward_status: 'redeemed',
          customer_profile_id: customerProfile.id,
          reward_date: new Date().toISOString()
        })
        .eq('id', rewardId);

      if (error) throw error;

      setTotalPoints(prev => prev - pointsRequired);
      fetchAvailableRewards();
      
      toast({
        title: "Reward Redeemed! 🎉",
        description: "Your reward has been successfully redeemed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (customerProfile) {
      fetchAvailableRewards();
    }
  }, [customerProfile]);

  return {
    rewards,
    redemptions,
    loading,
    error,
    redeemReward,
    refetch: fetchAvailableRewards
  };
};
