'use client';

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productBrand: string;
  inStock: boolean;
  className?: string;
  fullWidth?: boolean;
}

// Client Component - Add to Cart Button
export function AddToCartButton({ 
  productId, 
  productName, 
  productPrice, 
  productImage, 
  productBrand,
  inStock,
  className = "",
  fullWidth = false
}: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inStock) return;
    
    setIsAdded(true);
    addItem({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      brand: productBrand,
    });
    
    toast({
      description: "Product added to cart",
    });
    
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={!inStock || isAdded}
      className={`h-9 px-5 text-sm font-medium transition-all duration-150 active:scale-[0.98] ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {isAdded ? (
        <span className="flex items-center gap-2">
          <Check className="h-3.5 w-3.5" />
          Added
        </span>
      ) : (
        'Add to Cart'
      )}
    </Button>
  );
}
