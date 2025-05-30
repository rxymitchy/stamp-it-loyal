
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useStamps = (customerProfile: any) => {
  const [stamps, setStamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStamps = async () => {
    if (!customerProfile) return;

    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('stamps')
        .select(`
          *,
          business_profiles!business_profile_id (
            business_name
          )
        `)
        .eq('customer_profile_id', customerProfile.id)
        .order('stamp_date', { ascending: false });

      if (error) throw error;

      // Group stamps by business
      const groupedStamps = data?.reduce((acc: any, stamp: any) => {
        const businessId = stamp.business_profile_id;
        if (!acc[businessId]) {
          acc[businessId] = {
            business_name: stamp.business_profiles?.business_name || 'Unknown Business',
            business_id: businessId,
            stamps: [],
            unredeemedCount: 0
          };
        }
        acc[businessId].stamps.push(stamp);
        if (!stamp.is_redeemed) {
          acc[businessId].unredeemedCount++;
        }
        return acc;
      }, {}) || {};

      setStamps(Object.values(groupedStamps));
    } catch (error: any) {
      console.error('Error fetching stamps:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (businessId: string) => {
    try {
      // Mark stamps as redeemed for this business
      const { error } = await supabase
        .from('stamps')
        .update({ is_redeemed: true })
        .eq('customer_profile_id', customerProfile.id)
        .eq('business_profile_id', businessId)
        .eq('is_redeemed', false);

      if (error) throw error;

      toast({
        title: "Reward Claimed!",
        description: "Your surprise reward has been claimed successfully!",
      });

      fetchStamps(); // Refresh stamps data
    } catch (error: any) {
      toast({
        title: "Error claiming reward",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (customerProfile) {
      fetchStamps();
    }
  }, [customerProfile]);

  return {
    stamps,
    loading,
    error,
    claimReward,
    refetch: fetchStamps
  };
};
