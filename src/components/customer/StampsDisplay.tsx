
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Star } from "lucide-react";

interface StampsDisplayProps {
  stamps: Array<{
    business_name: string;
    business_id: string;
    stamps: any[];
    unredeemedCount: number;
  }>;
  onClaimReward: (businessId: string) => void;
}

const StampsDisplay = ({ stamps, onClaimReward }: StampsDisplayProps) => {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-6 w-6 text-amber-500" />
          <span>Your Stamps Collection</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {stamps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No stamps yet! Visit businesses to start collecting.</p>
          </div>
        ) : (
          stamps.map((business) => (
            <div key={business.business_id} className="p-4 bg-white rounded-lg border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{business.business_name}</h3>
                <Badge variant="secondary">
                  {business.unredeemedCount} stamps
                </Badge>
              </div>
              
              {/* Stamps visualization */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.from({ length: 5 }, (_, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      index < business.unredeemedCount
                        ? 'bg-gradient-to-br from-purple-500 to-amber-500 border-purple-500 text-white shadow-lg transform scale-110'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}
                  >
                    <Star className={`h-6 w-6 ${index < business.unredeemedCount ? 'fill-current' : ''}`} />
                  </div>
                ))}
              </div>

              {/* Progress and reward claim */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress to reward</span>
                  <span>{business.unredeemedCount}/5 stamps</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(business.unredeemedCount / 5) * 100}%` }}
                  ></div>
                </div>

                {business.unredeemedCount >= 5 && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <Gift className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 font-medium">Surprise Reward Ready!</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onClaimReward(business.business_id)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <Gift className="mr-2 h-4 w-4" />
                      Claim
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default StampsDisplay;
