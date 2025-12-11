import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from '@/components/DashboardNav';
import GracePeriodCountdown from '@/components/GracePeriodCountdown';

export default function Billing() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const trialDaysLeft = profile?.trial_ends_at 
    ? Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleAddPayment = async () => {
    setLoading(true);
    // In production, create Stripe customer portal session
    alert('Stripe customer portal will open here. You can update payment method, view invoices, and manage subscription.');
    setLoading(false);
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your billing period.')) {
      return;
    }

    setLoading(true);
    await supabase
      .from('profiles')
      .update({ subscription_status: 'canceled' })
      .eq('id', user?.id);

    alert('Subscription canceled. You will have access until the end of your billing period.');
    setLoading(false);
  };

  const handleReactivate = async () => {
    setLoading(true);
    await supabase
      .from('profiles')
      .update({ subscription_status: 'active' })
      .eq('id', user?.id);

    alert('Subscription reactivated!');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardNav />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Billing & Subscription</h2>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Current Plan</h3>
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-2xl font-bold text-slate-900">ReFurrm Shops Pro</p>
                <p className="text-slate-600">$29 per month</p>
              </div>
              <span className={`px-4 py-2 rounded text-sm font-semibold ${
                profile?.subscription_status === 'trial' ? 'bg-blue-100 text-blue-700' :
                profile?.subscription_status === 'active' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {profile?.subscription_status === 'trial' ? 'Free Trial' :
                 profile?.subscription_status === 'active' ? 'Active' : 'Canceled'}
              </span>
            </div>

            {profile?.subscription_status === 'trial' && trialDaysLeft > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <p className="text-purple-900">
                  <strong>{trialDaysLeft} days</strong> left in your free trial. 
                  Add a payment method to continue after your trial ends.
                </p>
              </div>
            )}

            {profile?.subscription_status === 'past_due' && profile?.grace_period_end && (
              <div className="mb-6">
                <GracePeriodCountdown gracePeriodEnd={profile.grace_period_end} />
              </div>
            )}


            <div className="space-y-3">
              <button
                onClick={handleAddPayment}
                disabled={loading}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
              >
                {profile?.subscription_status === 'trial' ? 'Add Payment Method' : 'Update Payment Method'}
              </button>

              {profile?.subscription_status === 'active' && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={loading}
                  className="w-full px-6 py-3 border-2 border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition disabled:opacity-50"
                >
                  Cancel Subscription
                </button>
              )}

              {profile?.subscription_status === 'canceled' && (
                <button
                  onClick={handleReactivate}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  Reactivate Subscription
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Plan Features</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700">Unlimited products and courses</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700">AI-powered store setup and copywriting</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700">Advanced analytics and recommendations</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700">Email marketing and DM campaigns</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700">Booking and calendar management</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
