
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AdvancedBusinessData {
  analytics: {
    visitsByMonth: Array<{ month: string; visits: number; customers: number }>;
    topCustomers: Array<{ name: string; visits: number; rewards: number }>;
    rewardRedemptions: Array<{ reward: string; count: number }>;
    customerGrowth: Array<{ month: string; newCustomers: number; totalCustomers: number }>;
  };
  rewards: Array<{
    id: string;
    title: string;
    points_required: number;
    is_active: boolean;
    redemption_count: number;
  }>;
}

export const useAdvancedBusinessData = (businessProfile: any) => {
  const [data, setData] = useState<AdvancedBusinessData>({
    analytics: {
      visitsByMonth: [],
      topCustomers: [],
      rewardRedemptions: [],
      customerGrowth: []
    },
    rewards: []
  });
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    if (!businessProfile) return;

    try {
      // Fetch visits by month
      const { data: visits } = await supabase
        .from('visits')
        .select('visit_date, customer_profile_id')
        .eq('business_profile_id', businessProfile.id);

      // Process visits by month
      const visitsByMonth = visits?.reduce((acc: any, visit) => {
        const month = new Date(visit.visit_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (!acc[month]) {
          acc[month] = { month, visits: 0, customers: new Set() };
        }
        acc[month].visits++;
        acc[month].customers.add(visit.customer_profile_id);
        return acc;
      }, {});

      const processedVisitsByMonth = Object.values(visitsByMonth || {}).map((data: any) => ({
        month: data.month,
        visits: data.visits,
        customers: data.customers.size
      }));

      // Fetch top customers
      const { data: topCustomersData } = await supabase
        .from('visits')
        .select(`
          customer_profile_id,
          customer_profiles!inner(full_name)
        `)
        .eq('business_profile_id', businessProfile.id);

      const customerVisits = topCustomersData?.reduce((acc: any, visit) => {
        const customerId = visit.customer_profile_id;
        if (!acc[customerId]) {
          acc[customerId] = {
            name: visit.customer_profiles.full_name,
            visits: 0,
            rewards: 0
          };
        }
        acc[customerId].visits++;
        return acc;
      }, {});

      const topCustomers = Object.values(customerVisits || {})
        .sort((a: any, b: any) => b.visits - a.visits)
        .slice(0, 5);

      // Mock data for reward redemptions and customer growth
      const rewardRedemptions = [
        { reward: 'Free Coffee', count: 15 },
        { reward: '10% Discount', count: 8 },
        { reward: 'Free Dessert', count: 5 }
      ];

      const customerGrowth = [
        { month: 'Jan', newCustomers: 5, totalCustomers: 5 },
        { month: 'Feb', newCustomers: 8, totalCustomers: 13 },
        { month: 'Mar', newCustomers: 12, totalCustomers: 25 },
        { month: 'Apr', newCustomers: 7, totalCustomers: 32 }
      ];

      setData(prev => ({
        ...prev,
        analytics: {
          visitsByMonth: processedVisitsByMonth,
          topCustomers,
          rewardRedemptions,
          customerGrowth
        }
      }));
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchRewards = async () => {
    if (!businessProfile) return;

    try {
      const { data: rewards } = await supabase
        .from('rewards')
        .select('*')
        .eq('business_profile_id', businessProfile.id);

      const rewardsWithCounts = rewards?.map(reward => ({
        ...reward,
        redemption_count: Math.floor(Math.random() * 20) // Mock redemption count
      })) || [];

      setData(prev => ({
        ...prev,
        rewards: rewardsWithCounts
      }));
    } catch (error: any) {
      console.error('Error fetching rewards:', error);
    }
  };

  const createReward = async (title: string, pointsRequired: number) => {
    if (!businessProfile) return;

    try {
      const { error } = await supabase
        .from('rewards')
        .insert({
          business_profile_id: businessProfile.id,
          title,
          points_required: pointsRequired,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reward created successfully!"
      });

      fetchRewards();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateReward = async (id: string, title: string, pointsRequired: number) => {
    try {
      const { error } = await supabase
        .from('rewards')
        .update({ title, points_required: pointsRequired })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reward updated successfully!"
      });

      fetchRewards();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteReward = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rewards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reward deleted successfully!"
      });

      fetchRewards();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const toggleReward = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('rewards')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Reward ${isActive ? 'activated' : 'deactivated'} successfully!`
      });

      fetchRewards();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const exportCustomersCSV = (customers: any[]) => {
    const headers = ['Name', 'Phone', 'Visits', 'Rewards', 'Last Visit'];
    const csvContent = [
      headers.join(','),
      ...customers.map(customer => [
        customer.full_name,
        customer.phone_number,
        customer.visit_count,
        customer.rewards_earned,
        customer.last_visit || 'Never'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'customers.csv';
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Customer data exported successfully!"
    });
  };

  useEffect(() => {
    if (businessProfile) {
      setLoading(true);
      Promise.all([fetchAnalytics(), fetchRewards()]).finally(() => {
        setLoading(false);
      });
    }
  }, [businessProfile]);

  return {
    data,
    loading,
    createReward,
    updateReward,
    deleteReward,
    toggleReward,
    exportCustomersCSV,
    refetch: () => {
      if (businessProfile) {
        setLoading(true);
        Promise.all([fetchAnalytics(), fetchRewards()]).finally(() => {
          setLoading(false);
        });
      }
    }
  };
};
