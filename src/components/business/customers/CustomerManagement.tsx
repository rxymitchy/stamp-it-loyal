
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Download, Filter, Star } from "lucide-react";

interface Customer {
  id: string;
  full_name: string;
  phone_number: string;
  visit_count: number;
  rewards_earned: number;
  last_visit?: string;
}

interface CustomerManagementProps {
  customers: Customer[];
  onSearchCustomer: (phone: string) => void;
  onAddVisit: (phone: string) => void;
  onAddStamp: (customerPhoneNumber: string) => Promise<boolean>;
  onExportCustomers: () => void;
}

const CustomerManagement = ({ customers, onSearchCustomer, onAddVisit, onAddStamp, onExportCustomers }: CustomerManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(customer =>
    customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone_number.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Management</span>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onExportCustomers}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or phone number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer List */}
        <Card>
          <CardHeader>
            <CardTitle>Customer List ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedCustomer?.id === customer.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{customer.full_name}</h3>
                    <p className="text-sm text-gray-600">{customer.phone_number}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{customer.visit_count} visits</Badge>
                    {customer.visit_count >= 5 && (
                      <Badge className="ml-2 bg-amber-100 text-amber-800">
                        Reward Ready!
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Customer Details */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCustomer ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedCustomer.full_name}</h3>
                  <p className="text-gray-600">{selectedCustomer.phone_number}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedCustomer.visit_count}</div>
                    <div className="text-sm text-gray-600">Total Visits</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedCustomer.rewards_earned}</div>
                    <div className="text-sm text-gray-600">Rewards Earned</div>
                  </div>
                </div>

                {selectedCustomer.last_visit && (
                  <div>
                    <p className="text-sm text-gray-600">Last Visit</p>
                    <p className="font-medium">{new Date(selectedCustomer.last_visit).toLocaleDateString()}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Button 
                    className="w-full"
                    onClick={() => onAddVisit(selectedCustomer.phone_number)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Visit
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => onAddStamp(selectedCustomer.phone_number)}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Add Stamp
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select a customer to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerManagement;
