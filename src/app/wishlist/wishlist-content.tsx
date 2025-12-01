'use client';

import { ProductCard } from "@/components/ProductCard";
import { useWishlist, useRemoveFromWishlist } from "@/lib/hooks/use-wishlist";
import { useAddToCart } from "@/lib/hooks/use-cart";
import { WishlistSkeleton } from "./wishlist-skeleton";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export function WishlistContent() {
    const { data: wishlist, isLoading, error } = useWishlist();
    const removeFromWishlist = useRemoveFromWishlist();
    const addToCart = useAddToCart();

    if (isLoading) {
        return <WishlistSkeleton />;
    }

    if (error) {
        return (
            <div className="text-center py-24">
                <p className="text-base text-destructive mb-6">Failed to load wishlist</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const handleAddToCart = async (productId: string) => {
        try {
            await addToCart.mutateAsync({ productId, quantity: 1 });
            toast.success('Added to cart');
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    if (!wishlist || wishlist.items.length === 0) {
        return (
            <div className="text-center py-24">
                <Heart className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
                <p className="text-base text-text-secondary mb-6">Your wishlist is empty</p>
                <Link href="/">
                    <Button>Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.items.map((item) => {
                if (!item.product) return null;

                return (
                    <ProductCard
                        key={item.id}
                        id={item.product.id}
                        name={item.product.name}
                        price={item.product.price}
                        mrp={item.product.mrp}
                        discount={item.product.discount}
                        image={item.product.image}
                        brand={item.product.brand || ''}
                        rating={item.product.rating}
                        inStock={item.product.inStock}
                        onAddToCart={() => handleAddToCart(item.product!.id)}
                    />
                );
            })}
        </div>
    );
}
