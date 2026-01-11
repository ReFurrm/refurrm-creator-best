import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardNav from '@/components/DashboardNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Heart, Share2 } from 'lucide-react';

export default function SocialMediaAnalytics() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const { data } = await supabase
      .from('social_media_posts')
      .select('*')
      .order('scheduled_at', { ascending: false });

    setPosts(data || []);
    setLoading(false);
  };

  const platformData = posts.reduce((acc, post) => {
    const platform = post.platform;
    if (!acc[platform]) {
      acc[platform] = { platform, likes: 0, comments: 0, shares: 0, reach: 0 };
    }
    acc[platform].likes += post.likes || 0;
    acc[platform].comments += post.comments || 0;
    acc[platform].shares += post.shares || 0;
    acc[platform].reach += post.reach || 0;
    return acc;
  }, {} as any);

  const chartData = Object.values(platformData);

  const totalEngagement = posts.reduce((sum, p) => sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0);
  const totalReach = posts.reduce((sum, p) => sum + (p.reach || 0), 0);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardNav />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <CardTitle className="text-3xl mb-8">Social Media Analytics</CardTitle>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-slate-600">Total Posts</p>
                    <p className="text-2xl font-bold">{posts.length}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-sm text-slate-600">Engagement</p>
                    <p className="text-2xl font-bold">{totalEngagement.toLocaleString()}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-slate-600">Total Reach</p>
                    <p className="text-2xl font-bold">{totalReach.toLocaleString()}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Share2 className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-slate-600">Avg Engagement</p>
                    <p className="text-2xl font-bold">
                      {posts.length > 0 ? Math.round(totalEngagement / posts.length) : 0}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="likes" fill="#3b82f6" />
                    <Bar dataKey="comments" fill="#10b981" />
                    <Bar dataKey="shares" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reach by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="reach" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
