'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/providers/hybrid-provider";

export default function CartPage() {
  const { state, isLoading, removeItem, updateQuantity } = useCart();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering cart content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpdateQuantity = (itemId: string, currentQuantity: number, delta: number) => {
    const newQuantity = Math.max(1, currentQuantity + delta);
    updateQuantity(itemId, newQuantity);
  };

  const handleRemove = (itemId: string) => {
    removeItem(itemId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-8 pt-24 pb-24">
        <h1 className="text-2xl font-semibold text-foreground mb-8">Shopping Cart</h1>

        {!mounted || isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6 flex gap-6 animate-pulse">
                  <div className="w-24 h-24 bg-surface rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-surface rounded w-3/4" />
                    <div className="h-5 bg-surface rounded w-1/4" />
                    <div className="h-8 bg-surface rounded w-32" />
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
                <div className="h-5 bg-surface rounded w-1/2 mb-6" />
                <div className="space-y-4">
                  <div className="h-4 bg-surface rounded" />
                  <div className="h-4 bg-surface rounded" />
                  <div className="h-6 bg-surface rounded" />
                </div>
              </div>
            </div>
          </div>
        ) : state.items.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
            <p className="text-base text-text-secondary mb-6">Your cart is empty</p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="bg-card border border-border rounded-xl p-6 flex gap-6">
                  <div className="w-24 h-24 bg-surface rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {item.brand && (
                        <p className="text-xs text-text-tertiary mb-1">{item.brand}</p>
                      )}
                      <h3 className="text-base font-semibold text-foreground mb-1">
                        {item.name}
                      </h3>
                      <p className="text-lg font-semibold text-foreground">
                        ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          className="px-3 h-8 text-foreground hover:bg-surface transition-colors duration-150"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 h-8 flex items-center border-x border-border text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          className="px-3 h-8 text-foreground hover:bg-surface transition-colors duration-150"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-text-secondary hover:text-destructive transition-colors duration-150"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <h2 className="text-base font-semibold text-foreground mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal ({state.count} items)</span>
                    <span className="text-foreground font-medium">
                      ₹{state.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Shipping</span>
                    <span className="text-success font-medium">Free</span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-foreground">Total</span>
                      <span className="text-lg font-semibold text-foreground">
                        ₹{state.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button className="w-full h-10 text-sm font-medium mb-3">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full h-10 text-sm font-medium">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
