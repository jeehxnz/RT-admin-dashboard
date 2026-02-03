import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from './Button';
import { Select } from './Select';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (count: number) => void;
}

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 per page' },
  { value: '25', label: '25 per page' },
  { value: '50', label: '50 per page' },
  { value: '100', label: '100 per page' },
];

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3">
      {/* Items info */}
      <div className="text-sm text-[--color-text-muted]">
        {totalItems === 0 ? (
          'No items'
        ) : (
          <>
            Showing <span className="font-medium text-[--color-text]">{startItem}</span> to{' '}
            <span className="font-medium text-[--color-text]">{endItem}</span> of{' '}
            <span className="font-medium text-[--color-text]">{totalItems}</span> items
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Page size selector */}
        <Select
          value={itemsPerPage.toString()}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          options={PAGE_SIZE_OPTIONS}
          className="w-32"
        />

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={isFirstPage}
            title="First page"
          >
            <ChevronsLeft size={16} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </Button>

          <span className="px-3 text-sm text-[--color-text]">
            Page <span className="font-medium">{totalPages === 0 ? 0 : currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </span>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={isLastPage}
            title="Next page"
          >
            <ChevronRight size={16} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={isLastPage}
            title="Last page"
          >
            <ChevronsRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
