
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  visitsByMonth: Array<{ month: string; visits: number; customers: number }>;
  topCustomers: Array<{ name: string; visits: number; rewards: number }>;
  rewardRedemptions: Array<{ reward: string; count: number }>;
  customerGrowth: Array<{ month: string; newCustomers: number; totalCustomers: number }>;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

const AnalyticsDashboard = ({ data }: AnalyticsDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Customer Growth */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Growth Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="newCustomers" stroke="#8884d8" name="New Customers" />
              <Line type="monotone" dataKey="totalCustomers" stroke="#82ca9d" name="Total Customers" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visit Frequency */}
        <Card>
          <CardHeader>
            <CardTitle>Visit Frequency Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.visitsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visits" fill="#8884d8" name="Visits" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reward Redemptions */}
        <Card>
          <CardHeader>
            <CardTitle>Reward Redemption Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.rewardRedemptions}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ reward, percent }) => `${reward} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.rewardRedemptions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers by Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topCustomers.map((customer, index) => (
              <div key={customer.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium">{customer.name}</h3>
                    <p className="text-sm text-gray-600">{customer.visits} visits • {customer.rewards} rewards</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((customer.visits / Math.max(...data.topCustomers.map(c => c.visits))) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
