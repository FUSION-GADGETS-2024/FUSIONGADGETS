import { Metadata } from 'next';
import { Footer } from "@/components/Footer";
import { getAllProducts, getNewArrivals, getHotDeals, getFeaturedProducts } from "@/lib/supabase/queries";
import { generateWebsiteStructuredData, generateOrganizationStructuredData, generateLocalBusinessStructuredData } from "@/lib/seo";
import { HomepageClient } from "./homepage-client";

// Generate metadata for homepage (SSG)
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

// Enable ISR - revalidate every hour
export const revalidate = 3600;

// Static generation with data from Supabase
export default async function HomePage() {
  // Get product data from Supabase at build time (SSG + ISR)
  const allProducts = await getAllProducts();
  const newArrivals = await getNewArrivals(3);
  const hotDeals = await getHotDeals(3);
  const featured = await getFeaturedProducts(3);

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
        {/* Client-side interactive components with Hero */}
        <HomepageClient 
          newArrivals={newArrivals}
          hotDeals={hotDeals}
          featured={featured}
          allProducts={allProducts}
        />
        
        {/* Footer is static */}
        <Footer />
      </div>
    </>
  );
}
