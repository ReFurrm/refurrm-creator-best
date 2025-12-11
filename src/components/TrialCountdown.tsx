import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

interface TrialCountdownProps {
  trialEndDate: string;
  currentPlan: string;
}

export function TrialCountdown({ trialEndDate, currentPlan }: TrialCountdownProps) {
  const now = new Date();
  const endDate = new Date(trialEndDate);
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60));
  const progressValue = ((14 - daysRemaining) / 14) * 100;
  
  const isExpiringSoon = daysRemaining <= 3;

  return (
    <Card className={isExpiringSoon ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className={isExpiringSoon ? 'text-red-600' : 'text-blue-600'} />
          {currentPlan} Trial Active
        </CardTitle>
        <CardDescription>
          {daysRemaining > 0 
            ? `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining (${hoursRemaining} hours)`
            : 'Trial expires today!'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progressValue} className="h-2" />
        <p className="text-sm text-muted-foreground">
          Your trial ends on {endDate.toLocaleDateString()} at {endDate.toLocaleTimeString()}
        </p>
        <Button asChild className="w-full" variant={isExpiringSoon ? 'destructive' : 'default'}>
          <Link to="/pricing">
            <Zap className="w-4 h-4 mr-2" />
            Upgrade Now to Keep Access
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
