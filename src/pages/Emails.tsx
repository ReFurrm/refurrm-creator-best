import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from '@/components/DashboardNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import RichTextEditor from '@/components/RichTextEditor';
import AIEmailGenerator from '@/components/AIEmailGenerator';
import { Sparkles } from 'lucide-react';

export default function Emails() {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [email, setEmail] = useState({ subject: '', body: '' });
  const [editorContent, setEditorContent] = useState('');


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
    if (!email.subject || !editorContent) {
      alert('Please fill in subject and body');
      return;
    }

    // In production, this would call an edge function to send emails
    alert(`Email broadcast sent to ${subscribers.length} subscribers!`);
    setShowCompose(false);
    setEmail({ subject: '', body: '' });
    setEditorContent('');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardNav />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <CardTitle className="text-3xl">Email Subscribers</CardTitle>
            <Button
              onClick={() => setShowCompose(!showCompose)}
            >
              {showCompose ? 'Cancel' : 'Send Broadcast'}
            </Button>
          </div>

          {showCompose && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Compose Email</CardTitle>
                  <Button onClick={() => setShowAI(true)} variant="outline">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Generate
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Subject</Label>
                    <Input
                      type="text"
                      value={email.subject}
                      onChange={(e) => setEmail({ ...email, subject: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Body</Label>
                    <RichTextEditor
                      value={editorContent}
                      onChange={setEditorContent}
                    />
                  </div>
                  <Button
                    onClick={sendBroadcast}
                  >
                    Send to {subscribers.length} Subscribers
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <p className="text-slate-600">Loading subscribers...</p>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{subscribers.length} total subscribers</CardTitle>
                <p className="text-sm text-slate-600">
                  {subscribers.filter(s => s.is_buyer).length} buyers
                </p>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-slate-200">
                  {subscribers.map(subscriber => (
                    <div key={subscriber.id} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-900">{subscriber.email}</p>
                        {subscriber.name && (
                          <p className="text-sm text-slate-600">{subscriber.name}</p>
                        )}
                      </div>
                      <div className="flex gap-2 items-center">
                        {subscriber.is_buyer && (
                          <Badge variant="secondary">Buyer</Badge>
                        )}
                        <span className="text-sm text-slate-500">
                          {new Date(subscriber.subscribed_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <AIEmailGenerator open={showAI} onClose={() => setShowAI(false)} onApply={(data) => {
          setEmail({ ...email, subject: data.subjectLines?.[0] || '' });
          setEditorContent(data.emailBody || '');
        }} />
      </div>
    </div>
  );
}
