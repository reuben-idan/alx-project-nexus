import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) => {
  // Don't render if there's only one page
  if (totalPages <= 1) return null;

  // Calculate the range of page numbers to show
  const getPageNumbers = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Adjust if we're at the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();
  const showStartEllipsis = pages[0] > 1;
  const showEndEllipsis = pages[pages.length - 1] < totalPages;

  return (
    <nav className="flex items-center justify-center space-x-1" aria-label="Pagination">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9 p-0"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* First Page */}
      {showStartEllipsis && (
        <>
          <Button
            variant={currentPage === 1 ? "default" : "outline"}
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {pages[0] > 2 && (
            <span className="flex items-center justify-center h-9 w-9">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          className={`h-9 w-9 p-0 ${currentPage === page ? 'font-bold' : ''}`}
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? 'page' : undefined}
          aria-label={`Page ${page}`}
        >
          {page}
        </Button>
      ))}

      {/* Last Page */}
      {showEndEllipsis && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="flex items-center justify-center h-9 w-9">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </span>
          )}
          <Button
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 w-9 p-0"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};

export default Pagination;
