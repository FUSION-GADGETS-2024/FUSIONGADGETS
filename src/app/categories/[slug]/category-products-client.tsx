'use client';

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductsHero } from "@/components/ProductsHero";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CategoryProductsClientProps {
  category: {
    name: string;
    slug: string;
    description: string;
    image: string;
    productCount: number;
  };
  products: Product[];
}

export function CategoryProductsClient({ category, products }: CategoryProductsClientProps) {
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Handle sorting
  const handleSort = (value: string) => {
    setSortBy(value);
    let sorted = [...products];

    switch (value) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'discount':
        sorted.sort((a, b) => b.discount - a.discount);
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }

    setFilteredProducts(sorted);
  };

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
    // Cart functionality will be implemented later
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProductsHero 
        categoryName={category.name}
        categoryImage={category.image}
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

        {/* Category Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-3">{category.name}</h1>
          {category.description && (
            <p className="text-text-secondary mb-4">{category.description}</p>
          )}
          <p className="text-sm text-text-tertiary">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Sort by:</span>
            <Select value={sortBy} onValueChange={handleSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
                <SelectItem value="discount">Highest Discount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
                onAddToCart={() => handleAddToCart(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg mb-4">No products found in this category</p>
            <Link href="/categories">
              <Button>Browse All Categories</Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
