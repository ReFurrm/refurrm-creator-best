import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Save, Eye, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function BlogAdmin() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [status, setStatus] = useState('draft');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadPosts();
    loadCategories();
  }, []);

  const loadPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
  };

  const loadCategories = async () => {
    const { data } = await supabase.from('blog_categories').select('*');
    setCategories(data || []);
  };

  const handleSave = async () => {
    const postData = { title, content, excerpt, featured_image: featuredImage, seo_title: seoTitle, seo_description: seoDescription, status, category_id: selectedCategory || null };
    if (editing) {
      await supabase.from('blog_posts').update(postData).eq('id', editing.id);
      toast.success('Post updated');
    } else {
      await supabase.from('blog_posts').insert(postData);
      toast.success('Post created');
    }
    resetForm();
    loadPosts();
  };

  const resetForm = () => {
    setEditing(null);
    setTitle('');
    setContent('');
    setExcerpt('');
    setFeaturedImage('');
    setSeoTitle('');
    setSeoDescription('');
    setStatus('draft');
    setSelectedCategory('');
  };

  const handleDelete = async (id: string) => {
    await supabase.from('blog_posts').delete().eq('id', id);
    toast.success('Post deleted');
    loadPosts();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Admin</h1>
        <Button onClick={resetForm}><Plus className="h-4 w-4 mr-2" />New Post</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div><Label>Content</Label><RichTextEditor value={content} onChange={setContent} /></div>
            <div><Label>Excerpt</Label><Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} /></div>
          </div>
        </Card>

        <Card className="p-6 h-fit">
          <div className="space-y-4">
            <div><Label>Status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent></Select></div>
            <div><Label>Category</Label><Select value={selectedCategory} onValueChange={setSelectedCategory}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Featured Image URL</Label><Input value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} /></div>
            <div><Label>SEO Title</Label><Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /></div>
            <div><Label>SEO Description</Label><Input value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} /></div>
            <div className="flex gap-2"><Button onClick={handleSave} className="flex-1"><Save className="h-4 w-4 mr-2" />Save</Button><Button variant="outline"><Eye className="h-4 w-4" /></Button></div>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-xl font-bold mb-4">All Posts</h2>
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {posts.map(post => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell><span className={`px-2 py-1 rounded text-xs ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{post.status}</span></TableCell>
                <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { setEditing(post); setTitle(post.title); setContent(post.content); setExcerpt(post.excerpt); setFeaturedImage(post.featured_image); setSeoTitle(post.seo_title); setSeoDescription(post.seo_description); setStatus(post.status); setSelectedCategory(post.category_id); }}>Edit</Button><Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
