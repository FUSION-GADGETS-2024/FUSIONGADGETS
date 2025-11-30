'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";
import { SearchProvider } from "@/lib/search-context";
import { AuthProvider } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { initializePerformanceOptimizations } from "@/lib/performance";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Optimize query defaults for performance
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors
          if (error && 'status' in error && typeof error.status === 'number') {
            return error.status >= 500 && failureCount < 3;
          }
          return failureCount < 3;
        },
      },
    },
  }));

  useEffect(() => {
    // Initialize performance optimizations on client-side
    initializePerformanceOptimizations();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <SearchProvider>
              {children}
              <Toaster />
              <Sonner />
              <PerformanceMonitor />
            </SearchProvider>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}