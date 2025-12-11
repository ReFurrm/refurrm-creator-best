import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp } from 'lucide-react';

export default function ProfitMarginCalculator() {
  const [cost, setCost] = useState('');
  const [price, setPrice] = useState('');
  const [shipping, setShipping] = useState('');

  const calculateProfit = () => {
    const c = parseFloat(cost) || 0;
    const p = parseFloat(price) || 0;
    const s = parseFloat(shipping) || 0;
    const profit = p - c - s;
    const margin = p > 0 ? ((profit / p) * 100) : 0;
    return { profit, margin };
  };

  const { profit, margin } = calculateProfit();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold">Profit Margin Calculator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Product Cost (from Printify)</Label>
          <Input
            type="number"
            step="0.01"
            value={cost}
            onChange={e => setCost(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div>
          <Label>Selling Price</Label>
          <Input
            type="number"
            step="0.01"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div>
          <Label>Shipping Cost</Label>
          <Input
            type="number"
            step="0.01"
            value={shipping}
            onChange={e => setShipping(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Net Profit</span>
            <span className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${profit.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Profit Margin</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xl font-semibold">{margin.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
