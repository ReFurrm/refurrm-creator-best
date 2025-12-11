import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('orders')
      .select('*, products(*), shops(*, profiles(*))')
      .eq('id', orderId)
      .single();

    setOrder(data);
    setLoading(false);
  };

  const handleDownload = async () => {
    if (!order?.download_token) return;
    
    setDownloading(true);
    try {
      // In production, this would download from secure storage
      const downloadUrl = order.products.file_url;
      
      // Increment download count
      await supabase
        .from('orders')
        .update({ download_count: (order.download_count || 0) + 1 })
        .eq('id', order.id);
      
      // Trigger download
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download. Please contact support.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Order not found</p>
          <Link to="/" className="text-purple-600 hover:underline">Go to homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">Thank you for your purchase!</h1>
          <p className="text-slate-600 mb-8">
            Your order has been confirmed. A receipt has been sent to <strong>{order.customer_email}</strong>.
          </p>

          <div className="border-t border-slate-200 pt-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600">Product:</span>
              <span className="font-semibold text-slate-900">{order.products.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600">Amount:</span>
              <span className="font-semibold text-slate-900">${order.amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Order ID:</span>
              <span className="font-mono text-sm text-slate-600">{order.id.slice(0, 8)}</span>
            </div>
          </div>

          {order.products.type === 'digital' && order.download_token && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-purple-900 mb-3">Your download link has been sent to your email.</p>
              <button 
                onClick={handleDownload}
                disabled={downloading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
              >
                {downloading ? 'Downloading...' : 'Download Now'}
              </button>
              {order.download_count > 0 && (
                <p className="text-sm text-slate-600 mt-2">
                  Downloaded {order.download_count} time{order.download_count !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}

          {order.products.type === 'course' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-purple-900 mb-3">You now have access to the course!</p>
              <Link
                to={`/course/${order.products.id}`}
                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Start Learning
              </Link>
            </div>
          )}

          {order.products.type === 'service' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-purple-900">Check your email for booking confirmation and next steps.</p>
            </div>
          )}

          <Link
            to={`/store/${order.shops.profiles.username}`}
            className="inline-block text-purple-600 hover:underline mt-4"
          >
            Back to store
          </Link>
        </div>
      </div>
    </div>
  );
}

