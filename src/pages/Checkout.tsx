import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function Checkout() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [form, setForm] = useState({
    email: '',
    name: '',
    couponCode: ''
  });

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, shops(*, profiles(*))')
      .eq('id', productId)
      .single();

    setProduct(data);
    setLoading(false);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase.from('orders').insert({
        product_id: product.id,
        shop_id: product.shop_id,
        customer_email: form.email,
        customer_name: form.name,
        amount: product.price,
        status: 'pending'
      }).select().single();

      if (orderError) throw orderError;

      // Create Stripe checkout session
      const { data: sessionData, error: sessionError } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          productId: product.id,
          productName: product.name,
          price: product.price,
          customerEmail: form.email,
          customerName: form.name,
          orderId: orderData.id,
          successUrl: `${window.location.origin}/success?order=${orderData.id}`,
          cancelUrl: window.location.href,
          productType: product.product_type || 'one_time',
          billingInterval: product.billing_interval,
          stripePriceId: product.stripe_price_id
        }
      });


      if (sessionError) throw sessionError;

      if (sessionData?.url) {
        window.location.href = sessionData.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout. Please try again.');
      setProcessing(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>
          <div className="border-b border-slate-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">{product.name}</h2>
            <p className="text-slate-600 mb-4">{product.description}</p>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-purple-600">
                ${product.price}
                {product.product_type === 'subscription' && (
                  <span className="text-base text-slate-600">/{product.billing_interval}</span>
                )}
              </span>
              {product.compare_at_price && (
                <span className="text-slate-400 line-through">${product.compare_at_price}</span>
              )}
            </div>
            {product.product_type === 'subscription' && (
              <p className="text-sm text-purple-600 mt-2">Recurring subscription - cancel anytime</p>
            )}
          </div>


          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Coupon Code (Optional)</label>
              <input
                type="text"
                value={form.couponCode}
                onChange={(e) => setForm({ ...form, couponCode: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {processing ? 'Processing...' : `Pay $${product.price}`}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Powered by ReFurrm Shops
          </p>
        </div>
      </div>
    </div>
  );
}
