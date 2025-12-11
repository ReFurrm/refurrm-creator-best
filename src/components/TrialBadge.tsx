import { Badge } from '@/components/ui/badge';
import { Clock, Crown } from 'lucide-react';


interface TrialBadgeProps {
  daysRemaining?: number;
  variant?: 'default' | 'compact';
  isVip?: boolean;
}


export function TrialBadge({ daysRemaining, variant = 'default', isVip }: TrialBadgeProps) {
  // Show VIP badge if user is VIP
  if (isVip) {
    if (variant === 'compact') {
      return (
        <Badge className="ml-2 bg-gradient-to-r from-purple-600 to-pink-600">
          <Crown className="w-3 h-3 mr-1" />
          VIP
        </Badge>
      );
    }
    return (
      <Badge className="text-sm px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600">
        <Crown className="w-4 h-4 mr-1.5" />
        VIP Premium
      </Badge>
    );
  }

  // Show trial badge if user is on trial
  if (daysRemaining !== undefined) {
    const isExpiringSoon = daysRemaining <= 3;
    
    if (variant === 'compact') {
      return (
        <Badge variant={isExpiringSoon ? 'destructive' : 'secondary'} className="ml-2">
          <Clock className="w-3 h-3 mr-1" />
          {daysRemaining}d trial
        </Badge>
      );
    }

    return (
      <Badge 
        variant={isExpiringSoon ? 'destructive' : 'secondary'} 
        className="text-sm px-3 py-1"
      >
        <Clock className="w-4 h-4 mr-1.5" />
        {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left in trial
      </Badge>
    );
  }

  return null;
}
