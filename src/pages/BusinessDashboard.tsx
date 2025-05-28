import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Phone, Users, Gift, TrendingUp, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Customer {
  id: string;
  full_name: string;
  phone_number: string;
  visit_count: number;
  rewards_earned: number;
}

const BusinessDashboard = () => {
  const { profile, signOut } = useAuth();
  const [customerPhone, setCustomerPhone] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.role !== 'business') {
      navigate('/auth');
      return;
    }
    
    fetchBusinessProfile();
    fetchCustomers();
  }, [profile]);

  const fetchBusinessProfile = async () => {
    if (!profile) return;
    
    const { data } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', profile.id)
      .single();
    
    setBusinessProfile(data);
  };

  const fetchCustomers = async () => {
    if (!businessProfile) return;

    const { data: visits } = await supabase
      .from('visits')
      .select(`
        customer_profile_id,
        customer_profiles!inner(
          id,
          full_name,
          phone_number
        )
      `)
      .eq('business_profile_id', businessProfile.id);

    const { data: rewards } = await supabase
      .from('rewards')
      .select('customer_profile_id')
      .eq('business_profile_id', businessProfile.id);

    // Group visits by customer
    const customerMap = new Map();
    visits?.forEach(visit => {
      const customer = visit.customer_profiles;
      if (customerMap.has(customer.id)) {
        customerMap.get(customer.id).visit_count++;
      } else {
        customerMap.set(customer.id, {
          ...customer,
          visit_count: 1,
          rewards_earned: 0
        });
      }
    });

    // Count rewards per customer
    rewards?.forEach(reward => {
      if (customerMap.has(reward.customer_profile_id)) {
        customerMap.get(reward.customer_profile_id).rewards_earned++;
      }
    });

    setCustomers(Array.from(customerMap.values()));
  };

  const handleAddVisit = async () => {
    if (!customerPhone || !businessProfile) return;
    
    setLoading(true);
    try {
      // Find or create customer
      let { data: customer } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('phone_number', customerPhone)
        .single();

      if (!customer) {
        toast({
          title: "Customer not found",
          description: "Please ask the customer to sign up first",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Add visit
      const { error } = await supabase
        .from('visits')
        .insert({
          customer_profile_id: customer.id,
          business_profile_id: businessProfile.id,
          points_earned: 1
        });

      if (error) throw error;

      toast({
        title: "Visit added! 🎉",
        description: `Visit logged for ${customer.full_name}`,
      });

      setCustomerPhone("");
      fetchCustomers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async (customerId: string) => {
    const { error } = await supabase
      .from('rewards')
      .update({ reward_status: 'redeemed' })
      .eq('customer_profile_id', customerId)
      .eq('business_profile_id', businessProfile.id)
      .eq('reward_status', 'earned');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to redeem reward",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Reward redeemed! ✨",
      description: "Customer reward has been marked as used",
    });

    fetchCustomers();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!businessProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      <div className="bg-white/80 backdrop-blur border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">{businessProfile.business_name}</h1>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Add Visit Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-purple-600" />
              <span>Add Customer Visit</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="phone">Customer Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddVisit} disabled={loading}>
                  Add Visit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer List */}
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
                    onClick={() => handleRedeemReward(customer.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600"
                  >
                    Redeem
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="bg-gradient-to-r from-purple-500 to-amber-500 text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{customers.length}</div>
                <div className="text-sm opacity-90">Total Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {customers.reduce((sum, c) => sum + c.visit_count, 0)}
                </div>
                <div className="text-sm opacity-90">Total Visits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessDashboard;
