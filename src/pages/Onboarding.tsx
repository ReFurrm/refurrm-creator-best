import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const CREATOR_TYPES = [
  'Coach', 'Consultant', 'Designer', 'Educator', 
  'Fitness Creator', 'Spiritual Reader', 'Artist', 'Other'
];

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Other'];

const PRICE_RANGES = [
  { value: 'low', label: 'Low ticket (under $50)' },
  { value: 'mid', label: 'Mid ticket ($50-$300)' },
  { value: 'high', label: 'High ticket ($300+)' }
];

const BRAND_VIBES = ['Minimal', 'Cozy', 'Luxury', 'Playful', 'Bold', 'Professional'];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    creatorType: '',
    currentSells: '',
    platform: '',
    priceRange: '',
    brandVibe: '',
    customVibe: ''
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const { data: aiData, error: aiError } = await supabase.functions.invoke('ai-store-generator', {
        body: {
          creatorType: formData.creatorType,
          whatToSell: formData.currentSells,
          primaryPlatform: formData.platform,
          priceRange: formData.priceRange,
          brandVibe: formData.customVibe || formData.brandVibe
        }
      });

      if (aiError) throw aiError;

      const { data: shopData } = await supabase
        .from('shops')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (shopData && aiData.starterProducts) {
        for (const product of aiData.starterProducts) {
          await supabase.from('products').insert({
            shop_id: shopData.id,
            name: product.name,
            description: product.description,
            price: product.suggestedPrice,
            type: product.type,
            status: 'draft'
          });
        }
      }
      
      toast({
        title: "Store created!",
        description: `AI generated ${aiData.starterProducts?.length || 0} starter products for you.`,
      });
      navigate('/store-builder');
    } catch (error) {
      toast({
        title: "Setup failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Set Up Your Creator Store
          </CardTitle>
          <CardDescription>
            Step {step} of 5 - AI will create your perfect store
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <Label className="text-lg">What type of creator are you?</Label>
              <RadioGroup 
                value={formData.creatorType}
                onValueChange={(value) => setFormData({...formData, creatorType: value})}
              >
                {CREATOR_TYPES.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type} className="cursor-pointer">{type}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label htmlFor="sells" className="text-lg">
                What do you currently sell, or want to sell?
              </Label>
              <Textarea
                id="sells"
                placeholder="E.g., 1-on-1 coaching sessions, digital templates, online courses..."
                value={formData.currentSells}
                onChange={(e) => setFormData({...formData, currentSells: e.target.value})}
                className="min-h-[120px]"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Label className="text-lg">What is your primary platform?</Label>
              <RadioGroup 
                value={formData.platform}
                onValueChange={(value) => setFormData({...formData, platform: value})}
              >
                {PLATFORMS.map(platform => (
                  <div key={platform} className="flex items-center space-x-2">
                    <RadioGroupItem value={platform} id={platform} />
                    <Label htmlFor={platform} className="cursor-pointer">{platform}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <Label className="text-lg">What is your typical price range?</Label>
              <RadioGroup 
                value={formData.priceRange}
                onValueChange={(value) => setFormData({...formData, priceRange: value})}
              >
                {PRICE_RANGES.map(range => (
                  <div key={range.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={range.value} id={range.value} />
                    <Label htmlFor={range.value} className="cursor-pointer">
                      {range.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <Label className="text-lg">What is your brand vibe?</Label>
              <div className="grid grid-cols-2 gap-3">
                {BRAND_VIBES.map(vibe => (
                  <Button
                    key={vibe}
                    type="button"
                    variant={formData.brandVibe === vibe ? "default" : "outline"}
                    onClick={() => setFormData({...formData, brandVibe: vibe})}
                    className="justify-start"
                  >
                    {vibe}
                  </Button>
                ))}
              </div>
              <Input
                placeholder="Or describe your own vibe..."
                value={formData.customVibe}
                onChange={(e) => setFormData({...formData, customVibe: e.target.value})}
              />
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {step < 5 ? (
              <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleFinish}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI Creating Your Store...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create My Store
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
