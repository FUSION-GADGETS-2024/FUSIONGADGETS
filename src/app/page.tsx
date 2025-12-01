import { Metadata } from 'next';
import { Suspense } from 'react';
import { Footer } from "@/components/Footer";
import { getAllProducts, getNewArrivals, getHotDeals, getFeaturedProducts } from "@/lib/supabase/queries";
import { generateWebsiteStructuredData, generateOrganizationStructuredData, generateLocalBusinessStructuredData } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductRowSkeleton } from "@/components/ProductRowSkeleton";

// ISR - revalidate every 10 minutes as per architecture requirements
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Premium Technology. Professional Quality. | Fusion Gadgets",
  description: "Carefully curated collection of cutting-edge gadgets for professionals who demand excellence. Shop MacBook Pro, AirPods, Apple Watch, iPad Pro and more with fast shipping.",
  keywords: [
    "premium technology",
    "professional gadgets",
    "macbook pro",
    "airpods",
    "apple watch",
    "ipad pro",
    "fusion gadgets",
    "tech store"
  ],
  openGraph: {
    title: "Premium Technology. Professional Quality. | Fusion Gadgets",
    description: "Carefully curated collection of cutting-edge gadgets for professionals who demand excellence.",
    images: [
      {
        url: "/assets/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Fusion Gadgets - Premium Technology Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Technology. Professional Quality. | Fusion Gadgets",
    description: "Carefully curated collection of cutting-edge gadgets for professionals who demand excellence.",
    images: ["/assets/hero-bg.jpg"],
  },
};

// Server Component - Product Section
async function ProductSection({ 
  title, 
  fetchFn, 
  showViewAll = false 
}: { 
  title: string; 
  fetchFn: () => Promise<any[]>;
  showViewAll?: boolean;
}) {
  const products = await fetchFn();
  
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        {showViewAll && (
          <a 
            href="/products" 
            className="text-sm font-medium text-text-secondary hover:text-foreground transition-colors"
          >
            View All →
          </a>
        )}
      </div>
      <ProductGrid products={products} />
    </section>
  );
}

// Homepage - ISR with Server Components
export default async function HomePage() {
  // Generate comprehensive structured data for SEO
  const websiteStructuredData = generateWebsiteStructuredData();
  const organizationStructuredData = generateOrganizationStructuredData();
  const localBusinessStructuredData = generateLocalBusinessStructuredData();

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessStructuredData),
        }}
      />

      <div className="min-h-screen bg-background">
        {/* Header with client-side cart/wishlist buttons */}
        <Header />
        
        {/* Hero - Server Component */}
        <Hero />
        
        <main className="container mx-auto px-8 pb-24">
          {/* New Arrivals - Server Component with Suspense */}
          <Suspense fallback={<ProductRowSkeleton title="New Arrivals" />}>
            <ProductSection 
              title="New Arrivals" 
              fetchFn={() => getNewArrivals(4)} 
            />
          </Suspense>

          {/* Hot Deals - Server Component with Suspense */}
          <Suspense fallback={<ProductRowSkeleton title="Hot Deals" />}>
            <ProductSection 
              title="Hot Deals" 
              fetchFn={() => getHotDeals(4)} 
            />
          </Suspense>

          {/* Featured Products - Server Component with Suspense */}
          <Suspense fallback={<ProductRowSkeleton title="Featured Products" />}>
            <ProductSection 
              title="Featured Products" 
              fetchFn={() => getFeaturedProducts(4)} 
            />
          </Suspense>

          {/* All Products - Server Component with Suspense */}
          <Suspense fallback={<ProductRowSkeleton title="All Products" />}>
            <ProductSection 
              title="All Products" 
              fetchFn={() => getAllProducts()} 
              showViewAll={true}
            />
          </Suspense>
        </main>

        {/* Footer - Server Component */}
        <Footer />
      </div>
    </>
  );
}
