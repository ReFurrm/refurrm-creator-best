import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Link2, TrendingUp, Package } from 'lucide-react';
import { AffiliateLinks } from '@/components/affiliate/AffiliateLinks';
import { AffiliateEarnings } from '@/components/affiliate/AffiliateEarnings';
import { AffiliateMarketingKit } from '@/components/affiliate/AffiliateMarketingKit';

export default function AffiliateDashboard() {
  const [totalEarnings, setTotalEarnings] = useState(1247.50);
  const [pendingEarnings, setPendingEarnings] = useState(342.00);
  const [totalSales, setTotalSales] = useState(87);
  const [conversionRate, setConversionRate] = useState(3.2);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Affiliate Dashboard</h1>
        <p className="text-muted-foreground">Track your earnings and promote products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Awaiting payout</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">Conversions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Click to sale</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="links" className="space-y-6">
        <TabsList>
          <TabsTrigger value="links"><Link2 className="w-4 h-4 mr-2" />My Links</TabsTrigger>
          <TabsTrigger value="earnings"><DollarSign className="w-4 h-4 mr-2" />Earnings</TabsTrigger>
          <TabsTrigger value="marketing"><Package className="w-4 h-4 mr-2" />Marketing Kit</TabsTrigger>
        </TabsList>

        <TabsContent value="links">
          <AffiliateLinks />
        </TabsContent>

        <TabsContent value="earnings">
          <AffiliateEarnings />
        </TabsContent>

        <TabsContent value="marketing">
          <AffiliateMarketingKit />
        </TabsContent>
      </Tabs>
    </div>
  );
}
