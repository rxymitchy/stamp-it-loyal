
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useRewardManagement = (businessProfile: any, onRewardRedeemed?: () => void) => {
  const handleRedeemReward = async (customerId: string) => {
    try {
      const { error } = await supabase
        .from('rewards')
        .update({ reward_status: 'redeemed' })
        .eq('customer_profile_id', customerId)
        .eq('business_profile_id', businessProfile.id)
        .eq('reward_status', 'earned');

      if (error) {
        toast({
          title: "Error",
          description: "Failed to redeem reward",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Reward redeemed! ✨",
        description: "Customer reward has been marked as used",
      });

      if (onRewardRedeemed) {
        onRewardRedeemed();
      }
    } catch (error: any) {
      console.error('Error redeeming reward:', error);
      toast({
        title: "Error",
        description: `Failed to redeem reward: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  return {
    handleRedeemReward
  };
};
