import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCategories, getProductsByCategory } from '@/lib/supabase/queries';
import { getAllCategoriesStatic } from '@/lib/supabase/queries-static';
import { generateBreadcrumbStructuredData, generateWebsiteStructuredData } from '@/lib/seo';
import { CategoryProductsClient } from './category-products-client';

// Enable ISR - revalidate every hour
export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all categories at build time
export async function generateStaticParams() {
  try {
    const categories = await getAllCategoriesStatic();
    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find(cat => cat.slug === slug);
  
  if (!category) {
    return {
      title: 'Category Not Found | Fusion Gadgets',
      description: 'The requested category could not be found.',
    };
  }

  return {
    title: `${category.name} - Shop ${category.name} Products | Fusion Gadgets`,
    description: category.description || `Browse our collection of ${category.name} products. Find the best deals on premium tech gadgets.`,
    keywords: [category.name.toLowerCase(), 'tech products', 'gadgets', 'electronics'],
    openGraph: {
      title: `${category.name} - Fusion Gadgets`,
      description: category.description || `Shop ${category.name} products`,
      images: [
        {
          url: category.image || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=600&fit=crop',
          width: 1200,
          height: 600,
          alt: category.name,
        },
      ],
    },
    alternates: {
      canonical: `/categories/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  // Fetch category and products
  const categories = await getAllCategories();
  const category = categories.find(cat => cat.slug === slug);
  
  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(slug);

  // Generate structured data
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' },
    { name: category.name, url: `/categories/${slug}` },
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
      
      <CategoryProductsClient 
        category={{
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          image: category.image || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=600&fit=crop',
          productCount: category.product_count,
        }}
        products={products}
      />
    </>
  );
}
