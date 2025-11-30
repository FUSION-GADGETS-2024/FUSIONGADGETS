'use client';

import { Search, ShoppingCart, Menu, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useSearch } from "@/lib/search-context";


// Import optimized lazy-loaded SearchResults
import { LazySearchResults } from './LazyComponents';

interface HeaderClientProps {
  cartCount?: number;
  onSearchChange?: (query: string) => void;
}

export const HeaderClient = ({ cartCount: propCartCount, onSearchChange }: HeaderClientProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { state: cartState } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  
  // Use cart context count if available, otherwise use prop
  const cartCount = propCartCount !== undefined ? propCartCount : cartState.count;
  
  const isHomePage = pathname === "/";
  const isProductsPage = pathname === "/products";
  const isCategoriesPage = pathname === "/categories";

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Use auth context instead of local state
  const { user } = useAuth();
  
  useEffect(() => {
    // Update local state based on auth context
    setIsLoggedIn(!!user);
    setUserName(user?.user_metadata?.name || user?.email || null);
  }, [user, pathname]);

  useEffect(() => {
    // Load products for search functionality
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const products = await response.json();
          setAllProducts(products);
        }
      } catch (error) {
        console.error('Failed to load products for search:', error);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    // Handle clicks outside search to close results
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Show/hide search results based on query
    setShowSearchResults(searchQuery.trim().length > 0);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
    setIsLoggedIn(false);
    setUserName(null);
    router.push("/");
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || (!isHomePage && !isProductsPage && !isCategoriesPage)
          ? 'h-14 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm' 
          : 'h-16 bg-transparent border-b border-white/10'
      }`}
    >
      <div className="container mx-auto h-full flex items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <Link href="/">
            <h1 className={`text-base font-semibold tracking-tight transition-colors duration-300 ${
              isScrolled || (!isHomePage && !isProductsPage && !isCategoriesPage) ? 'text-foreground' : 'text-white'
            }`}>
              FUSION GADGETS
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`text-sm font-semibold transition-colors duration-300 ${
                isScrolled || (!isHomePage && !isProductsPage && !isCategoriesPage)
                  ? 'text-foreground hover:text-text-secondary' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/categories" 
              className={`text-sm font-semibold transition-colors duration-300 ${
                isScrolled || (!isHomePage && !isProductsPage && !isCategoriesPage)
                  ? 'text-foreground hover:text-text-secondary' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              Categories
            </Link>
            <Link 
              href="/products" 
              className={`text-sm font-semibold transition-colors duration-300 ${
                isScrolled || (!isHomePage && !isProductsPage && !isCategoriesPage)
                  ? 'text-foreground hover:text-text-secondary' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              All Products
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden md:block" ref={searchRef}>
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${
              isScrolled || (!isHomePage && !isProductsPage && !isCategoriesPage) ? 'text-text-secondary' : 'text-white/80'
            }`} />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              className={`pl-10 w-64 h-10 text-sm transition-all duration-300 ${
                isScrolled || (!isHomePage && !isProductsPage && !isCategoriesPage)
                  ? 'border-border bg-background focus:border-border-medium' 
                  : 'border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:border-white/40 backdrop-blur-sm'
              }`}
            />
            {showSearchResults && (
              <LazySearchResults products={allProducts} />
            )}
          </div>
          
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className={`h-5 w-5 transition-colors duration-300 ${
                isScrolled || (!isHomePage && !isProductsPage && !isCategoriesPage) ? 'text-foreground' : 'text-white'
              }`} />
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
                <User className={`h-5 w-5 transition-colors duration-300 ${
                  isScrolled || (!isHomePage && !isProductsPage && !isCategoriesPage) ? 'text-foreground' : 'text-white'
                }`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background/80 backdrop-blur-xl border-border/50 z-50">
              {isLoggedIn ? (
                <>
                  {userName && (
                    <DropdownMenuItem disabled>
                      <span className="font-medium">Hello, {userName}</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="cursor-pointer">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup" className="cursor-pointer">Sign Up</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className={`h-5 w-5 transition-colors duration-300 ${
              isScrolled || (!isHomePage && !isProductsPage && !isCategoriesPage) ? 'text-foreground' : 'text-white'
            }`} />
          </Button>
        </div>
      </div>
    </header>
  );
};