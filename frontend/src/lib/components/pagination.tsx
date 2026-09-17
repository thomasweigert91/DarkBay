"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

export function generatePagination(page: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: number[] = [];
  const start = Math.max(1, page - 1);
  const end = Math.min(totalPages, page + 1);

  if (start > 1) pages.push(1);
  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) pages.push(i);
  }
  if (!pages.includes(totalPages)) pages.push(totalPages);

  return pages.sort((a, b) => a - b);
}

interface PaginationProps {
  page: number;
  limit?: number;
  total?: number;
  totalPages: number;
}

export function AppPagination(meta: PaginationProps) {
  const searchParams = useSearchParams();
  const { page: currentPage, totalPages } = meta;
  if (totalPages <= 1) return null;

  const buildPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `?${params.toString()}`;
  };

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;
  const allPages = generatePagination(currentPage, totalPages);

  return (
    <Pagination className="py-2">
      <PaginationContent className="gap-1.5">
        {!isFirstPage && (
          <PaginationItem>
            <PaginationPrevious
              href={buildPageHref(currentPage - 1)}
              text="Zurück"
              className="rounded-xl border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-gray-700 hover:bg-gray-800 hover:text-white"
            />
          </PaginationItem>
        )}

        {allPages.map((page) => {
          const isActive = page === currentPage;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                href={buildPageHref(page)}
                isActive={isActive}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 font-semibold text-white shadow-md shadow-indigo-600/30 border-transparent hover:bg-indigo-500"
                    : "border border-gray-800 bg-gray-900 text-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {!isLastPage && (
          <PaginationItem>
            <PaginationNext
              href={buildPageHref(currentPage + 1)}
              text="Weiter"
              className="rounded-xl border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-gray-700 hover:bg-gray-800 hover:text-white"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
