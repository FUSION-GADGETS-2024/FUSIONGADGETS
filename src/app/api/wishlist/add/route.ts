import { NextRequest, NextResponse } from 'next/server';
import { addToWishlist } from '@/lib/services/wishlist-service';
import { addToWishlistSchema } from '@/lib/validations/wishlist-schema';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
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
        const validated = addToWishlistSchema.parse(body);

        const wishlist = await addToWishlist(user.id, validated.productId);

        return NextResponse.json({ success: true, data: wishlist });
    } catch (error: any) {
        console.error('Error adding to wishlist:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { success: false, error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: error.message || 'Failed to add item to wishlist' },
            { status: 500 }
        );
    }
}
