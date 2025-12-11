import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
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
            <h2 className="text-3xl font-bold text-slate-900">DM Campaigns</h2>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              {showCreate ? 'Cancel' : 'Create Campaign'}
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-900 text-sm">
              <strong>Note:</strong> Live Instagram automation requires connecting your Instagram business account. 
              For now, you can create campaigns and copy the scripts manually.
            </p>
          </div>

          {showCreate && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Create DM Campaign</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Campaign Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Budget Course Promo"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Keyword</label>
                  <input
                    type="text"
                    value={form.keyword}
                    onChange={(e) => setForm({ ...form, keyword: e.target.value })}
                    placeholder="e.g., BUDGET"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Link to Product (Optional)</label>
                  <select
                    value={form.product_id}
                    onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="">None</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Goal (Optional)</label>
                  <textarea
                    value={form.goal}
                    onChange={(e) => setForm({ ...form, goal: e.target.value })}
                    placeholder="What do you want to achieve with this campaign?"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg h-20"
                  />
                </div>
                <button
                  onClick={createCampaign}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-slate-600">Loading campaigns...</p>
          ) : campaigns.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-slate-600">No DM campaigns yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{campaign.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">Keyword: <strong>{campaign.keyword}</strong></p>
                      {campaign.products && (
                        <p className="text-sm text-slate-600">Linked to: {campaign.products.name}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded text-sm ${
                      campaign.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {campaign.active ? 'Active' : 'Draft'}
                    </span>
                  </div>
                  
                  {campaign.suggested_caption && (
                    <div className="p-3 bg-purple-50 rounded mb-3">
                      <p className="text-sm font-medium text-purple-900 mb-1">Suggested Caption:</p>
                      <p className="text-sm text-purple-700">{campaign.suggested_caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
