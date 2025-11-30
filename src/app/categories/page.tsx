import { Metadata } from 'next';
import { CategoriesClient } from './categories-client';
import { getAllCategories } from '@/lib/supabase/queries';
import { generateBreadcrumbStructuredData, generateWebsiteStructuredData } from '@/lib/seo';

// Enable ISR - revalidate every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Categories - Shop by Category | Fusion Gadgets',
  description: 'Explore our curated collection of premium tech products organized by category. Find laptops, audio equipment, wearables, tablets, and accessories.',
  keywords: ['categories', 'tech categories', 'product categories', 'laptops', 'audio', 'wearables', 'tablets', 'accessories'],
  openGraph: {
    title: 'Categories - Shop by Category | Fusion Gadgets',
    description: 'Explore our curated collection of premium tech products organized by category.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=600&fit=crop',
        width: 1200,
        height: 600,
        alt: 'Categories - Fusion Gadgets',
      },
    ],
  },
  alternates: {
    canonical: '/categories',
  },
};

export default async function CategoriesPage() {
  // Fetch categories from Supabase
  const categoriesData = await getAllCategories();
  
  // Transform to match expected format
  const categories = categoriesData.map(cat => ({
    id: cat.slug,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || '',
    image: cat.image || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop',
    productCount: cat.product_count,
    seo: {
      title: `${cat.name} - Fusion Gadgets`,
      description: cat.description || `Shop ${cat.name} products`,
      keywords: [cat.name.toLowerCase()],
    },
    isActive: cat.is_active,
  }));

  // Generate structured data
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' },
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
      
      <CategoriesClient categories={categories} />
    </>
  );
}