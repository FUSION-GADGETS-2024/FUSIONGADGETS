'use client';

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

// Client Component - Wishlist Button
export function WishlistButton({ productId, className = "" }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsWishlisted(!isWishlisted);
    
    toast({
      description: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleWishlist}
      className={`h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm ${className}`}
    >
      <Heart 
        className={`h-4 w-4 transition-colors ${
          isWishlisted 
            ? 'fill-red-500 text-red-500' 
            : 'text-gray-600 hover:text-red-500'
        }`} 
      />
    </Button>
  );
}
