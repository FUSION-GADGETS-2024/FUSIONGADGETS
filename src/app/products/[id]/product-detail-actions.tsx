'use client';

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/WishlistButton";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/types";

interface ProductDetailActionsProps {
  product: Product;
}

// Client Component - Product Detail Actions (Add to Cart, Wishlist, Quantity)
export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    setIsAdded(true);
    
    // Add the specified quantity to cart
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || '/placeholder.svg',
        brand: product.brand,
      });
    }
    
    toast({
      description: `${quantity} item(s) added to cart`,
    });
    
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="border-t border-border pt-6 space-y-4">
      <div className="flex items-center gap-4">
        {/* Quantity Selector */}
        <div className="flex items-center border border-border rounded-lg">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 h-10 text-foreground hover:bg-surface transition-colors duration-150"
          >
            −
          </button>
          <span className="px-6 h-10 flex items-center border-x border-border text-sm font-medium">
            {quantity}
          </span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 h-10 text-foreground hover:bg-surface transition-colors duration-150"
          >
            +
          </button>
        </div>
        
        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdded}
          className="flex-1 h-10 text-sm font-medium transition-all duration-150 active:scale-[0.98]"
        >
          {isAdded ? (
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Added to Cart
            </span>
          ) : product.inStock ? (
            'Add to Cart'
          ) : (
            'Out of Stock'
          )}
        </Button>
        
        {/* Wishlist Button */}
        <WishlistButton productId={product.id} className="h-10 w-10" />
      </div>
    </div>
  );
}
