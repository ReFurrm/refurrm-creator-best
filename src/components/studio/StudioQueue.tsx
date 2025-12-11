import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle, Eye, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function StudioQueue() {
  const { user } = useAuth();
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadQueue();
    }
  }, [user]);

  const loadQueue = async () => {
    try {
      const { data, error } = await supabase
        .from('studio_queue')
        .select('*')
        .eq('user_id', user?.id)
        .in('status', ['processing', 'ready'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQueue(data || []);
    } catch (error) {
      console.error('Error loading queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <Loader2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nothing processing yet</h3>
          <p className="text-gray-600">
            Upload your first idea and watch AI turn it into a finished product
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {queue.map((item) => (
        <Card key={item.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{item.product_name || 'Untitled Product'}</h3>
                <Badge className={getStatusColor(item.status)}>
                  {item.status === 'processing' ? 'Processing' : 'Ready to Publish'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{item.idea_description}</p>
            </div>
            {item.status === 'ready' && (
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Eye className="mr-2 h-4 w-4" />
                Review & Publish
              </Button>
            )}
          </div>

          {item.status === 'processing' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">AI is working...</span>
                <span className="text-purple-600 font-medium">{item.progress || 45}%</span>
              </div>
              <Progress value={item.progress || 45} className="h-2" />
              <p className="text-xs text-gray-500">
                Generating product copy, mockups, and social posts
              </p>
            </div>
          )}

          {item.status === 'ready' && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Product ready!</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                AI generated title, description, mockups, and 5 social media posts
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
