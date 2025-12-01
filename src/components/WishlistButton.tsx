'use client';

import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useWishlist } from "@/lib/auth/wishlist-hooks";
import { toast } from "sonner";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className = "" }: WishlistButtonProps) {
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
