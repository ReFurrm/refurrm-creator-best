import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface GeographicDistributionChartProps {
  data: {
    location: string;
    customers: number;
    revenue: number;
  }[];
}

export default function GeographicDistributionChart({ data }: GeographicDistributionChartProps) {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#35b5e6]" />
          Geographic Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((location, index) => {
            const percentage = ((location.revenue / totalRevenue) * 100).toFixed(1);
            const colors = ['#45b08c', '#e88098', '#35b5e6', '#255d60', '#F8DD50'];
            
            return (
              <div key={location.location} className="flex items-center gap-3">
                <div className="w-32 text-sm font-medium truncate">{location.location}</div>
                <div className="flex-1 h-6 bg-[#F5F5F5] rounded-full overflow-hidden">
                  <div
                    className="h-full flex items-center justify-end px-2 text-white text-xs font-medium"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: colors[index % colors.length],
                      minWidth: percentage !== '0.0' ? '50px' : '0'
                    }}
                  >
                    {percentage}%
                  </div>
                </div>
                <div className="w-20 text-sm text-slate-600 text-right">
                  ${location.revenue.toFixed(0)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
