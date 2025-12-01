import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/lib/supabase/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Transform to simpler format for wishlist/cart
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      discount: product.discount,
      image: product.images[0]?.url || '/placeholder.svg',
      brand: product.brand,
      rating: product.rating,
      inStock: product.inStock,
    };

    return NextResponse.json({ success: true, data: productData });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
