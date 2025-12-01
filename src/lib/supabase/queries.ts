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

// Get filtered products with pagination (for SSR products page)
export async function getFilteredProducts(
  filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'name' | 'price' | 'rating' | 'newest' | 'discount';
    sortOrder?: 'asc' | 'desc';
    search?: string;
  },
  page: number = 1,
  limit: number = 12
): Promise<{ products: Product[]; total: number; totalPages: number }> {
  const supabase = await createServerClient();
  
  let query = supabase
    .from('products')
    .select(`
      *,
      categories(name, slug),
      brands(name),
      product_images(*),
      product_specifications(*),
      product_features(*)
    `, { count: 'exact' })
    .eq('status', 'Active');

  // Apply category filter
  if (filters.category) {
    query = query.eq('categories.name', filters.category);
  }

  // Apply brand filter
  if (filters.brand) {
    query = query.eq('brands.name', filters.brand);
  }

  // Apply price range filters
  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }

  // Apply search filter
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  // Apply sorting
  const sortOrder = filters.sortOrder === 'asc';
  switch (filters.sortBy) {
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    case 'price':
      query = query.order('price', { ascending: sortOrder });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    case 'discount':
      query = query.order('discount', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  // Apply pagination
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data: products, error, count } = await query;

  if (error) {
    console.error('Error fetching filtered products:', error);
    return { products: [], total: 0, totalPages: 0 };
  }

  // Filter out products that don't match category/brand (due to join behavior)
  const filteredProducts = products?.filter(product => {
    if (filters.category && product.categories?.name !== filters.category) return false;
    if (filters.brand && product.brands?.name !== filters.brand) return false;
    return true;
  }) || [];

  const transformedProducts = filteredProducts.map(product => 
    transformProduct(
      product,
      product.product_images || [],
      product.product_specifications || [],
      product.product_features || []
    )
  );

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return { products: transformedProducts, total, totalPages };
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
