import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wand2, Music, GraduationCap, Briefcase, Palette, Rocket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const businessTypes = [
  { id: 'artist', name: 'Artist/Musician', icon: Music, color: 'text-purple-500' },
  { id: 'entrepreneur', name: 'Entrepreneur', icon: Rocket, color: 'text-orange-500' },
  { id: 'coach', name: 'Coach/Consultant', icon: GraduationCap, color: 'text-blue-500' },
  { id: 'creator', name: 'Content Creator', icon: Palette, color: 'text-pink-500' },
  { id: 'consultant', name: 'Business Consultant', icon: Briefcase, color: 'text-green-500' },
];

export function SetupWizard() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const runSetup = async (businessType: string) => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('seed-account-data', {
      body: { businessType }
    });
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ 
        title: 'Setup Complete!', 
        description: `Created ${data.productsCount} products, ${data.customersCount} customers, and more.` 
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          One-Click Setup Wizard
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Automatically populate your account with sample data based on your business type
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {businessTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card key={type.id} className="p-4 hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`h-6 w-6 ${type.color}`} />
                  <h4 className="font-semibold">{type.name}</h4>
                </div>
                <Button 
                  onClick={() => runSetup(type.id)} 
                  disabled={loading}
                  className="w-full"
                >
                  Setup as {type.name}
                </Button>
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
