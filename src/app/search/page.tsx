import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductGrid } from '@/components/ProductGrid';
import { SortDropdown } from '@/components/SortDropdown';
import { FiltersPanel } from '@/components/FiltersPanel';
import { Pagination } from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
import { searchProducts, getAllCategories, getAllBrands, getFilteredProducts } from '@/lib/supabase/queries';
import { generateBreadcrumbStructuredData } from '@/lib/seo';
import { Search } from 'lucide-react';

// SSR - Force dynamic rendering for search page
export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || '';
  
  return {
    title: query ? `Search: "${query}" | Fusion Gadgets` : 'Search Products | Fusion Gadgets',
    description: query 
      ? `Search results for "${query}" - Find premium tech products at Fusion Gadgets`
      : 'Search our collection of premium tech products',
    robots: {
      index: false, // Don't index search pages
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const page = parseInt(params.page || '1', 10);
  const limit = 12;
  
  // Parse filters
  const filters = {
    category: params.category || undefined,
    brand: params.brand || undefined,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    sortBy: (params.sort as 'name' | 'price' | 'rating' | 'newest' | 'discount') || 'newest',
    sortOrder: params.sort?.includes('asc') ? 'asc' as const : 'desc' as const,
    search: query,
  };
  
  // Fetch data server-side
  const [productsData, categoriesData, brandsData] = await Promise.all([
    query ? getFilteredProducts(filters, page, limit) : Promise.resolve({ products: [], total: 0, totalPages: 0 }),
    getAllCategories(),
    getAllBrands(),
  ]);
  
  const { products, total, totalPages } = productsData;
  const categories = categoriesData.map(cat => cat.name);
  const brands = brandsData.map(brand => brand.name);
  
  // Generate structured data
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Search', url: '/search' },
    ...(query ? [{ name: `"${query}"`, url: `/search?q=${encodeURIComponent(query)}` }] : []),
  ]);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Search Hero */}
        <div className="bg-surface border-b border-border pt-24 pb-12">
          <div className="container mx-auto px-8">
            <h1 className="text-3xl font-semibold text-foreground mb-6">
              {query ? `Search Results for "${query}"` : 'Search Products'}
            </h1>
            
            {/* Search Input - Client Component */}
            <SearchInput initialQuery={query} />
          </div>
        </div>
        
        <main className="container mx-auto px-8 py-12">
          {query ? (
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
                    {total > 0 
                      ? `Found ${total} product${total !== 1 ? 's' : ''} for "${query}"`
                      : `No products found for "${query}"`
                    }
                  </p>
                  {total > 0 && <SortDropdown currentSort={params.sort} />}
                </div>
                
                {/* Product Grid - Server Component */}
                {products.length > 0 ? (
                  <>
                    <ProductGrid products={products} columns={3} />
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-12">
                        <Pagination 
                          currentPage={page}
                          totalPages={totalPages}
                          baseUrl="/search"
                          searchParams={{ ...params, q: query }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <Search className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
                    <p className="text-lg text-text-secondary mb-2">No products found</p>
                    <p className="text-sm text-text-tertiary">
                      Try adjusting your search or filters to find what you're looking for
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
              <p className="text-lg text-text-secondary mb-2">Enter a search term</p>
              <p className="text-sm text-text-tertiary">
                Search for products by name, category, or brand
              </p>
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </>
  );
}
