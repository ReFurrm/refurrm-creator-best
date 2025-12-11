import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: string;
  invoiceUrl: string;
}

export default function BillingHistoryTable() {
  const invoices: Invoice[] = [
    { id: 'INV-001', date: '2024-11-01', amount: 29.00, status: 'paid', invoiceUrl: '#' },
    { id: 'INV-002', date: '2024-10-01', amount: 29.00, status: 'paid', invoiceUrl: '#' },
    { id: 'INV-003', date: '2024-09-01', amount: 29.00, status: 'paid', invoiceUrl: '#' },
    { id: 'INV-004', date: '2024-08-01', amount: 29.00, status: 'paid', invoiceUrl: '#' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={invoice.status === 'paid' ? 'default' : 'destructive'}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
