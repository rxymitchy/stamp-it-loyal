
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

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "business">("customer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting sign in for:', email, 'as role:', role);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Auth error:', error);
        if (error.message.includes('Email not confirmed')) {
          navigate('/email-verification', { state: { email } });
          return;
        }
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned');
      }

      console.log('Auth successful, checking profile...');

      // Check if user has a profile and it matches the selected role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        throw new Error('Failed to load user profile');
      }

      if (profileData?.role !== role) {
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: `This account is registered as a ${profileData?.role}. Please select the correct role.`,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      navigate(role === 'business' ? '/business' : '/customer');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign In Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    // Clear form and reset state
    setPassword("");
    setLoading(false);
    // Focus back to password field
    document.getElementById('password')?.focus();
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      // Clear form data
      setEmail("");
      setPassword("");
      
      // Navigate to home page
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a password reset link.",
      });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur shadow-xl">
        <CardHeader className="text-center">
          <Crown className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Welcome back to StampIt</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
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
                autoComplete="current-password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleTryAgain}
                disabled={loading}
                className="flex-1"
              >
                Try Again
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleSignOut}
                disabled={loading}
                className="flex-1"
              >
                Sign Out
              </Button>
            </div>

            <div className="text-center space-y-2">
              <Button
                type="button"
                variant="link"
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-sm"
              >
                Forgot Password?
              </Button>
              
              <div className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-purple-600 hover:underline">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
