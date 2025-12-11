import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductsManager } from '@/components/admin/ProductsManager';
import { OrdersManager } from '@/components/admin/OrdersManager';
import { SubscriptionsManager } from '@/components/admin/SubscriptionsManager';
import { SupportManager } from '@/components/admin/SupportManager';
import { VIPManager } from '@/components/admin/VIPManager';
import { SetupWizard } from '@/components/admin/SetupWizard';
import { DataExport } from '@/components/admin/DataExport';
import { Package, ShoppingCart, CreditCard, MessageSquare, Calendar, Crown, Wand2, Database, Activity } from 'lucide-react';
import { PerformanceMetrics } from '@/components/admin/PerformanceMetrics';
import { SlowQueriesTable } from '@/components/admin/SlowQueriesTable';



export default function Admin() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage all aspects of your application</p>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-9 gap-2">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance
          </TabsTrigger>

          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Subscriptions
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Support
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="vip" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            VIP
          </TabsTrigger>
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Setup
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="space-y-6">
            <PerformanceMetrics />
            <SlowQueriesTable />
            <Card>
              <CardHeader>
                <CardTitle>Error Log</CardTitle>
                <CardDescription>Recent errors and exceptions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Check browser console for detailed error logs</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>


        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products Management</CardTitle>
              <CardDescription>View and manage all products in your store</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductsManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders Management</CardTitle>
              <CardDescription>View and update order statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Subscriptions Management</CardTitle>
              <CardDescription>Manage user subscriptions and billing</CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionsManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Manage customer support requests</CardDescription>
            </CardHeader>
            <CardContent>
              <SupportManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Bookings Management</CardTitle>
              <CardDescription>View and manage all bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Bookings manager coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vip">
          <Card>
            <CardHeader>
              <CardTitle>VIP Management</CardTitle>
              <CardDescription>Grant and manage VIP premium access</CardDescription>
            </CardHeader>
            <CardContent>
              <VIPManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>Quick Setup Wizard</CardTitle>
              <CardDescription>Populate your account with sample data</CardDescription>
            </CardHeader>
            <CardContent>
              <SetupWizard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>Download all your data for backup or analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <DataExport />
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
