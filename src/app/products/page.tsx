import { Metadata } from 'next';
import { Suspense } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductsHero } from '@/components/ProductsHero';
import { ProductGrid } from '@/components/ProductGrid';
import { FiltersPanel } from '@/components/FiltersPanel';
import { SortDropdown } from '@/components/SortDropdown';
import { Pagination } from '@/components/Pagination';
import { getFilteredProducts, getAllCategories, getAllBrands } from '@/lib/supabase/queries';
import { generateBreadcrumbStructuredData, generateWebsiteStructuredData } from '@/lib/seo';
import { categoryImages } from '@/lib/data/categories';

// SSR - Force dynamic rendering for products page
export const dynamic = 'force-dynamic';

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

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  
  // Parse search params for server-side filtering
  const filters = {
    category: params.category || undefined,
    brand: params.brand || undefined,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    sortBy: (params.sort as 'name' | 'price' | 'rating' | 'newest' | 'discount') || 'newest',
    sortOrder: params.sort?.includes('asc') ? 'asc' as const : 'desc' as const,
  };
  
  const page = parseInt(params.page || '1', 10);
  const limit = 12;
  
  // Fetch data server-side based on searchParams
  const [productsData, categoriesData, brandsData] = await Promise.all([
    getFilteredProducts(filters, page, limit),
    getAllCategories(),
    getAllBrands(),
  ]);
  
  const { products, total, totalPages } = productsData;
  const categories = categoriesData.map(cat => cat.name);
  const brands = brandsData.map(brand => brand.name);
  
  // Determine current category image
  const currentCategory = params.category || 'All';
  const currentCategoryImage = categoryImages[currentCategory] || categoryImages['All'];
  
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
      
      <div className="min-h-screen bg-background">
        <Header />
        <ProductsHero 
          categoryName={currentCategory}
          categoryImage={currentCategoryImage}
        />
        
        <main className="container mx-auto px-8 pb-24">
          {/* Filters and Sort - Client Components */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Panel - Client Component */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <FiltersPanel 
                categories={categories}
                brands={brands}
                currentCategory={params.category}
                currentBrand={params.brand}
                currentMinPrice={params.minPrice}
                currentMaxPrice={params.maxPrice}
              />
            </aside>
            
            <div className="flex-1">
              {/* Sort and Results Count */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <p className="text-sm text-text-secondary">
                  Showing {products.length} of {total} products
                </p>
                {/* Sort Dropdown - Client Component */}
                <SortDropdown currentSort={params.sort} />
              </div>
              
              {/* Product Grid - Server Component */}
              <ProductGrid products={products} columns={3} />
              
              {/* Pagination - Server Component with links */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination 
                    currentPage={page}
                    totalPages={totalPages}
                    baseUrl="/products"
                    searchParams={params}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
