
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Gift, Star, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Index = () => {
  const { user, profile, loading, error } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect authenticated users, but don't block the page
  useEffect(() => {
    if (!loading && user && profile && !error) {
      const timer = setTimeout(() => {
        navigate(profile.role === 'business' ? '/business' : '/customer', { replace: true });
      }, 100); // Small delay to ensure smooth transition
      
      return () => clearTimeout(timer);
    }
  }, [loading, user, profile, error, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-amber-500" />
            <h1 className="text-2xl font-bold text-gray-900">StampIt</h1>
          </div>
          <div className="space-x-4">
            <Link to="/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Loyalty Rewards Made Simple
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Build stronger customer relationships with our digital stamp card system. 
          Perfect for businesses of all sizes.
        </p>
        <div className="space-x-4">
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700">
              Get Started Free
            </Button>
          </Link>
          <Link to="/signin">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose StampIt?
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/80 backdrop-blur">
            <CardHeader>
              <Gift className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Digital Rewards</CardTitle>
              <CardDescription>
                Replace physical stamp cards with digital loyalty tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                No more lost cards or faded stamps. Everything is tracked digitally and securely.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur">
            <CardHeader>
              <Users className="h-12 w-12 text-amber-600 mb-4" />
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>
                Understand your customers better with detailed analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Track visit patterns, popular times, and customer preferences to grow your business.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur">
            <CardHeader>
              <Star className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Easy to Use</CardTitle>
              <CardDescription>
                Simple setup for businesses, intuitive experience for customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get started in minutes. No complex training required for you or your staff.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="bg-gradient-to-r from-purple-600 to-amber-600 text-white max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-purple-100">
              Join thousands of businesses already using StampIt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Create Your Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2024 StampIt. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
