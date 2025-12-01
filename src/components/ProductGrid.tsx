import { Product } from "@/lib/types";
import { ProductCardServer } from "./ProductCardServer";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

// Server Component - Product Grid
export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary">No products found</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {products.map((product) => (
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
  );
}
