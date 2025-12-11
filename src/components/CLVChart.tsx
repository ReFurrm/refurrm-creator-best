import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CLVChartProps {
  data: Array<{ month: string; clv: number; avgOrders: number }>;
  averageCLV: number;
}

export default function CLVChart({ data, averageCLV }: CLVChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Customer Lifetime Value</CardTitle>
          <div className="text-right">
            <p className="text-sm text-slate-600">Average CLV</p>
            <p className="text-2xl font-bold text-purple-600">${averageCLV.toFixed(2)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="clv" stroke="#8b5cf6" strokeWidth={2} name="CLV ($)" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
