import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, Lightbulb } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface OnboardingStorefrontProps {
  onNext: () => void;
  onSkip: () => void;
}

export const OnboardingStorefront = ({ onNext, onSkip }: OnboardingStorefrontProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        store_name: storeName,
        store_url: storeName.toLowerCase().replace(/\s+/g, '-')
      })
      .eq('id', user.id);

    setLoading(false);
    if (error) {
      toast.error('Failed to save store settings');
    } else {
      toast.success('Store settings saved!');
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <img 
        src="https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764042310071_3ce236d5.webp" 
        alt="Storefront" 
        className="w-full h-48 object-cover rounded-xl" 
      />
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Store className="w-6 h-6" />
          Name Your Store
        </h3>
        <p className="text-muted-foreground">
          Choose a name for your online store
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3">
        <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-900 dark:text-blue-100">
          Tip: Choose a memorable name that represents your brand. You can change it later!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Store Name</Label>
          <Input 
            value={storeName} 
            onChange={(e) => setStoreName(e.target.value)} 
            placeholder="My Awesome Store"
            required 
          />
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
