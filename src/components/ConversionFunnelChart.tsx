import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FunnelData {
  visitors: number;
  productViews: number;
  addToCart: number;
  checkout: number;
  completed: number;
}

interface ConversionFunnelChartProps {
  data: FunnelData;
}

export default function ConversionFunnelChart({ data }: ConversionFunnelChartProps) {
  const stages = [
    { label: 'Visitors', value: data.visitors, color: 'bg-purple-500' },
    { label: 'Product Views', value: data.productViews, color: 'bg-purple-600' },
    { label: 'Add to Cart', value: data.addToCart, color: 'bg-purple-700' },
    { label: 'Checkout', value: data.checkout, color: 'bg-purple-800' },
    { label: 'Completed', value: data.completed, color: 'bg-purple-900' },
  ];

  const maxValue = data.visitors || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const percentage = maxValue ? ((stage.value / maxValue) * 100).toFixed(1) : 0;
            const conversionRate = index > 0 && stages[index - 1].value > 0
              ? ((stage.value / stages[index - 1].value) * 100).toFixed(1)
              : 100;

            return (
              <div key={stage.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{stage.label}</span>
                  <span className="text-sm text-slate-600">{stage.value} ({percentage}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-8 relative">
                  <div 
                    className={`${stage.color} h-8 rounded-full flex items-center justify-end px-3 text-white text-sm font-semibold`}
                    style={{ width: `${percentage}%` }}
                  >
                    {index > 0 && <span>{conversionRate}%</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
