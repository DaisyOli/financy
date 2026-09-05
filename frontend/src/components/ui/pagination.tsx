import { ChevronLeft, ChevronRight } from "lucide-react";

import { PaginationButton } from "./pagination-button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Janela de páginas em volta da atual, para não estourar a linha. */
function pageWindow(page: number, totalPages: number): number[] {
  const MAX_VISIBLE = 5;

  if (totalPages <= MAX_VISIBLE) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const half = Math.floor(MAX_VISIBLE / 2);
  const start = Math.min(Math.max(page - half, 1), totalPages - MAX_VISIBLE + 1);

  return Array.from({ length: MAX_VISIBLE }, (_, index) => start + index);
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center gap-2" aria-label="Paginação">
      <PaginationButton
        aria-label="Página anterior"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4" />
      </PaginationButton>

      {pageWindow(page, totalPages).map((number) => (
        <PaginationButton
          key={number}
          isActive={number === page}
          onClick={() => onPageChange(number)}
        >
          {number}
        </PaginationButton>
      ))}

      <PaginationButton
        aria-label="Próxima página"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="size-4" />
      </PaginationButton>
    </nav>
  );
}
