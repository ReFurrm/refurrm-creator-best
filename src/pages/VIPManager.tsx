import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Crown, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function VIPManager() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const grantVIPAccess = async () => {
    if (!email) {
      setResult({ type: 'error', message: 'Please enter an email address' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('grant-vip-access', {
        body: { email }
      });

      if (error) throw error;

      setResult({ 
        type: 'success', 
        message: data.message || `VIP access granted to ${email}` 
      });
      setEmail('');
    } catch (error: any) {
      setResult({ 
        type: 'error', 
        message: error.message || 'Failed to grant VIP access' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8 text-purple-600" />
            <div>
              <CardTitle>VIP Access Manager</CardTitle>
              <CardDescription>
                Grant unlimited premium access to special users
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                User Email Address
              </label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && grantVIPAccess()}
              />
            </div>

            <Button 
              onClick={grantVIPAccess} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Granting Access...
                </>
              ) : (
                <>
                  <Crown className="mr-2 h-4 w-4" />
                  Grant VIP Access
                </>
              )}
            </Button>
          </div>

          {result && (
            <Alert variant={result.type === 'error' ? 'destructive' : 'default'}>
              {result.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">VIP Benefits</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Unlimited products, customers, and bookings</li>
              <li>• Unlimited email campaigns and AI tools</li>
              <li>• All premium features completely free</li>
              <li>• Special VIP badge throughout the platform</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
