# Quick Start Guide - Fusion Gadgets with Supabase

Get your e-commerce platform up and running in minutes!

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project credentials from Settings → API

### 3. Configure Environment

```bash
# Copy the example file
copy .env.local.example .env.local

# Edit .env.local and add your Supabase credentials
```

Your `.env.local` should look like:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Database

In your Supabase dashboard:

1. Go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the content from `supabase/migrations/001_initial_schema.sql`
4. Click **Run**
5. Repeat for `supabase/migrations/002_rls_policies.sql`

### 5. Import Products

```bash
npm run migrate:products
```

This imports all 75 products from the Data folder into your Supabase database.

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## ✅ What You Get

- ✨ **75 Products** - All imported with images, specs, and features
- 🔐 **Full Authentication** - Email/password signup and login
- 🛒 **Shopping Cart** - Add products to cart (guest and authenticated)
- ❤️ **Wishlist** - Save favorite products
- 👤 **User Profiles** - Manage account settings
- 📦 **Orders** - Track order history
- 🔍 **Search** - Find products quickly
- 📱 **Responsive** - Works on all devices
- ⚡ **Fast** - SSG + ISR for optimal performance
- 🔒 **Secure** - Row Level Security enabled

## 🎯 Key Features

### Authentication
- Email/password signup and login
- Password reset
- Profile management
- Protected routes (profile, orders, wishlist)

### Products
- 75 real products with images
- Categories and brands
- Ratings and reviews
- Stock management
- Featured products
- Hot deals
- New arrivals

### E-commerce
- Shopping cart (persists across sessions)
- Wishlist
- Product search
- Category filtering
- Product details with specifications

## 📁 Project Structure

```
fusion-gadgets-nextjs/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   └── auth/          # Authentication endpoints
│   │   ├── products/          # Product pages
│   │   ├── profile/           # User profile
│   │   ├── cart/              # Shopping cart
│   │   └── ...
│   ├── components/            # React components
│   ├── lib/                   # Utilities and helpers
│   │   ├── supabase/         # Supabase client and queries
│   │   │   ├── client.ts     # Browser client
│   │   │   ├── server.ts     # Server client
│   │   │   ├── auth.ts       # Auth utilities
│   │   │   ├── queries.ts    # Database queries
│   │   │   └── types.ts      # TypeScript types
│   │   ├── auth-context.tsx  # Auth context provider
│   │   └── ...
│   └── ...
├── supabase/
│   └── migrations/            # Database migrations
│       ├── 001_initial_schema.sql
│       └── 002_rls_policies.sql
├── scripts/
│   └── migrate-products.ts    # Product import script
├── Data/                      # Product data (JSON)
└── ...
```

## 🔧 Common Tasks

### Add a New Product

```typescript
// Use Supabase client
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

await supabase.from('products').insert({
  name: 'New Product',
  slug: 'new-product',
  description: 'Product description',
  price: 99.99,
  mrp_price: 149.99,
  stock: 10,
  // ... other fields
});
```

### Check if User is Logged In

```typescript
// In a Client Component
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Welcome, {user.email}!</div>;
}
```

### Fetch Products

```typescript
// In a Server Component
import { getAllProducts } from '@/lib/supabase/queries';

export default async function ProductsPage() {
  const products = await getAllProducts();
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## 🐛 Troubleshooting

### Products not showing?
- Check if migrations ran successfully
- Verify environment variables are set
- Run `npm run migrate:products` again

### Can't sign up?
- Check Supabase dashboard → Authentication → Settings
- Disable email confirmation for testing
- Check browser console for errors

### Database errors?
- Verify migrations ran in correct order
- Check Supabase logs in dashboard
- Ensure RLS policies are enabled

## 📚 Next Steps

1. **Customize Design** - Update colors, fonts, and layout
2. **Add Payment** - Integrate Stripe or PayPal
3. **Email Notifications** - Set up transactional emails
4. **Admin Panel** - Create product management interface
5. **Analytics** - Add Google Analytics or similar
6. **SEO** - Optimize meta tags and structured data
7. **Deploy** - Deploy to Vercel or your preferred platform

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Full Setup Guide](./SUPABASE_SETUP.md)

## 💡 Tips

- Use Server Components for data fetching (better performance)
- Use Client Components only when needed (interactivity)
- Products are cached with ISR for fast page loads
- Authentication state is managed globally via context
- All user data is protected with Row Level Security

## 🆘 Need Help?

- Check the [Full Setup Guide](./SUPABASE_SETUP.md)
- Review Supabase logs in dashboard
- Check browser console for errors
- Verify environment variables

---

**Happy coding!** 🚀
