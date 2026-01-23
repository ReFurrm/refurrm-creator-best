import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Store, Palette, CreditCard, Truck, Globe, Package, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import DashboardNav from '@/components/DashboardNav';
import PaymentGatewayConfig from '@/components/PaymentGatewayConfig';
import LogoUpload from '@/components/LogoUpload';



export default function StoreBuilder() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [storeData, setStoreData] = useState({
    store_name: '',
    store_description: '',
    store_url: '',
    logo_url: '',
    custom_domain: '',
    primary_color: '#6366f1',
    secondary_color: '#8b5cf6',
    currency: 'USD',
    tax_rate: 0,
    enable_shipping: true,
    shipping_flat_rate: 0,
    free_shipping_threshold: 0,
    payment_methods: [] as string[],
    business_name: '',
    business_email: '',
    business_phone: '',
    business_address: ''
  });

  const loadStoreData = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data) {
      setStoreData(prev => ({ ...prev, ...data }));
    }
  }, [user]);

  useEffect(() => {
    loadStoreData();
  }, [loadStoreData]);

  const saveStoreData = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from('user_profiles')
      .update(storeData)
      .eq('id', user.id);
    
    setLoading(false);
    if (error) {
      toast.error('Failed to save store settings');
    } else {
      toast.success('Store settings saved successfully!');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Store Builder</h1>
            <p className="text-gray-600">Configure your online store settings</p>
          </div>

          <Tabs defaultValue="branding" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>

            <TabsContent value="branding">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Store Branding
                  </CardTitle>
                  <CardDescription>Customize your store's appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <LogoUpload 
                    currentLogo={storeData.logo_url}
                    onLogoUpdate={(url) => setStoreData({...storeData, logo_url: url})}
                  />
                  
                  <div>
                    <Label>Store Name</Label>
                    <Input 
                      value={storeData.store_name}
                      onChange={(e) => setStoreData({...storeData, store_name: e.target.value})}
                      placeholder="My Awesome Store"
                    />
                  </div>
                  <div>
                    <Label>Store Description</Label>
                    <Textarea 
                      value={storeData.store_description}
                      onChange={(e) => setStoreData({...storeData, store_description: e.target.value})}
                      placeholder="Tell customers about your store..."
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Primary Color</Label>
                      <Input 
                        type="color"
                        value={storeData.primary_color}
                        onChange={(e) => setStoreData({...storeData, primary_color: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Secondary Color</Label>
                      <Input 
                        type="color"
                        value={storeData.secondary_color}
                        onChange={(e) => setStoreData({...storeData, secondary_color: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-semibold mb-4">Custom Domain</h3>
                    <div className="space-y-3">
                      <div>
                        <Label>Domain Name</Label>
                        <Input 
                          value={storeData.custom_domain || ''}
                          onChange={(e) => setStoreData({...storeData, custom_domain: e.target.value})}
                          placeholder="shop.yourdomain.com"
                        />
                      </div>
                      <Alert>
                        <AlertCircle className="w-4 h-4" />
                        <AlertDescription>
                          <p className="font-semibold mb-2">DNS Configuration:</p>
                          <p className="text-sm mb-1">Add a CNAME record:</p>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">shop.yourdomain.com → your-store.refurrm.app</code>
                          <p className="text-sm mt-2">SSL certificates are automatically provisioned once DNS is configured.</p>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                  
                  <Button onClick={saveStoreData} disabled={loading}>Save Branding</Button>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="business">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    Business Information
                  </CardTitle>
                  <CardDescription>Your business details for invoices and legal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Business Name</Label>
                    <Input 
                      value={storeData.business_name}
                      onChange={(e) => setStoreData({...storeData, business_name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Business Email</Label>
                      <Input 
                        type="email"
                        value={storeData.business_email}
                        onChange={(e) => setStoreData({...storeData, business_email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Business Phone</Label>
                      <Input 
                        type="tel"
                        value={storeData.business_phone}
                        onChange={(e) => setStoreData({...storeData, business_phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Business Address</Label>
                    <Textarea 
                      value={storeData.business_address}
                      onChange={(e) => setStoreData({...storeData, business_address: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <Button onClick={saveStoreData} disabled={loading}>Save Business Info</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Settings
                    </CardTitle>
                    <CardDescription>Configure payment methods and pricing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Currency</Label>
                      <Select value={storeData.currency} onValueChange={(v) => setStoreData({...storeData, currency: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Tax Rate (%)</Label>
                      <Input 
                        type="number"
                        value={storeData.tax_rate}
                        onChange={(e) => setStoreData({...storeData, tax_rate: parseFloat(e.target.value)})}
                        step="0.01"
                      />
                    </div>
                    <Button onClick={saveStoreData} disabled={loading}>Save Payment Settings</Button>
                  </CardContent>
                </Card>

                <PaymentGatewayConfig />
              </div>

            </TabsContent>

            <TabsContent value="shipping">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipping Options
                  </CardTitle>
                  <CardDescription>Set up shipping rates and options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable Shipping</Label>
                    <Switch 
                      checked={storeData.enable_shipping}
                      onCheckedChange={(checked) => setStoreData({...storeData, enable_shipping: checked})}
                    />
                  </div>
                  {storeData.enable_shipping && (
                    <>
                      <div>
                        <Label>Flat Shipping Rate</Label>
                        <Input 
                          type="number"
                          value={storeData.shipping_flat_rate}
                          onChange={(e) => setStoreData({...storeData, shipping_flat_rate: parseFloat(e.target.value)})}
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label>Free Shipping Threshold</Label>
                        <Input 
                          type="number"
                          value={storeData.free_shipping_threshold}
                          onChange={(e) => setStoreData({...storeData, free_shipping_threshold: parseFloat(e.target.value)})}
                          step="0.01"
                        />
                      </div>
                    </>
                  )}
                  <Button onClick={saveStoreData} disabled={loading}>Save Shipping Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Product Management
                  </CardTitle>
                  <CardDescription>Add and manage your products</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => window.location.href = '/products/new'}>
                      Add New Product
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/products'}>
                      View All Products
                    </Button>
                  </div>
                  <div className="border-t pt-4">
                    <Button variant="outline" className="w-full" onClick={() => window.location.href = '/storefront'}>
                      <Globe className="w-4 h-4 mr-2" />
                      Preview Your Storefront
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
