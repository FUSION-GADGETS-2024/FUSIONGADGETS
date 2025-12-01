import { createClient } from '../supabase/server';

export interface WishlistServiceItem {
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

export interface WishlistServiceResponse {
    id: string;
    userId: string;
    items: WishlistServiceItem[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Get or create wishlist for a user
 */
export async function getOrCreateWishlist(userId: string): Promise<WishlistServiceResponse> {
    const supabase = await createClient();

    // Try to find existing wishlist
    const { data: existingWishlist, error: fetchError } = await supabase
        .from('wishlists')
        .select(`
      *,
      wishlist_items (
        *,
        products (
          id,
          name,
          price,
          mrp_price,
          discount,
          rating,
          in_stock,
          brands (name),
          product_images (url, is_primary)
        )
      )
    `)
        .eq('user_id', userId)
        .single();

    if (existingWishlist && !fetchError) {
        return transformWishlist(existingWishlist);
    }

    // Create new wishlist if not found
    const { data: newWishlist, error: createError } = await supabase
        .from('wishlists')
        .insert({ user_id: userId })
        .select(`
      *,
      wishlist_items (
        *,
        products (
          id,
          name,
          price,
          mrp_price,
          discount,
          rating,
          in_stock,
          brands (name),
          product_images (url, is_primary)
        )
      )
    `)
        .single();

    if (createError || !newWishlist) {
        throw new Error('Failed to create wishlist');
    }

    return transformWishlist(newWishlist);
}

/**
 * Get wishlist by user ID
 */
export async function getWishlist(userId: string): Promise<WishlistServiceResponse> {
    return getOrCreateWishlist(userId);
}

/**
 * Add item to wishlist
 */
export async function addToWishlist(
    userId: string,
    productId: string
): Promise<WishlistServiceResponse> {
    const supabase = await createClient();

    // Get or create wishlist
    const wishlist = await getOrCreateWishlist(userId);

    // Check if item already exists
    const existingItem = wishlist.items.find(item => item.productId === productId);

    if (existingItem) {
        // Item already in wishlist, just return current wishlist
        return wishlist;
    }

    // Add new item
    const { error } = await supabase
        .from('wishlist_items')
        .insert({
            wishlist_id: wishlist.id,
            product_id: productId,
        });

    if (error) {
        throw new Error('Failed to add item to wishlist');
    }

    // Return updated wishlist
    return getWishlist(userId);
}

/**
 * Remove item from wishlist
 */
export async function removeFromWishlist(
    userId: string,
    wishlistItemId: string
): Promise<WishlistServiceResponse> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', wishlistItemId);

    if (error) {
        throw new Error('Failed to remove item from wishlist');
    }

    // Return updated wishlist
    return getWishlist(userId);
}

/**
 * Remove item from wishlist by product ID
 */
export async function removeFromWishlistByProductId(
    userId: string,
    productId: string
): Promise<WishlistServiceResponse> {
    const supabase = await createClient();

    // Get wishlist
    const wishlist = await getOrCreateWishlist(userId);

    // Delete item
    const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('wishlist_id', wishlist.id)
        .eq('product_id', productId);

    if (error) {
        throw new Error('Failed to remove item from wishlist');
    }

    // Return updated wishlist
    return getWishlist(userId);
}

/**
 * Check if product is in wishlist
 */
export async function isInWishlist(
    userId: string,
    productId: string
): Promise<boolean> {
    const supabase = await createClient();

    const { data: wishlist } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (!wishlist) {
        return false;
    }

    const { data } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('wishlist_id', wishlist.id)
        .eq('product_id', productId)
        .single();

    return !!data;
}

/**
 * Clear entire wishlist
 */
export async function clearWishlist(userId: string): Promise<void> {
    const supabase = await createClient();

    const wishlist = await getOrCreateWishlist(userId);

    const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('wishlist_id', wishlist.id);

    if (error) {
        throw new Error('Failed to clear wishlist');
    }
}

/**
 * Transform database wishlist to service response format
 */
function transformWishlist(dbWishlist: any): WishlistServiceResponse {
    return {
        id: dbWishlist.id,
        userId: dbWishlist.user_id,
        items: (dbWishlist.wishlist_items || []).map((item: any) => {
            const primaryImage = item.products?.product_images?.find((img: any) => img.is_primary);
            const fallbackImage = item.products?.product_images?.[0];

            return {
                id: item.id,
                wishlistId: item.wishlist_id,
                productId: item.product_id,
                addedAt: item.added_at,
                product: item.products ? {
                    id: item.products.id,
                    name: item.products.name,
                    price: item.products.price,
                    mrp: item.products.mrp_price,
                    discount: item.products.discount,
                    image: primaryImage?.url || fallbackImage?.url || '',
                    brand: item.products.brands?.name,
                    rating: item.products.rating || 0,
                    inStock: item.products.in_stock ?? true,
                } : undefined,
            };
        }),
        createdAt: dbWishlist.created_at,
        updatedAt: dbWishlist.updated_at,
    };
}
