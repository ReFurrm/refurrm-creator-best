import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { performanceMonitor } from '@/lib/performance';
import { usePageLoadTime } from '@/hooks/usePerformance';


export default function Health() {
  usePageLoadTime('health-page');

  const { user } = useAuth();
  const [status, setStatus] = useState<any>({
    connection: 'checking',
    tables: [],
    auth: 'checking',
    errors: []
  });

  const checkHealth = async () => {
    const errors: string[] = [];
    let connection = 'disconnected';
    let tables: string[] = [];

    try {
      // Test connection
      const { data, error } = await supabase.from('products').select('count');
      if (error) {
        errors.push(`Products table: ${error.message}`);
      } else {
        connection = 'connected';
      }

      // Try to list tables
      const tableTests = ['products', 'orders', 'subscriptions', 'affiliates', 'profiles'];
      for (const table of tableTests) {
        try {
          const { error } = await supabase.from(table).select('*').limit(1);
          if (!error) tables.push(table);
        } catch (e) {
          errors.push(`${table}: ${e}`);
        }
      }
    } catch (e: any) {
      errors.push(`Connection error: ${e.message}`);
    }

    setStatus({
      connection,
      tables,
      auth: user ? 'authenticated' : 'anonymous',
      errors,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'NOT SET',
      timestamp: new Date().toISOString()
    });
  };

  useEffect(() => {
    checkHealth();
  }, [user]);

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Health Check</h1>
        <Button onClick={checkHealth}>Refresh</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={status.connection === 'connected' ? 'default' : 'destructive'}>
            {status.connection}
          </Badge>
          <p className="mt-2 text-sm text-gray-600">URL: {status.supabaseUrl}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge>{status.auth}</Badge>
          {user && <p className="mt-2 text-sm">User ID: {user.id}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Tables ({status.tables.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {status.tables.map((table: string) => (
              <Badge key={table} variant="outline">{table}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {status.errors.length > 0 && (
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-600">Errors ({status.errors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {status.errors.map((err: string, i: number) => (
                <li key={i} className="text-red-600">{err}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>Total metrics tracked: {performanceMonitor.getMetrics().length}</p>
            <p>API calls: {performanceMonitor.getMetricsByType('api-call').length}</p>
            <p>Errors: {performanceMonitor.getMetricsByType('error').length}</p>
            <p>Page loads: {performanceMonitor.getMetricsByType('page-load').length}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                performanceMonitor.clearMetrics();
                alert('Performance metrics cleared');
              }}
              className="mt-2"
            >
              Clear Metrics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

  );
}
