'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth-context';
import { createClient } from '../supabase/client';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  brand?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  count: number;
}

const CART_KEY = 'fusion_cart';

function calculateTotals(items: CartItem[]) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, count };
}

export function useCartHybrid() {
  const { user } = useAuth();
  const [state, setState] = useState<CartState>({ items: [], total: 0, count: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const loadCart = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    try {
      if (user) {
        // Authenticated: Load from Supabase
        const supabase = createClient();
        const { data: cart } = await supabase
          .from('carts')
          .select(`
            cart_items (
              id,
              product_id,
              quantity,
              products (id, name, price, product_images (url))
            )
          `)
          .eq('user_id', user.id)
          .single();

        if (cart?.cart_items) {
          const items: CartItem[] = cart.cart_items.map((item: any) => ({
            id: item.id,
            productId: item.product_id,
            name: item.products?.name || '',
            price: item.products?.price || 0,
            image: item.products?.product_images?.[0]?.url || '/placeholder.svg',
            quantity: item.quantity,
          }));
          const { total, count } = calculateTotals(items);
          setState({ items, total, count });
        }
      } else {
        // Guest: Load from localStorage
        const stored = localStorage.getItem(CART_KEY);
        if (stored) {
          const items = JSON.parse(stored);
          const { total, count } = calculateTotals(items);
          setState({ items, total, count });
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Realtime sync for authenticated users
  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    const channel = supabase
      .channel('cart_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cart_items' },
        () => loadCart()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadCart]);

  const addItem = useCallback(async (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => {
    const quantity = item.quantity || 1;

    if (user) {
      // Authenticated: Save to Supabase
      const supabase = createClient();
      let { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!cart) {
        const { data: newCart } = await supabase
          .from('carts')
          .insert({ user_id: user.id })
          .select('id')
          .single();
        cart = newCart;
      }

      if (cart) {
        const { data: existing } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('cart_id', cart.id)
          .eq('product_id', item.productId)
          .single();

        if (existing) {
          await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + quantity })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('cart_items')
            .insert({ cart_id: cart.id, product_id: item.productId, quantity });
        }
      }
      await loadCart();
    } else {
      // Guest: Save to localStorage
      setState(prev => {
        const existingIndex = prev.items.findIndex(i => i.productId === item.productId);
        let newItems: CartItem[];

        if (existingIndex >= 0) {
          newItems = prev.items.map((i, idx) =>
            idx === existingIndex ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          newItems = [...prev.items, {
            id: item.productId,
            productId: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            brand: item.brand,
            quantity,
          }];
        }

        localStorage.setItem(CART_KEY, JSON.stringify(newItems));
        const { total, count } = calculateTotals(newItems);
        return { items: newItems, total, count };
      });
    }
  }, [user, loadCart]);

  const removeItem = useCallback(async (productId: string) => {
    if (user) {
      // Authenticated: Remove from Supabase
      const supabase = createClient();
      await supabase.from('cart_items').delete().eq('product_id', productId);
      await loadCart();
    } else {
      // Guest: Remove from localStorage
      setState(prev => {
        const newItems = prev.items.filter(i => i.productId !== productId);
        localStorage.setItem(CART_KEY, JSON.stringify(newItems));
        const { total, count } = calculateTotals(newItems);
        return { items: newItems, total, count };
      });
    }
  }, [user, loadCart]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity < 1) return removeItem(productId);

    if (user) {
      // Authenticated: Update in Supabase
      const supabase = createClient();
      await supabase.from('cart_items').update({ quantity }).eq('product_id', productId);
      await loadCart();
    } else {
      // Guest: Update in localStorage
      setState(prev => {
        const newItems = prev.items.map(i =>
          i.productId === productId ? { ...i, quantity } : i
        );
        localStorage.setItem(CART_KEY, JSON.stringify(newItems));
        const { total, count } = calculateTotals(newItems);
        return { items: newItems, total, count };
      });
    }
  }, [user, loadCart, removeItem]);

  const clearCart = useCallback(async () => {
    if (user) {
      const supabase = createClient();
      const { data: cart } = await supabase.from('carts').select('id').eq('user_id', user.id).single();
      if (cart) await supabase.from('cart_items').delete().eq('cart_id', cart.id);
    } else {
      localStorage.removeItem(CART_KEY);
    }
    setState({ items: [], total: 0, count: 0 });
  }, [user]);

  return {
    state,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    refreshCart: loadCart,
  };
}
