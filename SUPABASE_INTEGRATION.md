# Supabase Integration - Complete Guide

## Overview

This project now uses **Supabase** as the backend for:
- ✅ Authentication (Email/Password, Social Login)
- ✅ Database (PostgreSQL with Row Level Security)
- ✅ Real-time subscriptions (optional)
- ✅ Storage (for future image uploads)

## Architecture

### Frontend (Next.js 14+)
- **SSG (Static Site Generation)** - Product pages pre-rendered at build time
- **ISR (Incremental Static Regeneration)** - Products updated periodically
- **Dynamic Routes** - User-specific pages (profile, orders, cart)
- **Client Components** - Interactive UI with React hooks
- **Server Components** - Data fetching and SEO optimization

### Backend (Supabase)
- **PostgreSQL Database** - Relational database with full SQL support
- **Row Level Security** - Fine-grained access control
- **Auth** - Built-in authentication with JWT tokens
- **Realtime** - WebSocket connections for live updates
- **Edge Functions** - Serverless functions (optional)

## Database Schema

### Products & Catalog

```sql
categories
├── id (uuid, primary key)
├── name (text, unique)
├── slug (text, unique)
├── description (text)
├── image (text)
├── parent_id (uuid, foreign key → categories)
├── product_count (integer)
├── is_active (boolean)
├── created_at (timestamptz)
└── updated_at (timestamptz)

brands
├── id (uuid, primary key)
├── name (text, unique)
├── slug (text, unique)
├── logo (text)
├── description (text)
├── created_at (timestamptz)
└── updated_at (timestamptz)

products
├── id (uuid, primary key)
├── name (text)
├── slug (text, unique)
├── description (text)
├── price (decimal)
├── mrp_price (decimal)
├── discount (integer, computed)
├── category_id (uuid, foreign key → categories)
├── brand_id (uuid, foreign key → brands)
├── rating (decimal)
├── review_count (integer)
├── stock (integer)
├── in_stock (boolean, computed)
├── status (text: Active/Inactive/Draft)
├── is_new (boolean)
├── is_hot_deal (boolean)
├── is_featured (boolean)
├── seller_id (text)
├── advertised (boolean)
├── advertised_until (timestamptz)
├── campaign_name (text)
├── created_at (timestamptz)
└── updated_at (timestamptz)

product_images
├── id (uuid, primary key)
├── product_id (uuid, foreign key → products)
├── url (text)
├── alt (text)
├── width (integer)
├── height (integer)
├── is_primary (boolean)
├── display_order (integer)
└── created_at (timestamptz)

product_specifications
├── id (uuid, primary key)
├── product_id (uuid, foreign key → products)
├── name (text)
├── value (text)
├── category (text)
├── display_order (integer)
└── created_at (timestamptz)

product_features
├── id (uuid, primary key)
├── product_id (uuid, foreign key → products)
├── feature (text)
├── display_order (integer)
└── created_at (timestamptz)

product_tags
├── id (uuid, primary key)
├── product_id (uuid, foreign key → products)
├── tag (text)
└── created_at (timestamptz)
```

### Users & Authentication

```sql
profiles (extends auth.users)
├── id (uuid, primary key, foreign key → auth.users)
├── email (text, unique)
├── name (text)
├── avatar (text)
├── phone (text)
├── theme (text: light/dark/system)
├── currency (text)
├── language (text)
├── email_notifications (boolean)
├── push_notifications (boolean)
├── sms_notifications (boolean)
├── created_at (timestamptz)
└── updated_at (timestamptz)

addresses
├── id (uuid, primary key)
├── user_id (uuid, foreign key → auth.users)
├── first_name (text)
├── last_name (text)
├── company (text)
├── address1 (text)
├── address2 (text)
├── city (text)
├── state (text)
├── postal_code (text)
├── country (text)
├── phone (text)
├── is_default (boolean)
├── address_type (text: shipping/billing/both)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### Shopping & Orders

```sql
carts
├── id (uuid, primary key)
├── user_id (uuid, foreign key → auth.users)
├── session_id (text)
├── created_at (timestamptz)
└── updated_at (timestamptz)

cart_items
├── id (uuid, primary key)
├── cart_id (uuid, foreign key → carts)
├── product_id (uuid, foreign key → products)
├── quantity (integer)
├── selected_variant (text)
├── added_at (timestamptz)
└── updated_at (timestamptz)

wishlists
├── id (uuid, primary key)
├── user_id (uuid, foreign key → auth.users)
├── created_at (timestamptz)
└── updated_at (timestamptz)

wishlist_items
├── id (uuid, primary key)
├── wishlist_id (uuid, foreign key → wishlists)
├── product_id (uuid, foreign key → products)
└── added_at (timestamptz)

orders
├── id (uuid, primary key)
├── user_id (uuid, foreign key → auth.users)
├── order_number (text, unique)
├── status (text: pending/processing/shipped/delivered/cancelled)
├── subtotal (decimal)
├── tax (decimal)
├── shipping (decimal)
├── total (decimal)
├── payment_method (text)
├── payment_status (text: pending/paid/failed/refunded)
├── tracking_number (text)
├── shipping_address_id (uuid, foreign key → addresses)
├── billing_address_id (uuid, foreign key → addresses)
├── notes (text)
├── created_at (timestamptz)
└── updated_at (timestamptz)

order_items
├── id (uuid, primary key)
├── order_id (uuid, foreign key → orders)
├── product_id (uuid, foreign key → products)
├── product_name (text)
├── product_price (decimal)
├── quantity (integer)
├── subtotal (decimal)
└── created_at (timestamptz)

reviews
├── id (uuid, primary key)
├── product_id (uuid, foreign key → products)
├── user_id (uuid, foreign key → auth.users)
├── rating (integer, 1-5)
├── comment (text)
├── verified (boolean)
├── helpful_count (integer)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

## Row Level Security (RLS) Policies

### Public Access
- ✅ Products (Active status only)
- ✅ Categories
- ✅ Brands
- ✅ Product Images
- ✅ Product Specifications
- ✅ Product Features
- ✅ Reviews

### Authenticated Users
- ✅ Own profile (read/update)
- ✅ Own addresses (CRUD)
- ✅ Own cart (CRUD)
- ✅ Own wishlist (CRUD)
- ✅ Own orders (read/create)
- ✅ Own reviews (CRUD)

### Admin/Service Role
- ✅ All products (CRUD)
- ✅ All categories (CRUD)
- ✅ All brands (CRUD)
- ✅ Product management

## API Routes

### Authentication
```typescript
POST /api/auth/signup
POST /api/auth/signin
POST /api/auth/signout
GET  /api/auth/user
```

### Products (Future)
```typescript
GET  /api/products              // List with filters
GET  /api/products/[slug]       // Get by slug
GET  /api/products/featured     // Featured products
GET  /api/products/search       // Search
```

## Client-Side Usage

### Authentication

```typescript
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth();
  
  const handleSignIn = async () => {
    const { error } = await signIn('email@example.com', 'password');
    if (error) console.error(error);
  };
  
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
    </div>
  );
}
```

### Fetching Products

```typescript
// Server Component
import { getAllProducts } from '@/lib/supabase/queries';

export default async function ProductsPage() {
  const products = await getAllProducts();
  return <ProductList products={products} />;
}

// Client Component with React Query
import { useQuery } from '@tanstack/react-query';

function ProductList() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      return res.json();
    },
  });
  
  if (isLoading) return <div>Loading...</div>;
  return <div>{/* Render products */}</div>;
}
```

## Server-Side Usage

### Protected Routes

```typescript
// app/profile/page.tsx
import { requireAuth } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const user = await requireAuth();
  
  if (!user) {
    redirect('/login?returnUrl=/profile');
  }
  
  return <div>Welcome, {user.email}!</div>;
}
```

### Database Queries

```typescript
import { createClient } from '@/lib/supabase/server';

export async function getProducts() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), brands(*)')
    .eq('status', 'Active')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}
```

## Performance Optimizations

### Caching Strategy
- **Static Pages**: Products, categories (revalidated every 1 hour)
- **Dynamic Pages**: User profile, cart, orders (no caching)
- **API Routes**: Cached with stale-while-revalidate

### Database Indexes
All critical queries have indexes:
- Products: category_id, brand_id, slug, status, featured, new, hot_deal
- Cart items: cart_id, product_id
- Orders: user_id, status
- Reviews: product_id, user_id

### Query Optimization
- Select only needed columns
- Use joins instead of multiple queries
- Implement pagination for large datasets
- Use computed columns for discount and in_stock

## Security Best Practices

### Environment Variables
```env
# Never commit these to version control!
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...  # Safe for client
SUPABASE_SERVICE_ROLE_KEY=eyJ...     # Server-only!
```

### RLS Policies
- All tables have RLS enabled
- Users can only access their own data
- Public data is read-only
- Admin operations require service role

### Authentication
- JWT tokens stored in HTTP-only cookies
- Automatic token refresh
- Session validation on every request
- Protected routes via middleware

## Migration Guide

### From Mock Data to Supabase

1. **Run migrations** to create database schema
2. **Import products** using migration script
3. **Update components** to use Supabase queries
4. **Test authentication** flow
5. **Deploy** to production

### Backward Compatibility

The old `auth.ts` file is kept for compatibility but now uses Supabase internally. New code should use:
- `useAuth()` hook for client components
- `authServer` functions for server components
- `requireAuth()` for protected pages

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your-production-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Monitoring & Debugging

### Supabase Dashboard
- **Auth**: Monitor signups, logins, sessions
- **Database**: View tables, run queries
- **Logs**: Check API logs and errors
- **Performance**: Monitor query performance

### Next.js
- Use `console.log` in Server Components (shows in terminal)
- Use browser DevTools for Client Components
- Check Network tab for API calls
- Monitor Vercel Analytics for performance

## Future Enhancements

- [ ] Real-time cart updates
- [ ] Product recommendations
- [ ] Advanced search with filters
- [ ] Image upload to Supabase Storage
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] Payment integration (Stripe)
- [ ] Order tracking
- [ ] Product reviews moderation

## Support

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Quick Start Guide](./QUICKSTART.md)
- [Setup Guide](./SUPABASE_SETUP.md)

---

**Built with ❤️ using Next.js 14 and Supabase**
