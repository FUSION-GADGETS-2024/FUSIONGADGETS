import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Check, Star, Shield, Truck, RotateCcw } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductDetailActions } from './product-detail-actions';
import { getProductById, getSimilarProducts } from '@/lib/supabase/queries';
import { getProductSpecifications, getProductFeatures } from '@/lib/supabase/queries-static';
import { generateProductMetadata, generateEnhancedProductStructuredData, generateProductFAQStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo';

// SSR - Force dynamic rendering for product detail page
export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
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

  // Fetch specifications, features, and similar products server-side
  const [specifications, features, similarProducts] = await Promise.all([
    getProductSpecifications(id),
    getProductFeatures(id),
    getSimilarProducts(id, product.categoryId || '', 3),
  ]);

  // Generate comprehensive structured data
  const productStructuredData = generateEnhancedProductStructuredData(product);
  const faqStructuredData = generateProductFAQStructuredData(product);
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.category, url: `/categories/${product.category.toLowerCase()}` },
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
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-8 pt-24 pb-24">
          {/* Back Link - Server rendered */}
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground mb-8 transition-colors duration-150"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Product Image - Server rendered */}
            <div className="lg:sticky lg:top-24 self-start">
              <div className="bg-surface rounded-xl p-8 border border-border">
                <div className="relative aspect-square">
                  <Image 
                    src={product.images[0]?.url || '/placeholder.svg'} 
                    alt={product.images[0]?.alt || product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Product Info - Server rendered */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-3">{product.category}</Badge>
                <h1 className="text-2xl font-semibold text-foreground mb-4">{product.name}</h1>
                
                {/* Rating - Server rendered */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'fill-muted text-muted'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-text-secondary">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>
                
                {/* Price - Server rendered */}
                <div className="mb-6">
                  <p className="text-2xl font-semibold text-foreground">
                    ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  {product.mrp > product.price && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-text-tertiary line-through">
                        ₹{product.mrp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-sm font-medium text-success">
                        {product.discount}% off
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Description - Server rendered */}
                <p className="text-base text-text-secondary leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications - Server rendered */}
              <div className="border-t border-border pt-6">
                <h2 className="text-base font-semibold text-foreground mb-4">Specifications</h2>
                {specifications.length > 0 || features.length > 0 ? (
                  <ul className="space-y-3">
                    {specifications
                      .filter((spec: any) => spec && spec.name && spec.value)
                      .map((spec: any) => (
                        <li key={spec.id} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-text-secondary">
                            <strong>{spec.name}:</strong> {spec.value}
                          </span>
                        </li>
                      ))}
                    {features
                      .filter((feature: any) => feature && feature.description)
                      .map((feature: any) => (
                        <li key={feature.id} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-text-secondary">{feature.description}</span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-sm text-text-secondary">
                    No specifications available for this product.
                  </p>
                )}
              </div>

              {/* Add to Cart Section - Client Component */}
              <ProductDetailActions 
                product={product}
              />

              {/* Trust Indicators - Server rendered */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center text-center gap-2">
                  <Shield className="h-5 w-5 text-text-tertiary" />
                  <span className="text-xs text-text-secondary">2 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="h-5 w-5 text-text-tertiary" />
                  <span className="text-xs text-text-secondary">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw className="h-5 w-5 text-text-tertiary" />
                  <span className="text-xs text-text-secondary">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Products Section - Server rendered */}
          <div className="mt-24 border-t border-border pt-16">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Similar Products</h2>
              <p className="text-text-secondary">You might also like these items</p>
            </div>

            {similarProducts.length > 0 ? (
              <ProductGrid products={similarProducts} columns={3} />
            ) : (
              <p className="text-text-secondary text-center py-8">No similar products found</p>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
