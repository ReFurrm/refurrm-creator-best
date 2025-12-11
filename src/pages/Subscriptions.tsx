import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardNav from '@/components/DashboardNav';
import UsageProgressBars from '@/components/UsageProgressBars';
import BillingHistoryTable from '@/components/BillingHistoryTable';
import PlanComparisonCards from '@/components/PlanComparisonCards';
import PaymentMethodCard from '@/components/PaymentMethodCard';
import { TrialCountdown } from '@/components/TrialCountdown';
import { TrialBadge } from '@/components/TrialBadge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Calendar, CreditCard, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";



export default function Subscriptions() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setSubscription(data || { status: 'none', product_id: 'starter' });
    } catch (error: any) {
      toast({
        title: "Error loading subscription",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: { subscriptionId: subscription.stripe_subscription_id }
      });

      if (error) throw error;

      toast({
        title: "Subscription canceled",
        description: "Your subscription will remain active until the end of the billing period."
      });
      
      loadSubscription();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const config: any = {
      active: { variant: 'default', label: 'Active' },
      canceled: { variant: 'secondary', label: 'Canceled' },
      past_due: { variant: 'destructive', label: 'Past Due' },
      none: { variant: 'outline', label: 'No Subscription' }
    };
    const { variant, label } = config[status] || config.none;
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Card><CardContent className="p-8 text-center">Loading...</CardContent></Card>
        </main>
      </div>
    );
  }

  const calculateDaysRemaining = () => {
    if (!subscription?.trial_end_date) return 0;
    const now = new Date();
    const endDate = new Date(subscription.trial_end_date);
    return Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Subscription Management</h1>
            {(subscription?.is_trial || subscription?.is_vip) && (
              <TrialBadge 
                daysRemaining={subscription?.is_trial ? calculateDaysRemaining() : undefined}
                isVip={subscription?.is_vip}
                variant="compact" 
              />
            )}
          </div>
          {getStatusBadge(subscription?.status || 'none')}
        </div>


        {subscription?.is_trial && subscription?.trial_end_date && (
          <div className="mb-6">
            <TrialCountdown 
              trialEndDate={subscription.trial_end_date} 
              currentPlan={subscription.tier || 'Pro'} 
            />
          </div>
        )}


        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Pro Plan</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-2">$29<span className="text-lg text-gray-500">/mo</span></p>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar className="h-4 w-4" />
                Next billing: {subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}
              </div>
              <Button className="w-full" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                {subscription?.cancel_at_period_end ? (
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                )}
                <div>
                  <p className="font-semibold">
                    {subscription?.cancel_at_period_end ? 'Canceling Soon' : 'Active & Current'}
                  </p>
                  <p className="text-sm text-gray-500">All payments up to date</p>
                </div>
              </div>
              {subscription?.status === 'active' && !subscription?.cancel_at_period_end && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">Cancel Subscription</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Your subscription will remain active until the end of your billing period. You can reactivate anytime before then.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                      <AlertDialogAction onClick={cancelSubscription}>Cancel Subscription</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-2">$116.00</p>
              <p className="text-sm text-gray-500 mb-4">4 months subscribed</p>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Visa ending in 4242</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <UsageProgressBars planTier="pro" />
          <PaymentMethodCard />
        </div>

        <div className="mb-6">
          <PlanComparisonCards currentPlan="pro" isVip={subscription?.is_vip} />
        </div>


        <BillingHistoryTable />
      </main>
    </div>
  );
}
