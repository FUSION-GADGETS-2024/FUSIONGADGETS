import { NextRequest, NextResponse } from 'next/server';
import { addToCart } from '@/lib/services/cart-service';
import { addToCartSchema } from '@/lib/validations/cart-schema';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Get or create session ID
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

        const body = await request.json();
        const validated = addToCartSchema.parse(body);

        const cart = await addToCart(
            user?.id || null,
            sessionId,
            validated.productId,
            validated.quantity,
            validated.selectedVariant
        );

        return NextResponse.json({ success: true, data: cart });
    } catch (error: any) {
        console.error('Error adding to cart:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { success: false, error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: error.message || 'Failed to add item to cart' },
            { status: 500 }
        );
    }
}
