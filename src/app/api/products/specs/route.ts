import { NextRequest, NextResponse } from 'next/server';
import { getProductSpecifications, getProductFeatures } from '@/lib/supabase/queries-static';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const [specifications, features] = await Promise.all([
      getProductSpecifications(productId),
      getProductFeatures(productId)
    ]);

    return NextResponse.json({ specifications, features });
  } catch (error) {
    console.error('Error fetching product specs:', error);
    return NextResponse.json({ error: 'Failed to fetch specifications' }, { status: 500 });
  }
}
