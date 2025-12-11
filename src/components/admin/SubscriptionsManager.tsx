import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Subscription {
  id: number;
  user_id: string;
  plan_type: string;
  status: string;
  current_period_end: string;
  created_at: string;
  profiles?: { email: string };
}

export function SubscriptionsManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [emailDialog, setEmailDialog] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, profiles(email)')
      .order('created_at', { ascending: false });

    if (!error && data) setSubscriptions(data);
  }

  async function updateStatus(id: number, status: string) {
    const { error } = await supabase
      .from('subscriptions')
      .update({ status })
      .eq('id', id);

    if (!error) {
      toast({ title: 'Subscription status updated' });
      fetchSubscriptions();
    }
  }

  async function bulkUpdateStatus(status: string) {
    const ids = Array.from(selected);
    const { error } = await supabase
      .from('subscriptions')
      .update({ status })
      .in('id', ids);

    if (!error) {
      toast({ title: `${ids.length} subscriptions updated` });
      setSelected(new Set());
      fetchSubscriptions();
    }
  }

  function exportToCSV() {
    const items = subscriptions.filter(s => selected.has(s.id));
    const csv = [
      ['ID', 'User ID', 'Plan', 'Status', 'Period End', 'Created'],
      ...items.map(s => [s.id, s.user_id, s.plan_type, s.status, s.current_period_end, s.created_at])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscriptions.csv';
    a.click();
    toast({ title: 'CSV exported' });
  }

  async function sendBulkEmail() {
    const selectedSubs = subscriptions.filter(s => selected.has(s.id));
    const recipients = selectedSubs
      .filter(s => s.profiles?.email)
      .map(s => ({ email: s.profiles!.email }));

    if (recipients.length === 0) {
      toast({ title: 'No valid email addresses found', variant: 'destructive' });
      return;
    }

    const { data, error } = await supabase.functions.invoke('bulk-email-customers', {
      body: { recipients, subject: emailSubject, message: emailMessage }
    });

    if (!error) {
      toast({ title: `Emails sent to ${recipients.length} customers` });
      setEmailDialog(false);
      setEmailSubject('');
      setEmailMessage('');
    } else {
      toast({ title: 'Failed to send emails', variant: 'destructive' });
    }
  }

  const filtered = subscriptions.filter(s => {
    const matchesSearch = s.user_id.includes(search) || s.plan_type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(s => s.id)));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search by user or plan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="past_due">Past Due</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selected.size > 0 && (
        <div className="flex gap-2 flex-wrap">
          <Select onValueChange={bulkUpdateStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Bulk Update Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Set to Active</SelectItem>
              <SelectItem value="cancelled">Set to Cancelled</SelectItem>
              <SelectItem value="past_due">Set to Past Due</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Dialog open={emailDialog} onOpenChange={setEmailDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" /> Email ({selected.size})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Bulk Email</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Subject</Label>
                  <Input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Email subject"
                  />
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Email message"
                    rows={6}
                  />
                </div>
                <Button onClick={sendBulkEmail} className="w-full">
                  Send to {selected.size} customers
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selected.size === filtered.length && filtered.length > 0}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Period End</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell>
                <Checkbox
                  checked={selected.has(sub.id)}
                  onCheckedChange={() => toggleSelect(sub.id)}
                />
              </TableCell>
              <TableCell>#{sub.id}</TableCell>
              <TableCell className="font-mono text-xs">{sub.user_id.slice(0, 8)}...</TableCell>
              <TableCell className="capitalize">{sub.plan_type}</TableCell>
              <TableCell>
                <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                  {sub.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(sub.current_period_end).toLocaleDateString()}</TableCell>
              <TableCell>
                <Select value={sub.status} onValueChange={(val) => updateStatus(sub.id, val)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="past_due">Past Due</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
