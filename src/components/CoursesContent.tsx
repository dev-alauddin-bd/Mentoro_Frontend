"use client";

import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  SlidersHorizontal,
  BookOpen,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useGetCategoriesQuery } from "@/redux/features/category/categoriesApi";
import { CourseCard } from "@/components/shared/CourseCard";
import { CourseSkeleton } from "@/components/ui/course-skeleton";
import { trackEvent } from "@/lib/gtag";
import { useGetAllPublicCoursesQuery } from "@/redux/features/course/courseAPi";
import { Icourse, } from "@/interfaces/course.interface";

type SortBy = "latest" | "price:asc" | "price:desc";

export default function CoursesContent() {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [debouncedSearch] = useDebounce(search, 800);
  const [sortBy, setSortBy] = useState<SortBy>("latest");

  const { data, isLoading } = useGetAllPublicCoursesQuery({
    page,
    limit: 4,
    search: debouncedSearch,
    category,
    sort: sortBy,
  });

  // ✅ FIXED RESPONSE ACCESS
  const courses: Icourse[] = data?.data || [];
  const totalCount = data?.meta?.total || 0;
  const totalPages = data?.meta?.totalPages || 1;

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories =
    categoriesData?.data?.categories || categoriesData?.data || [];

  const skeletonCount = 8;

  useEffect(() => {
    if (courses.length > 0) {
      trackEvent("view_item_list", {
        item_list_id: "courses_list",
        item_list_name: "All Courses List",
        items: courses.map((course: any, idx: number) => ({
          item_id: course.id,
          item_name: course.title,
          index: idx + 1,
          price: course.price,
          item_category: course.category,
        })),
      });
    }
  }, [courses]);

  return (
    <main className="min-h-screen pt-24 pb-12 md:pt-28 md:pb-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 space-y-12 md:space-y-16 relative z-10">

        {/* FILTER SECTION */}
        <div className="bg-card/50 backdrop-blur-2xl border border-primary/10 rounded-[2.5rem] p-4 lg:p-6 shadow-2xl shadow-primary/5 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* SEARCH */}
            <div className="lg:col-span-5 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);

                  if (e.target.value.length > 2) {
                    trackEvent("search", {
                      search_term: e.target.value,
                    });
                  }
                }}
                placeholder={t("courses.search_placeholder")}
                className="w-full h-14 pl-14 pr-6 bg-background/50 border border-primary/5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            {/* CATEGORY */}
            <div className="lg:col-span-3 relative">
              <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full h-14 pl-14 pr-6 bg-background/50 border border-primary/5 rounded-2xl text-sm font-black uppercase tracking-widest"
              >
                <option value="">{t("courses.category.all")}</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SORT */}
            <div className="lg:col-span-3 relative">
              <SlidersHorizontal className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as SortBy)
                }
                className="w-full h-14 pl-14 pr-6 bg-background/50 border border-primary/5 rounded-2xl text-sm font-black uppercase tracking-widest"
              >
                <option value="latest">{t("courses.sort.newest")}</option>
                <option value="price:asc">{t("courses.sort.price_asc")}</option>
                <option value="price:desc">{t("courses.sort.price_desc")}</option>
              </select>
            </div>

            {/* TOTAL */}
            <div className="lg:col-span-1 hidden lg:flex flex-col items-center justify-center border-l border-primary/10">
              <span className="text-[10px] font-black text-muted-foreground uppercase">
                {t("courses.results")}
              </span>
              <span className="text-xl font-black text-primary">
                {totalCount}
              </span>
            </div>
          </div>
        </div>

        {/* COURSES GRID */}
        <div className="min-h-[600px]">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {Array.from({ length: skeletonCount }).map((_, i) => (
                <CourseSkeleton key={i} />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {courses.map((course, idx) => (
                <div
                  key={course.id}
                  className="animate-in fade-in slide-in-from-bottom-10 duration-700"
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
              <h3 className="text-2xl font-black">
                {t("courses.no_results")}
              </h3>
              <p className="text-muted-foreground">
                {t("courses.no_results_desc")}
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("");
                  setSortBy("latest");
                }}
                className="px-8 py-3 bg-secondary rounded-xl text-xs font-black uppercase"
              >
                {t("courses.clear_filters")}
              </button>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="mt-24 flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">

            {/* PREV */}
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="w-14 h-14 border rounded-2xl flex items-center justify-center disabled:opacity-30"
            >
              <ChevronLeft />
            </button>

            {/* PAGES */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-12 h-12 rounded-xl font-black ${
                    page === p
                      ? "bg-primary text-white"
                      : "text-muted-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* NEXT */}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="w-14 h-14 border rounded-2xl flex items-center justify-center disabled:opacity-30"
            >
              <ChevronRight />
            </button>
          </div>

          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Page {page} of {totalPages}
          </p>
        </div>

      </div>
    </main>
  );
}