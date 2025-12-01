import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateCart } from '@/lib/services/cart-service';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Get or create session ID for guest users
        const cookieStore = await cookies();
        let sessionId = cookieStore.get('cart_session_id')?.value;

        if (!sessionId) {
            sessionId = uuidv4();
            cookieStore.set('cart_session_id', sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });
        }

        const cart = await getOrCreateCart(user?.id || null, sessionId);

        return NextResponse.json({ success: true, data: cart });
    } catch (error: any) {
        console.error('Error fetching cart:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch cart' },
            { status: 500 }
        );
    }
}
