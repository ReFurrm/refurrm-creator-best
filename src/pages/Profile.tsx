import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import DashboardNav from '@/components/DashboardNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Palette, Store, Calendar } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    try {
      const [campaignsRes, storesRes] = await Promise.all([
        supabase.from('artist_campaigns').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }),
        supabase.from('generated_stores').select('*').eq('user_id', user?.id).order('created_at', { ascending: false })
      ]);

      if (campaignsRes.data) setCampaigns(campaignsRes.data);
      if (storesRes.data) setStores(storesRes.data);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [loadUserData, user]);

  return (
    <div className="min-h-screen bg-[#EDDACE]">
      <DashboardNav />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#5C4033] mb-2">My Profile</h1>
          <p className="text-[#1E8D70]">{user?.email}</p>
        </div>

        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-[#1E8D70]/20">
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-[#C24C1A] data-[state=active]:text-white">
              <Palette className="mr-2 h-4 w-4" />
              Campaigns ({campaigns.length})
            </TabsTrigger>
            <TabsTrigger value="stores" className="data-[state=active]:bg-[#C24C1A] data-[state=active]:text-white">
              <Store className="mr-2 h-4 w-4" />
              Stores ({stores.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="mt-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : campaigns.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Palette className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No campaigns generated yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle>{campaign.product_title || 'Untitled Campaign'}</CardTitle>
                          <CardDescription className="flex items-center mt-2">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(campaign.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge>Campaign</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {campaign.image_url && (
                        <img src={campaign.image_url} alt="Artwork" className="w-full max-w-xs rounded-lg" />
                      )}
                      {campaign.product_description && (
                        <p className="text-sm">{campaign.product_description}</p>
                      )}
                      {campaign.product_price && (
                        <p className="text-blue-600 font-semibold">{campaign.product_price}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stores" className="mt-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : stores.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Store className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No stores generated yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {stores.map((store) => (
                  <Card key={store.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle>{store.landing_headline || 'Untitled Store'}</CardTitle>
                          <CardDescription className="flex items-center mt-2">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(store.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">Store</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground italic">{store.idea_description}</p>
                      {store.landing_subheadline && (
                        <p className="text-sm font-medium">{store.landing_subheadline}</p>
                      )}
                      {store.sales_price && (
                        <p className="text-blue-600 font-semibold">{store.sales_price}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
