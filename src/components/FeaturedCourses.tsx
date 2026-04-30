"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import { useGetAllCoursesQuery } from "@/redux/features/course/courseAPi";
import { useGetCategoriesQuery } from "@/redux/features/category/categoriesApi";
import { CourseCard } from "./shared/CourseCard";

export function FeaturedCourses() {
  const { t } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const limit = 4;

  /* ================= GET CATEGORIES ================= */
  const { data: catData } = useGetCategoriesQuery();
  const categories = [
    "All",
    ...(catData?.data?.map((cat: any) => cat.name) || []),
  ];

  /* ================= CONVERT NAME → ID ================= */
  const selectedCategoryId =
    selectedCategory === "All"
      ? ""
      : catData?.data?.find((c: any) => c.name === selectedCategory)?.id;

  /* ================= API CALL ================= */
  const { data: courseData, isLoading } = useGetAllCoursesQuery({
    page: 1,
    limit,
    category: selectedCategoryId,
  });

  const courses: any[] = courseData?.data?.courses || [];

  /* ================= SKELETON ================= */
  const skeletons = Array.from({ length: limit });

  return (
    <section className="py-24 bg-background from-transparent to-secondary/20">
      <div className="container mx-auto space-y-12 px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="space-y-6 border-b border-primary/10 pb-0">
          {/* ================= TITLE ================= */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-xs font-black uppercase text-primary tracking-widest">
                <Star className="w-3 h-3 fill-primary" />
                {t("extra.voices_success") || "Top Rated"}
              </div>

              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
                {t("home.featured")}
              </h2>

              <p className="text-muted-foreground text-lg max-w-xl font-medium">
                {t("home.featured_desc")}
              </p>
            </div>
          </div>

          {/* ================= CATEGORY FILTER & VIEW ALL ================= */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-0">
            <div className="flex flex-wrap items-center gap-8 justify-center md:justify-start">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative py-4 text-xs font-black uppercase tracking-[0.2em] cursor-pointer transition-all ${
                    selectedCategory === cat
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {cat}
                  {selectedCategory === cat && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            <Link
              href="/courses"
              className="hidden md:flex items-center gap-2 group text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              {t("home.view_all")}
             <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ================= COURSES ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading
            ? skeletons.map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse bg-card rounded-2xl overflow-hidden border border-primary/10 h-96"
                >
                  <div className="bg-muted h-52 w-full" />
                  <div className="p-6 space-y-4">
                    <div className="h-3 bg-muted rounded-full w-1/3" />
                    <div className="h-6 bg-muted rounded-full w-full" />
                    <div className="h-4 bg-muted rounded-full w-3/4" />
                  </div>
                </div>
              ))
            : courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
        </div>

        {/* ================= MOBILE BUTTON ================= */}
        <div className="flex md:hidden justify-center pt-4">
          <Link
            href="/courses"
            className="w-full h-14 flex items-center justify-center rounded-2xl bg-secondary font-black"
          >
            {t("home.view_all") || "View All"}
          </Link>
        </div>
      </div>
    </section>
  );
}