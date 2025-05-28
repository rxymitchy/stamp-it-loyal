
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
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerProfile = async () => {
    if (!profile) {
      console.log('No profile provided to fetchCustomerProfile');
      return;
    }
    
    console.log('Fetching customer profile for user:', profile.id);
    
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', profile.id)
        .single();
      
      if (error) {
        console.error('Error fetching customer profile:', error);
        if (error.code === 'PGRST116') {
          // No customer profile found, create one
          console.log('Creating new customer profile');
          const { data: newProfile, error: createError } = await supabase
            .from('customer_profiles')
            .insert({ user_id: profile.id })
            .select()
            .single();
          
          if (createError) {
            console.error('Error creating customer profile:', createError);
            throw createError;
          }
          
          setCustomerProfile(newProfile);
        } else {
          throw error;
        }
      } else {
        console.log('Customer profile found:', data);
        setCustomerProfile(data);
      }
    } catch (error: any) {
      console.error('Error in fetchCustomerProfile:', error);
      setError(`Failed to load customer profile: ${error.message}`);
    }
  };

  const fetchVisitHistory = async () => {
    if (!customerProfile) {
      console.log('No customer profile available for fetchVisitHistory');
      return;
    }

    console.log('Fetching visit history for customer:', customerProfile.id);

    try {
      // Get visits with business info
      const { data: visits, error } = await supabase
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

      if (error) {
        console.error('Error fetching visits:', error);
        throw error;
      }

      console.log('Visits fetched:', visits);

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
    } catch (error: any) {
      console.error('Error in fetchVisitHistory:', error);
      setError(`Failed to load visit history: ${error.message}`);
    }
  };

  const fetchAvailableRewards = async () => {
    if (!customerProfile) {
      console.log('No customer profile available for fetchAvailableRewards');
      return;
    }

    console.log('Fetching available rewards');

    try {
      const { data, error } = await supabase
        .from('rewards')
        .select(`
          *,
          business_profiles!inner(
            business_name
          )
        `)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching rewards:', error);
        throw error;
      }

      const formattedRewards = data?.map(reward => ({
        id: reward.id,
        title: reward.title,
        points_required: reward.points_required,
        business_name: reward.business_profiles.business_name,
        business_profile_id: reward.business_profile_id
      })) || [];

      setRewards(formattedRewards);
    } catch (error: any) {
      console.error('Error in fetchAvailableRewards:', error);
      setError(`Failed to load rewards: ${error.message}`);
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
      console.log('Starting customer data fetch for profile:', profile);
      setLoading(true);
      setError(null);
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.error('Customer data fetch timed out');
          setError('Loading timed out. Please try refreshing the page.');
          setLoading(false);
        }
      }, 10000); // 10 second timeout

      fetchCustomerProfile().finally(() => {
        clearTimeout(timeoutId);
      });
    }
  }, [profile]);

  useEffect(() => {
    if (customerProfile) {
      console.log('Customer profile loaded, fetching additional data');
      Promise.all([
        fetchVisitHistory(),
        fetchAvailableRewards()
      ]).finally(() => {
        console.log('All customer data loaded');
        setLoading(false);
      });
    }
  }, [customerProfile]);

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
    refetch: () => {
      setLoading(true);
      setError(null);
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
