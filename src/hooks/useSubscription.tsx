import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Subscription {
  id: string;
  status: string;
  current_period_end: string;
  product_id: string;
  cancel_at_period_end: boolean;
}

export function useSubscription() {
  const { user, testMode } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    // If test mode is enabled, skip fetching and just set loading to false
    if (testMode) {
      setLoading(false);
      return;
    }

    fetchSubscriptions();
  }, [user, testMode]);


  const fetchSubscriptions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing', 'past_due']);

    if (!error && data) {
      setSubscriptions(data);
    }
    setLoading(false);
  };

  const hasActiveSubscription = (productId?: string) => {
    // If test mode is enabled, always return true
    if (testMode) return true;
    
    const activeStatuses = ['active', 'trialing', 'past_due'];
    
    if (productId) {
      return subscriptions.some(
        sub => sub.product_id === productId && activeStatuses.includes(sub.status)
      );
    }
    
    return subscriptions.some(sub => activeStatuses.includes(sub.status));
  };

  const hasAccessToProduct = (productId: string) => {
    // If test mode is enabled, always return true
    if (testMode) return true;
    
    return hasActiveSubscription(productId);
  };


  return {
    subscriptions,
    loading,
    hasActiveSubscription,
    hasAccessToProduct,
    refetch: fetchSubscriptions
  };
}
