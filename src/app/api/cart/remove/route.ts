import { NextRequest, NextResponse } from 'next/server';
import { removeFromCart } from '@/lib/services/cart-service';
import { removeFromCartSchema } from '@/lib/validations/cart-schema';

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const validated = removeFromCartSchema.parse(body);

        await removeFromCart(validated.cartItemId);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error removing from cart:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { success: false, error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: error.message || 'Failed to remove item from cart' },
            { status: 500 }
        );
    }
}
