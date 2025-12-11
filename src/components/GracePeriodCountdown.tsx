import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface GracePeriodCountdownProps {
  gracePeriodEnd: string;
  onExpired?: () => void;
}

export default function GracePeriodCountdown({ gracePeriodEnd, onExpired }: GracePeriodCountdownProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(gracePeriodEnd).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        onExpired?.();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setIsUrgent(days < 2);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [gracePeriodEnd, onExpired]);

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
      isUrgent ? 'bg-red-50 border-red-300' : 'bg-yellow-50 border-yellow-300'
    }`}>
      <AlertTriangle className={`w-6 h-6 ${isUrgent ? 'text-red-600' : 'text-yellow-600'}`} />
      <div>
        <p className={`font-semibold ${isUrgent ? 'text-red-900' : 'text-yellow-900'}`}>
          Grace Period: {timeLeft} remaining
        </p>
        <p className={`text-sm ${isUrgent ? 'text-red-700' : 'text-yellow-700'}`}>
          Update your payment method to avoid service interruption
        </p>
      </div>
    </div>
  );
}
