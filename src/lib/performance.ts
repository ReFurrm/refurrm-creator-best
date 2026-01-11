// Performance monitoring utility
import { logger } from '@/lib/logger';

export interface PerformanceMetric {
  id: string;
  type: 'page-load' | 'component-render' | 'api-call' | 'error';
  name: string;
  duration?: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
  error?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000;

  logMetric(metric: Omit<PerformanceMetric, 'id' | 'timestamp'>) {
    const fullMetric: PerformanceMetric = {
      ...metric,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };
    
    this.metrics.push(fullMetric);
    
    // Keep only last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
    
    logger.info(
      `[Performance] ${metric.type}: ${metric.name}`,
      metric.duration ? `${metric.duration}ms` : '',
      metric.metadata || ''
    );
    
    // Store in localStorage for persistence
    this.saveToStorage();
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getMetricsByType(type: PerformanceMetric['type']): PerformanceMetric[] {
    return this.metrics.filter(m => m.type === type);
  }

  clearMetrics() {
    this.metrics = [];
    localStorage.removeItem('performance-metrics');
  }

  private saveToStorage() {
    try {
      localStorage.setItem('performance-metrics', JSON.stringify(this.metrics.slice(-100)));
    } catch (e) {
      logger.warn('Failed to save metrics to storage');
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('performance-metrics');
      if (stored) {
        this.metrics = JSON.parse(stored);
      }
    } catch (e) {
      logger.warn('Failed to load metrics from storage');
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
performanceMonitor.loadFromStorage();
