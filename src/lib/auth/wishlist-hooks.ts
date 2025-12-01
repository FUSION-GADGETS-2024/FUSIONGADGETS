'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from './auth-store';

const WISHLIST_STORAGE_KEY = 'fusion_wishlist';

export function useWishlist() {
  const { user } = useAuthStore();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        try {
          setWishlist(JSON.parse(stored));
        } catch (error) {
          console.error('Failed to parse wishlist:', error);
        }
      }
      setMounted(true);
    }
  }, []);

  const saveWishlist = (newWishlist: string[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newWishlist));
      setWishlist(newWishlist);
    }
  };

  const addToWishlist = (productId: string) => {
    if (!wishlist.includes(productId)) {
      const newWishlist = [...wishlist, productId];
      saveWishlist(newWishlist);
    }
  };

  const removeFromWishlist = (productId: string) => {
    const newWishlist = wishlist.filter(id => id !== productId);
    saveWishlist(newWishlist);
  };

  const toggleWishlist = (productId: string) => {
    const isInWishlist = wishlist.includes(productId);
    
    if (isInWishlist) {
      removeFromWishlist(productId);
      return false;
    } else {
      addToWishlist(productId);
      return true;
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  return {
    items: [],
    productIds: wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    isLoading: false,
  };
}