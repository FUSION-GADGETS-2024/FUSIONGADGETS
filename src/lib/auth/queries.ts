'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '../supabase/client';
import { useAuthStore } from './auth-store';
import type { Profile } from './auth-store';

// Query keys for consistent caching
export const authKeys = {
  profile: (userId: string) => ['profile', userId] as const,
  cart: (userId: string) => ['cart', userId] as const,
  wishlist: (userId: string) => ['wishlist', userId] as const,
  orders: (userId: string) => ['orders', userId] as const,
} as const;

// Profile queries
export function useProfileQuery() {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: authKeys.profile(user?.id || ''),
    queryFn: async (): Promise<Profile | null> => {
      if (!user) return null;
      
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name, phone, user_code, created_at, updated_at')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const { user, setProfile } = useAuthStore();
  
  return useMutation({
    mutationFn: async (updates: Partial<Profile>): Promise<Profile> => {
      if (!user) throw new Error('No user found');
      
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select('id, email, name, phone, user_code, created_at, updated_at')
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Update cache and store
      queryClient.setQueryData(authKeys.profile(user?.id || ''), data);
      setProfile(data);
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
    },
  });
}

// Cart queries
export function useCartQuery() {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: authKeys.cart(user?.id || ''),
    queryFn: async () => {
      if (!user) return { items: [], total: 0, count: 0 };
      
      const supabase = createClient();
      const { data, error } = await supabase
        .from('cart_items_with_products')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const items = data || [];
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items, total, count };
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      
      if (!response.ok) throw new Error('Failed to add to cart');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate cart query to refetch
      queryClient.invalidateQueries({ queryKey: authKeys.cart(user?.id || '') });
    },
  });
}

export function useRemoveFromCartMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: async (cartItemId: string) => {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId }),
      });
      
      if (!response.ok) throw new Error('Failed to remove from cart');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.cart(user?.id || '') });
    },
  });
}

export function useUpdateCartMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
      const response = await fetch('/api/cart/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      
      if (!response.ok) throw new Error('Failed to update cart');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.cart(user?.id || '') });
    },
  });
}

// Wishlist queries
export function useWishlistQuery() {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: authKeys.wishlist(user?.id || ''),
    queryFn: async () => {
      if (!user) return [];
      
      const supabase = createClient();
      const { data, error } = await supabase
        .from('wishlist_items_with_products')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useAddToWishlistMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      
      if (!response.ok) throw new Error('Failed to add to wishlist');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.wishlist(user?.id || '') });
    },
  });
}

export function useRemoveFromWishlistMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch('/api/wishlist/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      
      if (!response.ok) throw new Error('Failed to remove from wishlist');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.wishlist(user?.id || '') });
    },
  });
}

// Orders query
export function useOrdersQuery() {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: authKeys.orders(user?.id || ''),
    queryFn: async () => {
      if (!user) return [];
      
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (id, name, price, product_images (url))
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

// Utility hooks
export function useIsInWishlist(productId: string) {
  const { data: wishlist = [] } = useWishlistQuery();
  return wishlist.some((item: any) => item.product_id === productId);
}

export function useCartCount() {
  const { data: cart } = useCartQuery();
  return cart?.count || 0;
}

export function useCartTotal() {
  const { data: cart } = useCartQuery();
  return cart?.total || 0;
}