'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { HybridProvider } from "@/lib/providers/hybrid-provider";
import { SearchProvider } from "@/lib/search-context";
import { AuthProvider } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { initializePerformanceOptimizations } from "@/lib/performance";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error && 'status' in error && typeof error.status === 'number') {
            return error.status >= 500 && failureCount < 3;
          }
          return failureCount < 3;
        },
      },
    },
  }));

  useEffect(() => {
    initializePerformanceOptimizations();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <HybridProvider>
            <SearchProvider>
              {children}
              <Toaster />
              <Sonner />
              <PerformanceMonitor />
            </SearchProvider>
          </HybridProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
