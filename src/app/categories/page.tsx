import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getAllCategories } from '@/lib/supabase/queries';
import { generateBreadcrumbStructuredData, generateWebsiteStructuredData } from '@/lib/seo';

// ISR - Revalidate every 10 minutes
export const revalidate = 600;

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
    productCount: cat.product_count || 0,
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
      
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <div className="relative h-64 bg-gradient-to-r from-gray-900 to-gray-700 pt-14">
          <div className="absolute inset-0 bg-black/40" />
          <div className="container mx-auto px-8 h-full flex items-center relative z-10">
            <div>
              <h1 className="text-4xl font-semibold text-white mb-4">Shop by Category</h1>
              <p className="text-lg text-white/80 max-w-xl">
                Explore our curated collection of premium tech products organized by category
              </p>
            </div>
          </div>
        </div>
        
        <main className="container mx-auto px-8 py-16">
          {/* Category Grid - Server Component */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group"
              >
                <div className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-border-medium hover:shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-xl font-semibold text-white mb-1">{category.name}</h2>
                      <p className="text-sm text-white/80">
                        {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                      </p>
                    </div>
                  </div>
                  {category.description && (
                    <div className="p-4">
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          
          {categories.length === 0 && (
            <div className="text-center py-16">
              <p className="text-text-secondary">No categories found</p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
