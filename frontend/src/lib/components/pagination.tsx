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

  return [1, page - 1, page, page + 1, totalPages];
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
    <Pagination>
      <PaginationContent>
        {isFirstPage ? null : (
          <PaginationItem>
            <PaginationPrevious href={buildPageHref(currentPage - 1)} />
          </PaginationItem>
        )}

        {allPages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={buildPageHref(page)} isActive>
              {" "}
              {page}{" "}
            </PaginationLink>
          </PaginationItem>
        ))}

        {isLastPage ? null : (
          <PaginationItem>
            <PaginationNext href={buildPageHref(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
