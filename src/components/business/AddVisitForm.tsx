
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";

interface AddVisitFormProps {
  onAddVisit: (phone: string) => Promise<void>;
  loading: boolean;
}

const AddVisitForm = ({ onAddVisit, loading }: AddVisitFormProps) => {
  const [customerPhone, setCustomerPhone] = useState("");

  const handleSubmit = async () => {
    await onAddVisit(customerPhone);
    setCustomerPhone("");
  };

  return (
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
            <Button onClick={handleSubmit} disabled={loading}>
              Add Visit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddVisitForm;
