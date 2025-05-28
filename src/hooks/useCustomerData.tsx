
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface BusinessVisit {
  business_name: string;
  visit_count: number;
  rewards_earned: number;
  last_visit: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
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

  const fetchCustomerProfile = async () => {
    if (!profile) return;
    
    const { data } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('user_id', profile.id)
      .single();
    
    setCustomerProfile(data);
  };

  const fetchVisitHistory = async () => {
    if (!customerProfile) return;

    // Get visits with business info - using the correct table structure
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
  };

  const fetchAvailableRewards = async () => {
    if (!customerProfile) return;

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
      description: reward.description || '',
      points_required: reward.points_required,
      business_name: reward.business_profiles.business_name,
      business_profile_id: reward.business_profile_id
    })) || [];

    setRewards(formattedRewards);
  };

  const redeemReward = async (rewardId: string, pointsRequired: number, businessProfileId: string) => {
    if (!customerProfile) return;

    const qrCode = `STAMPIT-${Date.now()}-${rewardId}`;
    
    // For now, we'll track redemptions in the rewards table until reward_redemptions is properly set up
    const { error } = await supabase
      .from('rewards')
      .update({ 
        redemption_count: (rewards.find(r => r.id === rewardId)?.redemption_count || 0) + 1 
      })
      .eq('id', rewardId);

    if (!error) {
      setTotalPoints(prev => prev - pointsRequired);
      fetchAvailableRewards();
    }
  };

  useEffect(() => {
    if (profile?.role === 'customer') {
      fetchCustomerProfile();
    }
  }, [profile]);

  useEffect(() => {
    if (customerProfile) {
      fetchVisitHistory();
      fetchAvailableRewards();
    }
  }, [customerProfile, totalPoints]);

  return {
    customerProfile,
    businesses,
    rewards,
    redemptions,
    totalVisits,
    totalPoints,
    redeemReward,
    refetch: () => {
      fetchCustomerProfile();
      fetchVisitHistory();
      fetchAvailableRewards();
    }
  };
};
