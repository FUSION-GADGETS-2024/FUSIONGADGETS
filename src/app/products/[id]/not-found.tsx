import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header isStatic={true} />
      <div className="container mx-auto px-8 pt-32 pb-24">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">Product Not Found</h1>
          <p className="text-text-secondary mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <div className="space-x-4">
            <Link href="/products">
              <Button>Browse All Products</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Return Home</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}