import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from '@/components/DashboardNav';

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;

    const { data: shopData } = await supabase
      .from('shops')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (shopData) {
      const { data: productsData } = await supabase
        .from('products')
        .select('id')
        .eq('shop_id', shopData.id)
        .eq('type', 'service');

      const productIds = productsData?.map(p => p.id) || [];

      if (productIds.length > 0) {
        const { data } = await supabase
          .from('bookings')
          .select('*, products(name)')
          .in('product_id', productIds)
          .order('scheduled_at', { ascending: true });

        setBookings(data || []);
      }
    }

    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardNav />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Bookings</h2>

          {loading ? (
            <p className="text-slate-600">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-slate-600 mb-4">No bookings yet.</p>
              <p className="text-sm text-slate-500">Create a service product to start accepting bookings.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {booking.products?.name}
                      </h3>
                      <p className="text-slate-600 mt-1">{booking.customer_name} ({booking.customer_email})</p>
                      <p className="text-sm text-slate-500 mt-2">{formatDate(booking.scheduled_at)}</p>
                      <p className="text-sm text-slate-500">{booking.duration_minutes} minutes</p>
                      
                      {booking.prep_notes && (
                        <div className="mt-4 p-3 bg-slate-50 rounded">
                          <p className="text-sm font-medium text-slate-700 mb-1">Client Notes:</p>
                          <p className="text-sm text-slate-600">{booking.prep_notes}</p>
                        </div>
                      )}

                      {booking.ai_brief && (
                        <div className="mt-3 p-3 bg-purple-50 rounded">
                          <p className="text-sm font-medium text-purple-900 mb-1">AI Brief:</p>
                          <p className="text-sm text-purple-700">{booking.ai_brief}</p>
                        </div>
                      )}
                    </div>
                    
                    <span className={`px-3 py-1 rounded text-sm ${
                      booking.status === 'scheduled' ? 'bg-green-100 text-green-700' :
                      booking.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
