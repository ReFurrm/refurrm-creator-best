import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { performanceMonitor } from '@/lib/performance';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

export function SlowQueriesTable() {
  const [metrics, setMetrics] = useState(performanceMonitor.getMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const apiCalls = metrics
    .filter(m => m.type === 'api-call' && m.duration)
    .sort((a, b) => (b.duration || 0) - (a.duration || 0))
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Slowest API Calls</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>API Call</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiCalls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No API calls tracked yet
                </TableCell>
              </TableRow>
            ) : (
              apiCalls.map((metric) => (
                <TableRow key={metric.id}>
                  <TableCell className="font-medium">{metric.name}</TableCell>
                  <TableCell>
                    <Badge variant={(metric.duration || 0) > 1000 ? 'destructive' : 'secondary'}>
                      {metric.duration?.toFixed(0)}ms
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={metric.metadata?.success ? 'default' : 'destructive'}>
                      {metric.metadata?.success ? 'Success' : 'Failed'}
                    </Badge>
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
