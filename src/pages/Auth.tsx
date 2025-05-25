
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Crown, User, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import EmailVerification from "@/components/EmailVerification";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "business">("customer");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Handle specific email not confirmed error
          if (error.message.includes('Email not confirmed')) {
            setPendingEmail(email);
            setShowEmailVerification(true);
            setLoading(false);
            return;
          }
          throw error;
        }

        // Check if user role matches the selected role
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileData?.role !== role) {
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: `This account is registered as a ${profileData?.role}. Please select the correct role.`,
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });

        navigate(role === 'business' ? '/business' : '/customer');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role
            }
          }
        });

        if (error) throw error;

        if (data.user && !data.user.email_confirmed_at) {
          // Show email verification screen
          setPendingEmail(email);
          setShowEmailVerification(true);
          setLoading(false);
          return;
        }

        if (data.user) {
          // Create role-specific profile
          if (role === 'customer') {
            await supabase.from('customer_profiles').insert({
              user_id: data.user.id,
              full_name: fullName,
              phone_number: phoneNumber
            });
          } else {
            await supabase.from('business_profiles').insert({
              user_id: data.user.id,
              business_name: businessName,
              contact_phone: contactPhone,
              address: address
            });
          }

          toast({
            title: "Account created!",
            description: "You have successfully signed up.",
          });

          navigate(role === 'business' ? '/business' : '/customer');
        }
      }
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

  const handleBackToAuth = () => {
    setShowEmailVerification(false);
    setPendingEmail("");
    setIsLogin(true); // Switch back to login mode
  };

  if (showEmailVerification) {
    return (
      <EmailVerification
        email={pendingEmail}
        onBack={handleBackToAuth}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur shadow-xl">
        <CardHeader className="text-center">
          <Crown className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <CardTitle className="text-2xl">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Welcome back to StampIt' : 'Join the StampIt loyalty program'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label>I am a:</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as "customer" | "business")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer" className="flex items-center space-x-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>Customer</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business" className="flex items-center space-x-2 cursor-pointer">
                    <Building2 className="h-4 w-4" />
                    <span>Business Owner</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Email and Password */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Additional fields for signup */}
            {!isLogin && (
              <>
                {role === 'customer' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
