
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useStampManagement = (businessProfile: any) => {
  const [loading, setLoading] = useState(false);

  const addStampToCustomer = async (customerPhoneNumber: string) => {
    if (!businessProfile) {
      toast({
        title: "Error",
        description: "Business profile not found",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Find customer by phone number
      const { data: customerData, error: customerError } = await supabase
        .from('customer_profiles')
        .select('id')
        .eq('phone_number', customerPhoneNumber)
        .single();

      if (customerError || !customerData) {
        throw new Error('Customer not found with this phone number');
      }

      // Add stamp
      const { error: stampError } = await supabase
        .from('stamps')
        .insert({
          customer_profile_id: customerData.id,
          business_profile_id: businessProfile.id
        });

      if (stampError) throw stampError;

      toast({
        title: "Stamp Added!",
        description: "Stamp has been successfully added to customer's collection.",
      });

      return true;
    } catch (error: any) {
      console.error('Error adding stamp:', error);
      toast({
        title: "Error adding stamp",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    addStampToCustomer,
    loading
  };
};
