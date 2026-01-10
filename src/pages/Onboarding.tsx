import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, CheckCircle2 } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingWelcome } from '@/components/onboarding/OnboardingWelcome';
import { OnboardingProduct } from '@/components/onboarding/OnboardingProduct';
import { OnboardingStorefront } from '@/components/onboarding/OnboardingStorefront';
import { OnboardingIntegrations } from '@/components/onboarding/OnboardingIntegrations';
import { OnboardingEmail } from '@/components/onboarding/OnboardingEmail';

const STEPS = [
  { id: 0, title: 'Welcome', component: OnboardingWelcome },
  { id: 1, title: 'Product', component: OnboardingProduct },
  { id: 2, title: 'Storefront', component: OnboardingStorefront },
  { id: 3, title: 'Integrations', component: OnboardingIntegrations },
  { id: 4, title: 'Email', component: OnboardingEmail },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { progress, updateStep, completeOnboarding, startOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (progress) {
      setCurrentStep(progress.current_step);
      setStarted(true);
    }
  }, [progress]);

  const handleStart = async () => {
    await startOnboarding();
    setStarted(true);
    setCurrentStep(1);
  };

  const handleNext = async () => {
    if (currentStep > 0) {
      await updateStep(currentStep + 1);
    }
    
    if (currentStep === STEPS.length - 1) {
      await completeOnboarding();
      navigate('/store-builder');

    } else {
      setCurrentStep(currentStep + 1);
    }

  };

  const handleSkip = async () => {
    if (currentStep > 0) {
      await updateStep(currentStep + 1);
    }
    
    if (currentStep === STEPS.length - 1) {
      await completeOnboarding();
      navigate('/dashboard');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };


  const handleExit = async () => {
    await completeOnboarding();
    navigate('/dashboard');
  };

  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;
  const CurrentStepComponent = STEPS[currentStep].component;

  if (currentStep === STEPS.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-2xl p-8 text-center space-y-6">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764042313486_922a051f.webp" 
            alt="Success" 
            className="w-full h-64 object-cover rounded-xl" 
          />
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
          <h2 className="text-3xl font-bold">You're All Set!</h2>
          <p className="text-lg text-muted-foreground">
            Your account is ready. Let's start building your business!
          </p>
          <Button size="lg" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {started && (
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {STEPS.length}
                </p>
                <h1 className="text-2xl font-bold">{STEPS[currentStep].title}</h1>
              </div>
              <Button variant="ghost" size="icon" onClick={handleExit}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        <Card className="p-8">
          {currentStep === 0 ? (
            <OnboardingWelcome onStart={handleStart} />
          ) : (
            <CurrentStepComponent onNext={handleNext} onSkip={handleSkip} />
          )}
        </Card>
      </div>
    </div>
  );
}
