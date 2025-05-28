
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Gift } from "lucide-react";

interface Customer {
  id: string;
  full_name: string;
  phone_number: string;
  visit_count: number;
  rewards_earned: number;
}

interface CustomerListProps {
  customers: Customer[];
  onRedeemReward: (customerId: string) => void;
}

const CustomerList = ({ customers, onRedeemReward }: CustomerListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Your Customers</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {customers.map((customer) => (
          <div key={customer.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-amber-50 border">
            <div>
              <h3 className="font-semibold">{customer.full_name}</h3>
              <p className="text-sm text-gray-600">{customer.phone_number}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">
                  {customer.visit_count} visits
                </Badge>
                {customer.visit_count >= 5 && (
                  <Badge className="bg-amber-100 text-amber-800">
                    <Gift className="mr-1 h-3 w-3" />
                    Reward Ready!
                  </Badge>
                )}
              </div>
            </div>
            
            {customer.visit_count >= 5 && (
              <Button
                size="sm"
                onClick={() => onRedeemReward(customer.id)}
                className="bg-gradient-to-r from-green-500 to-emerald-600"
              >
                Redeem
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CustomerList;
