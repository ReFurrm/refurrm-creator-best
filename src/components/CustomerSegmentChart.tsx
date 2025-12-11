import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface CustomerSegmentChartProps {
  data: {
    segment: string;
    count: number;
    revenue: number;
    color: string;
  }[];
}

export default function CustomerSegmentChart({ data }: CustomerSegmentChartProps) {
  const maxRevenue = Math.max(...data.map(d => d.revenue));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#45b08c]" />
          Customer Segments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((segment) => (
            <div key={segment.segment}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{segment.segment}</span>
                <span className="text-sm text-slate-600">{segment.count} customers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-8 bg-[#F5F5F5] rounded overflow-hidden">
                  <div
                    className="h-full flex items-center px-2 text-white text-sm font-medium"
                    style={{
                      width: `${(segment.revenue / maxRevenue) * 100}%`,
                      backgroundColor: segment.color,
                      minWidth: '60px'
                    }}
                  >
                    ${segment.revenue.toFixed(0)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
