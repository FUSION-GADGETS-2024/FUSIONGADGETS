import { createClient as createBrowserClient } from './client';
import { createClient as createServerClient } from './server';

// Client-side auth functions
export const authClient = {
  // Sign up with email and password
  signUp: async (email: string, password: string, name?: string) => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getUser: async () => {
    const supabase = createBrowserClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session
  getSession: async () => {
    const supabase = createBrowserClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Update user profile
  updateProfile: async (updates: { name?: string; avatar?: string }) => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    });
    return { data, error };
  },

  // Reset password
  resetPassword: async (email: string) => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { data, error };
  },

  // Update password
  updatePassword: async (newPassword: string) => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    const supabase = createBrowserClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  },
};

// Server-side auth functions
export const authServer = {
  // Get current user on server
  getUser: async () => {
    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session on server
  getSession: async () => {
    const supabase = await createServerClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    const { user } = await authServer.getUser();
    return !!user;
  },

  // Get user profile
  getProfile: async (userId: string) => {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },
};

// Helper to check authentication and redirect
export async function requireAuth() {
  const { user } = await authServer.getUser();
  if (!user) {
    return null;
  }
  return user;
}
