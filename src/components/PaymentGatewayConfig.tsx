import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { AlertCircle, Copy, ExternalLink } from 'lucide-react';

export default function PaymentGatewayConfig() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [stripeConfig, setStripeConfig] = useState({
    test_mode: true,
    stripe_publishable_key: '',
    stripe_secret_key: '',
    stripe_webhook_secret: '',
    is_active: false
  });
  const [paypalConfig, setPaypalConfig] = useState({
    test_mode: true,
    paypal_client_id: '',
    paypal_secret: '',
    is_active: false
  });

  const loadConfigs = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('payment_gateways')
      .select('*')
      .eq('user_id', user.id);
    
    if (data) {
      data.forEach(config => {
        if (config.provider === 'stripe') {
          setStripeConfig({
            test_mode: config.test_mode,
            stripe_publishable_key: config.stripe_publishable_key || '',
            stripe_secret_key: config.stripe_secret_key || '',
            stripe_webhook_secret: config.stripe_webhook_secret || '',
            is_active: config.is_active
          });
        } else if (config.provider === 'paypal') {
          setPaypalConfig({
            test_mode: config.test_mode,
            paypal_client_id: config.paypal_client_id || '',
            paypal_secret: config.paypal_secret || '',
            is_active: config.is_active
          });
        }
      });
    }
  }, [user]);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const saveStripeConfig = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from('payment_gateways')
      .upsert({
        user_id: user.id,
        provider: 'stripe',
        ...stripeConfig
      });
    
    setLoading(false);
    if (error) {
      toast.error('Failed to save Stripe configuration');
    } else {
      toast.success('Stripe configuration saved!');
    }
  };

  const savePayPalConfig = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from('payment_gateways')
      .upsert({
        user_id: user.id,
        provider: 'paypal',
        ...paypalConfig
      });
    
    setLoading(false);
    if (error) {
      toast.error('Failed to save PayPal configuration');
    } else {
      toast.success('PayPal configuration saved!');
    }
  };

  const testConnection = async (provider: 'stripe' | 'paypal') => {
    setTestingConnection(true);
    try {
      const config = provider === 'stripe' ? stripeConfig : paypalConfig;
      const { data, error } = await supabase.functions.invoke('verify-payment-gateway', {
        body: {
          provider,
          testMode: config.test_mode,
          apiKey: provider === 'stripe' ? config.stripe_secret_key : config.paypal_secret,
          clientId: provider === 'paypal' ? config.paypal_client_id : undefined
        }
      });

      if (error) throw error;
      
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error('Connection test failed: ' + error.message);
    }
    setTestingConnection(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <Tabs defaultValue="stripe" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="stripe">Stripe</TabsTrigger>
        <TabsTrigger value="paypal">PayPal</TabsTrigger>
      </TabsList>

      <TabsContent value="stripe">
        <Card>
          <CardHeader>
            <CardTitle>Stripe Configuration</CardTitle>
            <CardDescription>Connect your Stripe account to accept payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Test Mode</Label>
              <Switch 
                checked={stripeConfig.test_mode}
                onCheckedChange={(checked) => setStripeConfig({...stripeConfig, test_mode: checked})}
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {stripeConfig.test_mode ? 'Using test keys. No real charges will be made.' : 'Using live keys. Real charges will be processed!'}
              </AlertDescription>
            </Alert>

            <div>
              <Label>Publishable Key</Label>
              <Input 
                type="password"
                value={stripeConfig.stripe_publishable_key}
                onChange={(e) => setStripeConfig({...stripeConfig, stripe_publishable_key: e.target.value})}
                placeholder={stripeConfig.test_mode ? 'pk_test_...' : 'pk_live_...'}
              />
            </div>

            <div>
              <Label>Secret Key</Label>
              <Input 
                type="password"
                value={stripeConfig.stripe_secret_key}
                onChange={(e) => setStripeConfig({...stripeConfig, stripe_secret_key: e.target.value})}
                placeholder={stripeConfig.test_mode ? 'sk_test_...' : 'sk_live_...'}
              />
            </div>

            <div>
              <Label>Webhook Secret (Optional)</Label>
              <Input 
                type="password"
                value={stripeConfig.stripe_webhook_secret}
                onChange={(e) => setStripeConfig({...stripeConfig, stripe_webhook_secret: e.target.value})}
                placeholder="whsec_..."
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Webhook Setup</h4>
              <p className="text-sm text-gray-600">Add this URL to your Stripe webhooks:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white p-2 rounded text-xs">
                  {window.location.origin}/api/stripe-webhook
                </code>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(`${window.location.origin}/api/stripe-webhook`)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Button size="sm" variant="link" onClick={() => window.open('https://dashboard.stripe.com/webhooks', '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Stripe Dashboard
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Label>Enable Stripe Payments</Label>
              <Switch 
                checked={stripeConfig.is_active}
                onCheckedChange={(checked) => setStripeConfig({...stripeConfig, is_active: checked})}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={saveStripeConfig} disabled={loading} className="flex-1">
                Save Configuration
              </Button>
              <Button 
                onClick={() => testConnection('stripe')} 
                disabled={testingConnection || !stripeConfig.stripe_secret_key}
                variant="outline"
              >
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="paypal">
        <Card>
          <CardHeader>
            <CardTitle>PayPal Configuration</CardTitle>
            <CardDescription>Connect your PayPal account to accept payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Test Mode (Sandbox)</Label>
              <Switch 
                checked={paypalConfig.test_mode}
                onCheckedChange={(checked) => setPaypalConfig({...paypalConfig, test_mode: checked})}
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {paypalConfig.test_mode ? 'Using sandbox credentials. No real charges will be made.' : 'Using live credentials. Real charges will be processed!'}
              </AlertDescription>
            </Alert>

            <div>
              <Label>Client ID</Label>
              <Input 
                type="password"
                value={paypalConfig.paypal_client_id}
                onChange={(e) => setPaypalConfig({...paypalConfig, paypal_client_id: e.target.value})}
                placeholder="Client ID from PayPal"
              />
            </div>

            <div>
              <Label>Secret</Label>
              <Input 
                type="password"
                value={paypalConfig.paypal_secret}
                onChange={(e) => setPaypalConfig({...paypalConfig, paypal_secret: e.target.value})}
                placeholder="Secret from PayPal"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Getting PayPal Credentials</h4>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Go to PayPal Developer Dashboard</li>
                <li>Create a new app or select existing</li>
                <li>Copy Client ID and Secret</li>
                <li>Toggle between Sandbox/Live as needed</li>
              </ol>
              <Button size="sm" variant="link" onClick={() => window.open('https://developer.paypal.com/dashboard/', '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open PayPal Developer Dashboard
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Label>Enable PayPal Payments</Label>
              <Switch 
                checked={paypalConfig.is_active}
                onCheckedChange={(checked) => setPaypalConfig({...paypalConfig, is_active: checked})}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={savePayPalConfig} disabled={loading} className="flex-1">
                Save Configuration
              </Button>
              <Button 
                onClick={() => testConnection('paypal')} 
                disabled={testingConnection || !paypalConfig.paypal_client_id}
                variant="outline"
              >
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
