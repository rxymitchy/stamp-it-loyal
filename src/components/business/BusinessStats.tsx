
import { Card, CardContent } from "@/components/ui/card";

interface BusinessStatsProps {
  totalCustomers: number;
  totalVisits: number;
}

const BusinessStats = ({ totalCustomers, totalVisits }: BusinessStatsProps) => {
  return (
    <Card className="bg-gradient-to-r from-purple-500 to-amber-500 text-white">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <div className="text-sm opacity-90">Total Customers</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{totalVisits}</div>
            <div className="text-sm opacity-90">Total Visits</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessStats;
