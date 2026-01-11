import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from '@/components/DashboardNav';
import RevenueChart from '@/components/RevenueChart';
import ProductPerformanceChart from '@/components/ProductPerformanceChart';
import ConversionFunnelChart from '@/components/ConversionFunnelChart';
import CLVChart from '@/components/CLVChart';
import SalesForecastChart from '@/components/SalesForecastChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

export default function Analytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [funnelData, setFunnelData] = useState<any>({});
  const [clvData, setCLVData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);

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

  const processAnalytics = (orders: any[], products: any[]) => {
    // Calculate basic stats
    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + parseFloat(o.amount), 0);
    const avgOrderValue = completedOrders.length ? totalRevenue / completedOrders.length : 0;

    // Calculate unique customers
    const uniqueCustomers = new Set(completedOrders.map(o => o.customer_email)).size;

    // Calculate CLV
    const clv = uniqueCustomers > 0 ? totalRevenue / uniqueCustomers : 0;

    setStats({
      totalRevenue,
      totalOrders: completedOrders.length,
      avgOrderValue,
      uniqueCustomers,
      clv,
      conversionRate: orders.length > 0 ? (completedOrders.length / orders.length * 100).toFixed(1) : 0
    });

    // Revenue trend data (last 6 months)
    const revenueByMonth = processRevenueByMonth(completedOrders);
    setRevenueData(revenueByMonth);

    // Product performance
    const productStats = processProductPerformance(completedOrders, products);
    setProductData(productStats.slice(0, 5));

    // Conversion funnel (mock data - would need tracking)
    setFunnelData({
      visitors: Math.floor(completedOrders.length * 10),
      productViews: Math.floor(completedOrders.length * 5),
      addToCart: Math.floor(completedOrders.length * 2),
      checkout: Math.floor(completedOrders.length * 1.5),
      completed: completedOrders.length
    });

    // CLV trend
    const clvTrend = processCLVTrend(completedOrders);
    setCLVData(clvTrend);

    // Sales forecast
    const forecast = generateForecast(revenueByMonth);
    setForecastData(forecast);
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
      ['Metric', 'Value'],
      ['Total Revenue', `$${stats.totalRevenue?.toFixed(2)}`],
      ['Total Orders', stats.totalOrders],
      ['Average Order Value', `$${stats.avgOrderValue?.toFixed(2)}`],
      ['Unique Customers', stats.uniqueCustomers],
      ['Customer Lifetime Value', `$${stats.clv?.toFixed(2)}`],
      ['Conversion Rate', `${stats.conversionRate}%`],
      [''],
      ['Monthly Revenue'],
      ['Month', 'Revenue', 'Orders'],
      ...revenueData.map(d => [d.date, d.revenue, d.orders]),
      [''],
      ['Product Performance'],
      ['Product', 'Revenue', 'Orders'],
      ...productData.map(d => [d.name, d.revenue, d.orders])
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardNav />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h2>
            <Button onClick={exportData} className="bg-purple-600 hover:bg-purple-700">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          {loading ? (
            <p className="text-slate-600">Loading analytics...</p>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-slate-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.totalRevenue?.toFixed(2)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-slate-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                    <TrendingUp className="h-4 w-4 text-slate-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.avgOrderValue?.toFixed(2)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
                    <Users className="h-4 w-4 text-slate-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.uniqueCustomers}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <RevenueChart data={revenueData} />
                <ProductPerformanceChart data={productData} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ConversionFunnelChart data={funnelData} />
                <CLVChart data={clvData} averageCLV={stats.clv || 0} />
              </div>

              <div className="mb-6">
                <SalesForecastChart data={forecastData} />
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Lifetime Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      ${stats.clv?.toFixed(2)}
                    </div>
                    <p className="text-sm text-slate-600">
                      Average revenue per customer over their lifetime
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {stats.conversionRate}%
                    </div>
                    <p className="text-sm text-slate-600">
                      Percentage of orders that complete successfully
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
