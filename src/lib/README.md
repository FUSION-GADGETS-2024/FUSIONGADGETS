# Data Layer Documentation

This directory contains the comprehensive data layer for the Fusion Gadgets Next.js application, implementing modern data fetching patterns and type safety.

## Structure

```
src/lib/
├── data/                     # Core data and API functions
│   ├── products.ts          # Product data and utilities
│   ├── categories.ts        # Category data and utilities
│   ├── api.ts              # API simulation and data fetching
│   └── __tests__/          # Unit and property tests
├── types.ts                # TypeScript type definitions
├── utils.ts               # Utility functions (migrated from SPA)
├── seo.ts                 # SEO metadata and structured data utilities
├── data-fetching.ts       # Next.js 16+ data fetching patterns
└── index.ts               # Main exports
```

## Key Features

### 1. Type Safety
- Comprehensive TypeScript interfaces for all data models
- Strict type checking for Product, Category, User, Cart, and Order entities
- Type-safe API responses and error handling

### 2. Next.js 16+ Patterns
- React `cache()` for Server Component data fetching
- ISR (Incremental Static Regeneration) configuration
- Static generation helpers for SSG pages
- Client-side data service for CSR pages

### 3. SEO Optimization
- Metadata generation for products and categories
- JSON-LD structured data for search engines
- Open Graph and Twitter Card support
- Sitemap generation utilities

### 4. Data Compatibility
- Exact data structure matching from original SPA
- Backward compatibility with existing component props
- Seamless migration path from React Query to Next.js patterns

## Usage Examples

### Server Components (SSG/ISR)

```typescript
import { getProducts, getProductById } from '@/lib/data-fetching';

// In a Server Component
export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}

// For ISR pages
export const revalidate = 3600; // 1 hour
```

### Client Components (CSR)

```typescript
import { ClientDataService } from '@/lib/data-fetching';

// In a Client Component
const cart = await ClientDataService.getCart(userId);
await ClientDataService.addToCart(userId, productId, quantity);
```

### SEO Metadata

```typescript
import { generateProductMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) return {};
  
  return generateProductMetadata(product);
}
```

## Data Models

### Product
- Complete product information with images, specifications, and SEO data
- Pricing with MRP, discount calculations
- Inventory status and categorization
- Review and rating aggregation

### Category
- Hierarchical category structure
- SEO-optimized category pages
- Product count and filtering support

### User & Cart
- User preferences and authentication data
- Shopping cart with item management
- Order history and wishlist functionality

## Testing

The data layer includes comprehensive testing:

- **Unit Tests**: Core functionality and edge cases
- **Property Tests**: Data consistency across operations using fast-check
- **Integration Tests**: API simulation and data flow

Run tests:
```bash
npm test              # Run all tests once
npm run test:watch    # Run tests in watch mode
```

## Migration Notes

This data layer maintains 100% compatibility with the original SPA while adding:

1. **Enhanced Type Safety**: Stricter TypeScript definitions
2. **Next.js Optimization**: Server-side rendering and static generation
3. **SEO Enhancement**: Structured data and metadata generation
4. **Performance**: Caching and optimized data fetching
5. **Testing**: Comprehensive test coverage with property-based testing

## Configuration

### Environment Variables
- `NEXT_PUBLIC_SITE_URL`: Base URL for SEO and metadata
- `NEXT_PUBLIC_API_URL`: API endpoint for client-side requests

### ISR Settings
- Default revalidation: 3600 seconds (1 hour)
- Configurable per page type (products, categories, etc.)

## Future Enhancements

- Real API integration (currently uses mock data)
- Database connection and ORM integration
- Advanced caching strategies (Redis, etc.)
- Real-time inventory updates
- Advanced search and filtering capabilities