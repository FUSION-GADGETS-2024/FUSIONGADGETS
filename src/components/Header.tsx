import { Search, ShoppingCart, Menu, User } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { HeaderClient } from "./HeaderClient";

interface HeaderProps {
  cartCount?: number;
  onSearchChange?: (query: string) => void;
  isStatic?: boolean;
}

// Server Component version for static pages
export const Header = ({ cartCount = 0, onSearchChange, isStatic = false }: HeaderProps) => {
  // For static pages, render a simplified version
  if (isStatic) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="container mx-auto h-full flex items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <Link href="/">
              <h1 className="text-base font-semibold tracking-tight text-foreground">
                FUSION GADGETS
              </h1>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link 
                href="/" 
                className="text-sm font-semibold text-foreground hover:text-text-secondary transition-colors duration-300"
              >
                Home
              </Link>
              <Link 
                href="/categories" 
                className="text-sm font-semibold text-foreground hover:text-text-secondary transition-colors duration-300"
              >
                Categories
              </Link>
              <Link 
                href="/products" 
                className="text-sm font-semibold text-foreground hover:text-text-secondary transition-colors duration-300"
              >
                All Products
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <input
                type="search"
                placeholder="Search products..."
                className="pl-10 w-64 h-10 text-sm border border-border bg-background focus:border-border-medium rounded-md px-3 py-2"
                disabled
              />
            </div>
            
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5 text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-foreground text-background text-xs font-medium flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background/80 backdrop-blur-xl border-border/50 z-50">
                <DropdownMenuItem asChild>
                  <Link href="/login" className="cursor-pointer">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/signup" className="cursor-pointer">Sign Up</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5 text-foreground" />
            </Button>
          </div>
        </div>
      </header>
    );
  }

  // For interactive pages, use the client component
  return <HeaderClient cartCount={cartCount} onSearchChange={onSearchChange} />;
};