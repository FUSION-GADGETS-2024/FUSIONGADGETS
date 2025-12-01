import { NextRequest, NextResponse } from 'next/server';
import { removeFromWishlistByProductId } from '@/lib/services/wishlist-service';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json(
                { success: false, error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const wishlist = await removeFromWishlistByProductId(user.id, productId);

        return NextResponse.json({ success: true, data: wishlist });
    } catch (error: any) {
        console.error('Error removing from wishlist:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to remove item from wishlist' },
            { status: 500 }
        );
    }
}
