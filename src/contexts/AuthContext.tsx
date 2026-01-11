import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  testMode: boolean;
  testModeAllowed: boolean;
  setTestMode: (enabled: boolean) => void;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [testMode, setTestModeState] = useState(() => {
    const saved = localStorage.getItem('testMode');
    return saved === 'true';
  });
  const testModeAllowed = import.meta.env.VITE_TEST_MODE === 'true';

  const setTestMode = (enabled: boolean) => {
    setTestModeState(enabled);
    localStorage.setItem('testMode', enabled.toString());
  };

  const buildTestUser = (email: string): User =>
    ({
      id: 'test-admin',
      email,
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      role: 'authenticated',
    }) as User;

  useEffect(() => {
    if (testModeAllowed && testMode) {
      console.log('🔐 AuthContext: Test mode enabled, using local admin session.');
      setUser(buildTestUser('admin@example.com'));
      setLoading(false);
      return;
    }

    const startTime = performance.now();
    console.log('🔐 AuthContext: Initializing auth state...');
    
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    if (testModeAllowed && email.toLowerCase() === 'admin@example.com') {
      setTestMode(true);
      setUser(buildTestUser(email));
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const value = {
    user,
    loading,
    testMode,
    testModeAllowed,
    setTestMode,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
