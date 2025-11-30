'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { useSearch } from '@/lib/search-context';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/types';

interface SearchResultsProps {
  products: Product[];
  className?: string;
}

export function SearchResults({ products, className = '' }: SearchResultsProps) {
  const { searchQuery } = useSearch();
  const { addItem } = useCart();
  const { toast } = useToast();
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
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || '/placeholder.svg',
      brand: product.brand,
    });
    
    toast({
      description: "Product added to cart",
    });
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
              <div key={product.id} className="flex items-center gap-3 p-2 hover:bg-background/50 rounded-md">
                <img 
                  src={product.images[0]?.url || '/placeholder.svg'} 
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-xs text-text-secondary">{product.category}</p>
                  <p className="text-sm font-semibold text-foreground">${product.price}</p>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="text-xs bg-foreground text-background px-2 py-1 rounded hover:bg-foreground/90 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
            {filteredProducts.length > 5 && (
              <p className="text-xs text-text-secondary text-center py-2">
                And {filteredProducts.length - 5} more results...
              </p>
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