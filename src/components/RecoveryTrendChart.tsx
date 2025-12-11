import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const weeklyData = [
  { week: 'Week 1', recoveryRate: 65, recovered: 12, attempted: 18 },
  { week: 'Week 2', recoveryRate: 72, recovered: 18, attempted: 25 },
  { week: 'Week 3', recoveryRate: 68, recovered: 15, attempted: 22 },
  { week: 'Week 4', recoveryRate: 78, recovered: 21, attempted: 27 },
  { week: 'Week 5', recoveryRate: 75, recovered: 24, attempted: 32 },
  { week: 'Week 6', recoveryRate: 82, recovered: 28, attempted: 34 },
  { week: 'Week 7', recoveryRate: 80, recovered: 32, attempted: 40 },
  { week: 'Week 8', recoveryRate: 85, recovered: 34, attempted: 40 },
];

export default function RecoveryTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recovery Rate Trends</CardTitle>
        <CardDescription>Weekly recovery performance over the last 8 weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ recoveryRate: { label: 'Recovery Rate', color: 'hsl(142, 76%, 36%)' } }} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="recoveryRate" stroke="hsl(142, 76%, 36%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
