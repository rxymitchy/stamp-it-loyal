
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  full_name: string;
  phone_number: string;
  visit_count: number;
  rewards_earned: number;
}

export const useBusinessData = (profile: any) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinessProfile = async () => {
    if (!profile) return;
    
    try {
      setError(null);
      const { data } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', profile.id)
        .single();
      
      setBusinessProfile(data);
    } catch (error: any) {
      console.error('Error fetching business profile:', error);
      setError(`Failed to load business profile: ${error.message}`);
    }
  };

  const fetchCustomers = async () => {
    if (!businessProfile) return;

    try {
      setError(null);
      const { data: visits } = await supabase
        .from('visits')
        .select(`
          customer_profile_id,
          customer_profiles!inner(
            id,
            full_name,
            phone_number
          )
        `)
        .eq('business_profile_id', businessProfile.id);

      const { data: rewards } = await supabase
        .from('rewards')
        .select('customer_profile_id')
        .eq('business_profile_id', businessProfile.id);

      // Group visits by customer
      const customerMap = new Map();
      visits?.forEach(visit => {
        const customer = visit.customer_profiles;
        if (customerMap.has(customer.id)) {
          customerMap.get(customer.id).visit_count++;
        } else {
          customerMap.set(customer.id, {
            ...customer,
            visit_count: 1,
            rewards_earned: 0
          });
        }
      });

      // Count rewards per customer
      rewards?.forEach(reward => {
        if (customerMap.has(reward.customer_profile_id)) {
          customerMap.get(reward.customer_profile_id).rewards_earned++;
        }
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      setError(`Failed to load customers: ${error.message}`);
    }
  };

  const handleAddVisit = async (customerPhone: string) => {
    if (!customerPhone || !businessProfile) return;
    
    setLoading(true);
    try {
      setError(null);
      // Find or create customer
      let { data: customer } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('phone_number', customerPhone)
        .single();

      if (!customer) {
        toast({
          title: "Customer not found",
          description: "Please ask the customer to sign up first",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Add visit
      const { error } = await supabase
        .from('visits')
        .insert({
          customer_profile_id: customer.id,
          business_profile_id: businessProfile.id,
          points_earned: 1
        });

      if (error) throw error;

      toast({
        title: "Visit added! 🎉",
        description: `Visit logged for ${customer.full_name}`,
      });

      fetchCustomers();
    } catch (error: any) {
      console.error('Error adding visit:', error);
      setError(`Failed to add visit: ${error.message}`);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async (customerId: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('rewards')
        .update({ reward_status: 'redeemed' })
        .eq('customer_profile_id', customerId)
        .eq('business_profile_id', businessProfile.id)
        .eq('reward_status', 'earned');

      if (error) {
        toast({
          title: "Error",
          description: "Failed to redeem reward",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Reward redeemed! ✨",
        description: "Customer reward has been marked as used",
      });

      fetchCustomers();
    } catch (error: any) {
      console.error('Error redeeming reward:', error);
      setError(`Failed to redeem reward: ${error.message}`);
    }
  };

  useEffect(() => {
    if (profile?.role === 'business') {
      setLoading(true);
      fetchBusinessProfile().finally(() => {
        setLoading(false);
      });
    }
  }, [profile]);

  useEffect(() => {
    if (businessProfile) {
      fetchCustomers();
    }
  }, [businessProfile]);

  return {
    businessProfile,
    customers,
    loading,
    error,
    handleAddVisit,
    handleRedeemReward,
    refetch: () => {
      setLoading(true);
      setError(null);
      fetchBusinessProfile().finally(() => {
        if (businessProfile) {
          fetchCustomers();
        }
        setLoading(false);
      });
    }
  };
};
