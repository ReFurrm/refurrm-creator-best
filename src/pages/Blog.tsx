import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import Footer from '@/components/Footer';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  author_name: string;
  category: string;
  tags: string[];
  published_at: string;
  view_count: number;
}

const DEMO_POSTS: BlogPost[] = [
  { id: '1', title: 'How to Launch Your First Digital Product in 24 Hours', slug: 'launch-digital-product', excerpt: 'Learn the exact steps to take your idea from concept to live product in just one day.', featured_image: 'https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764067926520_50518b3b.webp', author_name: 'Teresa Furr', category: 'Getting Started', tags: ['launch', 'tutorial'], published_at: '2024-11-20', view_count: 1250 },
  { id: '2', title: 'AI-Powered Marketing: The Future is Here', slug: 'ai-marketing', excerpt: 'Discover how AI can write your product descriptions, emails, and social posts automatically.', featured_image: 'https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764067929085_758b495e.webp', author_name: 'Teresa Furr', category: 'Marketing', tags: ['ai', 'automation'], published_at: '2024-11-18', view_count: 980 },
  { id: '3', title: '10 Ways to Monetize Your Creative Skills', slug: 'monetize-skills', excerpt: 'From art to coaching, here are proven ways to turn your talents into income streams.', featured_image: 'https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764067932351_e1086476.webp', author_name: 'Teresa Furr', category: 'Business', tags: ['monetization', 'income'], published_at: '2024-11-15', view_count: 2100 },
  { id: '4', title: 'Building Your Email List from Zero', slug: 'email-list-building', excerpt: 'Step-by-step guide to growing an engaged email list that actually converts.', featured_image: 'https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764067935586_178b3c0d.webp', author_name: 'Teresa Furr', category: 'Marketing', tags: ['email', 'growth'], published_at: '2024-11-12', view_count: 1560 },
  { id: '5', title: 'The Creator Economy: Trends for 2025', slug: 'creator-economy-2025', excerpt: 'What every creator needs to know about the evolving digital landscape.', featured_image: 'https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764067937996_2d3b34c1.webp', author_name: 'Teresa Furr', category: 'Trends', tags: ['trends', 'future'], published_at: '2024-11-10', view_count: 890 },
  { id: '6', title: 'Pricing Your Digital Products: A Complete Guide', slug: 'pricing-guide', excerpt: 'Find the sweet spot between value and profit with these pricing strategies.', featured_image: 'https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764067940063_9bb19525.webp', author_name: 'Teresa Furr', category: 'Business', tags: ['pricing', 'strategy'], published_at: '2024-11-08', view_count: 1780 },
  { id: '7', title: 'Social Media Content That Actually Sells', slug: 'social-content', excerpt: 'Create posts that engage your audience and drive sales without being salesy.', featured_image: 'https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764067941943_e79e15e7.webp', author_name: 'Teresa Furr', category: 'Marketing', tags: ['social', 'content'], published_at: '2024-11-05', view_count: 1340 },
  { id: '8', title: 'From Side Hustle to Full-Time Creator', slug: 'side-hustle-fulltime', excerpt: 'Real stories and strategies from creators who made the leap successfully.', featured_image: 'https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764067943834_c1aa1f07.webp', author_name: 'Teresa Furr', category: 'Success Stories', tags: ['inspiration', 'journey'], published_at: '2024-11-02', view_count: 2450 },
  { id: '9', title: 'Automating Your Creative Business', slug: 'automation-guide', excerpt: 'Save hours every week by automating repetitive tasks in your business.', featured_image: 'https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764067945743_24770158.webp', author_name: 'Teresa Furr', category: 'Productivity', tags: ['automation', 'efficiency'], published_at: '2024-10-30', view_count: 1120 },
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>(DEMO_POSTS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(posts.map(p => p.category)));

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900">
      <nav className="bg-black/40 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-3xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            ReFurrm
          </Link>
          <div className="flex gap-4">
            <Link to="/"><Button variant="ghost" className="text-white">Home</Button></Link>
            <Link to="/pricing"><Button variant="ghost" className="text-white">Pricing</Button></Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-6xl font-black text-white mb-4">Blog</h1>
        <p className="text-xl text-purple-200 mb-8">Tips, tutorials, and insights for creators</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-96 bg-slate-800/50 border-slate-600 text-white"
          />
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={!selectedCategory ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              All
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                size="sm"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <Card key={post.id} className="bg-slate-800/50 border-slate-700 overflow-hidden hover:shadow-xl hover:shadow-purple-500/20 transition-all">
              <img src={post.featured_image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <Badge className="mb-2">{post.category}</Badge>
                <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                <p className="text-slate-300 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-slate-400">
                  <span>{post.author_name}</span>
                  <span>{new Date(post.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
