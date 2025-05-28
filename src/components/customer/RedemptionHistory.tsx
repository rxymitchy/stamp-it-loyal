
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RedemptionHistoryItem {
  id: string;
  reward_title: string;
  business_name: string;
  points_used: number;
  redemption_date: string;
  status: string;
}

interface RedemptionHistoryProps {
  redemptions: RedemptionHistoryItem[];
}

const RedemptionHistory = ({ redemptions }: RedemptionHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Redemption History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {redemptions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No redemptions yet. Start redeeming rewards to see your history!
          </p>
        ) : (
          redemptions.map((redemption) => (
            <div key={redemption.id} className="p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{redemption.reward_title}</h3>
                  <p className="text-sm text-gray-600">{redemption.business_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(redemption.redemption_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">{redemption.points_used} points</Badge>
                  <Badge 
                    className={redemption.status === 'redeemed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {redemption.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RedemptionHistory;
