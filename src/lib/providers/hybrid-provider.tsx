'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCartHybrid } from '../hooks/use-cart-hybrid';
import { useWishlistHybrid } from '../hooks/use-wishlist-hybrid';

export type { CartItem } from '../hooks/use-cart-hybrid';

const CartHybridContext = createContext<ReturnType<typeof useCartHybrid> | null>(null);
const WishlistHybridContext = createContext<ReturnType<typeof useWishlistHybrid> | null>(null);

export function HybridProvider({ children }: { children: ReactNode }) {
  const cart = useCartHybrid();
  const wishlist = useWishlistHybrid();

  return (
    <CartHybridContext.Provider value={cart}>
      <WishlistHybridContext.Provider value={wishlist}>
        {children}
      </WishlistHybridContext.Provider>
    </CartHybridContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartHybridContext);
  if (!context) {
    if (typeof window === 'undefined') {
      return {
        state: { items: [], total: 0, count: 0 },
        isLoading: true,
        addItem: () => {},
        removeItem: () => {},
        updateQuantity: () => {},
        clearCart: () => {},
        refreshCart: () => {},
      } as ReturnType<typeof useCartHybrid>;
    }
    throw new Error('useCart must be used within HybridProvider');
  }
  return context;
}

export function useWishlist() {
  const context = useContext(WishlistHybridContext);
  if (!context) {
    if (typeof window === 'undefined') {
      return {
        items: [],
        isLoading: true,
        addToWishlist: () => {},
        removeFromWishlist: () => {},
        isInWishlist: () => false,
        toggleWishlist: () => false,
        refreshWishlist: () => {},
      } as ReturnType<typeof useWishlistHybrid>;
    }
    throw new Error('useWishlist must be used within HybridProvider');
  }
  return context;
}
