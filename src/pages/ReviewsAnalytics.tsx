import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, TrendingUp, MessageSquare, Award } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ReviewsAnalytics() {
  const [stats, setStats] = useState({ avgRating: 0, totalReviews: 0, responseRate: 0, topReviewers: [] });
  const [trendData, setTrendData] = useState<any[]>([]);
  const [productRatings, setProductRatings] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const { data: reviews } = await supabase.from('product_reviews').select('*, products(name)');
    
    if (reviews) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0;
      const responded = reviews.filter(r => r.admin_response).length;
      const responseRate = (responded / reviews.length) * 100 || 0;

      const reviewerCounts = reviews.reduce((acc: any, r) => {
        acc[r.user_id] = (acc[r.user_id] || 0) + 1;
        return acc;
      }, {});
      const topReviewers = Object.entries(reviewerCounts).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5);

      setStats({ avgRating, totalReviews: reviews.length, responseRate, topReviewers });

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const trends = last7Days.map(date => ({
        date,
        reviews: reviews.filter(r => r.created_at.startsWith(date)).length,
        avgRating: reviews.filter(r => r.created_at.startsWith(date)).reduce((sum, r) => sum + r.rating, 0) / reviews.filter(r => r.created_at.startsWith(date)).length || 0
      }));
      setTrendData(trends);

      const productGroups = reviews.reduce((acc: any, r) => {
        const productName = r.products?.name || 'Unknown';
        if (!acc[productName]) acc[productName] = { name: productName, avgRating: 0, count: 0, total: 0 };
        acc[productName].total += r.rating;
        acc[productName].count += 1;
        acc[productName].avgRating = acc[productName].total / acc[productName].count;
        return acc;
      }, {});
      setProductRatings(Object.values(productGroups));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Reviews Analytics</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Average Rating</CardTitle><Star className="h-4 w-4 text-yellow-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div><p className="text-xs text-muted-foreground">Out of 5.0</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Reviews</CardTitle><MessageSquare className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalReviews}</div><p className="text-xs text-muted-foreground">All time</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Response Rate</CardTitle><TrendingUp className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.responseRate.toFixed(0)}%</div><p className="text-xs text-muted-foreground">Admin responses</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Top Reviewers</CardTitle><Award className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.topReviewers.length}</div><p className="text-xs text-muted-foreground">Active contributors</p></CardContent></Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Review Trends</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line type="monotone" dataKey="reviews" stroke="#8884d8" /><Line type="monotone" dataKey="avgRating" stroke="#82ca9d" /></LineChart></ResponsiveContainer></CardContent></Card>

        <Card><CardHeader><CardTitle>Ratings by Product</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={productRatings}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis domain={[0, 5]} /><Tooltip /><Bar dataKey="avgRating" fill="#fbbf24" /></BarChart></ResponsiveContainer></CardContent></Card>
      </div>
    </div>
  );
}
