import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardNav from '@/components/DashboardNav';
import { supabase } from '@/lib/supabase';
import { useSubscription } from '@/hooks/useSubscription';
import { useOnboarding } from '@/hooks/useOnboarding';
import { 
  DollarSign, Package, Calendar, Users, TrendingUp, 
  ShoppingBag, Eye, MousePointer
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { subscriptions, hasActiveSubscription } = useSubscription();
  const { progress, needsOnboarding } = useOnboarding();
  const [stats, setStats] = useState({
    revenue: 2450, orders: 28, views: 1234, conversionRate: 2.3
  });

  useEffect(() => {
    if (needsOnboarding) {
      navigate('/onboarding');
    }
  }, [needsOnboarding, navigate]);

  const recentOrders = [
    { id: 1, product: 'Content Strategy Guide', customer: 'Sarah M.', amount: 97, time: '2 hours ago' },
    { id: 2, product: '1-on-1 Coaching Call', customer: 'Mike R.', amount: 297, time: '5 hours ago' },
    { id: 3, product: 'Instagram Templates', customer: 'Emma L.', amount: 47, time: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's how your store is performing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orders}</div>
              <p className="text-xs text-green-600 mt-1">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Store Views</CardTitle>
              <Eye className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.views.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">+23% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
              <MousePointer className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-red-600 mt-1">-0.3% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest sales activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{order.product}</p>
                    <p className="text-sm text-gray-600">{order.customer} • {order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
