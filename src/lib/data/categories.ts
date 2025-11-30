// Category data and utilities
import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'laptops',
    name: 'Laptops',
    slug: 'laptops',
    description: 'High-performance laptops for work, gaming, and creativity',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=600&fit=crop',
    productCount: 1,
    seo: {
      title: 'Laptops - High Performance Computers | Fusion Gadgets',
      description: 'Shop premium laptops from top brands. Find the perfect laptop for work, gaming, and creative projects with fast shipping and warranty.',
      keywords: ['laptops', 'computers', 'macbook', 'gaming laptops', 'work laptops'],
      structuredData: {
        '@type': 'ProductCategory',
        name: 'Laptops',
        description: 'High-performance laptops for work, gaming, and creativity',
      }
    },
    isActive: true,
  },
  {
    id: 'audio',
    name: 'Audio',
    slug: 'audio',
    description: 'Premium headphones, earbuds, and audio accessories',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop',
    productCount: 3,
    seo: {
      title: 'Audio - Headphones & Earbuds | Fusion Gadgets',
      description: 'Discover premium audio equipment including noise-cancelling headphones, wireless earbuds, and professional audio gear.',
      keywords: ['headphones', 'earbuds', 'audio', 'wireless', 'noise cancelling'],
      structuredData: {
        '@type': 'ProductCategory',
        name: 'Audio',
        description: 'Premium headphones, earbuds, and audio accessories',
      }
    },
    isActive: true,
  },
  {
    id: 'wearables',
    name: 'Wearables',
    slug: 'wearables',
    description: 'Smart watches and fitness trackers for active lifestyles',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&fit=crop',
    productCount: 1,
    seo: {
      title: 'Wearables - Smart Watches & Fitness Trackers | Fusion Gadgets',
      description: 'Shop smart watches and fitness trackers. Monitor your health, stay connected, and track your fitness goals.',
      keywords: ['smart watch', 'fitness tracker', 'wearables', 'apple watch', 'health monitoring'],
      structuredData: {
        '@type': 'ProductCategory',
        name: 'Wearables',
        description: 'Smart watches and fitness trackers for active lifestyles',
      }
    },
    isActive: true,
  },
  {
    id: 'tablets',
    name: 'Tablets',
    slug: 'tablets',
    description: 'Powerful tablets for productivity and entertainment',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=1200&h=600&fit=crop',
    productCount: 1,
    seo: {
      title: 'Tablets - iPad & Android Tablets | Fusion Gadgets',
      description: 'Find the perfect tablet for work and play. Shop iPads, Android tablets, and accessories with fast shipping.',
      keywords: ['tablets', 'ipad', 'android tablet', 'productivity', 'entertainment'],
      structuredData: {
        '@type': 'ProductCategory',
        name: 'Tablets',
        description: 'Powerful tablets for productivity and entertainment',
      }
    },
    isActive: true,
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Essential accessories to enhance your tech experience',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&h=600&fit=crop',
    productCount: 1,
    seo: {
      title: 'Accessories - Tech Accessories & Peripherals | Fusion Gadgets',
      description: 'Complete your setup with premium tech accessories including keyboards, mice, chargers, and cases.',
      keywords: ['accessories', 'keyboard', 'mouse', 'chargers', 'cases', 'tech accessories'],
      structuredData: {
        '@type': 'ProductCategory',
        name: 'Accessories',
        description: 'Essential accessories to enhance your tech experience',
      }
    },
    isActive: true,
  },
];

// Category images mapping for compatibility with existing SPA
export const categoryImages: Record<string, string> = {
  'All': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=600&fit=crop',
  'Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=600&fit=crop',
  'Audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop',
  'Wearables': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&fit=crop',
  'Tablets': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=1200&h=600&fit=crop',
  'Accessories': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&h=600&fit=crop',
};

// Helper functions
export function getCategoryById(id: string): Category | undefined {
  return categories.find(category => category.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(category => category.slug === slug);
}

export function getCategoryByName(name: string): Category | undefined {
  return categories.find(category => category.name === name);
}

export function getActiveCategories(): Category[] {
  return categories.filter(category => category.isActive);
}

export function getCategoryNames(): string[] {
  return categories.map(category => category.name);
}

export function getCategoryImage(categoryName: string): string {
  return categoryImages[categoryName] || categoryImages['All'];
}