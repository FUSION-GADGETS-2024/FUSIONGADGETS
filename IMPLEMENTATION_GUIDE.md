# 🚀 Implementation Guide: Auth, Cart & Wishlist Integration

## 📋 Overview

This guide provides step-by-step instructions to integrate the hybrid cart and wishlist system while maintaining SSR/ISR/SSG architecture.

---

## ✅ COMPLETED

1. ✅ **Analysis Document** (`AUTH_CART_WISHLIST_ANALYSIS.md`)
   - Identified all loopholes and inconsistencies
   - Proposed solutions with architecture compliance

2. ✅ **Database Migration** (`supabase/migrations/003_auth_cart_wishlist_fixes.sql`)
   - Auto-create profile on user signup
   - Auto-create wishlist on user signup
   - Helper functions for cart/wishlist operations
   - Database views for easier querying
   - Performance indexes

3. ✅ **Hybrid Cart Hook** (`src/lib/hooks/use-cart-hybrid.ts`)
   - localStorage for guests
   - Database for authenticated users
   - Auto-sync on login
   - Optimistic updates

4. ✅ **Hybrid Wishlist Hook** (`src/lib/hooks/use-wishlist-hybrid.ts`)
   - localStorage for guests
   - Database for authenticated users
   - Auto-sync on login
   - Optimistic updates

---

## 🔧 IMPLEMENTATION STEPS

### Step 1: Run Database Migration

```bash
# Apply the migration to your Supabase database
supabase db push

# Or manually run the SQL file in Supabase Dashboard
# Go to SQL Editor and paste the contents of:
# supabase/migrations/003_auth_cart_wishlist_fixes.sql
```

**What this does:**
- Creates triggers to auto-create profiles and wishlists
- Adds helper functions for cart/wishlist operations
- Creates database views for efficient querying
- Adds performance indexes

---

### Step 2: Update Cart API Routes

The cart API routes need to be updated to use the new database functions.

**Files to update:**
- `src/app/api/cart/add/route.ts`
- `src/app/api/cart/remove/route.ts`
- `src/app/api/cart/update/route.ts`
- `src/app/api/cart/merge/route.ts`
- `src/app/api/cart/clear/route.ts`

**Key changes:**
- Use `get_or_create_cart()` function
- Use `cart_items_with_products` view for fetching
- Handle both user_id and session_id

---

### Step 3: Update Wishlist API Routes

**Files to update:**
- `src/app/api/wishlist/add/route.ts`
- `src/app/api/wishlist/remove/route.ts`

**Key changes:**
- Use `get_or_create_wishlist()` function
- Use `wishlist_items_with_products` view for fetching

---

### Step 4: Replace Cart Context

**Option A: Gradual Migration (Recommended)**
1. Keep existing `cart-context.tsx` for backward compatibility
2. Create new components that use `use-cart-hybrid.ts`
3. Gradually migrate components one by one

**Option B: Full Replacement**
1. Replace `cart-context.tsx` with hybrid hook
2. Update all components at once

**Components to update:**
- `src/components/AddToCartButton.tsx`
- `src/components/ProductCardActions.tsx`
- `src/components/HeaderClient.tsx`
- `src/app/cart/page.tsx`

---

### Step 5: Replace Wishlist Context

**Components to update:**
- `src/components/WishlistButton.tsx`
- `src/components/ProductCardActions.tsx`
- `src/app/wishlist/page.tsx`

---

### Step 6: Convert Cart Page to Hybrid Rendering

**Current:** Full CSR (Client-Side Rendering)
**Target:** Hybrid (Server + Client)

**New structure:**
```typescript
// src/app/cart/page.tsx (Server Component)
import { authServer } from '@/lib/supabase/auth';
import { CartContent } from './cart-content';

export default async function CartPage() {
  const { user } = await authServer.getUser();
  
  // Fetch cart items server-side for authenticated users
  let initialItems = null;
  if (user) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/cart`, {
      headers: { 'Cookie': cookies().toString() },
      cache: 'no-store',
    });
    if (response.ok) {
      const data = await response.json();
      initialItems = data.data?.items || [];
    }
  }
  
  return <CartContent initialItems={initialItems} />;
}

// src/app/cart/cart-content.tsx (Client Component)
'use client';
export function CartContent({ initialItems }) {
  const { state, addItem, removeItem, updateQuantity } = useCartHybrid();
  
  // Use initialItems from server for first render
  // Then use state from hook for updates
}
```

---

### Step 7: Convert Wishlist Page to Hybrid Rendering

**Current:** Full CSR with N+1 queries
**Target:** Hybrid with single server-side query

**New structure:**
```typescript
// src/app/wishlist/page.tsx (Server Component)
import { authServer } from '@/lib/supabase/auth';
import { WishlistContent } from './wishlist-content';
import { getWishlistProducts } from '@/lib/supabase/queries';

export default async function WishlistPage() {
  const { user } = await authServer.getUser();
  
  // Fetch all wishlist products server-side (single query)
  let products = [];
  if (user) {
    products = await getWishlistProducts(user.id);
  }
  
  return <WishlistContent initialProducts={products} />;
}

// src/app/wishlist/wishlist-content.tsx (Client Component)
'use client';
export function WishlistContent({ initialProducts }) {
  const { items, removeFromWishlist } = useWishlistHybrid();
  
  // Display initialProducts from server
  // Use items for add/remove operations
}
```

---

### Step 8: Add Server-Side Auth Protection

**Create middleware for protected routes:**

```typescript
// src/lib/auth-middleware.ts
import { authServer } from './supabase/auth';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const { user } = await authServer.getUser();
  if (!user) {
    redirect('/login?redirect=' + encodeURIComponent(window.location.pathname));
  }
  return user;
}
```

**Apply to protected pages:**
```typescript
// src/app/profile/page.tsx
export default async function ProfilePage() {
  const user = await requireAuth(); // Server-side auth check
  const profile = await getProfile(user.id);
  
  return <ProfileContent profile={profile} />;
}
```

---

### Step 9: Update Header Cart Count (Server Component)

**Current:** Client-side cart count
**Target:** Server-side cart count for authenticated users

```typescript
// src/components/Header.tsx (Server Component)
import { authServer } from '@/lib/supabase/auth';
import { getCartCount } from '@/lib/supabase/queries';
import { HeaderClient } from './HeaderClient';

export async function Header() {
  const { user } = await authServer.getUser();
  
  let cartCount = 0;
  if (user) {
    cartCount = await getCartCount(user.id);
  }
  
  return <HeaderClient initialCartCount={cartCount} />;
}

// src/components/HeaderClient.tsx (Client Component)
'use client';
export function HeaderClient({ initialCartCount }) {
  const { state } = useCartHybrid();
  
  // Use initialCartCount for first render
  // Then use state.count for updates
  const count = state.count || initialCartCount;
  
  return (
    // ... header UI with cart count
  );
}
```

---

### Step 10: Add Supabase Query Functions

**Create new query functions:**

```typescript
// src/lib/supabase/queries.ts

// Get cart count for user
export async function getCartCount(userId: string): Promise<number> {
  const supabase = await createServerClient();
  
  const { data } = await supabase
    .from('cart_items')
    .select('quantity', { count: 'exact' })
    .eq('cart_id', (
      await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .single()
    ).data?.id || '');
  
  return data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
}

// Get wishlist products (single query, no N+1)
export async function getWishlistProducts(userId: string): Promise<Product[]> {
  const supabase = await createServerClient();
  
  const { data } = await supabase
    .from('wishlist_items_with_products')
    .select('*')
    .eq('wishlist_id', (
      await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', userId)
        .single()
    ).data?.id || '');
  
  return data?.map(item => transformWishlistProduct(item)) || [];
}
```

---

## 🧪 TESTING CHECKLIST

### Guest User Flow
- [ ] Add product to cart (localStorage)
- [ ] Add product to wishlist (localStorage)
- [ ] View cart page
- [ ] View wishlist page
- [ ] Sign up
- [ ] Verify cart merged to database
- [ ] Verify wishlist merged to database
- [ ] Verify localStorage cleared

### Authenticated User Flow
- [ ] Login
- [ ] Add product to cart (database)
- [ ] Add product to wishlist (database)
- [ ] View cart page (server-rendered)
- [ ] View wishlist page (server-rendered)
- [ ] Logout
- [ ] Verify cart/wishlist cleared

### Cross-Device Sync
- [ ] Login on Device A
- [ ] Add items to cart/wishlist
- [ ] Login on Device B
- [ ] Verify cart/wishlist synced

### Performance
- [ ] Wishlist page loads with single query (no N+1)
- [ ] Cart page server-rendered for authenticated users
- [ ] Header cart count server-rendered

---

## 🔒 SECURITY CHECKLIST

- [ ] RLS policies enabled on all tables
- [ ] User can only access their own cart/wishlist
- [ ] Server-side auth checks on protected routes
- [ ] API routes validate user authentication
- [ ] No sensitive data in localStorage
- [ ] CSRF protection enabled

---

## 📊 PERFORMANCE METRICS

### Before
- Wishlist: N+1 queries (1 + N products)
- Cart: Client-side only
- No cross-device sync
- Data loss on localStorage clear

### After
- Wishlist: 1 query (with JOIN)
- Cart: Server-rendered for auth users
- Cross-device sync
- Persistent in database

---

## 🐛 TROUBLESHOOTING

### Issue: Cart not syncing on login
**Solution:** Check that `merge_guest_cart_to_user()` function is called in auth-context

### Issue: Wishlist showing old data
**Solution:** Call `refreshWishlist()` after login

### Issue: N+1 queries still happening
**Solution:** Use `wishlist_items_with_products` view instead of separate queries

### Issue: Hydration mismatch
**Solution:** Use `mounted` state to prevent SSR/CSR mismatch

---

## 📚 ADDITIONAL RESOURCES

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js Hybrid Rendering](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

---

## 🎯 NEXT STEPS

After completing this implementation:

1. **Add Real-time Sync** (Optional)
   - Use Supabase Realtime for live cart/wishlist updates
   - Sync across multiple tabs/devices instantly

2. **Add Optimistic UI** (Optional)
   - Update UI immediately before server response
   - Rollback on error

3. **Add Address Management**
   - Create UI for managing shipping/billing addresses
   - Required for checkout flow

4. **Add Order History**
   - Server-side fetch of user orders
   - Display order status and tracking

5. **Add Analytics**
   - Track cart abandonment
   - Track wishlist conversion
   - A/B test checkout flow

---

## ✅ COMPLETION CRITERIA

Implementation is complete when:

- [ ] All database migrations applied
- [ ] All API routes updated
- [ ] Cart uses hybrid hook
- [ ] Wishlist uses hybrid hook
- [ ] Cart page is hybrid rendered
- [ ] Wishlist page is hybrid rendered
- [ ] Server-side auth protection added
- [ ] All tests passing
- [ ] No console errors
- [ ] Performance metrics improved

---

## 📞 SUPPORT

If you encounter issues:
1. Check the troubleshooting section
2. Review the analysis document
3. Check Supabase logs
4. Check browser console for errors
5. Verify database migration applied correctly
