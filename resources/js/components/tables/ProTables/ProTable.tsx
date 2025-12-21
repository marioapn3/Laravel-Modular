import { useCallback } from "react";
import { router } from "@inertiajs/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  path: string;
  first_page_url: string;
  last_page_url: string;
  prev_page_url: string | null;
  next_page_url: string | null;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links: PaginationLink[];
}

export interface Response<T> {
  data: T;
  success: boolean;
  message: string;
}

// Column Definition Interface
export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
}

// ProTable Props Interface
export interface ProTableProps<T> {
  data: T[] | null | undefined;
  columns: Column<T>[];
  pagination?: PaginationResponse<T> | null;
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  perPageOptions?: number[];
  className?: string;
  rowClassName?: (item: T, index: number) => string;
  onRowClick?: (item: T) => void;
}

// Pagination Component
interface PaginationProps {
  meta: PaginationMeta;
  links: PaginationLink[];
  onPageChange: (url: string | null) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  meta,
  links,
  onPageChange,
  loading = false,
}) => {
  const handlePageChange = (url: string | null) => {
    if (url && !loading) {
      onPageChange(url);
    }
  };

  const renderPageNumbers = () => {
    const pages: React.ReactNode[] = [];
    const maxVisible = 5;
    let startPage = Math.max(1, meta.current_page - Math.floor(maxVisible / 2));
    let endPage = Math.min(meta.last_page, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(meta.first_page_url)}
          disabled={loading}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span
            key="ellipsis-start"
            className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => {
            const link = links.find((l) => l.label === String(i));
            handlePageChange(link?.url || null);
          }}
          disabled={loading || i === meta.current_page}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed ${i === meta.current_page
              ? "bg-brand-500 text-white disabled:opacity-100"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
            }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < meta.last_page) {
      if (endPage < meta.last_page - 1) {
        pages.push(
          <span
            key="ellipsis-end"
            className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={meta.last_page}
          onClick={() => handlePageChange(meta.last_page_url)}
          disabled={loading}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          {meta.last_page}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 px-4 py-4 border-t border-gray-200 sm:flex-row sm:px-6 dark:border-gray-700">
      {/* Info */}
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Showing <span className="font-medium">{meta.from}</span> to{" "}
        <span className="font-medium">{meta.to}</span> of{" "}
        <span className="font-medium">{meta.total}</span> results
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <button
          onClick={() => handlePageChange(meta.first_page_url)}
          disabled={loading || meta.current_page === 1}
          className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700"
          aria-label="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => handlePageChange(meta.prev_page_url)}
          disabled={loading || !meta.prev_page_url}
          className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">{renderPageNumbers()}</div>

        {/* Next Page */}
        <button
          onClick={() => handlePageChange(meta.next_page_url)}
          disabled={loading || !meta.next_page_url}
          className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => handlePageChange(meta.last_page_url)}
          disabled={loading || meta.current_page === meta.last_page}
          className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700"
          aria-label="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const TableSkeleton: React.FC<{ columns: number; rows?: number }> = ({
  columns,
  rows = 5,
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex} className="px-5 py-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

// Empty State Component
interface EmptyStateProps {
  message?: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No data available",
  description = "There are no records to display at this time.",
}) => {
  return (
    <TableRow>
      <TableCell colSpan={100} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
            {message}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
};

// Main ProTable Component
function ProTable<T extends Record<string, any>>({
  data,
  columns,
  pagination,
  loading = false,
  emptyMessage,
  emptyDescription,
  onPageChange,
  className = "",
  rowClassName,
  onRowClick,
}: ProTableProps<T>) {
  // Handle null/undefined data dengan default ke empty array
  const safeData = data ?? [];

  const handlePageChange = useCallback(
    (url: string | null) => {
      if (url && onPageChange) {
        // Extract page number from URL
        const urlObj = new URL(url);
        const page = urlObj.searchParams.get("page") || "1";
        onPageChange(parseInt(page, 10));
      } else if (url) {
        // Use Inertia router to navigate
        router.visit(url, {
          preserveState: true,
          preserveScroll: true,
          only: ["data", "meta", "links"],
        });
      }
    },
    [onPageChange]
  );

  return (
    <div
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 ${className}`}
    >
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-full">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    isHeader
                    className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 ${column.headerClassName || ""
                      }`}
                  >
                    {column.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/5 bg-white dark:bg-white/3">
              {loading ? (
                <TableSkeleton columns={columns.length} />
              ) : safeData.length === 0 ? (
                <EmptyState
                  message={emptyMessage}
                  description={emptyDescription}
                />
              ) : (
                safeData.map((item, index) => (
                  <TableRow
                    key={item.id || index}
                    className={`${onRowClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5" : ""
                      } ${rowClassName ? rowClassName(item, index) : ""}`}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={`px-5 py-4 text-start ${column.className || ""
                          }`}
                      >
                        {column.render ? (
                          column.render(item, index)
                        ) : (
                          <span className="text-gray-800 text-theme-sm dark:text-white/90">
                            {item[column.key] || "-"}
                          </span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.meta && pagination.meta.last_page > 1 && (
        <Pagination
          meta={pagination.meta}
          links={pagination.links}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}
    </div>
  );
}

export default ProTable;

