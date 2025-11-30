// Static queries for build-time data fetching (SSG)
// These use the service role key and don't require cookies

import { createClient } from '@supabase/supabase-js';
import { Product, ProductImage } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a static client for build-time queries
function createStaticClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Get all categories for static generation
export async function getAllCategoriesStatic() {
  const supabase = createStaticClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data;
}

// Get all product IDs for static generation
export async function getAllProductIdsStatic() {
  const supabase = createStaticClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('id')
    .eq('status', 'Active');

  if (error) {
    console.error('Error fetching product IDs:', error);
    return [];
  }

  return data;
}

// Get product with only essential data (no specs/features) - optimized for fast loading
export async function getProductByIdFast(id: string): Promise<Product | null> {
  const supabase = createStaticClient();
  
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      categories(name),
      brands(name),
      product_images(*)
    `)
    .eq('id', id)
    .eq('status', 'Active')
    .single();

  if (error || !product) {
    console.error('Error fetching product:', error);
    return null;
  }

  const productImages: ProductImage[] = (product.product_images || []).map((img: any, index: number) => ({
    id: img.id,
    url: img.url,
    alt: img.alt || product.name,
    width: img.width || 800,
    height: img.height || 600,
    isPrimary: img.is_primary || index === 0,
  }));

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    price: parseFloat(product.price),
    mrp: parseFloat(product.mrp_price),
    discount: product.discount,
    images: productImages,
    category: product.categories?.name || 'Uncategorized',
    categoryId: product.category_id,
    brand: product.brands?.name || 'Generic',
    brandId: product.brand_id,
    rating: parseFloat(product.rating) || 0,
    reviewCount: product.review_count || 0,
    inStock: product.in_stock,
    specifications: [], // Load dynamically
    specs: [], // Load dynamically
    isNew: product.is_new,
    isHotDeal: product.is_hot_deal,
    isFeatured: product.is_featured,
    createdAt: new Date(product.created_at),
    updatedAt: new Date(product.updated_at),
  };
}

// Get product specifications separately for dynamic loading
export async function getProductSpecifications(productId: string) {
  const supabase = createStaticClient();
  
  const { data, error } = await supabase
    .from('product_specifications')
    .select('*')
    .eq('product_id', productId)
    .order('display_order');

  if (error) {
    console.error('Error fetching specifications:', error);
    return [];
  }

  return data;
}

// Get product features separately for dynamic loading
export async function getProductFeatures(productId: string) {
  const supabase = createStaticClient();
  
  const { data, error } = await supabase
    .from('product_features')
    .select('*')
    .eq('product_id', productId)
    .order('display_order');

  if (error) {
    console.error('Error fetching features:', error);
    return [];
  }

  return data;
}
