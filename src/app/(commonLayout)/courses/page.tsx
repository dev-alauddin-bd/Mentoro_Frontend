"use client";

import { useDebounce } from 'use-debounce';
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  SlidersHorizontal,
  BookOpen,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useGetAllCoursesQuery } from "@/redux/features/course/courseAPi";
import { useGetCategoriesQuery } from "@/redux/features/category/categoriesApi";
import { CourseCard } from "@/components/shared/CourseCard";
import { CourseSkeleton } from "@/components/ui/course-skeleton";

export default function CoursesPage() {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price:asc" | "price:desc">("newest");
  const [category, setCategory] = useState("");
  const [debouncedSearch] = useDebounce(search, 800);

  // --- API Fetching ---
  const { data, isLoading } = useGetAllCoursesQuery({
    page,
    limit: 12,
    search: debouncedSearch,
    category,
    sort: sortBy,
  });

  const courses: any = data?.data?.courses || [];
  const totalCount = data?.data?.total || 0;
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];
  const totalPages = Math.ceil(totalCount / 12) || 1;

  return (
    <main className="min-h-screen bg-background pb-32">
      
      {/* --- Filter & Content Section --- */}
      <div className="container mx-auto px-4 pt-32  -mt-10 relative z-20">
        
        {/* ================= PREMIUM FILTER BAR ================= */}
        <div className="bg-card/50 backdrop-blur-2xl border border-primary/10 rounded-[2.5rem] p-4 lg:p-6 shadow-2xl shadow-primary/5 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* 1. Search (Span 5) */}
            <div className="lg:col-span-5 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={t("courses.search_placeholder") || "What do you want to learn today?"}
                className="w-full h-14 pl-14 pr-6 bg-background/50 border border-primary/5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
              />
            </div>

            {/* 2. Category Select (Span 3) */}
            <div className="lg:col-span-3 relative group">
              <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full h-14 pl-14 pr-6 bg-background/50 border border-primary/5 rounded-2xl text-sm font-black uppercase tracking-widest appearance-none outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                <option value="">{t("courses.category.all") || "All Subjects"}</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
              </div>
            </div>

            {/* 3. Sort Select (Span 3) */}
            <div className="lg:col-span-3 relative group">
              <SlidersHorizontal className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setPage(1);
                }}
                className="w-full h-14 pl-14 pr-6 bg-background/50 border border-primary/5 rounded-2xl text-sm font-black uppercase tracking-widest appearance-none outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                <option value="newest">New Arrivals</option>
                <option value="price:asc">Price: Low to High</option>
                <option value="price:desc">Price: High to Low</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
              </div>
            </div>

            {/* 4. Results Info (Span 1) */}
            <div className="lg:col-span-1 hidden lg:flex flex-col items-center justify-center border-l border-primary/10">
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Results</span>
               <span className="text-xl font-black text-primary leading-none">{totalCount}</span>
            </div>

          </div>
        </div>


        {/* ================= CONTENT GRID ================= */}
        <div className="min-h-[600px] relative">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <CourseSkeleton key={i} />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {courses.map((course: any, idx: number) => (
                <div 
                  key={course.id} 
                  className="animate-in fade-in slide-in-from-bottom-10 duration-700 fill-mode-both"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 space-y-6 text-center">
              <div className="w-24 h-24 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-primary/40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">{t("courses.no_results") || "End of Search"}</h3>
                <p className="text-muted-foreground font-medium">Try adjusting your filters or search terms.</p>
              </div>
              <button 
                onClick={() => { setSearch(""); setCategory(""); setSortBy("newest"); }}
                className="px-8 py-3 bg-secondary border border-border rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
              >
                Clear All Filter
              </button>
            </div>
          )}
        </div>

        {/* ================= PREMIUM PAGINATION ================= */}
        <div className="mt-24 flex flex-col items-center gap-8">
          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="w-14 h-14 border border-border rounded-2xl flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all disabled:opacity-20 active:scale-95 bg-card shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-[2rem] border border-border/50 backdrop-blur-sm">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isActive = page === p;
                  const isFar = totalPages > 5 && Math.abs(p - page) > 1 && p !== 1 && p !== totalPages;
                  
                  if (isFar) {
                    if (p === 2 || p === totalPages - 1) {
                      return <span key={`dot-${p}`} className="w-10 text-center text-muted-foreground">...</span>;
                    }
                    return null;
                  }

                  return (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className={`w-12 h-12 rounded-2xl text-xs font-black transition-all duration-300 ${
                        isActive 
                          ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110" 
                          : "text-muted-foreground hover:bg-background hover:text-primary"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="w-14 h-14 border border-border rounded-2xl flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all disabled:opacity-20 active:scale-95 bg-card shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="h-1 w-24 bg-primary/10 rounded-full" />
          )}
          
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
            Showing Page <span className="text-primary">{page}</span> of {totalPages}
          </p>
        </div>
      </div>
    </main>
  );
}