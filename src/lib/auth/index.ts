// Re-export the new optimized auth system
export { useAuth, useProfile, useAuthStore } from './auth-store';
export { AuthProvider } from './auth-provider';
export { useCart } from './cart-hooks';
export { useWishlist } from './wishlist-hooks';
export * from './queries';

// Export types
export type { Profile } from './auth-store';