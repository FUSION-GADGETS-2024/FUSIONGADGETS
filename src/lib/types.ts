// Core data models for Fusion Gadgets Next.js application

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  isPrimary: boolean;
}

export interface Specification {
  name: string;
  value: string;
  category: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string;
  productCount: number;
  seo: SEOMetadata;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  discount: number;
  images: ProductImage[];
  category: string; // Category name for compatibility with existing SPA
  categoryId?: string; // Category ID for future use
  brand: string; // Brand name for compatibility with existing SPA
  brandId?: string; // Brand ID for future use
  rating: number;
  reviewCount?: number;
  inStock: boolean;
  specifications?: Specification[];
  specs?: string[]; // For compatibility with existing SPA format
  seo?: SEOMetadata;
  // Additional flags from SPA
  isNew?: boolean;
  isHotDeal?: boolean;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Review {
  id: number | string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  productId?: string;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  currency?: string;
  language?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  productId: string;
  product?: Product; // Populated product data
  quantity: number;
  selectedVariant?: string;
  addedAt: Date;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  total: number;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  updatedAt: Date;
}

export interface WishlistItem {
  productId: string;
  product?: Product;
  addedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Search and Filter types
export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  rating?: number;
  search?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'newest' | 'discount';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  q?: string;
  category?: string;
  brand?: string;
  page?: string;
  limit?: string;
  sort?: string;
}

// Component Props types
export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  mrp: number;
  discount: number;
  image: string;
  brand: string;
  rating: number;
  inStock: boolean;
  onAddToCart: () => void;
}

export interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

// Next.js specific types
export interface PageProps {
  params: { [key: string]: string | string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface LayoutProps {
  children: React.ReactNode;
  params?: { [key: string]: string | string[] };
}

// Metadata generation types
export interface MetadataConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  product?: {
    price: number;
    currency: string;
    availability: 'in_stock' | 'out_of_stock';
    brand: string;
    category: string;
  };
}