"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages < 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Simple visible page logic (can be expanded for many pages)
  const visiblePages = pages.filter(page => {
    if (totalPages <= 7) return true;
    if (page === 1 || page === totalPages) return true;
    if (Math.abs(page - currentPage) <= 1) return true;
    return false;
  });

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-10 w-10 flex items-center cursor-pointer justify-center rounded-xl border border-border/50 bg-card text-muted-foreground hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-card disabled:hover:text-muted-foreground transition-all shadow-sm"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          // Add dots if there's a gap
          const prevPage = pages[index - 1];
          const hasGap = prevPage && page - prevPage > 1;

          if (!visiblePages.includes(page)) {
              if (hasGap && visiblePages.includes(prevPage)) {
                  return <span key={`gap-${page}`} className="px-2 text-muted-foreground font-black">...</span>;
              }
              return null;
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-10 w-10 flex items-center cursor-pointer justify-center rounded-xl border transition-all shadow-sm text-xs font-black tracking-widest ${
                currentPage === page
                  ? "bg-primary border-primary text-white scale-110"
                  : "border-border/50 bg-card text-muted-foreground hover:bg-secondary"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-10 w-10 flex items-center cursor-pointer justify-center rounded-xl border border-border/50 bg-card text-muted-foreground hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-card disabled:hover:text-muted-foreground transition-all shadow-sm"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
