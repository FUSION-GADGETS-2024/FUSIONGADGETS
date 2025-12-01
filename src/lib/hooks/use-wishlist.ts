'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth-context';

interface WishlistItem {
    id: string;
    wishlistId: string;
    productId: string;
    addedAt: string;
    product?: {
        id: string;
        name: string;
        price: number;
        mrp: number;
        discount: number;
        image: string;
        brand?: string;
        rating: number;
        inStock: boolean;
    };
}

interface Wishlist {
    id: string;
    userId: string;
    items: WishlistItem[];
    createdAt: string;
    updatedAt: string;
}

export function useWishlist() {
    const { user } = useAuth();

    return useQuery<Wishlist>({
        queryKey: ['wishlist', user?.id],
        queryFn: async () => {
            const response = await fetch('/api/wishlist');
            if (!response.ok) {
                throw new Error('Failed to fetch wishlist');
            }
            const data = await response.json();
            return data.data;
        },
        enabled: !!user,
    });
}

export function useAddToWishlist() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (productId: string) => {
            const response = await fetch('/api/wishlist/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                throw new Error('Failed to add to wishlist');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
        },
    });
}

export function useRemoveFromWishlist() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (productId: string) => {
            const response = await fetch('/api/wishlist/remove', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove from wishlist');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
        },
    });
}

export function useIsInWishlist(productId: string) {
    const { data: wishlist } = useWishlist();
    return wishlist?.items.some(item => item.productId === productId) || false;
}
