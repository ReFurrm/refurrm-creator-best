import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function VIPManager() {
  const [email, setEmail] = useState('');
  const [vipUsers, setVipUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadVIPUsers();
  }, []);

  const loadVIPUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_vip', true)
      .order('created_at', { ascending: false });
    setVipUsers(data || []);
  };

  const grantVIP = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.functions.invoke('grant-vip-access', {
      body: { email, grant: true }
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `VIP access granted to ${email}` });
      setEmail('');
      loadVIPUsers();
    }
    setLoading(false);
  };

  const revokeVIP = async (userEmail: string) => {
    const { error } = await supabase.functions.invoke('grant-vip-access', {
      body: { email: userEmail, grant: false }
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `VIP access revoked` });
      loadVIPUsers();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Grant VIP Access
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && grantVIP()}
          />
          <Button onClick={grantVIP} disabled={loading || !email}>
            <Plus className="h-4 w-4 mr-2" />
            Grant VIP
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current VIP Users ({vipUsers.length})</h3>
        <div className="space-y-2">
          {vipUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Crown className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Since {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => revokeVIP(user.email)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {vipUsers.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No VIP users yet</p>
          )}
        </div>
      </Card>
    </div>
  );
}
