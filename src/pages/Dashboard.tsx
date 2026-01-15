import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import DashboardNav from '@/components/DashboardNav';
import OrdersTable from '@/components/OrdersTable';
import { supabase } from '@/lib/supabase';
import { useSubscription } from '@/hooks/useSubscription';
import { 
  DollarSign, Package, Calendar, Users, TrendingUp, 
  ArrowUpRight, ShoppingBag, Eye, MousePointer, Crown
} from 'lucide-react';

export default function Dashboard() {
  const { subscriptions, hasActiveSubscription } = useSubscription();
  const [stats, setStats] = useState({
    revenue: 2450,
    orders: 28,
    views: 1234,
    conversionRate: 2.3,
    products: 5,
    bookings: 3,
    subscribers: 156
  });


  const recentOrders = [
    { id: 1, product: 'Content Strategy Guide', customer: 'Sarah M.', amount: 97, time: '2 hours ago' },
    { id: 2, product: '1-on-1 Coaching Call', customer: 'Mike R.', amount: 297, time: '5 hours ago' },
    { id: 3, product: 'Instagram Templates', customer: 'Emma L.', amount: 47, time: '1 day ago' },
  ];

  const aiRecommendations = [
    { 
      title: 'Improve conversion rate',
      description: 'Your Content Strategy Guide has high views but low conversions. Consider updating the headline.',
      action: 'Update Copy'
    },
    { 
      title: 'Create a bundle',
      description: 'Instagram Templates and Content Guide are often bought together. Bundle them for $127.',
      action: 'Create Bundle'
    },
    { 
      title: 'Raise coaching price',
      description: 'Your coaching sessions are booking fast. Consider raising the price by $50.',
      action: 'Update Pricing'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's how your store is performing.</p>
        </div>

        {/* Stats Grid */}
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <Card className="lg:col-span-2">
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
              <Link to="/orders">
                <Button variant="outline" className="w-full mt-4">
                  View All Orders
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/products/new" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
              </Link>
              <Link to="/emails" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Send Email Broadcast
                </Button>
              </Link>
              <Link to="/dm-campaigns" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Create DM Campaign
                </Button>
              </Link>
              <Link to="/bookings" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Bookings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Smart suggestions to grow your revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiRecommendations.map((rec, index) => (
                <div key={index} className="flex items-start justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-900">{rec.title}</h4>
                    <p className="text-sm text-purple-700 mt-1">{rec.description}</p>
                  </div>
                  <Button size="sm" className="ml-4 bg-purple-600 hover:bg-purple-700">
                    {rec.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
