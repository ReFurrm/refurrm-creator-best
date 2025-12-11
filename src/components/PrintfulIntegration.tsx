import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Package } from 'lucide-react';
import { toast } from 'sonner';

export function PrintfulIntegration() {
  const [apiKey, setApiKey] = useState('');
  const [profitMargin, setProfitMargin] = useState(30);
  const [autoFulfill, setAutoFulfill] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    loadSettings();
    // Set webhook URL
    const baseUrl = window.location.origin.includes('localhost') 
      ? 'https://api.databasepad.com'
      : window.location.origin;
    setWebhookUrl(`${baseUrl}/functions/v1/printful-webhook-handler`);
  }, []);


  const loadSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('printful_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setApiKey(data.api_key || '');
      setProfitMargin(data.default_profit_margin || 30);
      setAutoFulfill(data.auto_fulfill || false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('printful_settings').upsert({
        user_id: user.id,
        api_key: apiKey,
        default_profit_margin: profitMargin,
        auto_fulfill: autoFulfill,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      toast.success('Printful settings saved!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Printful Integration</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="apiKey">Printful API Key</Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Printful API key"
          />
        </div>

        <div>
          <Label htmlFor="profitMargin">Default Profit Margin (%)</Label>
          <Input
            id="profitMargin"
            type="number"
            value={profitMargin}
            onChange={(e) => setProfitMargin(Number(e.target.value))}
            min="0"
            max="100"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="autoFulfill">Auto-fulfill orders</Label>
          <Switch
            id="autoFulfill"
            checked={autoFulfill}
            onCheckedChange={setAutoFulfill}
          />
        </div>

        <div className="border-t pt-4">
          <Label>Webhook URL</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={webhookUrl}
              readOnly
              className="bg-slate-50"
            />
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(webhookUrl);
                toast.success('Webhook URL copied!');
              }}
            >
              Copy
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Add this webhook URL to your Printful dashboard to receive order status updates
          </p>
        </div>

        <Button onClick={saveSettings} disabled={loading} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>

      </div>
    </Card>
  );
}
