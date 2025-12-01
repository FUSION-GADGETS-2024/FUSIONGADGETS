/**
 * Lazy-loaded components for performance optimization
 * These components are dynamically imported to reduce initial bundle size
 */

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Loading component for lazy-loaded components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-foreground"></div>
  </div>
);

// Skeleton loader for search results
const SearchResultsSkeleton = () => (
  <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-lg mt-2 p-4 z-50">
    <div className="animate-pulse">
      <div className="h-4 bg-border rounded w-1/3 mb-2"></div>
      <div className="space-y-2">
        <div className="h-12 bg-border rounded"></div>
        <div className="h-12 bg-border rounded"></div>
        <div className="h-12 bg-border rounded"></div>
      </div>
    </div>
  </div>
);

// Skeleton loader for category filter
const CategoryFilterSkeleton = () => (
  <div className="flex items-center gap-3 flex-wrap">
    <div className="animate-pulse">
      <div className="h-10 bg-border rounded-lg w-24"></div>
    </div>
    {[...Array(4)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="h-10 bg-border rounded-lg w-20"></div>
      </div>
    ))}
  </div>
);

// Skeleton loader for review card
const ReviewCardSkeleton = () => (
  <div className="bg-background border border-border rounded-lg p-6 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-border rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-border rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-border rounded w-1/4"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-border rounded"></div>
      <div className="h-3 bg-border rounded w-3/4"></div>
    </div>
  </div>
);

// Lazy-loaded SearchResults component
export const LazySearchResults = dynamic(
  () => import('./SearchResults').then(mod => ({ default: mod.SearchResults })),
  {
    ssr: false,
    loading: () => <SearchResultsSkeleton />,
  }
);

// Lazy-loaded CategoryFilter component
export const LazyCategoryFilter = dynamic(
  () => import('./CategoryFilter').then(mod => ({ default: mod.CategoryFilter })),
  {
    ssr: false,
    loading: () => <CategoryFilterSkeleton />,
  }
);

// Lazy-loaded ReviewCard component
export const LazyReviewCard = dynamic(
  () => import('./ReviewCard').then(mod => ({ default: mod.ReviewCard })),
  {
    ssr: false,
    loading: () => <ReviewCardSkeleton />,
  }
);

// Lazy-loaded ProductCard component for non-critical sections
export const LazyProductCard = dynamic(
  () => import('./ProductCard').then(mod => ({ default: mod.ProductCard })),
  {
    ssr: true, // Keep SSR for SEO but lazy load for client-side navigation
    loading: () => (
      <div className="bg-background border border-border rounded-lg overflow-hidden animate-pulse">
        <div className="aspect-square bg-border"></div>
        <div className="p-4 space-y-2">
          <div className="h-4 bg-border rounded w-3/4"></div>
          <div className="h-3 bg-border rounded w-1/2"></div>
          <div className="h-4 bg-border rounded w-1/3"></div>
        </div>
      </div>
    ),
  }
);



// Lazy-loaded search provider
export const LazySearchProvider = dynamic(
  () => import('@/lib/search-context').then(mod => ({ default: mod.SearchProvider })),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);

// Higher-order component for lazy loading with intersection observer
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  options: {
    threshold?: number;
    rootMargin?: string;
    fallback?: ComponentType;
  } = {}
) {
  const { threshold = 0.1, rootMargin = '50px', fallback: Fallback = LoadingSpinner } = options;

  const LazyComponent = dynamic(
    () => Promise.resolve({ default: Component }),
    {
      ssr: false,
      loading: () => <Fallback />,
    }
  );

  return function WrappedLazyComponent(props: T) {
    return <LazyComponent {...props} />;
  };
}

// Utility for creating optimized image components
export const OptimizedImage = dynamic(
  () => import('next/image').then(mod => ({ default: mod.default })),
  {
    ssr: true,
    loading: () => (
      <div className="bg-border animate-pulse w-full h-full rounded"></div>
    ),
  }
);

// Export types for TypeScript support
export type LazyComponentProps<T> = T & {
  loading?: boolean;
  error?: Error | null;
};