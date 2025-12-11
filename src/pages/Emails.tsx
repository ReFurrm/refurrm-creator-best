import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from '@/components/DashboardNav';
import AIEmailGenerator from '@/components/AIEmailGenerator';
import { Sparkles } from 'lucide-react';

export default function Emails() {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [email, setEmail] = useState({ subject: '', body: '' });


  useEffect(() => {
    loadSubscribers();
  }, [user]);

  const loadSubscribers = async () => {
    if (!user) return;

    const { data: shopData } = await supabase
      .from('shops')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (shopData) {
      const { data } = await supabase
        .from('email_subscribers')
        .select('*')
        .eq('shop_id', shopData.id)
        .order('subscribed_at', { ascending: false });

      setSubscribers(data || []);
    }

    setLoading(false);
  };

  const sendBroadcast = async () => {
    if (!email.subject || !email.body) {
      alert('Please fill in subject and body');
      return;
    }

    // In production, this would call an edge function to send emails
    alert(`Email broadcast sent to ${subscribers.length} subscribers!`);
    setShowCompose(false);
    setEmail({ subject: '', body: '' });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardNav />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Email Subscribers</h2>
            <button
              onClick={() => setShowCompose(!showCompose)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              {showCompose ? 'Cancel' : 'Send Broadcast'}
            </button>
          </div>

          {showCompose && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-900">Compose Email</h3>
                <button onClick={() => setShowAI(true)} className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50">
                  <Sparkles className="w-4 h-4" />
                  AI Generate
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={email.subject}
                    onChange={(e) => setEmail({ ...email, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Body</label>
                  <textarea
                    value={email.body}
                    onChange={(e) => setEmail({ ...email, body: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg h-48"
                  />
                </div>
                <button
                  onClick={sendBroadcast}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Send to {subscribers.length} Subscribers
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-slate-600">Loading subscribers...</p>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-slate-200">
                <p className="text-slate-600">
                  <strong>{subscribers.length}</strong> total subscribers
                  {' '}({subscribers.filter(s => s.is_buyer).length} buyers)
                </p>
              </div>
              <div className="divide-y divide-slate-200">
                {subscribers.map(subscriber => (
                  <div key={subscriber.id} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-900">{subscriber.email}</p>
                      {subscriber.name && (
                        <p className="text-sm text-slate-600">{subscriber.name}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {subscriber.is_buyer && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Buyer</span>
                      )}
                      <span className="text-sm text-slate-500">
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <AIEmailGenerator open={showAI} onClose={() => setShowAI(false)} onApply={(data) => setEmail({ subject: data.subjectLines?.[0] || '', body: data.emailBody || '' })} />
      </div>
    </div>
  );
}
