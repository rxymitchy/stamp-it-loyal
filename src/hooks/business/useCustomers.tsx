
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface Customer {
  id: string;
  full_name: string;
  phone_number: string;
  visit_count: number;
  rewards_earned: number;
}

export const useCustomers = (businessProfile: any) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const refetch = () => {
    if (businessProfile) {
      fetchCustomers();
    }
  };

  useEffect(() => {
    if (businessProfile) {
      fetchCustomers();
    }
  }, [businessProfile]);

  return {
    customers,
    loading,
    error,
    refetch
  };
};
