import { NextResponse } from 'next/server';
import { getSimilarProducts } from '@/lib/supabase/queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const categoryId = searchParams.get('categoryId');
    const limit = parseInt(searchParams.get('limit') || '3');

    if (!productId || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const products = await getSimilarProducts(productId, categoryId, limit);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching similar products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch similar products' },
      { status: 500 }
    );
  }
}
