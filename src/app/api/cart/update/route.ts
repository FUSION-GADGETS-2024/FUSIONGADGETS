import { NextRequest, NextResponse } from 'next/server';
import { updateCartItem } from '@/lib/services/cart-service';
import { updateCartItemSchema } from '@/lib/validations/cart-schema';

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const validated = updateCartItemSchema.parse(body);

        await updateCartItem(validated.cartItemId, validated.quantity);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating cart item:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { success: false, error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: error.message || 'Failed to update cart item' },
            { status: 500 }
        );
    }
}
