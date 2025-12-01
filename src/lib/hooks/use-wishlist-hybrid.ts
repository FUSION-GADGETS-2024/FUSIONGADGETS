'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth-context';
import { createClient } from '../supabase/client';

const WISHLIST_KEY = 'fusion_wishlist';

export function useWishlistHybrid() {
  const { user } = useAuth();
  const [items, setItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlist = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    try {
      if (user) {
        // Authenticated: Load from Supabase
        const supabase = createClient();
        const { data: wishlist } = await supabase
          .from('wishlists')
          .select('wishlist_items (product_id)')
          .eq('user_id', user.id)
          .single();

        if (wishlist?.wishlist_items) {
          const productIds = wishlist.wishlist_items.map((item: any) => item.product_id);
          setItems(productIds);
        }
      } else {
        // Guest: Load from localStorage
        const stored = localStorage.getItem(WISHLIST_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setItems(Array.isArray(parsed) ? parsed : []);
        }
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Realtime sync for authenticated users
  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    const channel = supabase
      .channel('wishlist_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wishlist_items' },
        () => loadWishlist()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadWishlist]);

  const addToWishlist = useCallback(async (productId: string) => {
    if (user) {
      // Authenticated: Save to Supabase
      const supabase = createClient();
      let { data: wishlist } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!wishlist) {
        const { data: newWishlist } = await supabase
          .from('wishlists')
          .insert({ user_id: user.id })
          .select('id')
          .single();
        wishlist = newWishlist;
      }

      if (wishlist) {
        await supabase
          .from('wishlist_items')
          .insert({ wishlist_id: wishlist.id, product_id: productId })
          .select();
      }
      await loadWishlist();
    } else {
      // Guest: Save to localStorage
      setItems(prev => {
        if (prev.includes(productId)) return prev;
        const newItems = [...prev, productId];
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(newItems));
        return newItems;
      });
    }
  }, [user, loadWishlist]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (user) {
      // Authenticated: Remove from Supabase
      const supabase = createClient();
      await supabase.from('wishlist_items').delete().eq('product_id', productId);
      await loadWishlist();
    } else {
      // Guest: Remove from localStorage
      setItems(prev => {
        const newItems = prev.filter(id => id !== productId);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(newItems));
        return newItems;
      });
    }
  }, [user, loadWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return items.includes(productId);
  }, [items]);

  const toggleWishlist = useCallback(async (productId: string) => {
    const isCurrently = items.includes(productId);
    if (isCurrently) {
      await removeFromWishlist(productId);
      return false;
    } else {
      await addToWishlist(productId);
      return true;
    }
  }, [items, addToWishlist, removeFromWishlist]);

  return {
    items,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    refreshWishlist: loadWishlist,
  };
}
