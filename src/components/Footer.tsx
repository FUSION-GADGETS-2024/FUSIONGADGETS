import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border mt-24">
      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Products</h3>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">Laptops</Link></li>
              <li><Link href="/products" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">Tablets</Link></li>
              <li><Link href="/products" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">Accessories</Link></li>
              <li><Link href="/products" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">Audio</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">About Us</Link></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">Careers</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">Press</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">Help Center</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">Shipping</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">Returns</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">Warranty</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy-policy" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="text-sm text-text-secondary hover:text-foreground transition-colors duration-150">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-text-tertiary text-center">© 2024 Premium Tech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};