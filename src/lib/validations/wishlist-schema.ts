import { z } from 'zod';

// Wishlist item validation schema
export const wishlistItemSchema = z.object({
    productId: z.string().uuid(),
});

// Add to wishlist request schema
export const addToWishlistSchema = z.object({
    productId: z.string().uuid(),
});

// Remove from wishlist schema
export const removeFromWishlistSchema = z.object({
    wishlistItemId: z.string().uuid(),
});

// Wishlist response schema
export const wishlistSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    items: z.array(z.object({
        id: z.string().uuid(),
        wishlistId: z.string().uuid(),
        productId: z.string().uuid(),
        addedAt: z.string(),
        product: z.object({
            id: z.string(),
            name: z.string(),
            price: z.number(),
            mrp: z.number(),
            discount: z.number(),
            image: z.string(),
            brand: z.string().optional(),
            rating: z.number(),
            inStock: z.boolean(),
        }).optional(),
    })),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type WishlistItem = z.infer<typeof wishlistItemSchema>;
export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>;
export type RemoveFromWishlistInput = z.infer<typeof removeFromWishlistSchema>;
export type Wishlist = z.infer<typeof wishlistSchema>;
