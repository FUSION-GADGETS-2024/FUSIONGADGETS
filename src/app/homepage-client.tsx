'use client';

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductSection } from "@/components/ProductSection";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/types";

interface HomepageClientProps {
  newArrivals: Product[];
  hotDeals: Product[];
  featured: Product[];
  allProducts: Product[];
}

export function HomepageClient({ newArrivals, hotDeals, featured, allProducts }: HomepageClientProps) {
  const { addItem } = useCart();
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

  return (
    <>
      <Header />
      <Hero />
      
      <main className="container mx-auto px-8 pb-24">
        <ProductSection 
          title="New Arrivals"
          products={newArrivals}
          onAddToCart={handleAddToCart}
        />

        <ProductSection 
          title="Hot Deals"
          products={hotDeals}
          onAddToCart={handleAddToCart}
        />

        <ProductSection 
          title="Featured Products"
          products={featured}
          onAddToCart={handleAddToCart}
        />

        <ProductSection 
          title="All Products"
          products={allProducts}
          onAddToCart={handleAddToCart}
          showViewAll={true}
        />
      </main>
    </>
  );
}