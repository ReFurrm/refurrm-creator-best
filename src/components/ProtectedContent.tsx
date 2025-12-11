import { ReactNode } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedContentProps {
  children: ReactNode;
  productId?: string;
  fallback?: ReactNode;
  requireAnySubscription?: boolean;
}

export function ProtectedContent({ 
  children, 
  productId, 
  fallback,
  requireAnySubscription = false 
}: ProtectedContentProps) {
  const { user } = useAuth();
  const { hasActiveSubscription, hasAccessToProduct, loading } = useSubscription();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <Card className="border-purple-200">
        <CardContent className="p-8 text-center">
          <Lock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Sign In Required</h3>
          <p className="text-gray-600 mb-4">Please sign in to access this content</p>
          <Link to="/login">
            <Button className="bg-purple-600 hover:bg-purple-700">Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const hasAccess = requireAnySubscription 
    ? hasActiveSubscription() 
    : productId 
    ? hasAccessToProduct(productId) 
    : true;

  if (!hasAccess) {
    return fallback || (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Subscription Required</h3>
          <p className="text-gray-600 mb-4">Subscribe to access this premium content</p>
          <Link to="/pricing">

            <Button className="bg-purple-600 hover:bg-purple-700">View Plans</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
