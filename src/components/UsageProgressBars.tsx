import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Users, Mail, Calendar } from 'lucide-react';

interface UsageLimit {
  label: string;
  current: number;
  limit: number;
  icon: any;
}

interface UsageProgressBarsProps {
  planTier: string;
}

export default function UsageProgressBars({ planTier }: UsageProgressBarsProps) {
  const limits: UsageLimit[] = planTier === 'pro' ? [
    { label: 'Products', current: 45, limit: 100, icon: ShoppingBag },
    { label: 'Customers', current: 234, limit: 1000, icon: Users },
    { label: 'Emails Sent', current: 1250, limit: 5000, icon: Mail },
    { label: 'Bookings', current: 18, limit: 50, icon: Calendar }
  ] : [
    { label: 'Products', current: 8, limit: 10, icon: ShoppingBag },
    { label: 'Customers', current: 45, limit: 100, icon: Users },
    { label: 'Emails Sent', current: 320, limit: 500, icon: Mail },
    { label: 'Bookings', current: 7, limit: 10, icon: Calendar }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Limits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {limits.map((item) => {
          const percentage = (item.current / item.limit) * 100;
          const Icon = item.icon;
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {item.current} / {item.limit}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
