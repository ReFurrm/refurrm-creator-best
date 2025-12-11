import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Send, Calendar, BarChart3 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function EmailCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [abTest, setAbTest] = useState(false);
  const [variantB, setVariantB] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  useEffect(() => {
    loadCampaigns();
    loadTemplates();
  }, []);

  const loadCampaigns = async () => {
    const { data } = await supabase.from('email_campaigns').select('*, email_templates(name)').order('created_at', { ascending: false });
    setCampaigns(data || []);
  };

  const loadTemplates = async () => {
    const { data } = await supabase.from('email_templates').select('*');
    setTemplates(data || []);
  };

  const handleCreate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const campaignData = {
      user_id: user.id,
      name,
      subject,
      template_id: templateId,
      ab_test_enabled: abTest,
      variant_b_subject: abTest ? variantB : null,
      scheduled_at: scheduledAt || null,
      status: 'draft'
    };

    await supabase.from('email_campaigns').insert(campaignData);
    toast.success('Campaign created');
    setName('');
    setSubject('');
    setTemplateId('');
    setAbTest(false);
    setVariantB('');
    setScheduledAt('');
    loadCampaigns();
  };

  const handleSend = async (id: string) => {
    await supabase.from('email_campaigns').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', id);
    toast.success('Campaign sent');
    loadCampaigns();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Email Campaigns</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Create Campaign</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>Campaign Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Template</Label><Select value={templateId} onValueChange={setTemplateId}><SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger><SelectContent>{templates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Subject Line</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
          <div><Label>Schedule (optional)</Label><Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} /></div>
          <div className="flex items-center gap-2"><Switch checked={abTest} onCheckedChange={setAbTest} /><Label>Enable A/B Testing</Label></div>
          {abTest && <div><Label>Variant B Subject</Label><Input value={variantB} onChange={(e) => setVariantB(e.target.value)} /></div>}
        </div>
        <Button onClick={handleCreate} className="mt-4"><Send className="h-4 w-4 mr-2" />Create Campaign</Button>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">All Campaigns</h2>
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Subject</TableHead><TableHead>Status</TableHead><TableHead>Opens</TableHead><TableHead>Clicks</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {campaigns.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.subject}</TableCell>
                <TableCell><span className={`px-2 py-1 rounded text-xs ${c.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{c.status}</span></TableCell>
                <TableCell>{c.opens}</TableCell>
                <TableCell>{c.clicks}</TableCell>
                <TableCell className="flex gap-2">
                  {c.status === 'draft' && <Button size="sm" onClick={() => handleSend(c.id)}><Send className="h-4 w-4 mr-1" />Send</Button>}
                  <Button size="sm" variant="outline"><BarChart3 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
