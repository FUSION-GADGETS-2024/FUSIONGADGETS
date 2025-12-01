'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, Star } from "lucide-react";
import { useCart } from "@/lib/auth/cart-hooks";
import { useWishlist } from "@/lib/auth/wishlist-hooks";
import { toast } from "sonner";

interface ProductData {
  id: string;
  name: string;
  price: number;
  mrp: number;
  discount: number;
  image: string;
  brand: string;
  rating: number;
  inStock: boolean;
}

function WishlistProductCard({ productId, onRemove }: { productId: string; onRemove: () => void }) {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProduct(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product || !product.inStock) return;
    
    setIsAddingToCart(true);
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
    });
    toast.success("Added to cart");
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 animate-pulse">
        <div className="aspect-square bg-surface rounded-lg mb-3" />
        <div className="space-y-2">
          <div className="h-3 bg-surface rounded w-1/4" />
          <div className="h-4 bg-surface rounded w-3/4" />
          <div className="h-5 bg-surface rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="group bg-card border border-border rounded-xl p-3 transition-all duration-150 hover:border-border-medium hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square bg-surface rounded-lg mb-3 overflow-hidden cursor-pointer relative">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              onRemove();
            }}
            className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center"
          >
            <Trash2 className="h-4 w-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>
      </Link>

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">{product.brand}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-foreground leading-tight hover:text-text-secondary transition-colors duration-150 cursor-pointer line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < Math.floor(product.rating)
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'fill-muted text-muted'
              }`}
            />
          ))}
          <span className="text-xs text-text-secondary ml-1">({product.rating})</span>
        </div>

        <div>
          <p className="text-base font-semibold text-foreground">
            ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {product.mrp > product.price && (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-text-tertiary line-through">
                ₹{product.mrp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-medium text-success">
                {product.discount}% off
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-1.5">
          <span className={`text-xs font-medium ${product.inStock ? 'text-success' : 'text-text-tertiary'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>

          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAddingToCart}
            className="h-9 px-5 text-sm font-medium"
          >
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { productIds, removeFromWishlist, isLoading } = useWishlist();
  const items = productIds;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
    toast.success("Removed from wishlist");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16 bg-background">
        <div className="container mx-auto px-8 py-16">
          <h1 className="text-3xl font-semibold mb-8">My Wishlist</h1>

          {!mounted || isLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-3 animate-pulse">
                  <div className="aspect-square bg-surface rounded-lg mb-3" />
                  <div className="space-y-2">
                    <div className="h-3 bg-surface rounded w-1/4" />
                    <div className="h-4 bg-surface rounded w-3/4" />
                    <div className="h-5 bg-surface rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24">
              <Heart className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
              <p className="text-base text-text-secondary mb-6">Your wishlist is empty</p>
              <Link href="/">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((productId) => (
                <WishlistProductCard
                  key={productId}
                  productId={productId}
                  onRemove={() => handleRemove(productId)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
