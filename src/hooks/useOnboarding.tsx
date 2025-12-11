import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface OnboardingProgress {
  current_step: number;
  completed_steps: number[];
  skipped_steps: number[];
  is_completed: boolean;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('onboarding_step, onboarding_completed')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching onboarding:', error);
    } else if (data) {
      setProgress({
        current_step: data.onboarding_step || 0,
        completed_steps: [],
        skipped_steps: [],
        is_completed: data.onboarding_completed || false
      });
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  const startOnboarding = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('user_profiles')
      .update({ onboarding_step: 1 })
      .eq('id', user.id);

    if (!error) fetchProgress();
  };

  const updateStep = async (step: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_profiles')
      .update({ onboarding_step: step + 1 })
      .eq('id', user.id);

    if (!error) fetchProgress();
  };

  const completeOnboarding = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        onboarding_completed: true,
        onboarding_step: 5
      })
      .eq('id', user.id);

    if (!error) fetchProgress();
  };

  return {
    progress,
    loading,
    startOnboarding,
    updateStep,
    completeOnboarding,
    needsOnboarding: !loading && user && progress && !progress.is_completed
  };
};
