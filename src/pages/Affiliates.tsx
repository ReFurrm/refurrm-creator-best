import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Link2, DollarSign, TrendingUp, Settings } from 'lucide-react';
import { AffiliateList } from '@/components/affiliate/AffiliateList';
import { AffiliateStats } from '@/components/affiliate/AffiliateStats';
import { CommissionSettings } from '@/components/affiliate/CommissionSettings';
import { PayoutManager } from '@/components/affiliate/PayoutManager';

export default function Affiliates() {
  const [commissionRate, setCommissionRate] = useState(20);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Affiliate Program</h1>
        <p className="text-muted-foreground">Manage your affiliates, track sales, and process payouts</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview"><TrendingUp className="w-4 h-4 mr-2" />Overview</TabsTrigger>
          <TabsTrigger value="affiliates"><Users className="w-4 h-4 mr-2" />Affiliates</TabsTrigger>
          <TabsTrigger value="payouts"><DollarSign className="w-4 h-4 mr-2" />Payouts</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-2" />Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AffiliateStats />
        </TabsContent>

        <TabsContent value="affiliates">
          <AffiliateList />
        </TabsContent>

        <TabsContent value="payouts">
          <PayoutManager />
        </TabsContent>

        <TabsContent value="settings">
          <CommissionSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
