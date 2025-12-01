import { ProductCardServer } from "./ProductCardServer";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Product } from "@/lib/types";

interface ProductSectionProps {
  title: string;
  products: Product[];
  showViewAll?: boolean;
}

export const ProductSection = ({ title, products, showViewAll = false }: ProductSectionProps) => {
  return (
    <section className="mb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        {showViewAll && (
          <Link href="/products">
            <Button variant="ghost" className="group">
              View All
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCardServer
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
          />
        ))}
      </div>
    </section>
  );
};