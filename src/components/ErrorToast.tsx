import { useEffect } from 'react';
import { toast } from 'sonner';
import { AlertCircle, WifiOff, Lock, Database } from 'lucide-react';

interface ErrorToastProps {
  error: Error | null;
  onRetry?: () => void;
}

export function ErrorToast({ error, onRetry }: ErrorToastProps) {
  useEffect(() => {
    if (!error) return;

    const message = error.message || 'An error occurred';
    let icon = <AlertCircle className="h-4 w-4" />;
    let description = 'Please try again';

    if (message.includes('network') || message.includes('fetch')) {
      icon = <WifiOff className="h-4 w-4" />;
      description = 'Check your internet connection';
    } else if (message.includes('auth') || message.includes('unauthorized')) {
      icon = <Lock className="h-4 w-4" />;
      description = 'Please log in again';
    } else if (message.includes('database') || message.includes('query')) {
      icon = <Database className="h-4 w-4" />;
      description = 'Database error occurred';
    }

    toast.error(message, {
      description,
      action: onRetry ? {
        label: 'Retry',
        onClick: onRetry
      } : undefined,
      icon
    });
  }, [error, onRetry]);

  return null;
}
