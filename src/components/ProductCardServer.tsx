import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { WishlistWrapper, AddToCartWrapper } from "./ProductCardActions";

interface ProductCardServerProps {
  id: string;
  name: string;
  price: number;
  mrp: number;
  discount: number;
  image: string;
  brand: string;
  rating: number;
  inStock: boolean;
}

// Server Component - Product Card (renders static content, delegates interactive parts to client)
export function ProductCardServer({ 
  id, 
  name, 
  price, 
  mrp, 
  discount, 
  image, 
  brand, 
  rating, 
  inStock 
}: ProductCardServerProps) {
  return (
    <div className="group bg-card border border-border rounded-xl p-3 transition-all duration-150 hover:border-border-medium hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <Link href={`/products/${id}`}>
        <div className="aspect-square bg-surface rounded-lg mb-3 overflow-hidden cursor-pointer relative">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Client-side wishlist button */}
          <WishlistWrapper productId={id} />
        </div>
      </Link>

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">{brand}</p>
        <Link href={`/products/${id}`}>
          <h3 className="text-sm font-semibold text-foreground leading-tight hover:text-text-secondary transition-colors duration-150 cursor-pointer line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Ratings - Server rendered */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < Math.floor(rating)
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'fill-muted text-muted'
              }`}
            />
          ))}
          <span className="text-xs text-text-secondary ml-1">({rating})</span>
        </div>

        {/* Price Section - Server rendered */}
        <div>
          <p className="text-base font-semibold text-foreground">
            ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-text-tertiary line-through">
              ₹{mrp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-medium text-success">
              {discount}% off
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1.5">
          <span className={`text-xs font-medium ${inStock ? 'text-success' : 'text-text-tertiary'}`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>

          {/* Client-side add to cart button */}
          <AddToCartWrapper
            productId={id}
            productName={name}
            productPrice={price}
            productImage={image}
            productBrand={brand}
            inStock={inStock}
          />
        </div>
      </div>
    </div>
  );
}
