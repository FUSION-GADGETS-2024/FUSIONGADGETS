'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/lib/providers/hybrid-provider";
import { toast } from "sonner";

export function CheckoutForm() {
  const { state, isLoading, clearCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    clearCart();
    
    toast.success("Order placed successfully!", {
      description: "You will receive a confirmation email shortly.",
    });
    
    setTimeout(() => router.push("/"), 2000);
  };

  if (!mounted || isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-surface rounded w-1/3 mb-6" />
              <div className="space-y-4">
                <div className="h-10 bg-surface rounded" />
                <div className="h-10 bg-surface rounded" />
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
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary mb-4">Your cart is empty</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  className="mt-2" 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-6">Shipping Address</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                  <Input id="firstName" placeholder="John" className="mt-2" required />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" className="mt-2" required />
                </div>
              </div>
              <div>
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <Input id="address" placeholder="123 Main St" className="mt-2" required />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium">City</Label>
                  <Input id="city" placeholder="Mumbai" className="mt-2" required />
                </div>
                <div>
                  <Label htmlFor="state" className="text-sm font-medium">State</Label>
                  <Input id="state" placeholder="Maharashtra" className="mt-2" required />
                </div>
                <div>
                  <Label htmlFor="zip" className="text-sm font-medium">PIN Code</Label>
                  <Input id="zip" placeholder="400001" className="mt-2" required />
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                <Input id="phone" type="tel" placeholder="+91 98765 43210" className="mt-2" required />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-6">Payment Method</h2>
            <RadioGroup defaultValue="card">
              <div className="flex items-center space-x-3 mb-4">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="text-sm font-medium cursor-pointer">Credit / Debit Card</Label>
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="text-sm font-medium cursor-pointer">UPI</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="text-sm font-medium cursor-pointer">Cash on Delivery</Label>
              </div>
            </RadioGroup>

            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="cardNumber" className="text-sm font-medium">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry" className="text-sm font-medium">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="cvc" className="text-sm font-medium">CVV</Label>
                  <Input id="cvc" placeholder="123" className="mt-2" />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-10 text-sm font-medium">
            Place Order
          </Button>
        </form>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
          <h2 className="text-base font-semibold text-foreground mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
            {state.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-12 h-12 bg-surface rounded-lg overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-text-secondary">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-foreground">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
          
          <div className="space-y-4 mb-6 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Subtotal</span>
              <span className="text-foreground font-medium">
                ₹{state.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Shipping</span>
              <span className="text-success font-medium">Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Tax (18% GST)</span>
              <span className="text-foreground font-medium">
                ₹{(state.total * 0.18).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-base font-semibold text-foreground">Total</span>
                <span className="text-lg font-semibold text-foreground">
                  ₹{(state.total * 1.18).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
