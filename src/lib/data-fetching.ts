// Next.js 16+ data fetching patterns and utilities
import { cache } from 'react';
import { 
  fetchProducts, 
  fetchProductById, 
  fetchProductBySlug, 
  fetchFeaturedProducts, 
  fetchNewArrivals, 
  fetchHotDeals, 
  fetchProductsByCategory, 
  fetchSimilarProducts,
  fetchCategories,
  fetchCategoryBySlug,
  fetchProductReviews,
  REVALIDATE_INTERVAL 
} from './data/api';
import { Product, Category, Review, ProductFilters } from './types';

// Cache functions for Server Components using React cache()
// This ensures data is fetched only once per request

export const getProducts = cache(async (filters?: ProductFilters): Promise<Product[]> => {
  return fetchProducts(filters);
});

export const getProductById = cache(async (id: string): Promise<Product | null> => {
  return fetchProductById(id);
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  return fetchProductBySlug(slug);
});

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  return fetchFeaturedProducts();
});

export const getNewArrivals = cache(async (): Promise<Product[]> => {
  return fetchNewArrivals();
});

export const getHotDeals = cache(async (): Promise<Product[]> => {
  return fetchHotDeals();
});

export const getProductsByCategory = cache(async (category: string): Promise<Product[]> => {
  return fetchProductsByCategory(category);
});

export const getSimilarProducts = cache(async (productId: string, limit?: number): Promise<Product[]> => {
  return fetchSimilarProducts(productId, limit);
});

export const getCategories = cache(async (): Promise<Category[]> => {
  return fetchCategories();
});

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  return fetchCategoryBySlug(slug);
});

export const getProductReviews = cache(async (productId: string): Promise<Review[]> => {
  return fetchProductReviews(productId);
});

// Static generation helpers for SSG pages
export async function generateStaticProductParams() {
  const products = await getProducts();
  return products.map(product => ({
    id: product.id,
    slug: product.slug,
  }));
}

export async function generateStaticCategoryParams() {
  const categories = await getCategories();
  return categories.map(category => ({
    slug: category.slug,
  }));
}

// ISR configuration
export const revalidate = REVALIDATE_INTERVAL;

// Data fetching with error handling for production
export async function safeGetProductById(id: string): Promise<Product | null> {
  try {
    return await getProductById(id);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

export async function safeGetProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await getProductBySlug(slug);
  } catch (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    return null;
  }
}

export async function safeGetProducts(filters?: ProductFilters): Promise<Product[]> {
  try {
    return await getProducts(filters);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Client-side data fetching utilities (for CSR pages)
export class ClientDataService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  static async fetchWithRetry<T>(
    url: string, 
    options: RequestInit = {}, 
    retries: number = 3
  ): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    throw new Error('Max retries exceeded');
  }

  static async getCart(userId: string) {
    return this.fetchWithRetry(`${this.baseUrl}/cart/${userId}`);
  }

  static async addToCart(userId: string, productId: string, quantity: number = 1) {
    return this.fetchWithRetry(`${this.baseUrl}/cart/${userId}/add`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  static async removeFromCart(userId: string, productId: string) {
    return this.fetchWithRetry(`${this.baseUrl}/cart/${userId}/remove`, {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    });
  }

  static async updateCartQuantity(userId: string, productId: string, quantity: number) {
    return this.fetchWithRetry(`${this.baseUrl}/cart/${userId}/update`, {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  static async getWishlist(userId: string) {
    return this.fetchWithRetry(`${this.baseUrl}/wishlist/${userId}`);
  }

  static async addToWishlist(userId: string, productId: string) {
    return this.fetchWithRetry(`${this.baseUrl}/wishlist/${userId}/add`, {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  static async removeFromWishlist(userId: string, productId: string) {
    return this.fetchWithRetry(`${this.baseUrl}/wishlist/${userId}/remove`, {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    });
  }

  static async getOrders(userId: string) {
    return this.fetchWithRetry(`${this.baseUrl}/orders/${userId}`);
  }

  static async createOrder(userId: string, orderData: any) {
    return this.fetchWithRetry(`${this.baseUrl}/orders`, {
      method: 'POST',
      body: JSON.stringify({ userId, ...orderData }),
    });
  }
}

// Search utilities
export async function searchProducts(query: string, filters?: ProductFilters): Promise<Product[]> {
  const searchFilters = {
    ...filters,
    search: query,
  };
  return getProducts(searchFilters);
}

// Utility functions for component data preparation
export function prepareProductCardData(product: Product) {
  return {
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
}

export function prepareProductsForSection(products: Product[]) {
  return products.map(prepareProductCardData);
}

// Data validation utilities
export function validateProduct(product: any): product is Product {
  return (
    typeof product === 'object' &&
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.price === 'number' &&
    typeof product.category === 'string' &&
    typeof product.brand === 'string' &&
    typeof product.inStock === 'boolean'
  );
}

export function validateProducts(products: any[]): Product[] {
  return products.filter(validateProduct);
}