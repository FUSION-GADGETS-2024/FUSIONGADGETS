'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from './auth-store';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}