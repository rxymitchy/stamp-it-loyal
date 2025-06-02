
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useCustomerProfile = (profile: any) => {
  const [customerProfile, setCustomerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerProfile = async () => {
    if (!profile) {
      console.log('No profile provided to fetchCustomerProfile');
      setLoading(false);
      return;
    }
    
    console.log('Fetching customer profile for user:', profile.id);
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no record exists
      
      if (error) {
        console.error('Error fetching customer profile:', error);
        
        // Only create profile if it's a "not found" error
        if (error.code === 'PGRST116') {
          console.log('Creating new customer profile');
          const { data: newProfile, error: createError } = await supabase
            .from('customer_profiles')
            .insert({ 
              user_id: profile.id,
              email: profile.email,
              full_name: profile.email.split('@')[0] // Default name from email
            })
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
      } else if (data) {
        console.log('Customer profile found:', data);
        setCustomerProfile(data);
      } else {
        // No profile exists, create one
        console.log('No customer profile found, creating new one');
        const { data: newProfile, error: createError } = await supabase
          .from('customer_profiles')
          .insert({ 
            user_id: profile.id,
            email: profile.email,
            full_name: profile.email.split('@')[0]
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating customer profile:', createError);
          throw createError;
        }
        
        setCustomerProfile(newProfile);
      }
    } catch (error: any) {
      console.error('Error in fetchCustomerProfile:', error);
      setError(`Failed to load customer profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.role === 'customer') {
      console.log('Starting customer profile fetch for profile:', profile);
      fetchCustomerProfile();
    } else {
      setLoading(false);
    }
  }, [profile]);

  return {
    customerProfile,
    loading,
    error,
    refetch: fetchCustomerProfile
  };
};
