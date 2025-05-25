
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Star, Gift, TrendingUp, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="px-4 pt-8 pb-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="animate-fade-in">
            <Crown className="mx-auto h-16 w-16 text-amber-500 mb-4" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
              StampIt
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Loyalty Rewards Made Simple
            </p>
          </div>

          <Card className="animate-scale-in bg-white/80 backdrop-blur border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-gray-800">Get Started</CardTitle>
              <CardDescription>
                Join thousands of businesses and customers earning rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 transform transition-all duration-200 hover:scale-105"
              >
                <Users className="mr-2 h-5 w-5" />
                Sign Up / Sign In
              </Button>
            </CardContent>
          </Card>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4 pt-8">
            <Card className="bg-white/60 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Users className="mx-auto h-8 w-8 text-purple-500 mb-2" />
                <h3 className="font-semibold text-sm">For Customers</h3>
                <p className="text-xs text-gray-600">Earn rewards at your favorite places</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Building2 className="mx-auto h-8 w-8 text-amber-500 mb-2" />
                <h3 className="font-semibold text-sm">For Businesses</h3>
                <p className="text-xs text-gray-600">Build customer loyalty easily</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="text-center">
              <Star className="mx-auto h-8 w-8 text-amber-500 mb-2" />
              <p className="text-sm text-gray-600">Track Visits</p>
            </div>
            <div className="text-center">
              <Gift className="mx-auto h-8 w-8 text-purple-500 mb-2" />
              <p className="text-sm text-gray-600">Reward Loyalty</p>
            </div>
            <div className="text-center">
              <TrendingUp className="mx-auto h-8 w-8 text-green-500 mb-2" />
              <p className="text-sm text-gray-600">Grow Business</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
