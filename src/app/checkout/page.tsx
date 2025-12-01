import { Metadata } from 'next';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckoutForm } from "./checkout-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// Hybrid rendering - Server for layout, Client for forms
export const metadata: Metadata = {
  title: 'Checkout | Fusion Gadgets',
  description: 'Complete your purchase securely at Fusion Gadgets',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-8 pt-24 pb-24">
        {/* Back Link - Server rendered */}
        <Link 
          href="/cart" 
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground mb-8 transition-colors duration-150"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="text-2xl font-semibold text-foreground mb-8">Checkout</h1>

        {/* Checkout Form - Client Component */}
        <CheckoutForm />
      </main>

      <Footer />
    </div>
  );
}
