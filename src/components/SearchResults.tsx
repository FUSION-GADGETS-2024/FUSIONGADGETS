'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearch } from '@/lib/search-context';
import { useCart } from '@/lib/providers/hybrid-provider';
import { Product } from '@/lib/types';
import { toast } from 'sonner';

interface SearchResultsProps {
  products: Product[];
  className?: string;
}

export function SearchResults({ products, className = '' }: SearchResultsProps) {
  const { searchQuery } = useSearch();
  const { addItem } = useCart();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }

    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || '/placeholder.svg',
      brand: product.brand,
    });
    
    toast.success("Product added to cart");
  };

  if (!searchQuery.trim()) {
    return null;
  }

  return (
    <div className={`absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-lg mt-2 max-h-96 overflow-y-auto z-50 ${className}`}>
      {filteredProducts.length > 0 ? (
        <div className="p-4">
          <h3 className="text-sm font-medium text-text-secondary mb-3">
            Search Results ({filteredProducts.length})
          </h3>
          <div className="space-y-3">
            {filteredProducts.slice(0, 5).map(product => (
              <div key={product.id} className="flex items-center gap-3 p-2 hover:bg-surface rounded-md">
                <Link href={`/products/${product.id}`} className="flex-shrink-0">
                  <div className="w-12 h-12 relative rounded-md overflow-hidden">
                    <Image 
                      src={product.images[0]?.url || '/placeholder.svg'} 
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${product.id}`}>
                    <p className="text-sm font-medium text-foreground truncate hover:text-text-secondary">
                      {product.name}
                    </p>
                  </Link>
                  <p className="text-xs text-text-secondary">{product.category}</p>
                  <p className="text-sm font-semibold text-foreground">
                    ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="text-xs bg-foreground text-background px-3 py-1.5 rounded-md hover:bg-foreground/90 transition-colors"
                >
                  Add
                </button>
              </div>
            ))}
            {filteredProducts.length > 5 && (
              <Link 
                href={`/search?q=${encodeURIComponent(searchQuery)}`}
                className="block text-xs text-text-secondary text-center py-2 hover:text-foreground"
              >
                View all {filteredProducts.length} results →
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center">
          <p className="text-sm text-text-secondary">No products found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
