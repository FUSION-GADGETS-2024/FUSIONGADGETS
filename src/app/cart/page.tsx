'use client';

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { state: cartState, updateQuantity, removeItem } = useCart();

  const handleUpdateQuantity = (id: string, delta: number) => {
    const item = cartState.items.find(item => item.id === id);
    if (item) {
      updateQuantity(id, Math.max(1, item.quantity + delta));
    }
  };

  const shipping = 0;
  const total = cartState.total + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-8 pt-24 pb-24">
        <h1 className="text-2xl font-semibold text-foreground mb-8">Shopping Cart</h1>

        {cartState.items.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
            <p className="text-base text-text-secondary mb-6">Your cart is empty</p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartState.items.map((item) => (
                <div key={item.id} className="bg-card border border-border rounded-xl p-6 flex gap-6">
                  <div className="w-24 h-24 bg-surface rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-foreground mb-1">{item.name}</h3>
                      <p className="text-lg font-semibold text-foreground">
                        ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-border rounded-lg">
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="px-3 h-8 text-foreground hover:bg-surface transition-colors duration-150"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 h-8 flex items-center border-x border-border text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="px-3 h-8 text-foreground hover:bg-surface transition-colors duration-150"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-text-secondary hover:text-destructive transition-colors duration-150"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <h2 className="text-base font-semibold text-foreground mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="text-foreground font-medium">
                      ${cartState.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                        ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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