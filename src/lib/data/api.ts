// Data fetching utilities for Next.js 16+ patterns
import { Product, Category, Review, ProductFilters, PaginatedResponse } from '../types';
import { 
  products, 
  getProductById, 
  getProductBySlug, 
  getProductsByCategory, 
  getFeaturedProducts, 
  getNewArrivals, 
  getHotDeals, 
  searchProducts, 
  getReviewsForProduct, 
  getSimilarProducts,
  getProductCategories 
} from './products';
import { categories, getCategoryBySlug, getCategoryNames } from './categories';

// Simulate API delay for realistic behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Product API functions
export async function fetchProducts(filters?: ProductFilters): Promise<Product[]> {
  await delay(100); // Simulate network delay
  
  let filteredProducts = [...products];
  
  if (filters) {
    if (filters.category && filters.category !== 'All') {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }
    
    if (filters.brand) {
      filteredProducts = filteredProducts.filter(p => p.brand === filters.brand);
    }
    
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
    }
    
    if (filters.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.inStock === filters.inStock);
    }
    
    if (filters.rating !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.rating >= filters.rating!);
    }
    
    if (filters.search) {
      const searchResults = searchProducts(filters.search);
      filteredProducts = filteredProducts.filter(p => 
        searchResults.some(sr => sr.id === p.id)
      );
    }
    
    // Sorting
    if (filters.sortBy) {
      filteredProducts.sort((a, b) => {
        const order = filters.sortOrder === 'desc' ? -1 : 1;
        
        switch (filters.sortBy) {
          case 'name':
            return order * a.name.localeCompare(b.name);
          case 'price':
            return order * (a.price - b.price);
          case 'rating':
            return order * (a.rating - b.rating);
          case 'newest':
            return order * ((a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
          case 'discount':
            return order * (a.discount - b.discount);
          default:
            return 0;
        }
      });
    }
  }
  
  return filteredProducts;
}

export async function fetchProductsPaginated(
  page: number = 1, 
  limit: number = 12, 
  filters?: ProductFilters
): Promise<PaginatedResponse<Product>> {
  const allProducts = await fetchProducts(filters);
  const total = allProducts.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = allProducts.slice(startIndex, endIndex);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }
  };
}

export async function fetchProductById(id: string): Promise<Product | null> {
  await delay(50);
  return getProductById(id) || null;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  await delay(50);
  return getProductBySlug(slug) || null;
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  await delay(100);
  return getFeaturedProducts();
}

export async function fetchNewArrivals(): Promise<Product[]> {
  await delay(100);
  return getNewArrivals();
}

export async function fetchHotDeals(): Promise<Product[]> {
  await delay(100);
  return getHotDeals();
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  await delay(100);
  return getProductsByCategory(category);
}

export async function fetchSimilarProducts(productId: string, limit: number = 3): Promise<Product[]> {
  await delay(100);
  return getSimilarProducts(productId, limit);
}

// Category API functions
export async function fetchCategories(): Promise<Category[]> {
  await delay(50);
  return categories;
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  await delay(50);
  return getCategoryBySlug(slug) || null;
}

export async function fetchCategoryNames(): Promise<string[]> {
  await delay(50);
  return getCategoryNames();
}

// Review API functions
export async function fetchProductReviews(productId: string): Promise<Review[]> {
  await delay(100);
  return getReviewsForProduct(productId);
}

// Search API functions
export async function fetchSearchResults(query: string): Promise<Product[]> {
  await delay(150);
  return searchProducts(query);
}

// Static generation helpers for Next.js
export async function generateProductStaticParams(): Promise<{ id: string }[]> {
  return products.map(product => ({ id: product.id }));
}

export async function generateProductSlugStaticParams(): Promise<{ slug: string }[]> {
  return products.map(product => ({ slug: product.slug }));
}

export async function generateCategoryStaticParams(): Promise<{ slug: string }[]> {
  return categories.map(category => ({ slug: category.slug }));
}

// ISR revalidation helpers
export const REVALIDATE_INTERVAL = 3600; // 1 hour in seconds

export async function shouldRevalidateProduct(productId: string): Promise<boolean> {
  // In a real app, this would check if product data has changed
  // For now, we'll simulate occasional updates
  const product = await fetchProductById(productId);
  if (!product) return false;
  
  const lastUpdate = product.updatedAt?.getTime() || 0;
  const now = Date.now();
  const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60);
  
  return hoursSinceUpdate > 1; // Revalidate if updated more than 1 hour ago
}

// Mock cart and user data functions (for CSR pages)
export async function fetchUserCart(userId: string): Promise<any> {
  await delay(100);
  // Mock cart data - in real app this would come from API/database
  return {
    id: `cart-${userId}`,
    userId,
    items: [],
    total: 0,
    updatedAt: new Date(),
  };
}

export async function fetchUserOrders(userId: string): Promise<any[]> {
  await delay(150);
  // Mock orders data - in real app this would come from API/database
  return [];
}

export async function fetchUserWishlist(userId: string): Promise<any> {
  await delay(100);
  // Mock wishlist data - in real app this would come from API/database
  return {
    id: `wishlist-${userId}`,
    userId,
    items: [],
    updatedAt: new Date(),
  };
}