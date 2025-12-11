import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, MousePointerClick } from 'lucide-react';

export function AffiliateStats() {
  const stats = [
    { label: 'Active Affiliates', value: '24', icon: Users, change: '+3 this month' },
    { label: 'Total Sales', value: '$12,450', icon: DollarSign, change: '+18% from last month' },
    { label: 'Clicks', value: '3,842', icon: MousePointerClick, change: '+12% from last month' },
    { label: 'Conversion Rate', value: '4.2%', icon: TrendingUp, change: '+0.8% from last month' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
