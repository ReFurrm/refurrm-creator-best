import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function GoogleCalendarIntegration() {
  const { user } = useAuth();
  const [integration, setIntegration] = useState<any>(null);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadIntegration = useCallback(async () => {
    if (!user) return;
    const { data: shopData } = await supabase.from('shops').select('id').eq('user_id', user.id).single();
    if (shopData) {
      const { data } = await supabase.from('integrations').select('*').eq('shop_id', shopData.id).eq('type', 'google_calendar').single();
      setIntegration(data);
    }
    setLoading(false);
  }, [user]);

  const loadSyncLogs = useCallback(async () => {
    if (!user) return;
    const { data: shopData } = await supabase.from('shops').select('id').eq('user_id', user.id).single();
    if (shopData) {
      const { data } = await supabase.from('calendar_sync_logs').select('*, bookings(customer_name)').eq('shop_id', shopData.id).order('created_at', { ascending: false }).limit(10);
      setSyncLogs(data || []);
    }
  }, [user]);

  useEffect(() => {
    loadIntegration();
    loadSyncLogs();
  }, [loadIntegration, loadSyncLogs]);

  const initiateOAuth = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('google-oauth-initiate', { body: { userId: user?.id } });
      if (error) throw error;
      if (data?.authUrl) window.location.href = data.authUrl;
    } catch (error) {
      alert('Failed to initiate OAuth');
    }
  };

  const disconnect = async () => {
    if (!integration) return;
    await supabase.from('integrations').update({ connected: false, access_token: null }).eq('id', integration.id);
    loadIntegration();
  };

  const syncAllBookings = async () => {
    setSyncing(true);
    const { data: shopData } = await supabase.from('shops').select('id').eq('user_id', user?.id).single();
    if (shopData) {
      const { data: bookings } = await supabase.from('bookings').select('id').eq('shop_id', shopData.id).eq('status', 'scheduled');
      for (const booking of bookings || []) {
        await supabase.functions.invoke('google-calendar-sync', { body: { bookingId: booking.id, userId: user?.id } });
      }
    }
    await loadSyncLogs();
    setSyncing(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <Calendar className="h-10 w-10 text-blue-600" />
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Google Calendar</h3>
            <p className="text-slate-600 mb-4">Sync booking appointments automatically.</p>
            {integration?.connected ? (
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <XCircle className="h-5 w-5" />
                <span>Not Connected</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {integration?.connected ? (
            <>
              <Button onClick={syncAllBookings} disabled={syncing} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                Sync Now
              </Button>
              <Button onClick={disconnect} variant="destructive">Disconnect</Button>
            </>
          ) : (
            <Button onClick={initiateOAuth} className="bg-blue-600 hover:bg-blue-700">Connect Calendar</Button>
          )}
        </div>
      </div>
      {integration?.connected && syncLogs.length > 0 && (
        <div className="mt-6 border-t pt-6">
          <h4 className="font-semibold text-slate-900 mb-4">Recent Syncs</h4>
          <div className="space-y-2">
            {syncLogs.map(log => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <div className="flex items-center gap-3">
                  {log.status === 'success' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                  <div>
                    <span className="text-sm text-slate-700">{log.bookings?.customer_name || 'Booking'}</span>
                    {log.error_message && <p className="text-xs text-red-600 mt-1">{log.error_message}</p>}
                  </div>
                </div>
                <span className="text-xs text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
