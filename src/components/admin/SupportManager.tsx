import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Ticket {
  id: number;
  user_id: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
}

export function SupportManager() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setTickets(data);
  }

  async function updateStatus(id: number, status: string) {
    const { error } = await supabase
      .from('support_tickets')
      .update({ status })
      .eq('id', id);

    if (!error) {
      toast({ title: 'Ticket status updated' });
      fetchTickets();
    }
  }

  const filtered = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search tickets..."
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
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>#{ticket.id}</TableCell>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>
                <Badge variant={ticket.priority === 'high' ? 'destructive' : 'secondary'}>
                  {ticket.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'}>
                  {ticket.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Select value={ticket.status} onValueChange={(val) => updateStatus(ticket.id, val)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
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
