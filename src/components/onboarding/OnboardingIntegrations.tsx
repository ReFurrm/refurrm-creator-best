import { Button } from '@/components/ui/button';
import { Plug, Lightbulb, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingIntegrationsProps {
  onNext: () => void;
  onSkip: () => void;
}

export const OnboardingIntegrations = ({ onNext, onSkip }: OnboardingIntegrationsProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <img 
        src="https://d64gsuwffb70l.cloudfront.net/6924b1f0076ff3ce4a9b699a_1764042311415_64fe353a.webp" 
        alt="Integrations" 
        className="w-full h-48 object-cover rounded-xl" 
      />
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Plug className="w-6 h-6" />
          Connect Integrations
        </h3>
        <p className="text-muted-foreground">
          Connect your favorite tools to automate your workflow
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3">
        <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-900 dark:text-blue-100">
          Tip: Integrations help you sync data, automate tasks, and connect with other platforms 
          you already use.
        </p>
      </div>

      <div className="grid gap-3">
        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg" />
            <div>
              <p className="font-medium">Stripe</p>
              <p className="text-sm text-muted-foreground">Payment processing</p>
            </div>
          </div>
          <Button size="sm" variant="outline">Connect</Button>
        </div>
        
        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg" />
            <div>
              <p className="font-medium">SendGrid</p>
              <p className="text-sm text-muted-foreground">Email delivery</p>
            </div>
          </div>
          <Button size="sm" variant="outline">Connect</Button>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={() => navigate('/integrations')} className="flex-1 gap-2">
          <ExternalLink className="w-4 h-4" />
          View All Integrations
        </Button>
        <Button variant="outline" onClick={onNext}>Continue</Button>
        <Button variant="ghost" onClick={onSkip}>Skip</Button>
      </div>
    </div>
  );
};
