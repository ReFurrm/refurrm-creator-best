import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from '@/components/DashboardNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageSquare } from 'lucide-react';

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data } = await supabase
      .from('community_posts')
      .select('*, user:user_profiles(username, avatar_url)')
      .order('created_at', { ascending: false });

    setPosts(data || []);
    setLoading(false);
  };

  const createPost = async () => {
    if (!newPost.trim()) return;

    await supabase.from('community_posts').insert({
      content: newPost,
      user_id: user?.id,
    });

    setNewPost('');
    loadPosts();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardNav />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <CardTitle className="text-3xl mb-8">Community Feed</CardTitle>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create a Post</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind?"
                />
                <Button onClick={createPost}>Post</Button>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <p>Loading posts...</p>
          ) : (
            <div className="space-y-6">
              {posts.map(post => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={post.user.avatar_url} />
                        <AvatarFallback>{post.user.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{post.user.username}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(post.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{post.content}</p>
                    <div className="flex items-center gap-4 text-slate-500">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {post.likes || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments || 0}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
