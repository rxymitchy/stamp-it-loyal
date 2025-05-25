
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerFieldsProps {
  fullName: string;
  phoneNumber: string;
  onFullNameChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
}

const CustomerFields = ({
  fullName,
  phoneNumber,
  onFullNameChange,
  onPhoneNumberChange
}: CustomerFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          required
        />
      </div>
    </>
  );
};

export default CustomerFields;
