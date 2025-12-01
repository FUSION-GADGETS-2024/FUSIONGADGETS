'use client';

import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '../supabase/client';

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  user_code: string | null;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;
    
    const supabase = createClient();
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        set({ user: session.user, session });
        
        // Load profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, name, phone, user_code')
          .eq('id', session.user.id)
          .single();
        
        if (profile) set({ profile });
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        set({ user: session?.user || null, session });

        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, email, name, phone, user_code')
            .eq('id', session.user.id)
            .single();
          
          if (profile) set({ profile });
        } else if (event === 'SIGNED_OUT') {
          get().clearAuth();
        }
      });

      set({ initialized: true });
    } catch (error) {
      console.error('Auth error:', error);
      set({ initialized: true });
    }
  },

  signIn: async (email: string, password: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  },

  signUp: async (email: string, password: string, name?: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name || email.split('@')[0] } }
    });

    if (!error && data.user) {
      try {
        const userCode = 'FG' + Math.random().toString(36).substr(2, 6).toUpperCase();
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          name: name || email.split('@')[0],
          user_code: userCode
        });
        await supabase.from('wishlists').insert({ user_id: data.user.id });
      } catch (setupError) {
        console.error('Setup error:', setupError);
      }
    }
    return { error };
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    get().clearAuth();
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const { user } = get();
    if (!user) return { error: new Error('No user found') };

    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('id, email, name, phone, user_code')
      .single();

    if (!error && data) set({ profile: data });
    return { error };
  },

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  
  clearAuth: () => set({ 
    user: null, 
    session: null, 
    profile: null
  }),
}));

export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    session: store.session,
    profile: store.profile,
    loading: store.loading,
    initialized: store.initialized,
    signIn: store.signIn,
    signUp: store.signUp,
    signOut: store.signOut,
    updateProfile: store.updateProfile,
  };
};

export const useProfile = () => {
  const { profile, updateProfile } = useAuthStore();
  return { profile, updateProfile };
};