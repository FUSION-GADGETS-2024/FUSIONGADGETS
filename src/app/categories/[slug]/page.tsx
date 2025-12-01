import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductsHero } from '@/components/ProductsHero';
import { ProductGrid } from '@/components/ProductGrid';
import { SortDropdown } from '@/components/SortDropdown';
import { FiltersPanel } from '@/components/FiltersPanel';
import { Pagination } from '@/components/Pagination';
import { getAllCategories, getProductsByCategory, getAllBrands } from '@/lib/supabase/queries';
import { getAllCategoriesStatic } from '@/lib/supabase/queries-static';
import { generateBreadcrumbStructuredData, generateWebsiteStructuredData } from '@/lib/seo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// ISR - Revalidate every 10-30 minutes as per architecture
export const revalidate = 600; // 10 minutes

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const queryParams = await searchParams;
  
  // Fetch category and products
  const [categories, brandsData] = await Promise.all([
    getAllCategories(),
    getAllBrands(),
  ]);
  
  const category = categories.find(cat => cat.slug === slug);
  
  if (!category) {
    notFound();
  }

  // Fetch products for this category
  let products = await getProductsByCategory(slug);
  
  // Apply brand filter
  if (queryParams.brand) {
    products = products.filter(p => p.brand === queryParams.brand);
  }
  
  // Apply price filters
  if (queryParams.minPrice) {
    products = products.filter(p => p.price >= parseFloat(queryParams.minPrice!));
  }
  if (queryParams.maxPrice) {
    products = products.filter(p => p.price <= parseFloat(queryParams.maxPrice!));
  }
  
  // Apply sorting
  const sortBy = queryParams.sort || 'newest';
  switch (sortBy) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'rating':
      products.sort((a, b) => b.rating - a.rating);
      break;
    case 'discount':
      products.sort((a, b) => b.discount - a.discount);
      break;
    case 'newest':
    default:
      products.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      break;
  }
  
  // Pagination
  const page = parseInt(queryParams.page || '1', 10);
  const limit = 12;
  const total = products.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedProducts = products.slice((page - 1) * limit, page * limit);
  
  const brands = brandsData.map(brand => brand.name);

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
      
      <div className="min-h-screen bg-background">
        <Header />
        <ProductsHero 
          categoryName={category.name}
          categoryImage={category.image || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=600&fit=crop'}
        />
        
        <main className="container mx-auto px-8 pb-24">
          {/* Back to Categories */}
          <div className="mb-8">
            <Link 
              href="/categories"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Categories
            </Link>
          </div>

          {/* Category Info - Server rendered */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-3">{category.name}</h1>
            {category.description && (
              <p className="text-text-secondary mb-4">{category.description}</p>
            )}
            <p className="text-sm text-text-tertiary">
              {total} {total === 1 ? 'product' : 'products'} found
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Panel - Client Component */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <FiltersPanel 
                categories={[]} // Don't show category filter on category page
                brands={brands}
                currentBrand={queryParams.brand}
                currentMinPrice={queryParams.minPrice}
                currentMaxPrice={queryParams.maxPrice}
              />
            </aside>
            
            <div className="flex-1">
              {/* Sort Dropdown - Client Component */}
              <div className="flex justify-end mb-8">
                <SortDropdown currentSort={queryParams.sort} />
              </div>
              
              {/* Product Grid - Server Component */}
              {paginatedProducts.length > 0 ? (
                <>
                  <ProductGrid products={paginatedProducts} columns={3} />
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12">
                      <Pagination 
                        currentPage={page}
                        totalPages={totalPages}
                        baseUrl={`/categories/${slug}`}
                        searchParams={queryParams}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-text-secondary text-lg mb-4">No products found in this category</p>
                  <Link 
                    href="/categories"
                    className="text-sm font-medium text-foreground hover:text-text-secondary transition-colors"
                  >
                    Browse All Categories
                  </Link>
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
