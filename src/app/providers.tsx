'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SearchProvider } from "@/lib/search-context";
import { useAuth } from "@/lib/auth/index";
import { useState, useEffect } from "react";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAuth(state => state.initialize);
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}

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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthInitializer>
          <SearchProvider>
            {children}
            <Toaster />
            <Sonner />
          </SearchProvider>
        </AuthInitializer>
      </TooltipProvider>
    </QueryClientProvider>
  );
}