'use client';

import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { createClient } from '../supabase/client';

interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  user_code: string | null;
}

interface AuthStore {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  loadProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  loadProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name, phone, user_code')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        set({ profile: data });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select('id, email, name, phone, user_code')
        .single();

      if (!error && data) {
        set({ profile: data });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
}));