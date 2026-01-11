import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Crown, Lock } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

export default function Storefront() {
  const [products, setProducts] = useState<any[]>([]);
  const { hasAccessToProduct } = useSubscription();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (data) setProducts(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-purple-600 rounded-full mx-auto mb-4"></div>
          <h1 className="text-3xl font-bold mb-2">Creator Store</h1>
          <p className="text-gray-600">Digital products and premium subscriptions</p>
        </div>

        <div className="space-y-4">
          {products.map(product => {
            const isSubscription = product.product_type === 'subscription';
            const hasAccess = hasAccessToProduct(product.id);

            return (
              <Card key={product.id} className={isSubscription ? 'border-purple-300' : ''}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        {isSubscription && <Crown className="w-5 h-5 text-purple-600" />}
                        {hasAccess && <Badge className="bg-green-600">Active</Badge>}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-purple-600">${product.price}</p>
                        {isSubscription && (
                          <span className="text-gray-500 text-sm">
                            /{product.billing_interval}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link to={`/checkout/${product.id}`}>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        {hasAccess ? 'Manage' : isSubscription ? 'Subscribe' : 'Buy Now'}
                      </Button>
                    </Link>
                  </div>
                  {isSubscription && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <Lock className="w-4 h-4" />
                        <span>Includes access to premium content</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link to="/premium">
            <Button variant="outline" className="border-purple-600 text-purple-600">
              View Premium Content
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
