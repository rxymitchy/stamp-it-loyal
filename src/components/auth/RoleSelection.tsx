
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Building2 } from "lucide-react";

interface RoleSelectionProps {
  role: "customer" | "business";
  onRoleChange: (role: "customer" | "business") => void;
}

const RoleSelection = ({ role, onRoleChange }: RoleSelectionProps) => {
  return (
    <div className="space-y-3">
      <Label>I am a:</Label>
      <RadioGroup value={role} onValueChange={(value) => onRoleChange(value as "customer" | "business")}>
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
  );
};

export default RoleSelection;
