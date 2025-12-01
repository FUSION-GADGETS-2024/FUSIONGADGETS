'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth-context';

interface CartItem {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    selectedVariant: string | null;
    addedAt: string;
    product?: {
        id: string;
        name: string;
        price: number;
        image: string;
        brand?: string;
        inStock: boolean;
    };
}

interface Cart {
    id: string;
    userId: string | null;
    sessionId: string | null;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

export function useCartData() {
    return useQuery<Cart>({
        queryKey: ['cart'],
        queryFn: async () => {
            const response = await fetch('/api/cart');
            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }
            const data = await response.json();
            return data.data;
        },
    });
}

export function useAddToCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, quantity, selectedVariant }: {
            productId: string;
            quantity?: number;
            selectedVariant?: string;
        }) => {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity, selectedVariant }),
            });

            if (!response.ok) {
                throw new Error('Failed to add to cart');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
}

export function useUpdateCartItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ cartItemId, quantity }: {
            cartItemId: string;
            quantity: number;
        }) => {
            const response = await fetch('/api/cart/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItemId, quantity }),
            });

            if (!response.ok) {
                throw new Error('Failed to update cart item');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
}

export function useRemoveFromCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cartItemId: string) => {
            const response = await fetch('/api/cart/remove', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItemId }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove from cart');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
}

export function useMergeCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/cart/merge', {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to merge cart');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
}

// Helper hook to get cart totals
export function useCartTotals() {
    const { data: cart } = useCartData();

    const subtotal = cart?.items.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
    }, 0) || 0;

    const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return {
        subtotal,
        itemCount,
        shipping: 0, // Free shipping
        total: subtotal,
    };
}
