"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Section } from "./ui/section";
import { CourseCard } from "./shared/CourseCard";
import { useGetAllPublicCoursesQuery } from "@/redux/features/course/courseAPi";
import { Icourse } from "@/interfaces/course.interface";
import { useState, useMemo } from "react";

export function TopEnrolledCourses() {
  const { t } = useTranslation();
  const limit = 4;

  const { data: courseData, isLoading } = useGetAllPublicCoursesQuery({
    page: 1,
    limit,
    sort: "popular",
  });

  // ✅ FIXED
  const courses: Icourse[] = courseData?.data || [];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = useMemo(() => {
    const set = new Set<string>(courses.map((c) => c.category));
    return ['All', ...Array.from(set)];
  }, [courses]);

  const skeletons = Array.from({ length: limit });

  if (!isLoading && courses.length === 0) return null;

  return (
    <Section className="from-transparent to-secondary/20">
      {/* HEADER */}

<div className="border-b border-[--section-popular]/10 pb-6 space-y-6">

  {/* TOP TITLE SECTION */}
  <div className="text-center md:text-left space-y-3">

    {/* Badge */}
    <div className="inline-flex items-center text-primary gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-xs font-bold uppercase text-primary tracking-widest w-fit mx-auto md:mx-0">
      <TrendingUp className="w-3 h-3" />
      Students' Favorites
    </div>

    {/* Title */}
    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
      {t('home.top_enrolled_start')}{' '}
      <span className="text-primary italic font-serif">
        {t('home.top_enrolled_end')}
      </span>
    </h2>

    {/* Description */}
    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto md:mx-0 font-medium">
      {t('home.top_enrolled_desc')}
    </p>
  </div>

  {/* BOTTOM ROW (CATEGORIES + VIEW ALL) */}
  <div className="flex items-center justify-between gap-4 flex-wrap">

    {/* LEFT: CATEGORY TABS */}
    <div className="flex flex-wrap justify-center md:justify-start gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border cursor-pointer ${
            selectedCategory === cat
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-transparent text-muted-foreground border-gray-300 hover:border-primary hover:text-primary'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* RIGHT: VIEW ALL */}
    <div className="flex justify-center md:justify-end w-full md:w-auto">
      <Link
        href="/courses?sort=popular"
        className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-[--section-popular] transition-all group"
      >
        {t('home.view_all')}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>

  </div>
</div>

      {/* COURSES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? skeletons.map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse bg-card rounded-2xl overflow-hidden border border-[--section-popular]/10 h-96"
            >
              <div className="bg-muted h-52 w-full" />
              <div className="p-6 space-y-4">
                <div className="h-3 bg-muted rounded-full w-1/3" />
                <div className="h-6 bg-muted rounded-full w-full" />
                <div className="h-4 bg-muted rounded-full w-3/4" />
              </div>
            </div>
          ))
          : (selectedCategory === 'All' ? courses : courses.filter((c) => c.category === selectedCategory)).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
      </div>

      {/* MOBILE BUTTON */}
      <div className="flex md:hidden justify-center pt-2">
        <Link
          href="/courses"
          className="w-full h-14 flex items-center justify-center rounded-2xl bg-secondary font-black"
        >
          {t("home.view_all") || "View All"}
        </Link>
      </div>
    </Section>
  );
}