# Supabase Setup Checklist

Use this checklist to ensure everything is set up correctly.

## ☐ Prerequisites

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] Modern web browser
- [ ] Text editor (VS Code recommended)

## ☐ Supabase Account Setup

- [ ] Created account at [supabase.com](https://supabase.com)
- [ ] Created new project
- [ ] Saved database password securely
- [ ] Project is fully initialized (green checkmark)

## ☐ Get Credentials

- [ ] Opened project dashboard
- [ ] Navigated to Settings → API
- [ ] Copied Project URL
- [ ] Copied anon/public key
- [ ] Copied service_role key (keep secret!)

## ☐ Environment Configuration

- [ ] Copied `.env.local.example` to `.env.local`
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Added `NEXT_PUBLIC_APP_URL`
- [ ] Verified no spaces or quotes around values
- [ ] File is in `.gitignore` (don't commit!)

## ☐ Database Setup

- [ ] Opened Supabase SQL Editor
- [ ] Created new query
- [ ] Copied content from `supabase/migrations/001_initial_schema.sql`
- [ ] Ran the query successfully
- [ ] Created another new query
- [ ] Copied content from `supabase/migrations/002_rls_policies.sql`
- [ ] Ran the query successfully
- [ ] Verified tables exist in Table Editor

## ☐ Install Dependencies

- [ ] Ran `npm install`
- [ ] No errors during installation
- [ ] All packages installed successfully

## ☐ Import Products

- [ ] Ran `npm run migrate:products`
- [ ] Script completed successfully
- [ ] Saw "Migration completed!" message
- [ ] Verified products in Supabase Table Editor
- [ ] Checked categories were created
- [ ] Checked brands were created

## ☐ Start Development Server

- [ ] Ran `npm run dev`
- [ ] Server started on port 3000
- [ ] No errors in terminal
- [ ] Opened http://localhost:3000
- [ ] Homepage loads successfully

## ☐ Test Products

- [ ] Products display on homepage
- [ ] Product images load correctly
- [ ] Can click on a product
- [ ] Product detail page loads
- [ ] Specifications display
- [ ] Features display
- [ ] Images carousel works

## ☐ Test Authentication

### Sign Up
- [ ] Clicked "Sign Up" or "Register"
- [ ] Filled in email and password
- [ ] Submitted form
- [ ] No errors displayed
- [ ] Received confirmation (check email if enabled)

### Sign In
- [ ] Clicked "Sign In" or "Login"
- [ ] Entered credentials
- [ ] Successfully signed in
- [ ] User name/email displays in header
- [ ] Profile link appears

### Profile
- [ ] Accessed profile page
- [ ] User information displays
- [ ] Can update profile (if implemented)

### Sign Out
- [ ] Clicked "Sign Out"
- [ ] Successfully signed out
- [ ] Redirected appropriately
- [ ] User menu disappears

## ☐ Test Shopping Features

### Cart
- [ ] Added product to cart
- [ ] Cart count updates
- [ ] Viewed cart page
- [ ] Products display in cart
- [ ] Can update quantity
- [ ] Can remove items
- [ ] Total calculates correctly

### Wishlist (if authenticated)
- [ ] Added product to wishlist
- [ ] Viewed wishlist page
- [ ] Products display in wishlist
- [ ] Can remove items

## ☐ Test Search & Filters

- [ ] Search bar works
- [ ] Search results display
- [ ] Category filter works
- [ ] Brand filter works (if implemented)
- [ ] Price filter works (if implemented)

## ☐ Verify Security

- [ ] Can't access `/profile` without login
- [ ] Can't access `/orders` without login
- [ ] Can't access `/wishlist` without login
- [ ] Redirected to login page
- [ ] Return URL works after login

## ☐ Check Browser Console

- [ ] No errors in console
- [ ] No warnings about missing env variables
- [ ] No 404 errors
- [ ] No authentication errors

## ☐ Check Supabase Dashboard

### Auth
- [ ] User appears in Authentication → Users
- [ ] Profile created in profiles table
- [ ] Email confirmed (if required)

### Database
- [ ] Products table has 75 rows
- [ ] Categories table populated
- [ ] Brands table populated
- [ ] Product images linked correctly
- [ ] Product specifications linked correctly

### Logs
- [ ] No error logs
- [ ] API requests successful
- [ ] Auth requests successful

## ☐ Performance Check

- [ ] Homepage loads quickly (< 2 seconds)
- [ ] Product pages load quickly (< 1 second)
- [ ] Images load progressively
- [ ] No layout shift
- [ ] Smooth navigation

## ☐ Mobile Check

- [ ] Opened on mobile device or DevTools mobile view
- [ ] Layout responsive
- [ ] Navigation works
- [ ] Forms work
- [ ] Images scale correctly

## ☐ Documentation Review

- [ ] Read QUICKSTART.md
- [ ] Read SUPABASE_SETUP.md
- [ ] Understand SUPABASE_INTEGRATION.md
- [ ] Reviewed INTEGRATION_SUMMARY.md

## ☐ Optional Enhancements

- [ ] Customized email templates in Supabase
- [ ] Disabled email confirmation for testing
- [ ] Enabled social login providers
- [ ] Set up custom domain
- [ ] Configured SMTP for emails
- [ ] Added Google Analytics
- [ ] Set up error tracking (Sentry)

## ☐ Production Readiness

- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables documented
- [ ] Database backed up
- [ ] RLS policies reviewed
- [ ] Security best practices followed
- [ ] Performance optimized
- [ ] SEO configured

## ☐ Deployment (Optional)

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added to Vercel
- [ ] Deployed successfully
- [ ] Production URL works
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)

---

## 🎉 Completion

When all items are checked:
- ✅ Your e-commerce platform is fully functional
- ✅ Authentication is working
- ✅ Products are loading from database
- ✅ Ready for development or production

## 🐛 Troubleshooting

If any item fails, check:
1. Environment variables are correct
2. Supabase project is active
3. Migrations ran successfully
4. No typos in configuration
5. Browser console for errors
6. Supabase logs for issues

## 📞 Need Help?

- Review the [QUICKSTART.md](./QUICKSTART.md)
- Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Read [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md)
- Check Supabase documentation
- Review error messages carefully

---

**Good luck! 🚀**
