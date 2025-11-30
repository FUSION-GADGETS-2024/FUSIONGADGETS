// Mock product data matching the existing SPA structure exactly
import { Product, Review } from '../types';

// Product images - using the same structure as SPA
const productImages = {
  laptop: '/assets/laptop-pro.jpg',
  headphones: '/assets/headphones-premium.jpg',
  smartwatch: '/assets/smartwatch-elite.jpg',
  tablet: '/assets/tablet-ultra.jpg',
  earbuds: '/assets/earbuds-pro.jpg',
  keyboard: '/assets/keyboard-mech.jpg',
};

export const products: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    slug: 'macbook-pro-16',
    description: 'The ultimate pro notebook. MacBook Pro features the powerful M2 Pro or M2 Max chip, up to 22 hours of battery life, and a stunning Liquid Retina XDR display.',
    price: 2499.00,
    mrp: 2999.00,
    discount: 17,
    images: [
      {
        id: '1-1',
        url: productImages.laptop,
        alt: 'MacBook Pro 16" - Front View',
        width: 800,
        height: 600,
        isPrimary: true,
      }
    ],
    category: 'Laptops',
    categoryId: 'laptops',
    brand: 'Apple',
    brandId: 'apple',
    rating: 4.8,
    reviewCount: 128,
    inStock: true,
    specs: [
      'Apple M2 Pro chip',
      '16GB unified memory',
      '512GB SSD storage',
      '16-inch Liquid Retina XDR display',
      'Up to 22 hours battery life'
    ],
    specifications: [
      { name: 'Processor', value: 'Apple M2 Pro chip', category: 'Performance' },
      { name: 'Memory', value: '16GB unified memory', category: 'Performance' },
      { name: 'Storage', value: '512GB SSD storage', category: 'Storage' },
      { name: 'Display', value: '16-inch Liquid Retina XDR display', category: 'Display' },
      { name: 'Battery Life', value: 'Up to 22 hours', category: 'Power' },
    ],
    isNew: true,
    isHotDeal: false,
    isFeatured: true,
    seo: {
      title: 'MacBook Pro 16" - Apple M2 Pro Chip | Fusion Gadgets',
      description: 'Shop the MacBook Pro 16" with Apple M2 Pro chip. Features 16GB memory, 512GB storage, and stunning Liquid Retina XDR display. Free shipping available.',
      keywords: ['macbook pro', 'apple laptop', 'm2 pro chip', 'professional laptop'],
      structuredData: {
        '@type': 'Product',
        name: 'MacBook Pro 16"',
        brand: 'Apple',
        category: 'Laptops',
        price: 2499.00,
        availability: 'in_stock',
      }
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-11-29'),
  },
  {
    id: '2',
    name: 'AirPods Max Premium',
    slug: 'airpods-max-premium',
    description: 'Computational audio. Listen, it\'s powerful. Premium over-ear headphones with Active Noise Cancellation, Transparency mode, and spatial audio.',
    price: 549.00,
    mrp: 649.00,
    discount: 15,
    images: [
      {
        id: '2-1',
        url: productImages.headphones,
        alt: 'AirPods Max Premium - Side View',
        width: 800,
        height: 600,
        isPrimary: true,
      }
    ],
    category: 'Audio',
    categoryId: 'audio',
    brand: 'Apple',
    brandId: 'apple',
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
    specs: [
      'Active Noise Cancellation',
      'Transparency mode',
      'Spatial audio with dynamic head tracking',
      'Up to 20 hours of listening time',
      'Premium stainless steel frame'
    ],
    specifications: [
      { name: 'Noise Cancellation', value: 'Active Noise Cancellation', category: 'Audio' },
      { name: 'Transparency Mode', value: 'Yes', category: 'Audio' },
      { name: 'Spatial Audio', value: 'Dynamic head tracking', category: 'Audio' },
      { name: 'Battery Life', value: 'Up to 20 hours', category: 'Power' },
      { name: 'Frame Material', value: 'Stainless steel', category: 'Build' },
    ],
    isNew: false,
    isHotDeal: true,
    isFeatured: true,
    seo: {
      title: 'AirPods Max Premium - Active Noise Cancellation | Fusion Gadgets',
      description: 'Experience premium audio with AirPods Max. Features Active Noise Cancellation, spatial audio, and 20-hour battery life. Shop now with free shipping.',
      keywords: ['airpods max', 'noise cancelling headphones', 'apple audio', 'premium headphones'],
      structuredData: {
        '@type': 'Product',
        name: 'AirPods Max Premium',
        brand: 'Apple',
        category: 'Audio',
        price: 549.00,
        availability: 'in_stock',
      }
    },
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-11-29'),
  },
  {
    id: '3',
    name: 'Apple Watch Ultra',
    slug: 'apple-watch-ultra',
    description: 'The most rugged and capable Apple Watch ever. Featuring a 49mm titanium case, precision dual-frequency GPS, and up to 36 hours of battery life.',
    price: 799.00,
    mrp: 899.00,
    discount: 11,
    images: [
      {
        id: '3-1',
        url: productImages.smartwatch,
        alt: 'Apple Watch Ultra - Front View',
        width: 800,
        height: 600,
        isPrimary: true,
      }
    ],
    category: 'Wearables',
    categoryId: 'wearables',
    brand: 'Apple',
    brandId: 'apple',
    rating: 4.9,
    reviewCount: 156,
    inStock: true,
    specs: [
      '49mm titanium case',
      'Precision dual-frequency GPS',
      'Water resistant to 100m',
      'Up to 36 hours battery life',
      'Action button for quick control'
    ],
    specifications: [
      { name: 'Case Size', value: '49mm', category: 'Design' },
      { name: 'Case Material', value: 'Titanium', category: 'Design' },
      { name: 'GPS', value: 'Precision dual-frequency', category: 'Navigation' },
      { name: 'Water Resistance', value: '100m', category: 'Durability' },
      { name: 'Battery Life', value: 'Up to 36 hours', category: 'Power' },
    ],
    isNew: true,
    isHotDeal: false,
    isFeatured: false,
    seo: {
      title: 'Apple Watch Ultra - 49mm Titanium Case | Fusion Gadgets',
      description: 'The most rugged Apple Watch with 49mm titanium case, dual-frequency GPS, and 36-hour battery. Perfect for outdoor adventures.',
      keywords: ['apple watch ultra', 'titanium smartwatch', 'rugged watch', 'gps watch'],
      structuredData: {
        '@type': 'Product',
        name: 'Apple Watch Ultra',
        brand: 'Apple',
        category: 'Wearables',
        price: 799.00,
        availability: 'in_stock',
      }
    },
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-11-29'),
  },
  {
    id: '4',
    name: 'iPad Pro 12.9"',
    slug: 'ipad-pro-12-9',
    description: 'The ultimate iPad experience with the powerful M2 chip, stunning Liquid Retina XDR display, and ultrafast wireless connectivity.',
    price: 1099.00,
    mrp: 1299.00,
    discount: 15,
    images: [
      {
        id: '4-1',
        url: productImages.tablet,
        alt: 'iPad Pro 12.9" - Front View',
        width: 800,
        height: 600,
        isPrimary: true,
      }
    ],
    category: 'Tablets',
    categoryId: 'tablets',
    brand: 'Apple',
    brandId: 'apple',
    rating: 4.6,
    reviewCount: 94,
    inStock: true,
    specs: [
      'Apple M2 chip',
      '12.9-inch Liquid Retina XDR display',
      '128GB storage',
      'ProMotion technology',
      'Face ID for secure authentication'
    ],
    specifications: [
      { name: 'Processor', value: 'Apple M2 chip', category: 'Performance' },
      { name: 'Display', value: '12.9-inch Liquid Retina XDR', category: 'Display' },
      { name: 'Storage', value: '128GB', category: 'Storage' },
      { name: 'Refresh Rate', value: 'ProMotion technology', category: 'Display' },
      { name: 'Authentication', value: 'Face ID', category: 'Security' },
    ],
    isNew: false,
    isHotDeal: true,
    isFeatured: true,
    seo: {
      title: 'iPad Pro 12.9" - Apple M2 Chip | Fusion Gadgets',
      description: 'Experience the ultimate iPad with M2 chip and Liquid Retina XDR display. Perfect for creative professionals and productivity.',
      keywords: ['ipad pro', 'apple tablet', 'm2 chip', 'liquid retina xdr'],
      structuredData: {
        '@type': 'Product',
        name: 'iPad Pro 12.9"',
        brand: 'Apple',
        category: 'Tablets',
        price: 1099.00,
        availability: 'in_stock',
      }
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-11-29'),
  },
  {
    id: '5',
    name: 'AirPods Pro',
    slug: 'airpods-pro',
    description: 'Magic like you\'ve never heard. Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio in a new, more comfortable design.',
    price: 249.00,
    mrp: 299.00,
    discount: 17,
    images: [
      {
        id: '5-1',
        url: productImages.earbuds,
        alt: 'AirPods Pro - With Case',
        width: 800,
        height: 600,
        isPrimary: true,
      }
    ],
    category: 'Audio',
    categoryId: 'audio',
    brand: 'Apple',
    brandId: 'apple',
    rating: 4.5,
    reviewCount: 203,
    inStock: false,
    specs: [
      'Active Noise Cancellation',
      'Adaptive Audio',
      'Transparency mode',
      'Up to 6 hours listening time',
      'MagSafe Charging Case'
    ],
    specifications: [
      { name: 'Noise Cancellation', value: 'Active Noise Cancellation', category: 'Audio' },
      { name: 'Adaptive Audio', value: 'Yes', category: 'Audio' },
      { name: 'Transparency Mode', value: 'Yes', category: 'Audio' },
      { name: 'Battery Life', value: 'Up to 6 hours', category: 'Power' },
      { name: 'Charging Case', value: 'MagSafe compatible', category: 'Charging' },
    ],
    isNew: true,
    isHotDeal: false,
    isFeatured: false,
    seo: {
      title: 'AirPods Pro - Active Noise Cancellation | Fusion Gadgets',
      description: 'Experience magic with AirPods Pro. Features Active Noise Cancellation, Adaptive Audio, and MagSafe charging case.',
      keywords: ['airpods pro', 'wireless earbuds', 'noise cancelling', 'apple audio'],
      structuredData: {
        '@type': 'Product',
        name: 'AirPods Pro',
        brand: 'Apple',
        category: 'Audio',
        price: 249.00,
        availability: 'out_of_stock',
      }
    },
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-11-29'),
  },
  {
    id: '6',
    name: 'Magic Keyboard Pro',
    slug: 'magic-keyboard-pro',
    description: 'Precision typing experience with a sleek, minimalist design. Features scissor mechanism keys with 1mm travel and numeric keypad.',
    price: 349.00,
    mrp: 429.00,
    discount: 19,
    images: [
      {
        id: '6-1',
        url: productImages.keyboard,
        alt: 'Magic Keyboard Pro - Top View',
        width: 800,
        height: 600,
        isPrimary: true,
      }
    ],
    category: 'Accessories',
    categoryId: 'accessories',
    brand: 'Apple',
    brandId: 'apple',
    rating: 4.4,
    reviewCount: 67,
    inStock: true,
    specs: [
      'Scissor mechanism keys',
      'Numeric keypad',
      'Rechargeable battery',
      'Bluetooth connectivity',
      'Space Gray finish'
    ],
    specifications: [
      { name: 'Key Mechanism', value: 'Scissor mechanism', category: 'Input' },
      { name: 'Layout', value: 'Full size with numeric keypad', category: 'Design' },
      { name: 'Battery', value: 'Rechargeable', category: 'Power' },
      { name: 'Connectivity', value: 'Bluetooth', category: 'Connectivity' },
      { name: 'Color', value: 'Space Gray', category: 'Design' },
    ],
    isNew: false,
    isHotDeal: true,
    isFeatured: false,
    seo: {
      title: 'Magic Keyboard Pro - Wireless Keyboard | Fusion Gadgets',
      description: 'Professional wireless keyboard with scissor mechanism keys, numeric keypad, and rechargeable battery. Perfect for productivity.',
      keywords: ['magic keyboard', 'wireless keyboard', 'apple keyboard', 'bluetooth keyboard'],
      structuredData: {
        '@type': 'Product',
        name: 'Magic Keyboard Pro',
        brand: 'Apple',
        category: 'Accessories',
        price: 349.00,
        availability: 'in_stock',
      }
    },
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-11-29'),
  },
];

export const reviews: Review[] = [
  {
    id: 1,
    author: "Sarah Johnson",
    rating: 5,
    date: "2 weeks ago",
    comment: "Absolutely love this product! The quality is exceptional and it exceeded all my expectations. Worth every penny.",
    verified: true,
    productId: '1'
  },
  {
    id: 2,
    author: "Michael Chen",
    rating: 4,
    date: "1 month ago",
    comment: "Great product overall. Performance is solid and the design is beautiful. Only minor issue is the price, but you get what you pay for.",
    verified: true,
    productId: '1'
  },
  {
    id: 3,
    author: "Emma Davis",
    rating: 5,
    date: "1 month ago",
    comment: "This has been a game-changer for my workflow. Highly recommend to anyone looking for a premium experience.",
    verified: false,
    productId: '2'
  },
  {
    id: 4,
    author: "James Wilson",
    rating: 4,
    date: "2 months ago",
    comment: "Very satisfied with my purchase. The build quality is excellent and it works flawlessly. Customer service was also great.",
    verified: true,
    productId: '2'
  },
  {
    id: 5,
    author: "Lisa Rodriguez",
    rating: 5,
    date: "3 weeks ago",
    comment: "Amazing battery life and the GPS accuracy is incredible. Perfect for my outdoor adventures.",
    verified: true,
    productId: '3'
  },
  {
    id: 6,
    author: "David Kim",
    rating: 4,
    date: "1 month ago",
    comment: "The display quality is stunning and the M2 chip handles everything I throw at it. Great for creative work.",
    verified: true,
    productId: '4'
  },
];

// Helper functions for data access
export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'All') return products;
  return products.filter(product => product.category === category);
}

export function getProductsByBrand(brand: string): Product[] {
  return products.filter(product => product.brand === brand);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.isFeatured);
}

export function getNewArrivals(): Product[] {
  return products.filter(product => product.isNew);
}

export function getHotDeals(): Product[] {
  return products.filter(product => product.isHotDeal);
}

export function getInStockProducts(): Product[] {
  return products.filter(product => product.inStock);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    product.brand.toLowerCase().includes(lowercaseQuery)
  );
}

export function getReviewsForProduct(productId: string): Review[] {
  return reviews.filter(review => review.productId === productId);
}

export function getSimilarProducts(productId: string, limit: number = 3): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products
    .filter(p => p.category === product.category && p.id !== productId)
    .slice(0, limit);
}

export function getProductCategories(): string[] {
  return Array.from(new Set(products.map(product => product.category)));
}

export function getProductBrands(): string[] {
  return Array.from(new Set(products.map(product => product.brand)));
}

export function getAllProducts(): Product[] {
  return products;
}