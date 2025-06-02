
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Star } from "lucide-react";
import { useState } from "react";

interface LoyaltyCardProps {
  customerName: string;
  stamps: Array<{
    business_name: string;
    business_id: string;
    stamps: any[];
    unredeemedCount: number;
  }>;
  onClaimReward: (businessId: string) => void;
}

const LoyaltyCard = ({ customerName, stamps, onClaimReward }: LoyaltyCardProps) => {
  const [selectedBusiness, setSelectedBusiness] = useState(0);
  
  if (stamps.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-200">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <Star className="h-12 w-12 mx-auto text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome, {customerName}!</h3>
          <p className="text-gray-600">Start collecting stamps by visiting participating businesses.</p>
        </CardContent>
      </Card>
    );
  }

  const currentBusiness = stamps[selectedBusiness];

  return (
    <div className="space-y-4">
      {/* Business Selector */}
      {stamps.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {stamps.map((business, index) => (
            <Button
              key={business.business_id}
              variant={selectedBusiness === index ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedBusiness(index)}
              className="text-xs"
            >
              {business.business_name}
            </Button>
          ))}
        </div>
      )}

      {/* Loyalty Card */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-200 max-w-sm mx-auto">
        <CardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="bg-white rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold text-amber-600">
                {currentBusiness.business_name.charAt(0)}
              </span>
            </div>
            <h3 className="font-bold text-lg text-gray-800">{currentBusiness.business_name}</h3>
            <p className="text-sm text-gray-600 uppercase tracking-wide">
              {currentBusiness.unredeemedCount} SLICE{currentBusiness.unredeemedCount !== 1 ? 'S' : ''} • 1 STAMP
            </p>
          </div>

          {/* Stamps Grid */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {Array.from({ length: 10 }, (_, index) => (
              <div
                key={index}
                className={`aspect-square rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  index < currentBusiness.unredeemedCount
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-500 shadow-lg'
                    : 'bg-white border-gray-300'
                }`}
              >
                {index < currentBusiness.unredeemedCount ? (
                  <Star className="h-4 w-4 text-white" fill="currentColor" />
                ) : (
                  <div className="w-3 h-3 border border-gray-400 rounded-full" />
                )}
              </div>
            ))}
          </div>

          {/* Progress Text */}
          <div className="text-center mb-4">
            <p className="text-sm text-gray-700">
              10 SLICES = 1 FREE HALF NO CAKE
            </p>
          </div>

          {/* Customer Info */}
          <div className="mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700">FIRST NAME</span>
              <span className="font-medium text-gray-700">AVAILABLE REWARDS</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">{customerName}</span>
              <span className="text-lg font-bold text-gray-800">
                {Math.floor(currentBusiness.unredeemedCount / 5)} reward{Math.floor(currentBusiness.unredeemedCount / 5) !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Barcode */}
          <div className="bg-white p-2 rounded mb-4">
            <div className="flex justify-center space-x-1">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className={`bg-black ${Math.random() > 0.5 ? 'w-1' : 'w-0.5'} h-8`}
                />
              ))}
            </div>
          </div>

          {/* Reward Button */}
          {currentBusiness.unredeemedCount >= 5 && (
            <div className="text-center">
              <Badge className="mb-2 bg-green-500 text-white">
                <Gift className="mr-1 h-3 w-3" />
                Reward Ready!
              </Badge>
              <Button
                onClick={() => onClaimReward(currentBusiness.business_id)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Gift className="mr-2 h-4 w-4" />
                Claim Your Reward
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyCard;
