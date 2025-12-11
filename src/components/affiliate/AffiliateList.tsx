import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function AffiliateList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAffiliates(data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (affiliateId: string, approved: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.functions.invoke('approve-affiliate', {
        body: { affiliateId, approved, adminUserId: user?.id }
      });

      if (error) throw error;

      toast({
        title: approved ? 'Affiliate Approved' : 'Affiliate Rejected',
        description: approved ? 'Welcome email sent to affiliate' : 'Application rejected'
      });

      fetchAffiliates();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const filteredAffiliates = affiliates.filter(a => 
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Affiliates</CardTitle>
          <Button onClick={() => window.location.href = '/affiliate-signup'}>
            <UserPlus className="w-4 h-4 mr-2" />Invite Affiliate
          </Button>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search affiliates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
            ) : filteredAffiliates.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center">No affiliates found</TableCell></TableRow>
            ) : (
              filteredAffiliates.map((affiliate) => (
                <TableRow key={affiliate.id}>
                  <TableCell className="font-medium">{affiliate.name}</TableCell>
                  <TableCell>{affiliate.email}</TableCell>
                  <TableCell className="font-mono text-sm">{affiliate.affiliate_code}</TableCell>
                  <TableCell>
                    <Badge variant={
                      affiliate.status === 'active' ? 'default' :
                      affiliate.status === 'pending' ? 'secondary' : 'destructive'
                    }>
                      {affiliate.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {affiliate.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(affiliate.id, true)}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleApprove(affiliate.id, false)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

