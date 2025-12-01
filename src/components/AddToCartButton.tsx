'use client';

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/lib/providers/hybrid-provider";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productBrand: string;
  inStock: boolean;
  className?: string;
  fullWidth?: boolean;
  quantity?: number;
}

export function AddToCartButton({ 
  productId, 
  productName, 
  productPrice, 
  productImage, 
  productBrand,
  inStock,
  className = "",
  fullWidth = false,
  quantity = 1,
}: AddToCartButtonProps) {
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
      quantity,
    });
    
    setIsAdded(true);
    toast.success(`${quantity > 1 ? `${quantity} items` : 'Product'} added to cart`);
    
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
      ) : !inStock ? (
        'Out of Stock'
      ) : (
        'Add to Cart'
      )}
    </Button>
  );
}
