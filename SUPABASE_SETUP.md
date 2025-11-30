# Supabase Integration Setup Guide

This guide will help you set up Supabase authentication and database for the Fusion Gadgets e-commerce platform.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (sign up at https://supabase.com)
- Git installed

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: fusion-gadgets (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for it to initialize (~2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   copy .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Step 4: Run Database Migrations

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL Editor and click "Run"
5. Wait for it to complete (you should see "Success" message)
6. Repeat steps 2-5 for `supabase/migrations/002_rls_policies.sql`

Alternatively, if you have Supabase CLI installed:
```bash
npx supabase db push
```

## Step 5: Migrate Products Data

Now that your database schema is ready, import all 75 products from the Data folder:

```bash
npm run migrate:products
```

This will:
- Create all categories from your data
- Create all brands
- Import all 75 products with their:
  - Images
  - Specifications
  - Features
  - Tags
  - Pricing and stock information

## Step 6: Configure Authentication

### Email Authentication (Default)

Email authentication is enabled by default. Users can sign up and sign in with email/password.

### Optional: Enable Social Authentication

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable providers you want (Google, GitHub, etc.)
3. Follow the provider-specific setup instructions
4. Update your authentication UI to include social login buttons

### Email Templates

Customize email templates in **Authentication** → **Email Templates**:
- Confirmation email
- Password reset email
- Magic link email

## Step 7: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Test the following:
   - Browse products (should load from Supabase)
   - Sign up for a new account
   - Sign in with your account
   - View your profile
   - Add items to cart
   - Add items to wishlist

## Database Schema Overview

### Core Tables

- **categories**: Product categories with hierarchical support
- **brands**: Product brands
- **products**: Main product information
- **product_images**: Product images with primary flag
- **product_specifications**: Detailed product specs
- **product_features**: Product feature list
- **product_tags**: Product tags for search

### User Tables

- **profiles**: Extended user profile information
- **addresses**: User shipping/billing addresses
- **carts**: Shopping carts (supports guest and authenticated users)
- **cart_items**: Items in shopping carts
- **wishlists**: User wishlists
- **wishlist_items**: Items in wishlists
- **orders**: Order information
- **order_items**: Items in orders
- **reviews**: Product reviews

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **Public read**: Products, categories, brands, reviews
- **Authenticated read/write**: User-specific data (cart, wishlist, orders, profile)
- **Admin write**: Products, categories, brands (requires authentication)

### Authentication Flow

1. User signs up → Profile automatically created via trigger
2. User signs in → Session stored in cookies
3. Middleware checks authentication for protected routes
4. API routes validate user session

## API Routes

### Authentication

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/user` - Get current user

### Products (Coming Soon)

- `GET /api/products` - List products with filters
- `GET /api/products/[slug]` - Get product by slug
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search` - Search products

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set these in your production environment:

```env
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Troubleshooting

### Products not loading

1. Check if migrations ran successfully in Supabase SQL Editor
2. Verify environment variables are set correctly
3. Check browser console for errors
4. Verify RLS policies are enabled

### Authentication not working

1. Check if email confirmation is required (disable in Auth settings for testing)
2. Verify environment variables
3. Check browser cookies are enabled
4. Look for errors in browser console

### Migration script fails

1. Ensure `SUPABASE_SERVICE_ROLE_KEY` is set (not the anon key)
2. Check if tables already exist
3. Verify JSON file path is correct
4. Check Supabase logs for detailed errors

## Next Steps

1. **Customize UI**: Update authentication pages with your branding
2. **Add features**: Implement cart, checkout, and order management
3. **Set up payments**: Integrate Stripe or other payment providers
4. **Configure email**: Set up transactional emails
5. **Add admin panel**: Create admin interface for product management
6. **Optimize images**: Set up image optimization with Supabase Storage
7. **Add search**: Implement full-text search with Supabase

## Support

- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Project Issues: Create an issue in your repository

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Rotate keys** regularly in production
3. **Use service role key** only in server-side code
4. **Enable MFA** for your Supabase account
5. **Monitor** authentication logs regularly
6. **Set up** rate limiting for API routes
7. **Review** RLS policies before going live

---

**Congratulations!** Your Fusion Gadgets e-commerce platform is now powered by Supabase with full authentication and a complete product database.
