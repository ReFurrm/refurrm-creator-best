import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { performanceMonitor } from '@/lib/performance';
import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState(performanceMonitor.getMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const apiCalls = metrics.filter(m => m.type === 'api-call');
  const errors = metrics.filter(m => m.type === 'error');
  const pageLoads = metrics.filter(m => m.type === 'page-load');
  
  const avgApiTime = apiCalls.length > 0
    ? apiCalls.reduce((sum, m) => sum + (m.duration || 0), 0) / apiCalls.length
    : 0;
  
  const avgPageLoad = pageLoads.length > 0
    ? pageLoads.reduce((sum, m) => sum + (m.duration || 0), 0) / pageLoads.length
    : 0;

  const errorRate = metrics.length > 0 ? (errors.length / metrics.length) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg API Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgApiTime.toFixed(0)}ms</div>
          <p className="text-xs text-muted-foreground">{apiCalls.length} calls tracked</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg Page Load</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgPageLoad.toFixed(0)}ms</div>
          <p className="text-xs text-muted-foreground">{pageLoads.length} pages tracked</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{errorRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">{errors.length} errors</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Metrics</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.length}</div>
          <p className="text-xs text-muted-foreground">Last 1000 events</p>
        </CardContent>
      </Card>
    </div>
  );
}
