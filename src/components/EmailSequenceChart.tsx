import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const emailData = [
  { sequence: 'Day 1 Reminder', sent: 120, recovered: 45, rate: 37.5 },
  { sequence: 'Day 3 Urgent', sent: 75, recovered: 28, rate: 37.3 },
  { sequence: 'Day 7 Final', sent: 47, recovered: 22, rate: 46.8 },
  { sequence: 'Day 10 Offer', sent: 25, recovered: 15, rate: 60.0 },
  { sequence: 'Day 14 Last', sent: 10, recovered: 3, rate: 30.0 },
];

export default function EmailSequenceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Sequence Performance</CardTitle>
        <CardDescription>Recovery rates by email sequence timing</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ rate: { label: 'Recovery Rate', color: 'hsl(221, 83%, 53%)' } }} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={emailData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sequence" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="rate" fill="hsl(221, 83%, 53%)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
