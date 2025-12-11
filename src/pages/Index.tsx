import React, { useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';

const Index: React.FC = () => {
  useEffect(() => {
    console.log('📄 Index: Page loaded');
  }, []);

  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
};

export default Index;
