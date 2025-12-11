import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function AffiliateEarnings() {
  const earnings = [
    { id: 1, date: '2024-01-20', customer: 'John D.', product: 'Premium Course', commission: 45.00, status: 'paid' },
    { id: 2, date: '2024-01-19', customer: 'Sarah M.', product: 'Digital Art Pack', commission: 28.50, status: 'paid' },
    { id: 3, date: '2024-01-18', customer: 'Mike K.', product: 'Coaching Session', commission: 60.00, status: 'pending' },
    { id: 4, date: '2024-01-17', customer: 'Emma L.', product: 'E-book Bundle', commission: 22.00, status: 'pending' },
    { id: 5, date: '2024-01-16', customer: 'David R.', product: 'Workshop Access', commission: 85.00, status: 'paid' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {earnings.map((earning) => (
              <TableRow key={earning.id}>
                <TableCell>{earning.date}</TableCell>
                <TableCell>{earning.customer}</TableCell>
                <TableCell>{earning.product}</TableCell>
                <TableCell className="font-semibold">${earning.commission.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={earning.status === 'paid' ? 'default' : 'secondary'}>
                    {earning.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
