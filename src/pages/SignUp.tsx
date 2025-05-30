
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import RoleSelection from "@/components/auth/RoleSelection";
import CustomerFields from "@/components/auth/CustomerFields";
import BusinessFields from "@/components/auth/BusinessFields";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "business">("customer");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting sign up process for:', email, 'as role:', role);

      // Validate required fields
      if (role === 'customer' && (!fullName.trim() || !phoneNumber.trim())) {
        throw new Error('Full name and phone number are required for customers');
      }
      
      if (role === 'business' && (!businessName.trim() || !contactPhone.trim())) {
        throw new Error('Business name and contact phone are required for businesses');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://stamp-it-loyal.lovable.app/signin',
          data: {
            role: role
          }
        }
      });

      if (error) {
        console.error('Auth signup error:', error);
        throw error;
      }

      if (data.user && !data.user.email_confirmed_at) {
        navigate('/email-verification', { state: { email } });
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log('User created, creating profiles...');
        
        // Create profile entry first
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          email: email,
          role: role
        });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // If profile already exists, that's okay
          if (!profileError.message.includes('duplicate key')) {
            throw profileError;
          }
        }

        // Create role-specific profile
        if (role === 'customer') {
          const { error: customerError } = await supabase.from('customer_profiles').insert({
            user_id: data.user.id,
            full_name: fullName.trim(),
            phone_number: phoneNumber.trim(),
            email: email
          });

          if (customerError) {
            console.error('Customer profile error:', customerError);
            throw customerError;
          }
        } else {
          const { error: businessError } = await supabase.from('business_profiles').insert({
            user_id: data.user.id,
            business_name: businessName.trim(),
            contact_phone: contactPhone.trim(),
            address: address.trim()
          });

          if (businessError) {
            console.error('Business profile error:', businessError);
            throw businessError;
          }
        }

        toast({
          title: "Account created successfully!",
          description: "Welcome to StampIt! You can now start using the app.",
        });

        navigate(role === 'business' ? '/business' : '/customer');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred during registration",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur shadow-xl">
        <CardHeader className="text-center">
          <Crown className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Join the StampIt loyalty program</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <RoleSelection role={role} onRoleChange={setRole} />

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
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
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {role === 'customer' ? (
              <CustomerFields
                fullName={fullName}
                phoneNumber={phoneNumber}
                onFullNameChange={setFullName}
                onPhoneNumberChange={setPhoneNumber}
              />
            ) : (
              <BusinessFields
                businessName={businessName}
                contactPhone={contactPhone}
                address={address}
                onBusinessNameChange={setBusinessName}
                onContactPhoneChange={setContactPhone}
                onAddressChange={setAddress}
              />
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-purple-600 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
