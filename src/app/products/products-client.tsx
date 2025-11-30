'use client';

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { ProductsHero } from "@/components/ProductsHero";
import { Footer } from "@/components/Footer";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { useSearch } from "@/lib/search-context";
import { Product } from "@/lib/types";

interface AllProductsClientProps {
  products: Product[];
  categories: string[];
  categoryImages: Record<string, string>;
}

export function AllProductsClient({ products, categories, categoryImages }: AllProductsClientProps) {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl ? categories.find(c => c.toLowerCase() === categoryFromUrl.toLowerCase()) || 'All' : 'All'
  );
  
  const { addItem } = useCart();
  const { searchQuery } = useSearch();
  const { toast } = useToast();

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

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = searchQuery ? (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    ) : true;
    return matchesCategory && matchesSearch;
  });

  const currentCategoryImage = useMemo(() => {
    return categoryImages[selectedCategory] || categoryImages['All'];
  }, [selectedCategory, categoryImages]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProductsHero 
        categoryName={selectedCategory}
        categoryImage={currentCategoryImage}
      />
      
      <main className="container mx-auto px-8 pb-24">
        <div className="mb-12">
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              mrp={product.mrp}
              discount={product.discount}
              image={product.images[0]?.url || '/placeholder.svg'}
              brand={product.brand}
              rating={product.rating}
              inStock={product.inStock}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <p className="text-base text-text-secondary">No products found matching your criteria.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}