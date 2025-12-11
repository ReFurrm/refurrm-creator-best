import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const shipping = 10.00;
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get store owner from first product
      const { data: product } = await supabase
        .from('products')
        .select('user_id')
        .eq('id', cartItems[0].id)
        .single();

      const { data, error } = await supabase.functions.invoke('create-order-checkout', {
        body: {
          cartItems: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          storeOwnerId: product?.user_id,
          customerEmail: formData.email,
          customerName: formData.name,
          shippingAddress: formData,
          billingAddress: formData
        }
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({
        title: 'Checkout Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => navigate('/storefront')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input required type="email" value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <Label>Full Name</Label>
              <Input required value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <Label>Address</Label>
              <Input required value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>City</Label>
                <Input required value={formData.city} 
                  onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div>
                <Label>State</Label>
                <Input required value={formData.state} 
                  onChange={e => setFormData({...formData, state: e.target.value})} />
              </div>
            </div>
            <div>
              <Label>ZIP Code</Label>
              <Input required value={formData.zip} 
                onChange={e => setFormData({...formData, zip: e.target.value})} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </form>
        </Card>

        <Card className="p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
