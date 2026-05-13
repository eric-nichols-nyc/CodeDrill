"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProblemsPaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

type PageNavItem =
  | { key: string; kind: "ellipsis" }
  | { key: string; kind: "page"; page: number };

function buildVisiblePageItems(
  totalPages: number,
  currentPage: number
): PageNavItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => ({
      key: `page-${i + 1}`,
      kind: "page" as const,
      page: i + 1,
    }));
  }

  const items: PageNavItem[] = [{ key: "page-1", kind: "page", page: 1 }];

  if (currentPage > 3) {
    items.push({ key: "ellipsis-head", kind: "ellipsis" });
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    if (!items.some((x) => x.kind === "page" && x.page === i)) {
      items.push({ key: `page-${i}`, kind: "page", page: i });
    }
  }

  if (currentPage < totalPages - 2) {
    items.push({ key: "ellipsis-tail", kind: "ellipsis" });
  }

  if (!items.some((x) => x.kind === "page" && x.page === totalPages)) {
    items.push({
      key: `page-${totalPages}`,
      kind: "page",
      page: totalPages,
    });
  }

  return items;
}

export function ProblemsPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: ProblemsPaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem =
    totalItems === 0 ? 0 : Math.min(currentPage * pageSize, totalItems);

  const pageItems = buildVisiblePageItems(totalPages, currentPage);

  const safeTotalPages = Math.max(1, totalPages);
  const atFirst = currentPage <= 1;
  const atLast = currentPage >= safeTotalPages || totalItems === 0;

  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
        <span>Showing</span>
        <Select
          onValueChange={(v) => onPageSizeChange(Number(v))}
          value={String(pageSize)}
        >
          <SelectTrigger className="h-8 w-[70px] border-0 bg-secondary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span>
          {startItem}-{endItem} of {totalItems}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          className="h-8 w-8"
          disabled={atFirst}
          onClick={() => onPageChange(currentPage - 1)}
          size="icon"
          variant="ghost"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageItems.map((item) =>
          item.kind === "ellipsis" ? (
            <span className="px-2 text-muted-foreground" key={item.key}>
              …
            </span>
          ) : (
            <Button
              className="h-8 w-8"
              key={item.key}
              onClick={() => onPageChange(item.page)}
              size="icon"
              variant={currentPage === item.page ? "default" : "ghost"}
            >
              {item.page}
            </Button>
          )
        )}

        <Button
          className="h-8 w-8"
          disabled={atLast}
          onClick={() => onPageChange(currentPage + 1)}
          size="icon"
          variant="ghost"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
