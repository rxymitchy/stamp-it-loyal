
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface BusinessVisit {
  business_name: string;
  visit_count: number;
  rewards_earned: number;
  last_visit: string;
}

export const useVisitHistory = (customerProfile: any) => {
  const [businesses, setBusinesses] = useState<BusinessVisit[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitHistory = async () => {
    if (!customerProfile) {
      console.log('No customer profile available for fetchVisitHistory');
      return;
    }

    console.log('Fetching visit history for customer:', customerProfile.id);
    setLoading(true);
    setError(null);

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
        const businessName = visit.business_profiles?.business_name || 'Unknown Business';
        
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerProfile) {
      fetchVisitHistory();
    }
  }, [customerProfile]);

  return {
    businesses,
    totalVisits,
    totalPoints,
    loading,
    error,
    refetch: fetchVisitHistory
  };
};
