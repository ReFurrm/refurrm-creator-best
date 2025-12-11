import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export function CommissionSettings() {
  const [commissionRate, setCommissionRate] = useState('20');
  const [commissionType, setCommissionType] = useState('percentage');
  const [cookieDuration, setCookieDuration] = useState('30');
  const [autoApprove, setAutoApprove] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your commission settings have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Settings</CardTitle>
        <CardDescription>Configure how affiliates earn commissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="commissionRate">Commission Rate</Label>
          <div className="flex gap-2">
            <Input
              id="commissionRate"
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="max-w-[200px]"
            />
            <Select value={commissionType} onValueChange={setCommissionType}>
              <SelectTrigger className="max-w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cookieDuration">Cookie Duration (days)</Label>
          <Input
            id="cookieDuration"
            type="number"
            value={cookieDuration}
            onChange={(e) => setCookieDuration(e.target.value)}
            className="max-w-[200px]"
          />
          <p className="text-sm text-muted-foreground">How long to track referrals</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-approve Affiliates</Label>
            <p className="text-sm text-muted-foreground">Automatically approve new affiliate applications</p>
          </div>
          <Switch checked={autoApprove} onCheckedChange={setAutoApprove} />
        </div>

        <Button onClick={handleSave}>Save Settings</Button>
      </CardContent>
    </Card>
  );
}
