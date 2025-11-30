import { createClient as createServerClient } from './server';
import { Product, ProductImage, Specification } from '../types';

// Helper function to transform database product to app Product type
function transformProduct(dbProduct: any, images: any[], specs: any[], features: any[]): Product {
  const productImages: ProductImage[] = images.map((img, index) => ({
    id: img.id,
    url: img.url,
    alt: img.alt || dbProduct.name,
    width: img.width || 800,
    height: img.height || 600,
    isPrimary: img.is_primary || index === 0,
  }));

  const specifications: Specification[] = specs.map(spec => ({
    name: spec.name,
    value: spec.value,
    category: spec.category || 'General',
  }));

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    description: dbProduct.description || '',
    price: parseFloat(dbProduct.price),
    mrp: parseFloat(dbProduct.mrp_price),
    discount: dbProduct.discount,
    images: productImages,
    category: dbProduct.categories?.name || 'Uncategorized',
    categoryId: dbProduct.category_id,
    brand: dbProduct.brands?.name || 'Generic',
    brandId: dbProduct.brand_id,
    rating: parseFloat(dbProduct.rating) || 0,
    reviewCount: dbProduct.review_count || 0,
    inStock: dbProduct.in_stock,
    specifications,
    specs: features.map(f => f.feature),
    isNew: dbProduct.is_new,
    isHotDeal: dbProduct.is_hot_deal,
    isFeatured: dbProduct.is_featured,
    createdAt: new Date(dbProduct.created_at),
    updatedAt: new Date(dbProduct.updated_at),
  };
}

// Get all products with related data
export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createServerClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      categories(name),
      brands(name),
      product_images(*),
      product_specifications(*),
      product_features(*)
    `)
    .eq('status', 'Active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return products.map(product => 
    transformProduct(
      product,
      product.product_images || [],
      product.product_specifications || [],
      product.product_features || []
    )
  );
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createServerClient();
  
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      categories(name),
      brands(name),
      product_images(*),
      product_specifications(*),
      product_features(*)
    `)
    .eq('id', id)
    .eq('status', 'Active')
    .single();

  if (error || !product) {
    console.error('Error fetching product:', error);
    return null;
  }

  return transformProduct(
    product,
    product.product_images || [],
    product.product_specifications || [],
    product.product_features || []
  );
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createServerClient();
  
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      categories(name),
      brands(name),
      product_images(*),
      product_specifications(*),
      product_features(*)
    `)
    .eq('slug', slug)
    .eq('status', 'Active')
    .single();

  if (error || !product) {
    console.error('Error fetching product:', error);
    return null;
  }

  return transformProduct(
    product,
    product.product_images || [],
    product.product_specifications || [],
    product.product_features || []
  );
}

// Get featured products
export async function getFeaturedProducts(limit: number = 10): Promise<Product[]> {
  const supabase = await createServerClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      categories(name),
      brands(name),
      product_images(*),
      product_specifications(*),
      product_features(*)
    `)
    .eq('status', 'Active')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return products.map(product => 
    transformProduct(
      product,
      product.product_images || [],
      product.product_specifications || [],
      product.product_features || []
    )
  );
}

// Get new arrivals
export async function getNewArrivals(limit: number = 10): Promise<Product[]> {
  const supabase = await createServerClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      categories(name),
      brands(name),
      product_images(*),
      product_specifications(*),
      product_features(*)
    `)
    .eq('status', 'Active')
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }

  return products.map(product => 
    transformProduct(
      product,
      product.product_images || [],
      product.product_specifications || [],
      product.product_features || []
    )
  );
}

// Get hot deals
export async function getHotDeals(limit: number = 10): Promise<Product[]> {
  const supabase = await createServerClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      categories(name),
      brands(name),
      product_images(*),
      product_specifications(*),
      product_features(*)
    `)
    .eq('status', 'Active')
    .eq('is_hot_deal', true)
    .order('discount', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching hot deals:', error);
    return [];
  }

  return products.map(product => 
    transformProduct(
      product,
      product.product_images || [],
      product.product_specifications || [],
      product.product_features || []
    )
  );
}

// Get products by category
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = await createServerClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      categories!inner(name, slug),
      brands(name),
      product_images(*),
      product_specifications(*),
      product_features(*)
    `)
    .eq('status', 'Active')
    .eq('categories.slug', categorySlug)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return products.map(product => 
    transformProduct(
      product,
      product.product_images || [],
      product.product_specifications || [],
      product.product_features || []
    )
  );
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  const supabase = await createServerClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      categories(name),
      brands(name),
      product_images(*),
      product_specifications(*),
      product_features(*)
    `)
    .eq('status', 'Active')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return products.map(product => 
    transformProduct(
      product,
      product.product_images || [],
      product.product_specifications || [],
      product.product_features || []
    )
  );
}

// Get all categories
export async function getAllCategories() {
  const supabase = await createServerClient();
  
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

// Get all brands
export async function getAllBrands() {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching brands:', error);
    return [];
  }

  return data;
}

// Get similar products (same category, excluding current product)
export async function getSimilarProducts(productId: string, categoryId: string | null, limit: number = 3): Promise<Product[]> {
  if (!categoryId) return [];
  
  const supabase = await createServerClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      categories(name),
      brands(name),
      product_images(*),
      product_specifications(*),
      product_features(*)
    `)
    .eq('status', 'Active')
    .eq('category_id', categoryId)
    .neq('id', productId)
    .limit(limit);

  if (error) {
    console.error('Error fetching similar products:', error);
    return [];
  }

  return products.map(product => 
    transformProduct(
      product,
      product.product_images || [],
      product.product_specifications || [],
      product.product_features || []
    )
  );
}
