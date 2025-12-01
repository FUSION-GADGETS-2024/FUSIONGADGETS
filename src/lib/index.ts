// Main library exports
export * from './types';
export * from './utils';
export * from './seo';

// Re-export specific data functions to avoid conflicts
export { 
  products, 
  reviews, 
  categories, 
  categoryImages 
} from './data';