import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

const abTests = [
  {
    id: 1,
    name: 'Subject Line: Urgent vs Friendly',
    variantA: { name: 'Urgent Tone', rate: 68, sent: 150 },
    variantB: { name: 'Friendly Tone', rate: 75, sent: 150 },
    winner: 'B',
    improvement: 10.3
  },
  {
    id: 2,
    name: 'Discount Offer: 20% vs 30%',
    variantA: { name: '20% Discount', rate: 55, sent: 120 },
    variantB: { name: '30% Discount', rate: 62, sent: 120 },
    winner: 'B',
    improvement: 12.7
  },
  {
    id: 3,
    name: 'Email Timing: Morning vs Evening',
    variantA: { name: 'Morning (9AM)', rate: 72, sent: 180 },
    variantB: { name: 'Evening (6PM)', rate: 68, sent: 180 },
    winner: 'A',
    improvement: 5.9
  }
];

export default function ABTestResults() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>A/B Test Results</CardTitle>
        <CardDescription>Dunning strategy experiments and outcomes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {abTests.map((test) => (
          <div key={test.id} className="border rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-3">{test.name}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded ${test.winner === 'A' ? 'bg-green-50 border border-green-200' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Variant A</span>
                  {test.winner === 'A' && <Badge className="bg-green-600">Winner</Badge>}
                </div>
                <p className="text-xs text-slate-600 mb-2">{test.variantA.name}</p>
                <p className="text-2xl font-bold">{test.variantA.rate}%</p>
              </div>
              <div className={`p-3 rounded ${test.winner === 'B' ? 'bg-green-50 border border-green-200' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Variant B</span>
                  {test.winner === 'B' && <Badge className="bg-green-600">Winner</Badge>}
                </div>
                <p className="text-xs text-slate-600 mb-2">{test.variantB.name}</p>
                <p className="text-2xl font-bold">{test.variantB.rate}%</p>
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{test.improvement}% improvement</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
