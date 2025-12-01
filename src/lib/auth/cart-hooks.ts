'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from './auth-store';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  brand?: string;
}

const CART_STORAGE_KEY = 'fusion_cart';

export function useCart() {
  const { user } = useAuthStore();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        try {
          setCart(JSON.parse(stored));
        } catch (error) {
          console.error('Failed to parse cart:', error);
        }
      }
      setMounted(true);
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      setCart(newCart);
    }
  };

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const quantity = item.quantity || 1;
    const existingIndex = cart.findIndex(i => i.productId === item.productId);
    let newCart: CartItem[];

    if (existingIndex >= 0) {
      newCart = cart.map((i, idx) =>
        idx === existingIndex ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      newCart = [...cart, { ...item, quantity }];
    }

    saveCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(i => i.productId !== productId);
    saveCart(newCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map(i =>
      i.productId === productId ? { ...i, quantity } : i
    );
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items: cart,
    total,
    count,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoading: false,
  };
}