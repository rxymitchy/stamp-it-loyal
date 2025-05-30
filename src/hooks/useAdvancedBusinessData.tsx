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

  const fetchAdvancedData = async () => {
    if (!businessProfile) return;

    setLoading(true);
    try {
      // Fetch rewards
      const { data: rewards } = await supabase
        .from('rewards')
        .select('*')
        .eq('business_profile_id', businessProfile.id);

      // Generate mock analytics data for now
      const mockAnalytics: AdvancedBusinessData['analytics'] = {
        visitsByMonth: [
          { month: 'Jan', visits: 45, customers: 12 },
          { month: 'Feb', visits: 52, customers: 15 },
          { month: 'Mar', visits: 48, customers: 14 },
          { month: 'Apr', visits: 61, customers: 18 },
          { month: 'May', visits: 55, customers: 16 },
          { month: 'Jun', visits: 67, customers: 20 }
        ],
        topCustomers: [
          { name: 'John Doe', visits: 15, rewards: 3 },
          { name: 'Jane Smith', visits: 12, rewards: 2 },
          { name: 'Mike Johnson', visits: 10, rewards: 2 },
          { name: 'Sarah Wilson', visits: 8, rewards: 1 },
          { name: 'Tom Brown', visits: 7, rewards: 1 }
        ],
        rewardRedemptions: [
          { reward: 'Free Coffee', count: 25 },
          { reward: '10% Discount', count: 18 },
          { reward: 'Free Dessert', count: 12 },
          { reward: 'Buy 1 Get 1', count: 8 }
        ],
        customerGrowth: [
          { month: 'Jan', newCustomers: 5, totalCustomers: 25 },
          { month: 'Feb', newCustomers: 8, totalCustomers: 33 },
          { month: 'Mar', newCustomers: 6, totalCustomers: 39 },
          { month: 'Apr', newCustomers: 10, totalCustomers: 49 },
          { month: 'May', newCustomers: 7, totalCustomers: 56 },
          { month: 'Jun', newCustomers: 12, totalCustomers: 68 }
        ]
      };

      setData({
        analytics: mockAnalytics,
        rewards: rewards || []
      });
    } catch (error) {
      console.error('Error fetching advanced data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReward = async (rewardData: { title: string; points_required: number }) => {
    try {
      const { error } = await supabase
        .from('rewards')
        .insert({
          ...rewardData,
          business_profile_id: businessProfile.id,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Reward created successfully!",
        description: `${rewardData.title} has been added to your rewards catalog.`,
      });

      fetchAdvancedData();
    } catch (error: any) {
      toast({
        title: "Error creating reward",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateReward = async (id: string, updates: Partial<{ title: string; points_required: number; is_active: boolean }>) => {
    try {
      const { error } = await supabase
        .from('rewards')
        .update(updates)
        .eq('id', id)
        .eq('business_profile_id', businessProfile.id);

      if (error) throw error;

      toast({
        title: "Reward updated successfully!",
      });

      fetchAdvancedData();
    } catch (error: any) {
      toast({
        title: "Error updating reward",
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
        .eq('id', id)
        .eq('business_profile_id', businessProfile.id);

      if (error) throw error;

      toast({
        title: "Reward deleted successfully!",
      });

      fetchAdvancedData();
    } catch (error: any) {
      toast({
        title: "Error deleting reward",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const toggleReward = async (id: string, isActive: boolean) => {
    await updateReward(id, { is_active: isActive });
  };

  const exportCustomersCSV = (customers: any[]) => {
    const headers = ['Name', 'Phone', 'Visits', 'Rewards'];
    const csvContent = [
      headers.join(','),
      ...customers.map(customer => 
        [customer.full_name, customer.phone_number, customer.visit_count, customer.rewards_earned].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful!",
      description: "Customer data has been exported to CSV.",
    });
  };

  const refetch = () => {
    fetchAdvancedData();
  };

  useEffect(() => {
    if (businessProfile) {
      fetchAdvancedData();
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
    refetch
  };
};
