import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface OnboardingWelcomeProps {
  onStart: () => void;
}

export const OnboardingWelcome = ({ onStart }: OnboardingWelcomeProps) => {
  return (
    <div className="text-center space-y-6">
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-8">
        <img
          src="https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764042306409_9f581606.webp"
          alt="Welcome"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            Let's Get Started
          </span>
        </div>
        
        <h2 className="text-3xl font-bold">Welcome to Your Platform!</h2>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We'll guide you through setting up your first product, customizing your storefront, 
          connecting integrations, and launching your first email campaign. This will only take 
          a few minutes!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button size="lg" onClick={onStart} className="gap-2">
          <Sparkles className="w-4 h-4" />
          Start Setup
        </Button>
      </div>
    </div>
  );
};
