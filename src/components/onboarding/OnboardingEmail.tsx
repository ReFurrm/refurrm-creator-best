import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Mail, Lightbulb } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface OnboardingEmailProps {
  onNext: () => void;
  onSkip: () => void;
}

export const OnboardingEmail = ({ onNext, onSkip }: OnboardingEmailProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailSettings, setEmailSettings] = useState({
    fromName: '',
    enableWelcome: true,
    enableOrderConfirm: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    // Save to user_profiles
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ 
        email_from_name: emailSettings.fromName,
      })
      .eq('id', user.id);

    // Save email template preferences
    const { error: settingsError } = await supabase
      .from('email_settings')
      .upsert({
        user_id: user.id,
        from_name: emailSettings.fromName,
        enable_welcome_email: emailSettings.enableWelcome,
        enable_order_confirmation: emailSettings.enableOrderConfirm,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    setLoading(false);
    if (profileError) {
      toast.error('Failed to save email settings');
      return;
    }
    if (settingsError) {
      toast.warning('Email preferences saved partially. You can finish this in Settings.');
      onNext();
      return;
    }

    toast.success('Email settings saved!');
    onNext();
  };


  return (
    <div className="space-y-6">
      <img 
        src="https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764042312587_e702b6a9.webp" 
        alt="Email Campaign" 
        className="w-full h-48 object-cover rounded-xl" 
      />
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="w-6 h-6" />
          Configure Email Settings
        </h3>
        <p className="text-muted-foreground">
          Set up how your emails will appear to customers
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3">
        <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-900 dark:text-blue-100">
          Tip: Use your brand name so customers recognize your emails!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>From Name</Label>
          <Input 
            value={emailSettings.fromName} 
            onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})} 
            placeholder="Your Store Name"
            required 
          />
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label>Welcome emails</Label>
            <Switch checked={emailSettings.enableWelcome} 
              onCheckedChange={(v) => setEmailSettings({...emailSettings, enableWelcome: v})} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Order confirmations</Label>
            <Switch checked={emailSettings.enableOrderConfirm} 
              onCheckedChange={(v) => setEmailSettings({...emailSettings, enableOrderConfirm: v})} />
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading} className="flex-1">
            Save & Continue
          </Button>
          <Button type="button" variant="outline" onClick={onSkip}>Skip</Button>
        </div>
      </form>
    </div>
  );
};
