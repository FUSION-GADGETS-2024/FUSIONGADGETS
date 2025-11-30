// Legacy authentication utilities - kept for backward compatibility
// New code should use the Supabase auth context from auth-context.tsx

import { createClient } from './supabase/client';

export const auth = {
  // Check if user is logged in
  isLoggedIn: async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  // Get user name
  getUserName: async (): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.user_metadata?.name || user?.email || null;
  },

  // Login user (deprecated - use authClient.signIn from supabase/auth.ts)
  login: async (userData?: { email: string; password: string }): Promise<void> => {
    if (typeof window === 'undefined') return;
    if (!userData?.email || !userData?.password) return;
    
    const supabase = createClient();
    await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password,
    });
  },

  // Logout user
  logout: async (): Promise<void> => {
    if (typeof window === 'undefined') return;
    const supabase = createClient();
    await supabase.auth.signOut();
  },

  // Get return URL from query params
  getReturnUrl: (): string => {
    if (typeof window === 'undefined') return '/';
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('returnUrl') || '/';
  }
};