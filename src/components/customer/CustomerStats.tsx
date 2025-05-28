
import { Card, CardContent } from "@/components/ui/card";

interface CustomerStatsProps {
  totalPoints: number;
  totalVisits: number;
  businessCount: number;
  rewardsCount: number;
}

const CustomerStats = ({ totalPoints, totalVisits, businessCount, rewardsCount }: CustomerStatsProps) => {
  return (
    <Card className="bg-gradient-to-r from-purple-500 to-amber-500 text-white">
      <CardContent className="p-6">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{totalPoints}</div>
            <div className="text-sm opacity-90">Available Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{totalVisits}</div>
            <div className="text-sm opacity-90">Total Visits</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{businessCount}</div>
            <div className="text-sm opacity-90">Businesses</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{rewardsCount}</div>
            <div className="text-sm opacity-90">Rewards Earned</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerStats;
