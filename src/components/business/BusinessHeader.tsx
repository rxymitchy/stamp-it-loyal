
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface BusinessHeaderProps {
  businessName: string;
  onSignOut: () => void;
}

const BusinessHeader = ({ businessName, onSignOut }: BusinessHeaderProps) => {
  return (
    <div className="bg-white/80 backdrop-blur border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">{businessName}</h1>
          <Button variant="outline" size="sm" onClick={onSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessHeader;
