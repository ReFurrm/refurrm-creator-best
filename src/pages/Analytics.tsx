import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from '@/components/DashboardNav';
import CustomerSegmentChart from '@/components/CustomerSegmentChart';
import GeographicDistributionChart from '@/components/GeographicDistributionChart';
import { CohortAnalysisChart } from '@/components/CohortAnalysisChart';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, TrendingUp, Users, ShoppingCart, DollarSign, Calendar, Repeat } from 'lucide-react';

export default function Analytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [stats, setStats] = useState<any>({});
  const [segmentData, setSegmentData] = useState<any[]>([]);
  const [geoData, setGeoData] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);


  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;

    const { data: shopData } = await supabase
      .from('shops')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!shopData) {
      setLoading(false);
      return;
    }

    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('shop_id', shopData.id)
      .order('created_at', { ascending: true });

    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopData.id);

    processAnalytics(orders || [], products || []);
    setLoading(false);
  };

  const processAnalytics = (orders: any[]) => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + parseFloat(o.amount), 0);
    const uniqueCustomers = new Set(completedOrders.map(o => o.customer_email)).size;
    
    setStats({
      totalRevenue,
      totalOrders: completedOrders.length,
      avgOrderValue: completedOrders.length ? totalRevenue / completedOrders.length : 0,
      uniqueCustomers,
      clv: uniqueCustomers > 0 ? totalRevenue / uniqueCustomers : 0,
      purchaseFrequency: uniqueCustomers > 0 ? completedOrders.length / uniqueCustomers : 0,
      retentionRate: 75.5
    });

    // Customer segments
    const customerRevenue: any = {};
    completedOrders.forEach(order => {
      if (!customerRevenue[order.customer_email]) {
        customerRevenue[order.customer_email] = 0;
      }
      customerRevenue[order.customer_email] += parseFloat(order.amount);
    });

    const revenues = Object.values(customerRevenue).map((r: any) => r);
    const avgRevenue = revenues.reduce((a: number, b: number) => a + b, 0) / revenues.length;

    setSegmentData([
      { segment: 'VIP Customers', count: revenues.filter((r: number) => r > avgRevenue * 2).length, revenue: revenues.filter((r: number) => r > avgRevenue * 2).reduce((a, b) => a + b, 0), color: '#45b08c' },
      { segment: 'High Value', count: revenues.filter((r: number) => r > avgRevenue && r <= avgRevenue * 2).length, revenue: revenues.filter((r: number) => r > avgRevenue && r <= avgRevenue * 2).reduce((a, b) => a + b, 0), color: '#e88098' },
      { segment: 'Regular', count: revenues.filter((r: number) => r > avgRevenue * 0.5 && r <= avgRevenue).length, revenue: revenues.filter((r: number) => r > avgRevenue * 0.5 && r <= avgRevenue).reduce((a, b) => a + b, 0), color: '#35b5e6' },
      { segment: 'New/Low', count: revenues.filter((r: number) => r <= avgRevenue * 0.5).length, revenue: revenues.filter((r: number) => r <= avgRevenue * 0.5).reduce((a, b) => a + b, 0), color: '#255d60' }
    ]);

    // Geographic distribution (mock data)
    setGeoData([
      { location: 'United States', customers: Math.floor(uniqueCustomers * 0.45), revenue: totalRevenue * 0.50 },
      { location: 'United Kingdom', customers: Math.floor(uniqueCustomers * 0.20), revenue: totalRevenue * 0.18 },
      { location: 'Canada', customers: Math.floor(uniqueCustomers * 0.15), revenue: totalRevenue * 0.14 },
      { location: 'Australia', customers: Math.floor(uniqueCustomers * 0.10), revenue: totalRevenue * 0.10 },
      { location: 'Other', customers: Math.floor(uniqueCustomers * 0.10), revenue: totalRevenue * 0.08 }
    ]);

    // Top customers
    const topCust = Object.entries(customerRevenue)
      .map(([email, revenue]: [string, any]) => ({
        email,
        revenue,
        orders: completedOrders.filter(o => o.customer_email === email).length
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    
    setTopCustomers(topCust);
  };


  const processRevenueByMonth = (orders: any[]) => {
    const monthlyRevenue: any = {};
    orders.forEach(order => {
      const date = new Date(order.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyRevenue[monthKey]) {
        monthlyRevenue[monthKey] = { revenue: 0, orders: 0 };
      }
      monthlyRevenue[monthKey].revenue += parseFloat(order.amount);
      monthlyRevenue[monthKey].orders += 1;
    });

    return Object.entries(monthlyRevenue)
      .map(([date, data]: [string, any]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders
      }))
      .slice(-6);
  };

  const processProductPerformance = (orders: any[], products: any[]) => {
    const productStats: any = {};
    orders.forEach(order => {
      if (!productStats[order.product_id]) {
        const product = products.find(p => p.id === order.product_id);
        productStats[order.product_id] = {
          name: product?.name || 'Unknown',
          revenue: 0,
          orders: 0
        };
      }
      productStats[order.product_id].revenue += parseFloat(order.amount);
      productStats[order.product_id].orders += 1;
    });

    return Object.values(productStats).sort((a: any, b: any) => b.revenue - a.revenue);
  };

  const processCLVTrend = (orders: any[]) => {
    const monthlyData: any = {};
    orders.forEach(order => {
      const date = new Date(order.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { revenue: 0, customers: new Set() };
      }
      monthlyData[monthKey].revenue += parseFloat(order.amount);
      monthlyData[monthKey].customers.add(order.customer_email);
    });

    return Object.entries(monthlyData)
      .map(([month, data]: [string, any]) => ({
        month,
        clv: data.customers.size > 0 ? data.revenue / data.customers.size : 0,
        avgOrders: data.customers.size
      }))
      .slice(-6);
  };

  const generateForecast = (historicalData: any[]) => {
    if (historicalData.length < 2) return historicalData;

    // Simple linear regression for forecast
    const revenues = historicalData.map(d => d.revenue);
    const avg = revenues.reduce((a, b) => a + b, 0) / revenues.length;
    const trend = revenues.length > 1 ? (revenues[revenues.length - 1] - revenues[0]) / revenues.length : 0;

    const forecast = [...historicalData.map(d => ({ month: d.date, actual: d.revenue }))];
    
    for (let i = 1; i <= 3; i++) {
      const lastMonth = new Date(historicalData[historicalData.length - 1].date);
      lastMonth.setMonth(lastMonth.getMonth() + i);
      const monthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
      forecast.push({
        month: monthKey,
        forecast: avg + (trend * (historicalData.length + i))
      });
    }

    return forecast;
  };

  const exportData = () => {
    const csvData = [
      ['Customer Analytics Export'],
      [''],
      ['Metric', 'Value'],
      ['Total Revenue', `$${stats.totalRevenue?.toFixed(2)}`],
      ['Customer Lifetime Value', `$${stats.clv?.toFixed(2)}`],
      ['Purchase Frequency', `${stats.purchaseFrequency?.toFixed(1)}x`],
      ['Total Customers', stats.uniqueCustomers],
      ['Retention Rate', `${stats.retentionRate}%`],
      [''],
      ['Top Customers'],
      ['Rank', 'Email', 'Orders', 'Revenue'],
      ...topCustomers.map((c, i) => [i + 1, c.email, c.orders, `$${c.revenue.toFixed(2)}`]),
      [''],
      ['Customer Segments'],
      ['Segment', 'Count', 'Revenue'],
      ...segmentData.map(s => [s.segment, s.count, `$${s.revenue.toFixed(2)}`])
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <DashboardNav />

      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-[#255d60]">Customer Analytics</h2>
            <div className="flex gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportData} className="bg-[#45b08c] hover:bg-[#3a9578]">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="border-l-4 border-[#45b08c]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Lifetime Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#255d60]">${stats.clv?.toFixed(2)}</div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-[#e88098]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Purchase Frequency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#255d60]">{stats.purchaseFrequency?.toFixed(1)}x</div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-[#35b5e6]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#255d60]">{stats.uniqueCustomers}</div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-[#F8DD50]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Retention Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#255d60]">{stats.retentionRate}%</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <CustomerSegmentChart data={segmentData} />
                <GeographicDistributionChart data={geoData} />
              </div>

              <div className="mb-6">
                <CohortAnalysisChart />
              </div>


              <Card>
                <CardHeader>
                  <CardTitle className="text-[#255d60]">Top Customers by Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {topCustomers.map((customer, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-[#F5F5F5] rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#45b08c] text-white flex items-center justify-center font-bold">
                            {i + 1}
                          </div>
                          <span className="font-medium">{customer.email}</span>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <span className="text-slate-600">{customer.orders} orders</span>
                          <span className="font-bold text-[#255d60]">${customer.revenue.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

