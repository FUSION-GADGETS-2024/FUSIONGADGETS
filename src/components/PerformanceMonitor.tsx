'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  bundleSize?: {
    transfer: number;
    encoded: number;
    decoded: number;
  };
  memory?: {
    used: number;
    total: number;
    limit: number;
  };
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    let clsValue = 0;
    const metricsData: PerformanceMetrics = {};

    // Measure Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      metricsData.lcp = lastEntry.startTime;
      setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Measure First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        const fid = (entry as any).processingStart - entry.startTime;
        metricsData.fid = fid;
        setMetrics(prev => ({ ...prev, fid }));
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Measure Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });
      metricsData.cls = clsValue;
      setMetrics(prev => ({ ...prev, cls: clsValue }));
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Measure bundle size
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const bundleSize = {
        transfer: Math.round(navigation.transferSize / 1024), // KB
        encoded: Math.round(navigation.encodedBodySize / 1024), // KB
        decoded: Math.round(navigation.decodedBodySize / 1024), // KB
      };
      metricsData.bundleSize = bundleSize;
      setMetrics(prev => ({ ...prev, bundleSize }));
    }

    // Monitor memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryData = {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      };
      metricsData.memory = memoryData;
      setMetrics(prev => ({ ...prev, memory: memoryData }));
    }

    // Cleanup observers
    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  // Only render in development
  if (process.env.NODE_ENV !== 'development') return null;

  const getScoreColor = (metric: string, value: number) => {
    switch (metric) {
      case 'lcp':
        return value <= 2500 ? 'text-green-500' : value <= 4000 ? 'text-yellow-500' : 'text-red-500';
      case 'fid':
        return value <= 100 ? 'text-green-500' : value <= 300 ? 'text-yellow-500' : 'text-red-500';
      case 'cls':
        return value <= 0.1 ? 'text-green-500' : value <= 0.25 ? 'text-yellow-500' : 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-black text-white px-3 py-2 rounded-lg text-xs font-mono shadow-lg hover:bg-gray-800 transition-colors"
      >
        {isVisible ? 'Hide' : 'Show'} Perf
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-black text-white p-4 rounded-lg shadow-xl font-mono text-xs min-w-64">
          <h3 className="font-bold mb-2 text-yellow-400">Performance Metrics</h3>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>LCP:</span>
              <span className={metrics.lcp ? getScoreColor('lcp', metrics.lcp) : 'text-gray-400'}>
                {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'Measuring...'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>FID:</span>
              <span className={metrics.fid ? getScoreColor('fid', metrics.fid) : 'text-gray-400'}>
                {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'Waiting...'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>CLS:</span>
              <span className={metrics.cls !== undefined ? getScoreColor('cls', metrics.cls) : 'text-gray-400'}>
                {metrics.cls !== undefined ? metrics.cls.toFixed(3) : 'Measuring...'}
              </span>
            </div>
          </div>

          {metrics.bundleSize && (
            <div className="mt-3 pt-2 border-t border-gray-600">
              <h4 className="font-bold mb-1 text-blue-400">Bundle Size</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Transfer:</span>
                  <span className="text-blue-300">{metrics.bundleSize.transfer}KB</span>
                </div>
                <div className="flex justify-between">
                  <span>Encoded:</span>
                  <span className="text-blue-300">{metrics.bundleSize.encoded}KB</span>
                </div>
                <div className="flex justify-between">
                  <span>Decoded:</span>
                  <span className="text-blue-300">{metrics.bundleSize.decoded}KB</span>
                </div>
              </div>
            </div>
          )}

          {metrics.memory && (
            <div className="mt-3 pt-2 border-t border-gray-600">
              <h4 className="font-bold mb-1 text-purple-400">Memory Usage</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Used:</span>
                  <span className="text-purple-300">{metrics.memory.used}MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="text-purple-300">{metrics.memory.total}MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Limit:</span>
                  <span className="text-purple-300">{metrics.memory.limit}MB</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}