'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";

export default function CheckoutPage() {
  const { state: cartState, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    toast({
      title: "Order placed successfully!",
      description: "You will receive a confirmation email shortly.",
    });
    setTimeout(() => router.push("/"), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-8 pt-24 pb-24">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground mb-8 transition-colors duration-150">
          <ChevronLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="text-2xl font-semibold text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-base font-semibold text-foreground mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" className="mt-2" required />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
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
                      <Input id="city" placeholder="New York" className="mt-2" required />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium">State</Label>
                      <Input id="state" placeholder="NY" className="mt-2" required />
                    </div>
                    <div>
                      <Label htmlFor="zip" className="text-sm font-medium">ZIP Code</Label>
                      <Input id="zip" placeholder="10001" className="mt-2" required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-base font-semibold text-foreground mb-6">Payment Method</h2>
                <RadioGroup defaultValue="card">
                  <div className="flex items-center space-x-3 mb-4">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="text-sm font-medium cursor-pointer">Credit / Debit Card</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="text-sm font-medium cursor-pointer">PayPal</Label>
                  </div>
                </RadioGroup>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber" className="text-sm font-medium">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-2" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry" className="text-sm font-medium">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" className="mt-2" required />
                    </div>
                    <div>
                      <Label htmlFor="cvc" className="text-sm font-medium">CVC</Label>
                      <Input id="cvc" placeholder="123" className="mt-2" required />
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-10 text-sm font-medium">
                Place Order
              </Button>
            </form>
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
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Tax</span>
                  <span className="text-foreground font-medium">
                    ${(cartState.total * 0.08).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-foreground">Total</span>
                    <span className="text-lg font-semibold text-foreground">
                      ${(cartState.total * 1.08).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Items ({cartState.count})</span>
                  <span className="text-foreground">
                    ${cartState.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}