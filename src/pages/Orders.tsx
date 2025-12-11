import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Package, Search, Eye } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const filterOrders = () => {
    let filtered = [...orders];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.fulfillment_status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(o => 
        o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ fulfillment_status: status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (!error) {
      toast({ title: 'Order status updated' });
      loadOrders();
    }
  };

  const fulfillOrder = async (order: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: integration } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'printify')
      .single();

    if (!integration?.config?.shopId) {
      toast({ title: 'Printify not connected', description: 'Please connect Printify in Integrations', variant: 'destructive' });
      return;
    }

    const { data, error } = await supabase.functions.invoke('printful-order-fulfillment', {
      body: {
        orderId: order.order_number,
        shopId: integration.config.shopId,
        items: order.order_items,
        shippingAddress: {
          name: order.customer_name,
          email: order.customer_email,
          address1: order.shipping_address?.address1,
          city: order.shipping_address?.city,
          state: order.shipping_address?.state,
          zip: order.shipping_address?.zip,
          country: order.shipping_address?.country || 'US'
        }
      }
    });

    if (error) {
      toast({ title: 'Fulfillment failed', description: error.message, variant: 'destructive' });
    } else {
      await supabase
        .from('orders')
        .update({ 
          fulfillment_status: 'processing',
          printify_order_id: data.printifyOrderId
        })
        .eq('id', order.id);
      
      toast({ title: 'Order sent to Printify!' });
      loadOrders();
    }
  };

  const updateTracking = async () => {
    if (!selectedOrder || !trackingNumber) return;

    const { error } = await supabase
      .from('orders')
      .update({ 
        tracking_number: trackingNumber,
        fulfillment_status: 'shipped',
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedOrder.id);

    if (!error) {
      toast({ title: 'Tracking number added' });
      setSelectedOrder(null);
      setTrackingNumber('');
      loadOrders();
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'secondary',
      processing: 'default',
      shipped: 'default',
      delivered: 'default',
      cancelled: 'destructive'
    };
    return colors[status] || 'secondary';
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map(order => (
          <Card key={order.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">Order #{order.order_number}</h3>
                <p className="text-sm text-gray-500">{order.customer_name || order.customer_email}</p>
                <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${order.total_amount}</p>
                <Badge variant={getStatusColor(order.fulfillment_status)}>
                  {order.fulfillment_status}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              {order.fulfillment_status === 'pending' && (
                <Button size="sm" onClick={() => fulfillOrder(order)}>
                  <Package className="w-4 h-4 mr-2" />
                  Send to Printify
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Select value={order.fulfillment_status} onValueChange={v => updateOrderStatus(order.id, v)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </Card>
        ))}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Items</h4>
                {selectedOrder.order_items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between py-2 border-b">
                    <span>{item.product_name} x {item.quantity}</span>
                    <span>${item.subtotal}</span>
                  </div>
                ))}
              </div>
              <div>
                <Label>Tracking Number</Label>
                <div className="flex gap-2">
                  <Input
                    value={trackingNumber || selectedOrder.tracking_number || ''}
                    onChange={e => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                  />
                  <Button onClick={updateTracking}>Save</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
