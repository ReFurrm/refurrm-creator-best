import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import DashboardNav from '@/components/DashboardNav';

export default function DMCampaigns() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    goal: '',
    keyword: '',
    product_id: ''
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    const { data: shopData } = await supabase
      .from('shops')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (shopData) {
      const { data: campaignsData } = await supabase
        .from('dm_campaigns')
        .select('*, products(name)')
        .eq('shop_id', shopData.id)
        .order('created_at', { ascending: false });

      setCampaigns(campaignsData || []);

      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', shopData.id);

      setProducts(productsData || []);
    }

    setLoading(false);
  };

  const createCampaign = async () => {
    if (!form.name || !form.keyword) {
      alert('Please fill in campaign name and keyword');
      return;
    }

    const { data: shopData } = await supabase
      .from('shops')
      .select('id')
      .eq('user_id', user?.id)
      .single();

    if (shopData) {
      await supabase.from('dm_campaigns').insert({
        shop_id: shopData.id,
        name: form.name,
        goal: form.goal,
        keyword: form.keyword.toUpperCase(),
        product_id: form.product_id || null,
        dm_sequence: [
          { order: 1, message: `Thanks for your interest! Here's the link to ${form.name}` }
        ],
        suggested_caption: `Comment "${form.keyword.toUpperCase()}" below to get instant access!`
      });

      setForm({ name: '', goal: '', keyword: '', product_id: '' });
      setShowCreate(false);
      loadData();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardNav />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <CardTitle className="text-3xl">DM Campaigns</CardTitle>
            <Button
              onClick={() => setShowCreate(!showCreate)}
            >
              {showCreate ? 'Cancel' : 'Create Campaign'}
            </Button>
          </div>

          <Card className="bg-blue-50 border-blue-200 mb-6">
            <CardContent className="p-4">
              <p className="text-blue-900 text-sm">
                <strong>Note:</strong> Live Instagram automation requires connecting your Instagram business account. 
                For now, you can create campaigns and copy the scripts manually.
              </p>
            </CardContent>
          </Card>

          {showCreate && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create DM Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Campaign Name</Label>
                    <Input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g., Budget Course Promo"
                    />
                  </div>
                  <div>
                    <Label>Keyword</Label>
                    <Input
                      type="text"
                      value={form.keyword}
                      onChange={(e) => setForm({ ...form, keyword: e.target.value })}
                      placeholder="e.g., BUDGET"
                    />
                  </div>
                  <div>
                    <Label>Link to Product (Optional)</Label>
                    <Select
                      value={form.product_id}
                      onValueChange={(value) => setForm({ ...form, product_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {products.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Goal (Optional)</Label>
                    <Textarea
                      value={form.goal}
                      onChange={(e) => setForm({ ...form, goal: e.target.value })}
                      placeholder="What do you want to achieve with this campaign?"
                    />
                  </div>
                  <Button
                    onClick={createCampaign}
                  >
                    Create Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <p className="text-slate-600">Loading campaigns...</p>
          ) : campaigns.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-slate-600">No DM campaigns yet. Create one to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {campaigns.map(campaign => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{campaign.name}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">Keyword: <strong>{campaign.keyword}</strong></p>
                        {campaign.products && (
                          <p className="text-sm text-slate-600">Linked to: {campaign.products.name}</p>
                        )}
                      </div>
                      <Badge variant={campaign.active ? 'default' : 'secondary'}>
                        {campaign.active ? 'Active' : 'Draft'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  {campaign.suggested_caption && (
                    <CardContent>
                      <div className="p-3 bg-purple-50 rounded">
                        <p className="text-sm font-medium text-purple-900 mb-1">Suggested Caption:</p>
                        <p className="text-sm text-purple-700">{campaign.suggested_caption}</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
