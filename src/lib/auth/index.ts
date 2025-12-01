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

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  brand?: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  wishlist: string[];
  
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  
  loadFromStorage: () => void;
  saveToStorage: () => void;
  loadFromDatabase: () => Promise<void>;
  syncToDatabase: () => Promise<void>;
}

function calculateTotals(items: CartItem[]) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, count };
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  cart: [],
  cartTotal: 0,
  cartCount: 0,
  wishlist: [],

  initialize: async () => {
    const supabase = createClient();
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        set({ user: session.user, session });
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, name, phone, user_code')
          .eq('id', session.user.id)
          .single();
        
        if (profile) set({ profile });
        
        // Load cart and wishlist from database
        await get().loadFromDatabase();
      } else {
        // Load from localStorage
        get().loadFromStorage();
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
          await get().syncToDatabase();
        } else if (event === 'SIGNED_OUT') {
          set({ profile: null, cart: [], cartTotal: 0, cartCount: 0, wishlist: [] });
        }
      });
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      set({ loading: false });
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
    localStorage.removeItem('fusion_cart');
    localStorage.removeItem('fusion_wishlist');
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('id, email, name, phone, user_code')
      .single();

    if (!error && data) set({ profile: data });
  },

  addToCart: (item) => {
    const { cart } = get();
    const quantity = item.quantity || 1;
    const existingIndex = cart.findIndex(i => i.productId === item.productId);
    let newCart: CartItem[];

    if (existingIndex >= 0) {
      newCart = cart.map((i, idx) =>
        idx === existingIndex ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      newCart = [...cart, {
        id: item.productId,
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        brand: item.brand,
        quantity,
      }];
    }

    const { total, count } = calculateTotals(newCart);
    set({ cart: newCart, cartTotal: total, cartCount: count });
    get().saveToStorage();
  },

  removeFromCart: (productId) => {
    const { cart } = get();
    const newCart = cart.filter(i => i.productId !== productId);
    const { total, count } = calculateTotals(newCart);
    set({ cart: newCart, cartTotal: total, cartCount: count });
    get().saveToStorage();
  },

  updateCartQuantity: (productId, quantity) => {
    if (quantity < 1) return get().removeFromCart(productId);
    
    const { cart } = get();
    const newCart = cart.map(i =>
      i.productId === productId ? { ...i, quantity } : i
    );
    const { total, count } = calculateTotals(newCart);
    set({ cart: newCart, cartTotal: total, cartCount: count });
    get().saveToStorage();
  },

  clearCart: () => {
    set({ cart: [], cartTotal: 0, cartCount: 0 });
    get().saveToStorage();
  },

  addToWishlist: (productId) => {
    const { wishlist } = get();
    if (wishlist.includes(productId)) return;
    const newWishlist = [...wishlist, productId];
    set({ wishlist: newWishlist });
    get().saveToStorage();
  },

  removeFromWishlist: (productId) => {
    const { wishlist } = get();
    const newWishlist = wishlist.filter(id => id !== productId);
    set({ wishlist: newWishlist });
    get().saveToStorage();
  },

  toggleWishlist: (productId) => {
    const { wishlist } = get();
    if (wishlist.includes(productId)) {
      get().removeFromWishlist(productId);
      return false;
    } else {
      get().addToWishlist(productId);
      return true;
    }
  },

  isInWishlist: (productId) => get().wishlist.includes(productId),

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    
    const cart = JSON.parse(localStorage.getItem('fusion_cart') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('fusion_wishlist') || '[]');
    
    const { total, count } = calculateTotals(cart);
    set({ cart, cartTotal: total, cartCount: count, wishlist });
  },

  saveToStorage: () => {
    if (typeof window === 'undefined') return;
    const { cart, wishlist } = get();
    localStorage.setItem('fusion_cart', JSON.stringify(cart));
    localStorage.setItem('fusion_wishlist', JSON.stringify(wishlist));
  },

  loadFromDatabase: async () => {
    const { user } = get();
    if (!user) return;

    const supabase = createClient();
    
    // Load cart
    const { data: cart } = await supabase
      .from('carts')
      .select(`cart_items (id, product_id, quantity, products (id, name, price, product_images (url)))`)
      .eq('user_id', user.id)
      .single();

    if (cart?.cart_items) {
      const cartItems: CartItem[] = cart.cart_items.map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        name: item.products?.name || '',
        price: item.products?.price || 0,
        image: item.products?.product_images?.[0]?.url || '/placeholder.svg',
        quantity: item.quantity,
      }));
      
      const { total, count } = calculateTotals(cartItems);
      set({ cart: cartItems, cartTotal: total, cartCount: count });
    }

    // Load wishlist
    const { data: wishlist } = await supabase
      .from('wishlists')
      .select('wishlist_items (product_id)')
      .eq('user_id', user.id)
      .single();

    if (wishlist?.wishlist_items) {
      const productIds = wishlist.wishlist_items.map((item: any) => item.product_id);
      set({ wishlist: productIds });
    }
  },

  syncToDatabase: async () => {
    const { user, cart, wishlist } = get();
    if (!user) return;

    const supabase = createClient();
    
    try {
      // Sync cart to database
      if (cart.length > 0) {
        const { data: existingCart } = await supabase
          .from('carts')
          .select('id')
          .eq('user_id', user.id)
          .single();

        let cartId = existingCart?.id;
        if (!cartId) {
          const { data: newCart } = await supabase
            .from('carts')
            .insert({ user_id: user.id })
            .select('id')
            .single();
          cartId = newCart?.id;
        }

        if (cartId) {
          await supabase.from('cart_items').delete().eq('cart_id', cartId);
          const cartItems = cart.map(item => ({
            cart_id: cartId,
            product_id: item.productId,
            quantity: item.quantity
          }));
          await supabase.from('cart_items').insert(cartItems);
        }
      }

      // Sync wishlist to database
      if (wishlist.length > 0) {
        const { data: existingWishlist } = await supabase
          .from('wishlists')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (existingWishlist?.id) {
          await supabase.from('wishlist_items').delete().eq('wishlist_id', existingWishlist.id);
          const wishlistItems = wishlist.map(productId => ({
            wishlist_id: existingWishlist.id,
            product_id: productId
          }));
          await supabase.from('wishlist_items').insert(wishlistItems);
        }
      }
    } catch (error) {
      console.error('Sync error:', error);
    }
  },
}));

// Export individual hooks for backward compatibility
export const useCart = () => {
  const { cart, cartTotal, cartCount, addToCart, removeFromCart, updateCartQuantity, clearCart } = useAuth();
  return { cart, cartTotal, cartCount, addToCart, removeFromCart, updateCartQuantity, clearCart };
};

export const useWishlist = () => {
  const { wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist } = useAuth();
  return { wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist };
};