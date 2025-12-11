import { useEffect, useRef } from 'react';
import { performanceMonitor } from '@/lib/performance';

export function usePageLoadTime(pageName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      performanceMonitor.logMetric({
        type: 'page-load',
        name: pageName,
        duration,
      });
    };
  }, [pageName]);
}

export function useComponentRenderTime(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());
  
  useEffect(() => {
    renderCount.current++;
    const duration = performance.now() - startTime.current;
    
    performanceMonitor.logMetric({
      type: 'component-render',
      name: componentName,
      duration,
      metadata: { renderCount: renderCount.current },
    });
    
    startTime.current = performance.now();
  });
}

export async function measureApiCall<T>(
  name: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;
    
    performanceMonitor.logMetric({
      type: 'api-call',
      name,
      duration,
      metadata: { success: true },
    });
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    
    performanceMonitor.logMetric({
      type: 'error',
      name,
      duration,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: { apiCall: true },
    });
    
    throw error;
  }
}
