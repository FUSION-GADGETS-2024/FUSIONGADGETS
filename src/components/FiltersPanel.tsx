'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface FiltersPanelProps {
  categories: string[];
  brands: string[];
  currentCategory?: string;
  currentBrand?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

// Client Component - Filters Panel (updates URL for server-side filtering)
export function FiltersPanel({
  categories,
  brands,
  currentCategory,
  currentBrand,
  currentMinPrice,
  currentMaxPrice,
}: FiltersPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [showCategories, setShowCategories] = useState(true);
  const [showBrands, setShowBrands] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  
  const [minPrice, setMinPrice] = useState(currentMinPrice || '');
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice || '');

  // Update URL with new filter params (triggers server-side refetch)
  const updateFilters = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    // Reset to page 1 when filters change
    params.delete('page');
    
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const handleCategoryChange = (category: string) => {
    updateFilters('category', category === currentCategory ? null : category);
  };

  const handleBrandChange = (brand: string) => {
    updateFilters('brand', brand === currentBrand ? null : brand);
  };

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (minPrice) {
      params.set('minPrice', minPrice);
    } else {
      params.delete('minPrice');
    }
    
    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    } else {
      params.delete('maxPrice');
    }
    
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    router.push(pathname);
  };

  const hasActiveFilters = currentCategory || currentBrand || currentMinPrice || currentMaxPrice;

  return (
    <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-foreground">Filters</h2>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-xs text-text-secondary hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-3"
        >
          Categories
          {showCategories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showCategories && (
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  currentCategory === category
                    ? 'bg-foreground text-background'
                    : 'text-text-secondary hover:bg-surface hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="mb-6">
        <button
          onClick={() => setShowBrands(!showBrands)}
          className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-3"
        >
          Brands
          {showBrands ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showBrands && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandChange(brand)}
                className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  currentBrand === brand
                    ? 'bg-foreground text-background'
                    : 'text-text-secondary hover:bg-surface hover:text-foreground'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => setShowPrice(!showPrice)}
          className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-3"
        >
          Price Range
          {showPrice ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showPrice && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="minPrice" className="text-xs text-text-secondary">Min</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="₹0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="maxPrice" className="text-xs text-text-secondary">Max</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="₹99999"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="mt-1 h-9 text-sm"
                />
              </div>
            </div>
            <Button 
              onClick={handlePriceFilter}
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              Apply Price Filter
            </Button>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-text-secondary mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {currentCategory && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface rounded-md text-xs">
                {currentCategory}
                <button onClick={() => updateFilters('category', null)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {currentBrand && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface rounded-md text-xs">
                {currentBrand}
                <button onClick={() => updateFilters('brand', null)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {(currentMinPrice || currentMaxPrice) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface rounded-md text-xs">
                ₹{currentMinPrice || '0'} - ₹{currentMaxPrice || '∞'}
                <button onClick={() => {
                  setMinPrice('');
                  setMaxPrice('');
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete('minPrice');
                  params.delete('maxPrice');
                  router.push(`${pathname}?${params.toString()}`);
                }}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
