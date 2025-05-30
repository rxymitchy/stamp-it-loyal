
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useBusinessProfile = (profile: any) => {
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

  const refetch = () => {
    setLoading(true);
    setError(null);
    fetchBusinessProfile().finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (profile?.role === 'business') {
      setLoading(true);
      fetchBusinessProfile().finally(() => {
        setLoading(false);
      });
    }
  }, [profile]);

  return {
    businessProfile,
    loading,
    error,
    refetch
  };
};
