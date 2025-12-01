import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WishlistContent } from "./wishlist-content";
import { WishlistSkeleton } from "./wishlist-skeleton";

// Static page - no dynamic rendering
export default function WishlistPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16 bg-background">
        <div className="container mx-auto px-8 py-16">
          <h1 className="text-3xl font-semibold mb-8">My Wishlist</h1>

          <Suspense fallback={<WishlistSkeleton />}>
            <WishlistContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}