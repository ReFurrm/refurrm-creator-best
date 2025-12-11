import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string;
  platform: string;
  caption: string;
  image_url: string;
  scheduled_time: string;
  status: string;
}

export function SocialMediaScheduler() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [platform, setPlatform] = useState('instagram');
  const [caption, setCaption] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPosts();
    loadProducts();
  }, []);

  const loadPosts = async () => {
    const { data } = await supabase
      .from('social_media_posts')
      .select('*')
      .order('scheduled_time', { ascending: true });
    if (data) setPosts(data);
  };

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data);
  };

  const generateAICaption = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      const product = products.find(p => p.id === selectedProduct);
      const { data, error } = await supabase.functions.invoke('ai-campaign-generator', {
        body: { 
          type: 'social',
          productName: product.name,
          productDescription: product.description
        }
      });
      if (error) throw error;
      setCaption(data.caption);
      toast.success('AI caption generated!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const schedulePost = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const product = products.find(p => p.id === selectedProduct);
      
      const { data, error } = await supabase.functions.invoke('social-media-scheduler', {
        body: {
          platform,
          caption,
          imageUrl: product?.image_url,
          scheduledTime
        }
      });

      if (error) throw error;
      toast.success('Post scheduled!');
      loadPosts();
      setCaption('');
      setScheduledTime('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Schedule Social Media Post</h2>
        
        <div className="space-y-4">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Post caption..."
              rows={4}
            />
            <Button onClick={generateAICaption} disabled={loading || !selectedProduct}>
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>

          <Input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
          />

          <Button onClick={schedulePost} disabled={loading || !caption} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Schedule Post
          </Button>
        </div>
      </Card>

      <div className="grid gap-4">
        {posts.map(post => (
          <Card key={post.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold capitalize">{post.platform}</p>
                <p className="text-sm text-muted-foreground">{post.caption}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(post.scheduled_time).toLocaleString()}
                </p>
              </div>
              <span className="text-xs px-2 py-1 bg-primary/10 rounded">{post.status}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
