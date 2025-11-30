import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/supabase/queries';
import { getAllProductIdsStatic } from '@/lib/supabase/queries-static';
import { generateProductMetadata, generateEnhancedProductStructuredData, generateProductFAQStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo';
import { ProductDetailClient } from './product-detail-client';

// ISR Configuration - Time-based revalidation (not request-based)
export const revalidate = 3600; // 1 hour maximum, regardless of traffic volume

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all products at build time
export async function generateStaticParams() {
  try {
    const products = await getAllProductIdsStatic();
    return products.map((product) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    return {
      title: 'Product Not Found | Fusion Gadgets',
      description: 'The requested product could not be found.',
    };
  }

  return generateProductMetadata(product);
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    notFound();
  }

  const reviews: any[] = []; // Reviews will be fetched from database later

  // Generate comprehensive structured data
  const productStructuredData = generateEnhancedProductStructuredData(product);
  const faqStructuredData = generateProductFAQStructuredData(product);
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.category, url: `/categories?category=${product.category}` },
    { name: product.name, url: `/products/${product.id}` },
  ]);

  return (
    <>
      {/* Enhanced Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      
      {/* Client Component for Interactive Features */}
      <ProductDetailClient 
        product={product}
        reviews={reviews}
      />
    </>
  );
}