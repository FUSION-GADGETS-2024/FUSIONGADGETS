'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Check, Star, Shield, Truck, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard } from "@/components/ReviewCard";
import { Product, Review } from "@/lib/types";

interface ProductDetailClientProps {
  product: Product;
  reviews: Review[];
}

export function ProductDetailClient({ product, reviews }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [specifications, setSpecifications] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [loadingSpecs, setLoadingSpecs] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  // Load specifications and features dynamically
  useEffect(() => {
    const loadSpecs = async () => {
      try {
        const response = await fetch(`/api/products/specs?productId=${product.id}`);
        if (response.ok) {
          const data = await response.json();
          setSpecifications(data.specifications || []);
          setFeatures(data.features || []);
        }
      } catch (error) {
        console.error('Error loading specifications:', error);
      } finally {
        setLoadingSpecs(false);
      }
    };

    loadSpecs();
  }, [product.id]);

  // Load similar products dynamically after page load
  useEffect(() => {
    const loadSimilarProducts = async () => {
      if (!product.categoryId) return;
      
      setLoadingSimilar(true);
      try {
        const response = await fetch(`/api/products/similar?productId=${product.id}&categoryId=${product.categoryId}&limit=3`);
        if (response.ok) {
          const data = await response.json();
          setSimilarProducts(data);
        }
      } catch (error) {
        console.error('Error loading similar products:', error);
      } finally {
        setLoadingSimilar(false);
      }
    };

    // Load similar products after a short delay to prioritize main content
    const timer = setTimeout(loadSimilarProducts, 500);
    return () => clearTimeout(timer);
  }, [product.id, product.categoryId]);

  const handleAddToCart = () => {
    setIsAdded(true);
    
    // Add the specified quantity to cart
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || '/placeholder.svg',
        brand: product.brand,
      });
    }
    
    toast({
      description: `${quantity} item(s) added to cart`,
    });
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleSimilarProductAddToCart = (similarProduct: Product) => {
    addItem({
      id: similarProduct.id,
      name: similarProduct.name,
      price: similarProduct.price,
      image: similarProduct.images[0]?.url || '/placeholder.svg',
      brand: similarProduct.brand,
    });
    
    toast({
      description: "Item added to cart",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-8 pt-24 pb-24">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground mb-8 transition-colors duration-150">
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Image */}
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

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">{product.category}</Badge>
              <h1 className="text-2xl font-semibold text-foreground mb-4">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-sm text-text-secondary">({product.reviewCount || reviews.length} reviews)</span>
              </div>
              <div className="mb-6">
                <p className="text-2xl font-semibold text-foreground">
                  ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {product.mrp > product.price && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-text-tertiary line-through">
                      ${product.mrp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm font-medium text-success">
                      {product.discount}% off
                    </span>
                  </div>
                )}
              </div>
              <p className="text-base text-text-secondary leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications */}
            <div className="border-t border-border pt-6">
              <h2 className="text-base font-semibold text-foreground mb-4">Specifications</h2>
              {loadingSpecs ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-start gap-3">
                      <div className="h-5 w-5 bg-surface rounded flex-shrink-0" />
                      <div className="h-4 bg-surface rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {specifications.map((spec) => (
                    <li key={spec.id} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-text-secondary">
                        <strong>{spec.name}:</strong> {spec.value}
                      </span>
                    </li>
                  ))}
                  {features.map((feature) => (
                    <li key={feature.id} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-text-secondary">{feature.description}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Add to Cart */}
            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 h-10 text-foreground hover:bg-surface transition-colors duration-150"
                  >
                    −
                  </button>
                  <span className="px-6 h-10 flex items-center border-x border-border text-sm font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 h-10 text-foreground hover:bg-surface transition-colors duration-150"
                  >
                    +
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdded}
                  className="flex-1 h-10 text-sm font-medium transition-all duration-150 active:scale-[0.98]"
                >
                  {isAdded ? (
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Added to Cart
                    </span>
                  ) : product.inStock ? (
                    'Add to Cart'
                  ) : (
                    'Out of Stock'
                  )}
                </Button>
              </div>

              {/* Trust Indicators */}
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
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-24 border-t border-border pt-16">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{product.rating} out of 5</span>
                </div>
                <span className="text-sm text-text-secondary">Based on {reviews.length} reviews</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map(review => (
                <ReviewCard key={review.id} {...review} />
              ))}
            </div>
          </div>
        )}

        {/* Similar Products Section */}
        <div className="mt-24 border-t border-border pt-16">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Similar Products</h2>
            <p className="text-text-secondary">You might also like these items</p>
          </div>

          {loadingSimilar ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-surface rounded-xl h-80"></div>
                </div>
              ))}
            </div>
          ) : similarProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarProducts.map(similarProduct => (
                <ProductCard
                  key={similarProduct.id}
                  id={similarProduct.id}
                  name={similarProduct.name}
                  price={similarProduct.price}
                  mrp={similarProduct.mrp}
                  discount={similarProduct.discount}
                  image={similarProduct.images[0]?.url || '/placeholder.svg'}
                  brand={similarProduct.brand}
                  rating={similarProduct.rating}
                  inStock={similarProduct.inStock}
                  onAddToCart={() => handleSimilarProductAddToCart(similarProduct)}
                />
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-8">No similar products found</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}