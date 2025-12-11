import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from '@/components/DashboardNav';

export default function Settings() {
  const { user, testMode, setTestMode } = useAuth();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    brand_name: '',
    username: '',
    timezone: 'UTC'
  });

  const [shopForm, setShopForm] = useState({
    headline: '',
    subheadline: '',
    bio: '',
    primary_color: '#6366f1',
    theme: 'light',
    instagram_url: '',
    tiktok_url: '',
    youtube_url: ''
  });

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) {
      setProfileForm({
        full_name: profileData.full_name || '',
        brand_name: profileData.brand_name || '',
        username: profileData.username || '',
        timezone: profileData.timezone || 'UTC'
      });
    }

    const { data: shopData } = await supabase
      .from('shops')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (shopData) {
      setShopForm({
        headline: shopData.headline || '',
        subheadline: shopData.subheadline || '',
        bio: shopData.bio || '',
        primary_color: shopData.primary_color || '#6366f1',
        theme: shopData.theme || 'light',
        instagram_url: shopData.instagram_url || '',
        tiktok_url: shopData.tiktok_url || '',
        youtube_url: shopData.youtube_url || ''
      });
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    await supabase
      .from('profiles')
      .update(profileForm)
      .eq('id', user?.id);

    setSuccess('Profile updated successfully!');
    setLoading(false);
  };

  const saveShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    await supabase
      .from('shops')
      .update(shopForm)
      .eq('user_id', user?.id);

    setSuccess('Shop settings updated successfully!');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardNav />
      
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Settings</h2>

          {/* Supabase Database Access Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-semibold text-green-900 mb-3 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              Your Database Access
            </h3>
            <p className="text-green-800 text-sm mb-4">
              All your data is stored in Supabase. Access your database directly to manage products, users, orders, and more.
            </p>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Supabase Project URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="https://msaadrpyttiiejglqbbj.supabase.co"
                    readOnly
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://msaadrpyttiiejglqbbj.supabase.co');
                      setSuccess('URL copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Access Your Database</label>
                <a
                  href="https://supabase.com/dashboard/project/msaadrpyttiiejglqbbj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open Supabase Dashboard
                </a>
              </div>
            </div>

            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2 text-sm">Database Tables You Can Edit:</h4>
              <ul className="text-xs text-green-800 space-y-1">
                <li><strong>• profiles</strong> - User profiles and account settings</li>
                <li><strong>• products</strong> - Your product catalog</li>
                <li><strong>• orders</strong> - Customer orders and transactions</li>
                <li><strong>• subscriptions</strong> - Subscription plans and billing</li>
                <li><strong>• affiliates</strong> - Affiliate program data</li>
                <li><strong>• shops</strong> - Storefront customization</li>
                <li><strong>• support_tickets</strong> - Customer support messages</li>
              </ul>
              <p className="text-xs text-green-700 mt-3">
                <strong>Tip:</strong> Go to "Table Editor" in Supabase to add, edit, or delete records directly.
              </p>
            </div>
          </div>

          {/* VIP Account Setup Instructions */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-semibold text-amber-900 mb-3 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              How to Set Up VIP Accounts
            </h3>
            <div className="bg-white rounded-lg p-4 space-y-3 text-sm text-amber-900">
              <div>
                <p className="font-semibold mb-1">Option 1: Use Test Mode (Recommended for Testing)</p>
                <p className="text-xs text-amber-800">Enable "Test Premium Mode" toggle above to instantly access all VIP features without setting up subscriptions.</p>
              </div>
              
              <div>
                <p className="font-semibold mb-1">Option 2: Create Real Subscription in Supabase</p>
                <ol className="text-xs text-amber-800 space-y-1 ml-4 list-decimal">
                  <li>Open your Supabase Dashboard (link above)</li>
                  <li>Go to "Table Editor" → "subscriptions" table</li>
                  <li>Click "Insert" → "Insert row"</li>
                  <li>Fill in: user_id (your user ID), plan_id, status='active', current_period_end (future date)</li>
                  <li>Save - you now have VIP access!</li>
                </ol>
              </div>

              <div>
                <p className="font-semibold mb-1">Option 3: Use the VIP Manager Page</p>
                <p className="text-xs text-amber-800">Navigate to /vip-manager to grant VIP status to users through the admin interface.</p>
              </div>
            </div>
          </div>


          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {/* Test Mode Section */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg shadow p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Test Premium Mode
                </h3>
                <p className="text-purple-700 text-sm mb-4">
                  Enable test mode to access all premium features without a subscription. Perfect for testing and development.
                </p>
                <div className="bg-white/50 rounded-lg p-3 text-xs text-purple-800 mb-4">
                  <strong>When enabled:</strong> All premium content and features will be accessible, subscription checks will be bypassed.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={testMode}
                  onChange={(e) => {
                    setTestMode(e.target.checked);
                    setSuccess(e.target.checked ? 'Test mode enabled! All premium features unlocked.' : 'Test mode disabled.');
                  }}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            {testMode && (
              <div className="mt-4 bg-purple-100 border border-purple-300 rounded-lg p-3 text-sm text-purple-900">
                <strong>Test Mode Active:</strong> You now have full access to all premium features!
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Profile</h3>
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Brand Name</label>
                <input
                  type="text"
                  value={profileForm.brand_name}
                  onChange={(e) => setProfileForm({ ...profileForm, brand_name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                <input
                  type="text"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
                <p className="text-xs text-slate-500 mt-1">Your store URL: refurrm.shop/{profileForm.username}</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Save Profile
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Shop Settings</h3>
            <form onSubmit={saveShop} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Headline</label>
                <input
                  type="text"
                  value={shopForm.headline}
                  onChange={(e) => setShopForm({ ...shopForm, headline: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subheadline</label>
                <input
                  type="text"
                  value={shopForm.subheadline}
                  onChange={(e) => setShopForm({ ...shopForm, subheadline: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                <textarea
                  value={shopForm.bio}
                  onChange={(e) => setShopForm({ ...shopForm, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Instagram URL</label>
                  <input
                    type="url"
                    value={shopForm.instagram_url}
                    onChange={(e) => setShopForm({ ...shopForm, instagram_url: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">TikTok URL</label>
                  <input
                    type="url"
                    value={shopForm.tiktok_url}
                    onChange={(e) => setShopForm({ ...shopForm, tiktok_url: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Save Shop Settings
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
