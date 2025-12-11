import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardNav from '@/components/DashboardNav';
import DunningMetricsCards from '@/components/DunningMetricsCards';
import RecoveryTrendChart from '@/components/RecoveryTrendChart';
import EmailSequenceChart from '@/components/EmailSequenceChart';
import ABTestResults from '@/components/ABTestResults';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, TrendingUp, Users, DollarSign } from 'lucide-react';

interface DunningStats {
  atRisk: number;
  recovered: number;
  lost: number;
  recoveryRate: number;
  totalAtRisk: number;
}

export default function Dunning() {
  const [stats, setStats] = useState<DunningStats>({
    atRisk: 0,
    recovered: 0,
    lost: 0,
    recoveryRate: 0,
    totalAtRisk: 0
  });
  const [atRiskSubs, setAtRiskSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDunningData();
  }, []);

  const loadDunningData = async () => {
    try {
      // Get at-risk subscriptions (past_due)
      const { data: pastDue } = await supabase
        .from('profiles')
        .select('*')
        .eq('subscription_status', 'past_due');

      // Calculate stats (mock data for demo)
      const atRiskCount = pastDue?.length || 0;
      const recovered = 12;
      const lost = 3;
      const total = atRiskCount + recovered + lost;
      const recoveryRate = total > 0 ? (recovered / total) * 100 : 0;

      setStats({
        atRisk: atRiskCount,
        recovered,
        lost,
        recoveryRate,
        totalAtRisk: atRiskCount * 29
      });

      setAtRiskSubs(pastDue || []);
    } catch (error) {
      console.error('Error loading dunning data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardNav />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Dunning Management</h2>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="at-risk">At-Risk Subscriptions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{stats.atRisk}</p>
                  <p className="text-slate-600">At Risk</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{stats.recoveryRate.toFixed(1)}%</p>
                  <p className="text-slate-600">Recovery Rate</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{stats.recovered}</p>
                  <p className="text-slate-600">Recovered</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900">${stats.totalAtRisk}</p>
                  <p className="text-slate-600">At Risk MRR</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <DunningMetricsCards />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecoveryTrendChart />
                <EmailSequenceChart />
              </div>

              <ABTestResults />
            </TabsContent>

            <TabsContent value="at-risk">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold text-slate-900">At-Risk Subscriptions</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Attempts</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Grace Period</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {atRiskSubs.map((sub) => (
                        <tr key={sub.id}>
                          <td className="px-6 py-4 text-sm text-slate-900">{sub.email}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-700">
                              Past Due
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-900">{sub.payment_attempts || 1}/3</td>
                          <td className="px-6 py-4 text-sm text-slate-900">
                            {sub.grace_period_end ? new Date(sub.grace_period_end).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-900">$29.00</td>
                        </tr>
                      ))}
                      {atRiskSubs.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                            No at-risk subscriptions
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

