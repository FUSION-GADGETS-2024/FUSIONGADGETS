import { NextRequest, NextResponse } from 'next/server';
import { getWishlist } from '@/lib/services/wishlist-service';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const wishlist = await getWishlist(user.id);

        return NextResponse.json({ success: true, data: wishlist });
    } catch (error: any) {
        console.error('Error fetching wishlist:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch wishlist' },
            { status: 500 }
        );
    }
}
