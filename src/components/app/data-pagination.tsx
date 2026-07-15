import { ChevronLeft, ChevronRight } from "lucide-react";
import { type MouseEvent, useCallback } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

interface DataPaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  itemCount: number;
  total: number;
  onPageChange: (page: number) => void;
  onPrefetchPage?: (page: number) => void;
}

const PAGE_WINDOW = 3;

export function DataPagination({
  page,
  pageCount,
  pageSize,
  itemCount,
  total,
  onPageChange,
  onPrefetchPage,
}: Readonly<DataPaginationProps>) {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      const next = Number(event.currentTarget.dataset.page);
      if (next) onPageChange(next);
    },
    [onPageChange],
  );
  const handlePrefetch = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const next = Number(event.currentTarget.dataset.page);
      if (onPrefetchPage && next >= 1 && next <= pageCount) onPrefetchPage(next);
    },
    [onPrefetchPage, pageCount],
  );

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = rangeStart + itemCount - 1;

  const windowStart = Math.max(1, Math.min(page - 1, pageCount - PAGE_WINDOW + 1));
  const windowEnd = Math.min(windowStart + PAGE_WINDOW - 1, pageCount);
  const pageNumbers = Array.from(
    { length: windowEnd - windowStart + 1 },
    (_, index) => windowStart + index,
  );
  const showLeadingEllipsis = windowStart > 1;
  const showTrailingEllipsis = windowEnd < pageCount;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-[13px] font-semibold text-muted-foreground">
        Showing {rangeStart}-{rangeEnd} of {total}
      </div>
      {pageCount > 1 && (
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                href="#"
                aria-label="Go to previous page"
                data-page={page - 1}
                onClick={handleClick}
                onMouseEnter={handlePrefetch}
                aria-disabled={page === 1}
                className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
              >
                <ChevronLeft />
              </PaginationLink>
            </PaginationItem>

            {showLeadingEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {pageNumbers.map((number) => (
              <PaginationItem key={number}>
                <PaginationLink
                  href="#"
                  data-page={number}
                  onClick={handleClick}
                  onMouseEnter={handlePrefetch}
                  isActive={number === page}
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}
            {showTrailingEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                href="#"
                aria-label="Go to next page"
                data-page={page + 1}
                onClick={handleClick}
                onMouseEnter={handlePrefetch}
                aria-disabled={page === pageCount}
                className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
              >
                <ChevronRight />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
