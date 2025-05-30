
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

interface CustomerProfileProps {
  customerProfile: any;
  userEmail: string;
}

const CustomerProfile = ({ customerProfile, userEmail }: CustomerProfileProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Profile Settings</span>
        </CardTitle>
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
            <p className="p-2 bg-gray-50 rounded">{userEmail}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Member Since</label>
            <p className="p-2 bg-gray-50 rounded">
              {new Date(customerProfile.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <Link to="/profile">
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerProfile;
