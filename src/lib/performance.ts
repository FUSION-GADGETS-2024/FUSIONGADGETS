/**
 * Performance optimization utilities for resource prioritization and preloading
 */

// Critical resources that should be preloaded
export const CRITICAL_RESOURCES = {
  // Hero background image for homepage
  HERO_BG: '/assets/hero-bg.jpg',
  // Common product images
  PLACEHOLDER: '/placeholder.svg',
  // Critical fonts (if using custom fonts)
  FONTS: [],
} as const;

// Resource hints for different types of content
export const RESOURCE_HINTS = {
  // DNS prefetch for external domains
  DNS_PREFETCH: [
    'https://images.unsplash.com',
  ],
  // Preconnect for critical external resources
  PRECONNECT: [],
  // Prefetch for likely next navigation
  PREFETCH: [
    '/products',
    '/categories',
  ],
} as const;

/**
 * Preload critical resources for better performance
 */
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  // Preload hero background image
  const heroImg = new Image();
  heroImg.src = CRITICAL_RESOURCES.HERO_BG;

  // Preload placeholder image
  const placeholderImg = new Image();
  placeholderImg.src = CRITICAL_RESOURCES.PLACEHOLDER;
}

/**
 * Add resource hints to document head
 */
export function addResourceHints() {
  if (typeof window === 'undefined') return;

  // DNS prefetch
  RESOURCE_HINTS.DNS_PREFETCH.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });

  // Preconnect
  RESOURCE_HINTS.PRECONNECT.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
  });

  // Prefetch likely next pages
  RESOURCE_HINTS.PREFETCH.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    document.head.appendChild(link);
  });
}

/**
 * Lazy load images with intersection observer
 */
export function setupLazyLoading() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01,
  });

  // Observe all images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });

  return imageObserver;
}

/**
 * Optimize bundle loading with dynamic imports
 */
export const dynamicImports = {
  // Lazy load search results component
  SearchResults: () => import('@/components/SearchResults').then(mod => ({ default: mod.SearchResults })),
  
  // Lazy load category filter for product pages
  CategoryFilter: () => import('@/components/CategoryFilter').then(mod => ({ default: mod.CategoryFilter })),
  
  // Lazy load review components for product details
  ReviewCard: () => import('@/components/ReviewCard').then(mod => ({ default: mod.ReviewCard })),
  
  // Lazy load authentication components
  AuthComponents: () => import('@/lib/auth').then(mod => ({ default: mod.auth })),
} as const;

/**
 * Performance monitoring utilities
 */
export const performanceMonitoring = {
  // Measure and log Core Web Vitals
  measureCoreWebVitals() {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        const fidEntry = entry as any; // Type assertion for FID entry
        console.log('FID:', fidEntry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        const clsEntry = entry as any; // Type assertion for CLS entry
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value;
        }
      });
      console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  },

  // Measure bundle sizes
  measureBundleSize() {
    if (typeof window === 'undefined') return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    console.log('Bundle transfer size:', navigation.transferSize);
    console.log('Bundle encoded size:', navigation.encodedBodySize);
    console.log('Bundle decoded size:', navigation.decodedBodySize);
  },

  // Monitor memory usage
  monitorMemoryUsage() {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    const memory = (performance as any).memory;
    console.log('Memory usage:', {
      used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB',
    });
  },
};

/**
 * Initialize performance optimizations
 */
export function initializePerformanceOptimizations() {
  if (typeof window === 'undefined') return;

  // Preload critical resources
  preloadCriticalResources();
  
  // Add resource hints
  addResourceHints();
  
  // Setup lazy loading
  setupLazyLoading();
  
  // Register service worker for caching (production only)
  if (process.env.NODE_ENV === 'production') {
    import('./service-worker').then(({ registerServiceWorker }) => {
      registerServiceWorker();
    });
  }
  
  // Start performance monitoring in development
  if (process.env.NODE_ENV === 'development') {
    performanceMonitoring.measureCoreWebVitals();
    performanceMonitoring.measureBundleSize();
    performanceMonitoring.monitorMemoryUsage();
  }
}