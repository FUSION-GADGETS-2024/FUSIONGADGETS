'use client';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";

const wishlistProducts = [
  {
    id: "1",
    name: "Ultra HD Laptop Pro",
    price: 2499,
    category: "Laptops",
    image: "/assets/laptop-pro.jpg",
    rating: 4.8,
    mrp: 2999,
    discount: 17,
    brand: "TechPro",
    inStock: true,
  },
  {
    id: "2",
    name: "Premium Wireless Headphones",
    price: 1299,
    category: "Audio",
    image: "/assets/headphones-premium.jpg",
    rating: 4.9,
    mrp: 1599,
    discount: 19,
    brand: "AudioMax",
    inStock: true,
  },
];

export default function WishlistPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16 bg-background">
        <div className="container mx-auto px-8 py-16">
          <h1 className="text-3xl font-semibold mb-8">My Wishlist</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={() => {}}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}