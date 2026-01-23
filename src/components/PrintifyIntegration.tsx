import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Package, RefreshCw, CheckCircle } from 'lucide-react';

export default function PrintifyIntegration() {
  const [shops, setShops] = useState<any[]>([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  const loadShops = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('printify-get-shops');
    
    if (error) {
      toast({ title: 'Error loading shops', description: error.message, variant: 'destructive' });
    } else if (data?.shops) {
      setShops(data.shops);
    }
    setLoading(false);
  }, [toast]);

  const checkConnection = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'printify')
      .single();

    if (data) {
      setConnected(true);
      setSelectedShop(data.config?.shopId);
    }
  }, []);

  useEffect(() => {
    loadShops();
    checkConnection();
  }, [checkConnection, loadShops]);

  const saveConnection = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !selectedShop) return;

    const { error } = await supabase
      .from('integrations')
      .upsert({
        user_id: user.id,
        type: 'printify',
        config: { shopId: selectedShop },
        connected: true
      });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setConnected(true);
      toast({ title: 'Printify connected successfully!' });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-green-600" />
          <div>
            <h3 className="text-xl font-bold">Printify Integration</h3>
            <p className="text-sm text-gray-500">Automatic order fulfillment</p>
          </div>
        </div>
        {connected && <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Printify Shop</label>
          <Select value={selectedShop} onValueChange={setSelectedShop}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a shop..." />
            </SelectTrigger>
            <SelectContent>
              {shops.map(shop => (
                <SelectItem key={shop.id} value={shop.id.toString()}>
                  {shop.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={saveConnection} disabled={!selectedShop || loading}>
            {connected ? 'Update Connection' : 'Connect'}
          </Button>
          <Button variant="outline" onClick={loadShops} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Shops
          </Button>
        </div>
      </div>
    </Card>
  );
}
