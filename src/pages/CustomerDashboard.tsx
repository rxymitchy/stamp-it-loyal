
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Gift, Building2, LogOut, TrendingUp, User, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface BusinessVisit {
  business_name: string;
  visit_count: number;
  rewards_earned: number;
  last_visit: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  points_required: number;
  business_name: string;
  business_profile_id: string;
}

interface RedemptionHistory {
  id: string;
  reward_title: string;
  business_name: string;
  points_used: number;
  redemption_date: string;
  status: string;
}

const CustomerDashboard = () => {
  const { profile, signOut } = useAuth();
  const [customerProfile, setCustomerProfile] = useState<any>(null);
  const [businesses, setBusinesses] = useState<BusinessVisit[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionHistory[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.role !== 'customer') {
      navigate('/');
      return;
    }
    
    fetchCustomerProfile();
  }, [profile]);

  useEffect(() => {
    if (customerProfile) {
      fetchVisitHistory();
      fetchAvailableRewards();
      fetchRedemptionHistory();
    }
  }, [customerProfile]);

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
        points_earned,
        business_profile_id,
        business_profiles!inner(
          business_name
        )
      `)
      .eq('customer_profile_id', customerProfile.id);

    // Get rewards
    const { data: rewardData } = await supabase
      .from('reward_redemptions')
      .select('business_profile_id, points_used')
      .eq('customer_profile_id', customerProfile.id);

    // Calculate total points
    const totalEarned = visits?.reduce((sum, visit) => sum + (visit.points_earned || 0), 0) || 0;
    const totalUsed = rewardData?.reduce((sum, redemption) => sum + redemption.points_used, 0) || 0;
    setTotalPoints(totalEarned - totalUsed);

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
    rewardData?.forEach(redemption => {
      if (businessMap.has(redemption.business_profile_id)) {
        businessMap.get(redemption.business_profile_id).rewards_earned++;
      }
    });

    const businessList = Array.from(businessMap.values());
    setBusinesses(businessList);
    setTotalVisits(visits?.length || 0);
  };

  const fetchAvailableRewards = async () => {
    if (!customerProfile) return;

    const { data } = await supabase
      .from('rewards')
      .select(`
        *,
        business_profiles!inner(
          business_name
        )
      `)
      .eq('is_active', true)
      .lte('points_required', totalPoints);

    const formattedRewards = data?.map(reward => ({
      id: reward.id,
      title: reward.title,
      description: reward.description || '',
      points_required: reward.points_required,
      business_name: reward.business_profiles.business_name,
      business_profile_id: reward.business_profile_id
    })) || [];

    setRewards(formattedRewards);
  };

  const fetchRedemptionHistory = async () => {
    if (!customerProfile) return;

    const { data } = await supabase
      .from('reward_redemptions')
      .select(`
        *,
        rewards!inner(title),
        business_profiles!inner(business_name)
      `)
      .eq('customer_profile_id', customerProfile.id)
      .order('redemption_date', { ascending: false });

    const formattedRedemptions = data?.map(redemption => ({
      id: redemption.id,
      reward_title: redemption.rewards.title,
      business_name: redemption.business_profiles.business_name,
      points_used: redemption.points_used,
      redemption_date: redemption.redemption_date,
      status: redemption.status
    })) || [];

    setRedemptions(formattedRedemptions);
  };

  const redeemReward = async (rewardId: string, pointsRequired: number, businessProfileId: string) => {
    if (!customerProfile) return;

    const qrCode = `STAMPIT-${Date.now()}-${rewardId}`;
    
    const { error } = await supabase
      .from('reward_redemptions')
      .insert({
        customer_profile_id: customerProfile.id,
        reward_id: rewardId,
        business_profile_id: businessProfileId,
        points_used: pointsRequired,
        qr_code: qrCode,
        status: 'pending'
      });

    if (!error) {
      setTotalPoints(prev => prev - pointsRequired);
      fetchAvailableRewards();
      fetchRedemptionHistory();
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!customerProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Welcome, {customerProfile.full_name || 'Customer'}</h1>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'rewards', label: 'Rewards', icon: Gift },
            { id: 'history', label: 'History', icon: Star },
            { id: 'profile', label: 'Profile', icon: User }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-amber-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Overview */}
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
                    <div className="text-2xl font-bold">{businesses.length}</div>
                    <div className="text-sm opacity-90">Businesses</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{redemptions.length}</div>
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
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Rewards</CardTitle>
                <CardDescription>
                  You have {totalPoints} points available to spend
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {rewards.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No rewards available with your current points. Keep visiting businesses to earn more!
                  </p>
                ) : (
                  rewards.map((reward) => (
                    <div key={reward.id} className="p-4 rounded-lg border flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{reward.title}</h3>
                        <p className="text-sm text-gray-600">{reward.description}</p>
                        <p className="text-sm text-purple-600">{reward.business_name}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge>{reward.points_required} points</Badge>
                        <Button
                          onClick={() => redeemReward(reward.id, reward.points_required, reward.business_profile_id)}
                          className="bg-gradient-to-r from-purple-500 to-amber-500"
                        >
                          <QrCode className="mr-2 h-4 w-4" />
                          Redeem
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
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
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="p-2 bg-gray-50 rounded">{customerProfile.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <p className="p-2 bg-gray-50 rounded">{customerProfile.phone_number || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="p-2 bg-gray-50 rounded">{profile?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Member Since</label>
                    <p className="p-2 bg-gray-50 rounded">
                      {new Date(customerProfile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
