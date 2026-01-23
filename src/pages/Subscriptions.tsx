import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardNav from '@/components/DashboardNav';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Calendar, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadSubscriptions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, products(name, description, price)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading subscriptions",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const cancelSubscription = async (subId: string) => {
    try {
      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: { subscriptionId: subId }
      });

      if (error) throw error;

      toast({
        title: "Subscription canceled",
        description: "Your subscription will remain active until the end of the billing period."
      });
      
      loadSubscriptions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      active: 'default',
      canceled: 'secondary',
      past_due: 'destructive',
      unpaid: 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Subscriptions</h1>

        {loading ? (
          <Card><CardContent className="p-8 text-center">Loading...</CardContent></Card>
        ) : subscriptions.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-gray-500">No active subscriptions</CardContent></Card>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <Card key={sub.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{sub.products?.name}</CardTitle>
                      <CardDescription>{sub.products?.description}</CardDescription>
                    </div>
                    {getStatusBadge(sub.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-semibold">${sub.products?.price}/month</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Next billing</p>
                        <p className="font-semibold">
                          {new Date(sub.current_period_end).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sub.cancel_at_period_end ? (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-semibold">
                          {sub.cancel_at_period_end ? 'Canceling' : 'Active'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {sub.status === 'active' && !sub.cancel_at_period_end && (
                    <Button 
                      variant="outline" 
                      onClick={() => cancelSubscription(sub.stripe_subscription_id)}
                    >
                      Cancel Subscription
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
