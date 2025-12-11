import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SalesForecastChartProps {
  data: Array<{ 
    month: string; 
    actual?: number; 
    forecast?: number;
    lower?: number;
    upper?: number;
  }>;
}

export default function SalesForecastChart({ data }: SalesForecastChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Forecast (Next 3 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#8b5cf6" strokeWidth={2} name="Actual Revenue" />
            <Line type="monotone" dataKey="forecast" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
