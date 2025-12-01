import { createClient } from '../supabase/server';
import { v4 as uuidv4 } from 'uuid';

export interface CartServiceItem {
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

export interface CartServiceResponse {
    id: string;
    userId: string | null;
    sessionId: string | null;
    items: CartServiceItem[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Get or create a cart for a user or session
 */
export async function getOrCreateCart(
    userId: string | null,
    sessionId: string
): Promise<CartServiceResponse> {
    const supabase = await createClient();

    // Try to find existing cart
    let query = supabase
        .from('carts')
        .select(`
      *,
      cart_items (
        *,
        products (
          id,
          name,
          price,
          product_images (url)
        )
      )
    `);

    if (userId) {
        query = query.eq('user_id', userId);
    } else {
        query = query.eq('session_id', sessionId).is('user_id', null);
    }

    const { data: existingCart, error: fetchError } = await query.single();

    if (existingCart && !fetchError) {
        return transformCart(existingCart);
    }

    // Create new cart if not found
    const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({
            user_id: userId,
            session_id: userId ? null : sessionId,
        })
        .select(`
      *,
      cart_items (
        *,
        products (
          id,
          name,
          price,
          product_images (url)
        )
      )
    `)
        .single();

    if (createError || !newCart) {
        throw new Error('Failed to create cart');
    }

    return transformCart(newCart);
}

/**
 * Get cart by ID
 */
export async function getCart(cartId: string): Promise<CartServiceResponse | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('carts')
        .select(`
      *,
      cart_items (
        *,
        products (
          id,
          name,
          price,
          brands (name),
          product_images (url, is_primary)
        )
      )
    `)
        .eq('id', cartId)
        .single();

    if (error || !data) {
        return null;
    }

    return transformCart(data);
}

/**
 * Add item to cart
 */
export async function addToCart(
    userId: string | null,
    sessionId: string,
    productId: string,
    quantity: number = 1,
    selectedVariant?: string
): Promise<CartServiceResponse> {
    const supabase = await createClient();

    // Get or create cart
    const cart = await getOrCreateCart(userId, sessionId);

    // Check if item already exists in cart
    const existingItem = cart.items.find(item =>
        item.productId === productId &&
        item.selectedVariant === (selectedVariant || null)
    );

    if (existingItem) {
        // Update quantity
        const { error } = await supabase
            .from('cart_items')
            .update({
                quantity: existingItem.quantity + quantity,
                updated_at: new Date().toISOString(),
            })
            .eq('id', existingItem.id);

        if (error) {
            throw new Error('Failed to update cart item');
        }
    } else {
        // Add new item
        const { error } = await supabase
            .from('cart_items')
            .insert({
                cart_id: cart.id,
                product_id: productId,
                quantity,
                selected_variant: selectedVariant || null,
            });

        if (error) {
            throw new Error('Failed to add item to cart');
        }
    }

    // Return updated cart
    const updatedCart = await getCart(cart.id);
    if (!updatedCart) {
        throw new Error('Failed to fetch updated cart');
    }

    return updatedCart;
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
    cartItemId: string,
    quantity: number
): Promise<void> {
    const supabase = await createClient();

    if (quantity === 0) {
        // Remove item if quantity is 0
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', cartItemId);

        if (error) {
            throw new Error('Failed to remove cart item');
        }
    } else {
        // Update quantity
        const { error } = await supabase
            .from('cart_items')
            .update({
                quantity,
                updated_at: new Date().toISOString(),
            })
            .eq('id', cartItemId);

        if (error) {
            throw new Error('Failed to update cart item');
        }
    }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(cartItemId: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

    if (error) {
        throw new Error('Failed to remove cart item');
    }
}

/**
 * Clear entire cart
 */
export async function clearCart(cartId: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId);

    if (error) {
        throw new Error('Failed to clear cart');
    }
}

/**
 * Merge guest cart into user cart on login
 */
export async function mergeGuestCart(
    sessionId: string,
    userId: string
): Promise<CartServiceResponse> {
    const supabase = await createClient();

    // Get guest cart
    const { data: guestCart } = await supabase
        .from('carts')
        .select('*, cart_items (*)')
        .eq('session_id', sessionId)
        .is('user_id', null)
        .single();

    if (!guestCart || !guestCart.cart_items || guestCart.cart_items.length === 0) {
        // No guest cart, just return user cart
        return getOrCreateCart(userId, sessionId);
    }

    // Get or create user cart
    const userCart = await getOrCreateCart(userId, sessionId);

    // Merge items
    for (const guestItem of guestCart.cart_items) {
        const existingItem = userCart.items.find(item =>
            item.productId === guestItem.product_id &&
            item.selectedVariant === guestItem.selected_variant
        );

        if (existingItem) {
            // Update quantity
            await supabase
                .from('cart_items')
                .update({
                    quantity: existingItem.quantity + guestItem.quantity,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', existingItem.id);
        } else {
            // Add new item to user cart
            await supabase
                .from('cart_items')
                .insert({
                    cart_id: userCart.id,
                    product_id: guestItem.product_id,
                    quantity: guestItem.quantity,
                    selected_variant: guestItem.selected_variant,
                });
        }
    }

    // Delete guest cart
    await supabase
        .from('carts')
        .delete()
        .eq('id', guestCart.id);

    // Return updated user cart
    const finalCart = await getCart(userCart.id);
    if (!finalCart) {
        throw new Error('Failed to fetch merged cart');
    }

    return finalCart;
}

/**
 * Transform database cart to service response format
 */
function transformCart(dbCart: any): CartServiceResponse {
    return {
        id: dbCart.id,
        userId: dbCart.user_id,
        sessionId: dbCart.session_id,
        items: (dbCart.cart_items || []).map((item: any) => ({
            id: item.id,
            cartId: item.cart_id,
            productId: item.product_id,
            quantity: item.quantity,
            selectedVariant: item.selected_variant,
            addedAt: item.added_at,
            product: item.products ? {
                id: item.products.id,
                name: item.products.name,
                price: item.products.price,
                image: item.products.product_images?.[0]?.url || '',
                brand: item.products.brands?.name,
                inStock: item.products.in_stock ?? true,
            } : undefined,
        })),
        createdAt: dbCart.created_at,
        updatedAt: dbCart.updated_at,
    };
}
