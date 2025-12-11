import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Target, Mail, DollarSign } from 'lucide-react';

export default function DunningMetricsCards() {
  const metrics = [
    {
      title: 'Avg Time to Recovery',
      value: '4.2 days',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Overall Recovery Rate',
      value: '78.5%',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Emails Sent',
      value: '1,247',
      icon: Mail,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Revenue Recovered',
      value: '$18,420',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
