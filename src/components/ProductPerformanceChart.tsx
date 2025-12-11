import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductPerformanceChartProps {
  data: Array<{ name: string; revenue: number; orders: number; views?: number }>;
}

export default function ProductPerformanceChart({ data }: ProductPerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue ($)" />
            <Bar dataKey="orders" fill="#06b6d4" name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
