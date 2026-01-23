import { useEffect, useState, useCallback } from 'react';
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
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
    youtube_url: ''
  });

  const loadSettings = useCallback(async () => {
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
        facebook_url: shopData.facebook_url || '',
        instagram_url: shopData.instagram_url || '',
        tiktok_url: shopData.tiktok_url || '',
        youtube_url: shopData.youtube_url || ''
      });
    }
  }, [user]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Facebook URL</label>
                  <input
                    type="url"
                    value={shopForm.facebook_url}
                    onChange={(e) => setShopForm({ ...shopForm, facebook_url: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
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
