'use client';

import { Button } from "./ui/button";
import { useState } from "react";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  mrp: number;
  discount: number;
  image: string;
  brand: string;
  rating: number;
  inStock: boolean;
  onAddToCart: () => void;
}

export const ProductCard = ({ id, name, price, mrp, discount, image, brand, rating, inStock, onAddToCart }: ProductCardProps) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    setIsAdded(true);
    onAddToCart();
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group bg-card border border-border rounded-xl p-4 transition-all duration-150 hover:border-border-medium hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <Link href={`/products/${id}`}>
        <div className="aspect-square bg-surface rounded-lg mb-4 overflow-hidden cursor-pointer relative">
          <Image 
            src={image} 
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">{brand}</p>
        <Link href={`/products/${id}`}>
          <h3 className="text-base font-semibold text-foreground leading-tight hover:text-text-secondary transition-colors duration-150 cursor-pointer line-clamp-2">{name}</h3>
        </Link>
        
        {/* Ratings */}
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

        {/* Price Section */}
        <div>
          <p className="text-lg font-semibold text-foreground">${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-text-tertiary line-through">
              ${mrp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-medium text-success">
              {discount}% off
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className={`text-xs font-medium ${inStock ? 'text-success' : 'text-text-tertiary'}`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
          
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || isAdded}
            className="h-10 px-6 text-sm font-medium transition-all duration-150 active:scale-[0.98]"
          >
            {isAdded ? (
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Added
              </span>
            ) : (
              'Add to Cart'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};