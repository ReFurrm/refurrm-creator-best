import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from '@/components/DashboardNav';
import PrintifyIntegration from '@/components/PrintifyIntegration';
import ProfitMarginCalculator from '@/components/ProfitMarginCalculator';
import { PrintfulIntegration } from '@/components/PrintfulIntegration';
import { SocialMediaScheduler } from '@/components/SocialMediaScheduler';
import GoogleCalendarIntegration from '@/components/GoogleCalendarIntegration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';



export default function Integrations() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntegrations();
  }, [user]);

  const loadIntegrations = async () => {
    if (!user) return;

    const { data: shopData } = await supabase
      .from('shops')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (shopData) {
      const { data } = await supabase
        .from('integrations')
        .select('*')
        .eq('shop_id', shopData.id);

      const integrationsMap = data?.reduce((acc, int) => {
        acc[int.type] = int;
        return acc;
      }, {} as any) || {};

      setIntegrations(integrationsMap);
    }

    setLoading(false);
  };

  const connectIntegration = async (type: string) => {
    alert(`${type} integration will be available soon. OAuth flow will be implemented here.`);
  };

  const integrationsList = [
    {
      type: 'instagram',
      name: 'Instagram',
      description: 'Connect your Instagram business account to automate DM campaigns and track engagement.',
      icon: '📷',
      status: integrations.instagram?.connected ? 'Connected' : 'Not Connected'
    },
    {
      type: 'shopify',
      name: 'Shopify',
      description: 'Import products from your Shopify store and sync inventory automatically.',
      icon: '🛍️',
      status: integrations.shopify?.connected ? 'Connected' : 'Not Connected'
    },
    {
      type: 'google_calendar',
      name: 'Google Calendar',
      description: 'Sync booking appointments to your Google Calendar automatically.',
      icon: '📅',
      status: integrations.google_calendar?.connected ? 'Connected' : 'Not Connected'
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardNav />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Integrations</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-blue-900 text-sm">
              <strong>Developer Note:</strong> Integration endpoints are ready for OAuth implementation. 
              The database schema and service layer are prepared for connecting external APIs.
            </p>
          </div>

          {loading ? (
            <p className="text-slate-600">Loading integrations...</p>
          ) : (
            <Tabs defaultValue="print" className="space-y-6">
              <TabsList>
                <TabsTrigger value="print">Print on Demand</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>

              <TabsContent value="print" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <PrintifyIntegration />
                  <PrintfulIntegration />
                </div>
                <ProfitMarginCalculator />
              </TabsContent>

              <TabsContent value="social">
                <SocialMediaScheduler />
              </TabsContent>

              <TabsContent value="other" className="space-y-6">
                <GoogleCalendarIntegration />

                {integrationsList.filter(i => i.type !== 'google_calendar').map(integration => (
                  <div key={integration.type} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{integration.icon}</div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900 mb-2">{integration.name}</h3>
                          <p className="text-slate-600 mb-4">{integration.description}</p>
                          <span className={`inline-block px-3 py-1 rounded text-sm ${
                            integration.status === 'Connected'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {integration.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => connectIntegration(integration.name)}
                        className={`px-6 py-3 rounded-lg font-semibold transition ${
                          integration.status === 'Connected'
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}

              </TabsContent>
            </Tabs>

          )}
        </div>

      </div>
    </div>
  );
}
