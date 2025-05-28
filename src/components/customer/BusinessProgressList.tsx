
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp } from "lucide-react";

interface BusinessVisit {
  business_name: string;
  visit_count: number;
  rewards_earned: number;
  last_visit: string;
}

interface BusinessProgressListProps {
  businesses: BusinessVisit[];
}

const BusinessProgressList = ({ businesses }: BusinessProgressListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>Your Loyalty Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {businesses.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No visits yet. Start visiting participating businesses to earn points!
          </p>
        ) : (
          businesses.map((business, index) => (
            <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-amber-50 border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{business.business_name}</h3>
                <Badge variant="outline">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {business.visit_count} visits
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Last visit: {new Date(business.last_visit).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessProgressList;
