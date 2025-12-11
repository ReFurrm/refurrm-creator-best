import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: number;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
  profiles?: { email: string };
}

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [emailDialog, setEmailDialog] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles(email)')
      .order('created_at', { ascending: false });

    if (!error && data) setOrders(data);
  }

  async function updateStatus(id: number, status: string) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (!error) {
      toast({ title: 'Order status updated' });
      fetchOrders();
    }
  }

  async function bulkUpdateStatus(status: string) {
    const ids = Array.from(selected);
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .in('id', ids);

    if (!error) {
      toast({ title: `${ids.length} orders updated` });
      setSelected(new Set());
      fetchOrders();
    }
  }

  function exportToCSV() {
    const items = orders.filter(o => selected.has(o.id));
    const csv = [
      ['Order ID', 'User ID', 'Status', 'Total', 'Date'],
      ...items.map(o => [o.id, o.user_id, o.status, o.total, o.created_at])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    toast({ title: 'CSV exported' });
  }

  async function sendBulkEmail() {
    const selectedOrders = orders.filter(o => selected.has(o.id));
    const recipients = selectedOrders
      .filter(o => o.profiles?.email)
      .map(o => ({ email: o.profiles!.email }));

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

  const filtered = orders.filter(o => {
    const matchesSearch = o.id.toString().includes(search) || o.user_id.includes(search);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
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
      setSelected(new Set(filtered.map(o => o.id)));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search by order ID or user..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
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
              <SelectItem value="pending">Set to Pending</SelectItem>
              <SelectItem value="processing">Set to Processing</SelectItem>
              <SelectItem value="completed">Set to Completed</SelectItem>
              <SelectItem value="cancelled">Set to Cancelled</SelectItem>
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
            <TableHead>Order ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Checkbox
                  checked={selected.has(order.id)}
                  onCheckedChange={() => toggleSelect(order.id)}
                />
              </TableCell>
              <TableCell>#{order.id}</TableCell>
              <TableCell className="font-mono text-xs">{order.user_id.slice(0, 8)}...</TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Select value={order.status} onValueChange={(val) => updateStatus(order.id, val)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
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
