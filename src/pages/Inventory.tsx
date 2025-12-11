import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

export default function Inventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const updateStock = async (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newQuantity = Math.max(0, product.stock_quantity + change);

    const { error } = await supabase
      .from('products')
      .update({ stock_quantity: newQuantity })
      .eq('id', productId);

    if (!error) {
      await supabase.from('inventory_history').insert({
        product_id: productId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        change_type: change > 0 ? 'increase' : 'decrease',
        quantity_change: change,
        previous_quantity: product.stock_quantity,
        new_quantity: newQuantity,
        notes: 'Manual adjustment'
      });

      toast({ title: 'Stock updated successfully' });
      loadProducts();
    }
  };

  const getStockStatus = (product: any) => {
    if (!product.track_inventory) return { label: 'Not Tracked', variant: 'secondary' as const };
    if (product.stock_quantity === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (product.stock_quantity <= product.low_stock_threshold) return { label: 'Low Stock', variant: 'warning' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
      </div>

      <div className="grid gap-4">
        {products.map(product => {
          const status = getStockStatus(product);
          return (
            <Card key={product.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-500">${product.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Current Stock</p>
                    <p className="text-2xl font-bold">{product.stock_quantity || 0}</p>
                  </div>

                  <Badge variant={status.variant}>{status.label}</Badge>

                  {product.track_inventory && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateStock(product.id, -1)}>
                        <TrendingDown className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStock(product.id, 1)}>
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
