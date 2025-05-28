
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode } from "lucide-react";

interface Reward {
  id: string;
  title: string;
  points_required: number;
  business_name: string;
  business_profile_id: string;
}

interface RewardsCatalogProps {
  rewards: Reward[];
  totalPoints: number;
  onRedeemReward: (rewardId: string, pointsRequired: number, businessProfileId: string) => void;
}

const RewardsCatalog = ({ rewards, totalPoints, onRedeemReward }: RewardsCatalogProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Rewards</CardTitle>
        <CardDescription>
          You have {totalPoints} points available to spend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rewards.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No rewards available with your current points. Keep visiting businesses to earn more!
          </p>
        ) : (
          rewards.map((reward) => (
            <div key={reward.id} className="p-4 rounded-lg border flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{reward.title}</h3>
                <p className="text-sm text-purple-600">{reward.business_name}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge>{reward.points_required} points</Badge>
                <Button
                  onClick={() => onRedeemReward(reward.id, reward.points_required, reward.business_profile_id)}
                  className="bg-gradient-to-r from-purple-500 to-amber-500"
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Redeem
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RewardsCatalog;
