'use client';

import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductsHero } from "@/components/ProductsHero";
import { Category } from "@/lib/types";

interface CategoriesClientProps {
  categories: Category[];
}

export function CategoriesClient({ categories }: CategoriesClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProductsHero 
        categoryName="Categories"
        categoryImage="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=600&fit=crop"
      />
      
      <main className="container mx-auto px-8 pb-24">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-3">Shop by Category</h2>
          <p className="text-text-secondary">Explore our curated collection of premium tech products</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-xl aspect-[4/3] hover-scale"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-semibold text-white mb-2">{category.name}</h3>
                <p className="text-sm text-white/80">{category.productCount} Products</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}