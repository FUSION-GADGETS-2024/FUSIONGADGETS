'use client';

import { useState } from "react";
import { Heart, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useCart, useWishlist } from "@/lib/providers/hybrid-provider";
import { toast } from "sonner";

// Wishlist Button Wrapper - Client Component
export function WishlistWrapper({ productId }: { productId: string }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(productId);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const nowInWishlist = toggleWishlist(productId);
    
    if (nowInWishlist) {
      toast.success("Added to wishlist");
    } else {
      toast.success("Removed from wishlist");
    }
  };

  return (
    <div className="absolute top-2 right-2 z-10">
      <button
        onClick={handleToggleWishlist}
        className="h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center"
      >
        <Heart 
          className={`h-4 w-4 transition-colors ${
            isWishlisted 
              ? 'fill-red-500 text-red-500' 
              : 'text-gray-600 hover:text-red-500'
          }`} 
        />
      </button>
    </div>
  );
}

// Add to Cart Button Wrapper - Client Component
export function AddToCartWrapper({ 
  productId, 
  productName, 
  productPrice, 
  productImage, 
  productBrand,
  inStock,
}: { 
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productBrand: string;
  inStock: boolean;
}) {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inStock || isAdded) return;
    
    addItem({
      productId,
      name: productName,
      price: productPrice,
      image: productImage,
      brand: productBrand,
    });
    
    setIsAdded(true);
    toast.success("Product added to cart");
    
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={!inStock || isAdded}
      className="h-9 px-5 text-sm font-medium transition-all duration-150 active:scale-[0.98]"
    >
      {isAdded ? (
        <span className="flex items-center gap-2">
          <Check className="h-3.5 w-3.5" />
          Added
        </span>
      ) : !inStock ? (
        'Out of Stock'
      ) : (
        'Add to Cart'
      )}
    </Button>
  );
}
