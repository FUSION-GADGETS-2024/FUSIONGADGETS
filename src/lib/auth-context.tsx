'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from './supabase/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { name?: string; avatar?: string }) => Promise<{ error: any }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const refreshUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }, [supabase.auth]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // On sign in, merge guest cart and wishlist
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Merge cart
          await fetch('/api/cart/merge', { method: 'POST' });
          
          // Merge wishlist from localStorage
          const localWishlist = localStorage.getItem('fusion_gadgets_wishlist');
          if (localWishlist) {
            const productIds = JSON.parse(localWishlist);
            for (const productId of productIds) {
              await fetch('/api/wishlist/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
              });
            }
            // Clear local wishlist after merge
            localStorage.removeItem('fusion_gadgets_wishlist');
          }
        } catch (error) {
          console.error('Failed to merge data on login:', error);
        }
      }
      
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    });
    
    // Create profile and wishlist manually after successful signup
    if (!error && data.user) {
      try {
        const userCode = 'FG' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        // Create profile
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          name: name || email.split('@')[0],
          user_code: userCode
        });
        
        // Create wishlist
        await supabase.from('wishlists').insert({
          user_id: data.user.id
        });
      } catch (setupError) {
        console.error('Failed to setup user data:', setupError);
      }
    }
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Clear local storage on logout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fusion_gadgets_cart');
      localStorage.removeItem('fusion_gadgets_wishlist');
    }
    router.push('/');
  };

  const updateProfile = async (updates: { name?: string; avatar?: string }) => {
    const { error } = await supabase.auth.updateUser({
      data: updates,
    });
    
    if (!error) {
      await refreshUser();
    }
    
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  // Return default values if context is not available (SSR or outside provider)
  if (context === undefined) {
    return {
      user: null,
      session: null,
      loading: true,
      signIn: async () => ({ error: new Error('Auth not initialized') }),
      signUp: async () => ({ error: new Error('Auth not initialized') }),
      signOut: async () => {},
      updateProfile: async () => ({ error: new Error('Auth not initialized') }),
      refreshUser: async () => {},
    };
  }
  
  return context;
}
