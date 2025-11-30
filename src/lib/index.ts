// Main library exports
export * from './types';
export * from './utils';
export * from './seo';
export * from './data-fetching';

// Re-export specific data functions to avoid conflicts
export { 
  products, 
  reviews, 
  categories, 
  categoryImages 
} from './data';