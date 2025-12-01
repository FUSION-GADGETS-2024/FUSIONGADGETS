import { NextRequest, NextResponse } from 'next/server';
import { mergeGuestCart } from '@/lib/services/cart-service';
import { cookies } from 'next/headers';
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

        const cookieStore = await cookies();
        const sessionId = cookieStore.get('cart_session_id')?.value;

        if (!sessionId) {
            return NextResponse.json(
                { success: false, error: 'No guest cart found' },
                { status: 400 }
            );
        }

        const cart = await mergeGuestCart(sessionId, user.id);

        // Clear the session cookie after merge
        cookieStore.delete('cart_session_id');

        return NextResponse.json({ success: true, data: cart });
    } catch (error: any) {
        console.error('Error merging cart:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to merge cart' },
            { status: 500 }
        );
    }
}
