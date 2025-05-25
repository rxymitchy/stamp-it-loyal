
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Phone, Crown, Star, Gift, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [customerPhone, setCustomerPhone] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Mock data for demonstration
  const mockCustomers = [
    { phone: "+1234567890", visits: 4, name: "Sarah J." },
    { phone: "+1987654321", visits: 7, name: "Mike R." },
    { phone: "+1555123456", visits: 2, name: "Emma W." },
  ];

  const handleAddVisit = () => {
    if (!customerPhone) {
      toast({
        title: "Phone number required",
        description: "Please enter a customer's phone number",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Visit added! 🎉",
      description: `Customer ${customerPhone} visit logged successfully`,
    });
    setCustomerPhone("");
  };

  const handleRedeemReward = (phone: string) => {
    toast({
      title: "Reward redeemed! ✨",
      description: "Customer reward has been marked as used",
    });
  };

  if (!isAuthenticated) {
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
                <CardTitle className="text-2xl text-gray-800">Welcome Back</CardTitle>
                <CardDescription>
                  Manage your customer loyalty program
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Business Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@business.com"
                    className="h-12 text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-12 text-lg"
                  />
                </div>
                <Button 
                  onClick={() => setIsAuthenticated(true)}
                  className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 transform transition-all duration-200 hover:scale-105"
                >
                  Sign In to Dashboard
                </Button>
              </CardContent>
            </Card>

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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-amber-500" />
              <h1 className="text-xl font-bold text-gray-800">StampIt Dashboard</h1>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAuthenticated(false)}
              className="border-purple-200"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Add Visit Card */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-purple-600" />
              <span>Add Customer Visit</span>
            </CardTitle>
            <CardDescription>
              Enter phone number to log a visit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Customer Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="h-12 text-lg"
              />
            </div>
            <Button 
              onClick={handleAddVisit}
              className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 transform transition-all duration-200 hover:scale-105"
            >
              <Star className="mr-2 h-5 w-5" />
              Add Visit
            </Button>
          </CardContent>
        </Card>

        {/* Customer List */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
            <CardDescription>
              Track loyalty progress and manage rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockCustomers.map((customer, index) => (
              <div key={customer.phone} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-amber-50 border border-purple-100">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-800">{customer.name}</h3>
                      {customer.visits >= 5 && (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          <Gift className="mr-1 h-3 w-3" />
                          Reward Ready!
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{customer.phone}</p>
                    
                    {/* Stamp Progress */}
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            i < customer.visits
                              ? "bg-gradient-to-r from-purple-500 to-amber-500 border-purple-500 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {i < customer.visits && <Star className="h-4 w-4" />}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {customer.visits}/5 visits • {5 - customer.visits > 0 ? `${5 - customer.visits} more for reward` : "Reward earned!"}
                    </p>
                  </div>
                  
                  {customer.visits >= 5 && (
                    <Button
                      size="sm"
                      onClick={() => handleRedeemReward(customer.phone)}
                      className="ml-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <Gift className="mr-1 h-4 w-4" />
                      Redeem
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="bg-gradient-to-r from-purple-500 to-amber-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">47</div>
                <div className="text-sm opacity-90">Total Visits</div>
              </div>
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm opacity-90">Active Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm opacity-90">Rewards Given</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
