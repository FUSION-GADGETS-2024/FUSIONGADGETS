'use client';

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SearchProvider } from "@/lib/search-context";
import { AuthProvider } from "@/lib/auth/auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <AuthProvider>
        <SearchProvider>
          {children}
          <Toaster />
          <Sonner />
        </SearchProvider>
      </AuthProvider>
    </TooltipProvider>
  );
}