
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BusinessVisit {
  business_name: string;
  visit_count: number;
  rewards_earned: number;
  last_visit: string;
}

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

export const useCustomerData = (profile: any) => {
  const [customerProfile, setCustomerProfile] = useState<any>(null);
  const [businesses, setBusinesses] = useState<BusinessVisit[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionHistory[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCustomerProfile = async () => {
    if (!profile) return;
    
    try {
      const { data } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', profile.id)
        .single();
      
      setCustomerProfile(data);
    } catch (error) {
      console.error('Error fetching customer profile:', error);
    }
  };

  const fetchVisitHistory = async () => {
    if (!customerProfile) return;

    try {
      // Get visits with business info
      const { data: visits } = await supabase
        .from('visits')
        .select(`
          visit_date,
          points_earned,
          business_profile_id,
          business_profiles!inner(
            business_name
          )
        `)
        .eq('customer_profile_id', customerProfile.id);

      // Calculate total points from visits
      const totalEarned = visits?.reduce((sum, visit) => sum + (visit.points_earned || 0), 0) || 0;
      setTotalPoints(totalEarned);

      // Group by business
      const businessMap = new Map();
      visits?.forEach(visit => {
        const businessId = visit.business_profile_id;
        const businessName = visit.business_profiles.business_name;
        
        if (businessMap.has(businessId)) {
          businessMap.get(businessId).visit_count++;
          if (new Date(visit.visit_date) > new Date(businessMap.get(businessId).last_visit)) {
            businessMap.get(businessId).last_visit = visit.visit_date;
          }
        } else {
          businessMap.set(businessId, {
            business_name: businessName,
            visit_count: 1,
            rewards_earned: 0,
            last_visit: visit.visit_date
          });
        }
      });

      const businessList = Array.from(businessMap.values());
      setBusinesses(businessList);
      setTotalVisits(visits?.length || 0);
    } catch (error) {
      console.error('Error fetching visit history:', error);
    }
  };

  const fetchAvailableRewards = async () => {
    if (!customerProfile) return;

    try {
      const { data } = await supabase
        .from('rewards')
        .select(`
          *,
          business_profiles!inner(
            business_name
          )
        `)
        .eq('is_active', true)
        .lte('points_required', totalPoints);

      const formattedRewards = data?.map(reward => ({
        id: reward.id,
        title: reward.title,
        points_required: reward.points_required,
        business_name: reward.business_profiles.business_name,
        business_profile_id: reward.business_profile_id
      })) || [];

      setRewards(formattedRewards);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const redeemReward = async (rewardId: string, pointsRequired: number, businessProfileId: string) => {
    if (!customerProfile) return;

    try {
      // Simple redemption tracking
      const { error } = await supabase
        .from('rewards')
        .update({ 
          reward_status: 'redeemed',
          customer_profile_id: customerProfile.id
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
    if (profile?.role === 'customer') {
      fetchCustomerProfile();
    }
  }, [profile]);

  useEffect(() => {
    if (customerProfile) {
      Promise.all([
        fetchVisitHistory(),
        fetchAvailableRewards()
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [customerProfile, totalPoints]);

  return {
    customerProfile,
    businesses,
    rewards,
    redemptions,
    totalVisits,
    totalPoints,
    loading,
    redeemReward,
    refetch: () => {
      setLoading(true);
      fetchCustomerProfile();
      if (customerProfile) {
        Promise.all([
          fetchVisitHistory(),
          fetchAvailableRewards()
        ]).finally(() => {
          setLoading(false);
        });
      }
    }
  };
};
