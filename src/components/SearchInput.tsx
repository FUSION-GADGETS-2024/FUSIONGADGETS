'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SearchInputProps {
  initialQuery?: string;
  placeholder?: string;
}

// Client Component - Search Input (live search with URL update)
export function SearchInput({ initialQuery = '', placeholder = 'Search products...' }: SearchInputProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }, [query, router]);

  const handleClear = () => {
    setQuery('');
    router.push('/search');
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-2xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-12 pr-24 h-12 text-base border-border bg-background"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-20 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <Button 
        type="submit" 
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8"
      >
        Search
      </Button>
    </form>
  );
}
