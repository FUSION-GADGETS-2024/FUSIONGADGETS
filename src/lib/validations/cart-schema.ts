import { z } from 'zod';

// Cart item validation schema
export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
  selectedVariant: z.string().optional(),
});

// Add to cart request schema
export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99).default(1),
  selectedVariant: z.string().optional(),
});

// Update cart item schema
export const updateCartItemSchema = z.object({
  cartItemId: z.string().uuid(),
  quantity: z.number().int().min(0).max(99),
});

// Remove from cart schema
export const removeFromCartSchema = z.object({
  cartItemId: z.string().uuid(),
});

// Cart response schema
export const cartSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  sessionId: z.string().nullable(),
  items: z.array(z.object({
    id: z.string().uuid(),
    cartId: z.string().uuid(),
    productId: z.string().uuid(),
    quantity: z.number().int(),
    selectedVariant: z.string().nullable(),
    addedAt: z.string(),
    product: z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      image: z.string(),
      brand: z.string().optional(),
      inStock: z.boolean(),
    }).optional(),
  })),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type RemoveFromCartInput = z.infer<typeof removeFromCartSchema>;
export type Cart = z.infer<typeof cartSchema>;
