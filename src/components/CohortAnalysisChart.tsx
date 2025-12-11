import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export function CohortAnalysisChart() {
  const [period, setPeriod] = useState('6');

  // Generate cohort data (months 0-5 for retention)
  const cohorts = [
    { month: 'Jan 2025', customers: 245, m0: 100, m1: 68, m2: 52, m3: 45, m4: 41, m5: 38, ltv: 2850 },
    { month: 'Dec 2024', customers: 198, m0: 100, m1: 72, m2: 58, m3: 49, m4: 44, m5: 40, ltv: 3120 },
    { month: 'Nov 2024', customers: 167, m0: 100, m1: 65, m2: 48, m3: 42, m4: 38, m5: 35, ltv: 2640 },
    { month: 'Oct 2024', customers: 223, m0: 100, m1: 70, m2: 55, m3: 47, m4: 43, m5: 39, ltv: 2980 },
    { month: 'Sep 2024', customers: 189, m0: 100, m1: 66, m2: 50, m3: 44, m4: 40, m5: 37, ltv: 2720 },
    { month: 'Aug 2024', customers: 201, m0: 100, m1: 69, m2: 53, m3: 46, m4: 42, m5: 38, ltv: 2890 },
  ];

  const getRetentionColor = (value: number) => {
    if (value >= 70) return 'bg-[#45b08c]'; // Spearmint
    if (value >= 50) return 'bg-[#35b5e6]'; // Turquoise
    if (value >= 35) return 'bg-[#e88098]'; // Hot Pink
    return 'bg-[#255d60]'; // Teal
  };

  const getRetentionOpacity = (value: number) => {
    if (value >= 70) return 'opacity-100';
    if (value >= 50) return 'opacity-80';
    if (value >= 35) return 'opacity-60';
    return 'opacity-40';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cohort Retention Analysis</CardTitle>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 Months</SelectItem>
            <SelectItem value="6">6 Months</SelectItem>
            <SelectItem value="12">12 Months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Cohort</th>
                <th className="text-right p-2 font-semibold">Customers</th>
                <th className="text-center p-2 font-semibold">M0</th>
                <th className="text-center p-2 font-semibold">M1</th>
                <th className="text-center p-2 font-semibold">M2</th>
                <th className="text-center p-2 font-semibold">M3</th>
                <th className="text-center p-2 font-semibold">M4</th>
                <th className="text-center p-2 font-semibold">M5</th>
                <th className="text-right p-2 font-semibold">Avg LTV</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.map((cohort) => (
                <tr key={cohort.month} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{cohort.month}</td>
                  <td className="text-right p-2">{cohort.customers}</td>
                  <td className="p-1">
                    <div className={`${getRetentionColor(cohort.m0)} ${getRetentionOpacity(cohort.m0)} text-white text-center py-2 rounded`}>
                      {cohort.m0}%
                    </div>
                  </td>
                  <td className="p-1">
                    <div className={`${getRetentionColor(cohort.m1)} ${getRetentionOpacity(cohort.m1)} text-white text-center py-2 rounded`}>
                      {cohort.m1}%
                    </div>
                  </td>
                  <td className="p-1">
                    <div className={`${getRetentionColor(cohort.m2)} ${getRetentionOpacity(cohort.m2)} text-white text-center py-2 rounded`}>
                      {cohort.m2}%
                    </div>
                  </td>
                  <td className="p-1">
                    <div className={`${getRetentionColor(cohort.m3)} ${getRetentionOpacity(cohort.m3)} text-white text-center py-2 rounded`}>
                      {cohort.m3}%
                    </div>
                  </td>
                  <td className="p-1">
                    <div className={`${getRetentionColor(cohort.m4)} ${getRetentionOpacity(cohort.m4)} text-white text-center py-2 rounded`}>
                      {cohort.m4}%
                    </div>
                  </td>
                  <td className="p-1">
                    <div className={`${getRetentionColor(cohort.m5)} ${getRetentionOpacity(cohort.m5)} text-white text-center py-2 rounded`}>
                      {cohort.m5}%
                    </div>
                  </td>
                  <td className="text-right p-2 font-medium">${cohort.ltv.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs">
          <span className="font-semibold">Retention Legend:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#45b08c] rounded"></div>
            <span>70%+</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#35b5e6] rounded"></div>
            <span>50-69%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#e88098] rounded"></div>
            <span>35-49%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#255d60] rounded"></div>
            <span>&lt;35%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
