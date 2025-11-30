import { Metadata } from 'next';
import { AllProductsClient } from './products-client';
import { getAllProducts, getAllCategories } from '@/lib/supabase/queries';
import { categoryImages } from '@/lib/data/categories';
import { generateBreadcrumbStructuredData, generateWebsiteStructuredData } from '@/lib/seo';

// Enable ISR - revalidate every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'All Products - Premium Tech Gadgets | Fusion Gadgets',
  description: 'Browse our complete collection of premium tech products including laptops, audio equipment, wearables, tablets, and accessories. Fast shipping and warranty included.',
  keywords: ['tech products', 'gadgets', 'electronics', 'laptops', 'headphones', 'tablets', 'accessories'],
  openGraph: {
    title: 'All Products - Premium Tech Gadgets | Fusion Gadgets',
    description: 'Browse our complete collection of premium tech products including laptops, audio equipment, wearables, tablets, and accessories.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=600&fit=crop',
        width: 1200,
        height: 600,
        alt: 'All Products - Fusion Gadgets',
      },
    ],
  },
  alternates: {
    canonical: '/products',
  },
};

export default async function ProductsPage() {
  // Fetch data from Supabase
  const products = await getAllProducts();
  const categoriesData = await getAllCategories();
  const categories = categoriesData.map(cat => cat.name);
  
  // Generate structured data
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
  ]);

  const websiteStructuredData = generateWebsiteStructuredData();
  
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      
      <AllProductsClient 
        products={products}
        categories={categories}
        categoryImages={categoryImages}
      />
    </>
  );
}