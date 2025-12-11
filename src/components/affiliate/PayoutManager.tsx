import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PayoutManager() {
  const { toast } = useToast();
  const [payouts, setPayouts] = useState([
    { id: 1, affiliate: 'Sarah Johnson', amount: 890.50, status: 'pending', date: '2024-01-15' },
    { id: 2, affiliate: 'Mike Chen', amount: 640.00, status: 'pending', date: '2024-01-15' },
    { id: 3, affiliate: 'Emma Davis', amount: 560.00, status: 'paid', date: '2024-01-01' },
    { id: 4, affiliate: 'James Wilson', amount: 380.00, status: 'paid', date: '2024-01-01' },
  ]);

  const handlePayout = (id: number) => {
    setPayouts(payouts.map(p => 
      p.id === id ? { ...p, status: 'paid' } : p
    ));
    toast({
      title: "Payout processed",
      description: "The affiliate has been paid.",
    });
  };

  const totalPending = payouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-4">${totalPending.toFixed(2)}</div>
          <Button>
            <DollarSign className="w-4 h-4 mr-2" />
            Process All Payouts
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Affiliate</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-medium">{payout.affiliate}</TableCell>
                  <TableCell>${payout.amount.toFixed(2)}</TableCell>
                  <TableCell>{payout.date}</TableCell>
                  <TableCell>
                    <Badge variant={payout.status === 'paid' ? 'default' : 'secondary'}>
                      {payout.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {payout.status === 'pending' && (
                      <Button size="sm" onClick={() => handlePayout(payout.id)}>
                        <Check className="w-4 h-4 mr-1" />
                        Pay
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
