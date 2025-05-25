
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Gift, Building2, LogOut, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface BusinessVisit {
  business_name: string;
  visit_count: number;
  rewards_earned: number;
  last_visit: string;
}

const CustomerDashboard = () => {
  const { profile, signOut } = useAuth();
  const [customerProfile, setCustomerProfile] = useState<any>(null);
  const [businesses, setBusinesses] = useState<BusinessVisit[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.role !== 'customer') {
      navigate('/auth');
      return;
    }
    
    fetchCustomerProfile();
    fetchVisitHistory();
  }, [profile]);

  const fetchCustomerProfile = async () => {
    if (!profile) return;
    
    const { data } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('user_id', profile.id)
      .single();
    
    setCustomerProfile(data);
  };

  const fetchVisitHistory = async () => {
    if (!customerProfile) return;

    // Get visits with business info
    const { data: visits } = await supabase
      .from('visits')
      .select(`
        visit_date,
        business_profile_id,
        business_profiles!inner(
          business_name
        )
      `)
      .eq('customer_profile_id', customerProfile.id);

    // Get rewards
    const { data: rewards } = await supabase
      .from('rewards')
      .select('business_profile_id')
      .eq('customer_profile_id', customerProfile.id);

    // Group by business
    const businessMap = new Map();
    visits?.forEach(visit => {
      const businessId = visit.business_profile_id;
      const businessName = visit.business_profiles.business_name;
      
      if (businessMap.has(businessId)) {
        businessMap.get(businessId).visit_count++;
        if (new Date(visit.visit_date) > new Date(businessMap.get(businessId).last_visit)) {
          businessMap.get(businessId).last_visit = visit.visit_date;
        }
      } else {
        businessMap.set(businessId, {
          business_name: businessName,
          visit_count: 1,
          rewards_earned: 0,
          last_visit: visit.visit_date
        });
      }
    });

    // Count rewards per business
    rewards?.forEach(reward => {
      if (businessMap.has(reward.business_profile_id)) {
        businessMap.get(reward.business_profile_id).rewards_earned++;
      }
    });

    const businessList = Array.from(businessMap.values());
    setBusinesses(businessList);
    setTotalVisits(visits?.length || 0);
    setTotalRewards(rewards?.length || 0);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!customerProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      <div className="bg-white/80 backdrop-blur border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Welcome, {customerProfile.full_name}</h1>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <Card className="bg-gradient-to-r from-purple-500 to-amber-500 text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{totalVisits}</div>
                <div className="text-sm opacity-90">Total Visits</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{businesses.length}</div>
                <div className="text-sm opacity-90">Businesses</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{totalRewards}</div>
                <div className="text-sm opacity-90">Rewards Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Businesses List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Your Loyalty Progress</span>
            </CardTitle>
            <CardDescription>
              Track your visits and rewards at each business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {businesses.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No visits yet. Start visiting participating businesses to earn rewards!
              </p>
            ) : (
              businesses.map((business, index) => (
                <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-amber-50 border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">{business.business_name}</h3>
                    {business.visit_count >= 5 && (
                      <Badge className="bg-amber-100 text-amber-800">
                        <Gift className="mr-1 h-3 w-3" />
                        Reward Available!
                      </Badge>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress to next reward</span>
                      <span>{business.visit_count % 5}/5 visits</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((business.visit_count % 5) / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {business.visit_count} visits
                      </Badge>
                      <Badge variant="outline">
                        <Gift className="mr-1 h-3 w-3" />
                        {business.rewards_earned} rewards
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Call to Action */}
        {businesses.length === 0 && (
          <Card className="text-center">
            <CardContent className="p-6">
              <Star className="mx-auto h-12 w-12 text-amber-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Start Earning Rewards!</h3>
              <p className="text-gray-600 mb-4">
                Visit participating businesses and give them your phone number to start earning loyalty points.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
