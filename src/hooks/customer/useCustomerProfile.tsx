
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useCustomerProfile = (profile: any) => {
  const [customerProfile, setCustomerProfile] = useState<any>(null);
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

  useEffect(() => {
    if (profile?.role === 'customer') {
      console.log('Starting customer profile fetch for profile:', profile);
      setLoading(true);
      setError(null);
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.error('Customer profile fetch timed out');
          setError('Loading timed out. Please try refreshing the page.');
          setLoading(false);
        }
      }, 10000); // 10 second timeout

      fetchCustomerProfile().finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });
    }
  }, [profile]);

  return {
    customerProfile,
    loading,
    error,
    refetch: fetchCustomerProfile
  };
};
