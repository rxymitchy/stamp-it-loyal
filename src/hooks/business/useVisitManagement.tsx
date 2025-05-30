
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useVisitManagement = (businessProfile: any, onVisitAdded?: () => void) => {
  const [loading, setLoading] = useState(false);

  const handleAddVisit = async (customerPhone: string) => {
    if (!customerPhone || !businessProfile) return;
    
    setLoading(true);
    try {
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

      if (onVisitAdded) {
        onVisitAdded();
      }
    } catch (error: any) {
      console.error('Error adding visit:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    handleAddVisit,
    loading
  };
};
