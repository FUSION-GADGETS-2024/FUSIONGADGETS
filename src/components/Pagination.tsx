import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string | undefined>;
}

// Server Component - Pagination with links (no client-side navigation)
export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    
    // Add existing search params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== 'page') {
        params.set(key, value);
      }
    });
    
    // Add page param
    if (page > 1) {
      params.set('page', page.toString());
    }
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Always show first page
    pages.push(1);
    
    // Calculate start and end of middle section
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    
    // Adjust if at the beginning
    if (currentPage <= 3) {
      end = Math.min(4, totalPages - 1);
    }
    
    // Adjust if at the end
    if (currentPage >= totalPages - 2) {
      start = Math.max(2, totalPages - 3);
    }
    
    // Add ellipsis before middle section if needed
    if (start > 2) {
      pages.push('ellipsis');
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis after middle section if needed
    if (end < totalPages - 1) {
      pages.push('ellipsis');
    }
    
    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-secondary hover:text-foreground hover:bg-surface rounded-lg transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-tertiary cursor-not-allowed">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-text-tertiary">
                ...
              </span>
            );
          }
          
          const isCurrentPage = page === currentPage;
          
          return isCurrentPage ? (
            <span
              key={page}
              className="px-3 py-2 text-sm font-medium bg-foreground text-background rounded-lg"
              aria-current="page"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={buildUrl(page)}
              className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-foreground hover:bg-surface rounded-lg transition-colors"
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-secondary hover:text-foreground hover:bg-surface rounded-lg transition-colors"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-tertiary cursor-not-allowed">
          Next
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
