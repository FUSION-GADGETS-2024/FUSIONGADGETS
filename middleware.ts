import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Define private routes that require authentication
const privateRoutes = ['/profile', '/checkout', '/orders', '/wishlist'];

// Define SEO redirects for old URLs or common variations
const seoRedirects: Record<string, string> = {
  // Legacy URL patterns
  '/product': '/products',
  '/category': '/categories',
  '/shop': '/products',
  '/store': '/products',
  
  // Common variations
  '/privacy': '/privacy-policy',
  '/terms': '/terms-of-service',
  '/cookies': '/cookie-policy',
  '/about-us': '/about',
  
  // Trailing slash normalization (remove trailing slashes)
  // This will be handled by the trailing slash logic below
};

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  
  // Update Supabase session
  const response = await updateSession(request);
  
  // Handle trailing slash normalization (remove trailing slashes except for root)
  if (pathname !== '/' && pathname.endsWith('/')) {
    const newUrl = new URL(request.url);
    newUrl.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(newUrl, 301); // Permanent redirect for SEO
  }
  
  // Handle SEO redirects
  if (seoRedirects[pathname]) {
    const redirectUrl = new URL(seoRedirects[pathname], request.url);
    // Preserve query parameters
    if (search) {
      redirectUrl.search = search;
    }
    return NextResponse.redirect(redirectUrl, 301); // Permanent redirect for SEO
  }
  
  // Handle case-insensitive redirects for common paths
  const lowerPathname = pathname.toLowerCase();
  if (pathname !== lowerPathname && lowerPathname !== pathname) {
    // Only redirect if the lowercase version is different and it's a known route
    const knownRoutes = ['/products', '/categories', '/about', '/privacy-policy', '/terms-of-service', '/cookie-policy'];
    if (knownRoutes.includes(lowerPathname)) {
      const redirectUrl = new URL(lowerPathname, request.url);
      if (search) {
        redirectUrl.search = search;
      }
      return NextResponse.redirect(redirectUrl, 301);
    }
  }
  
  // Check if the current path is a private route
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
  
  if (isPrivateRoute) {
    // Check for Supabase auth session
    const hasSession = request.cookies.get('sb-access-token') || 
                      request.cookies.get('sb-refresh-token');
    
    if (!hasSession) {
      // Redirect to login page with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // SEO headers
  response.headers.set('X-Robots-Tag', 'index, follow');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};