
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BusinessFieldsProps {
  businessName: string;
  contactPhone: string;
  address: string;
  onBusinessNameChange: (value: string) => void;
  onContactPhoneChange: (value: string) => void;
  onAddressChange: (value: string) => void;
}

const BusinessFields = ({
  businessName,
  contactPhone,
  address,
  onBusinessNameChange,
  onContactPhoneChange,
  onAddressChange
}: BusinessFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name</Label>
        <Input
          id="businessName"
          value={businessName}
          onChange={(e) => onBusinessNameChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactPhone">Contact Phone</Label>
        <Input
          id="contactPhone"
          value={contactPhone}
          onChange={(e) => onContactPhoneChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
        />
      </div>
    </>
  );
};

export default BusinessFields;
