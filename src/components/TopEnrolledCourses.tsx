"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetAllCoursesQuery } from "@/redux/features/course/courseAPi";
import { Section } from "./ui/section";
import { CourseCard } from "./shared/CourseCard";

export function TopEnrolledCourses() {
  const { t } = useTranslation();
  const limit = 4;

  const { data: courseData, isLoading } = useGetAllCoursesQuery({
    page: 1,
    limit,
    sort: "popular",
  });

  const courses: any[] = courseData?.data?.courses || [];
  const skeletons = Array.from({ length: limit });

  if (!isLoading && courses.length === 0) return null;

  return (
    <Section className="from-transparent to-secondary/20">
      {/* HEADER */}
      <div className="space-y-6 border-b border-[--section-popular]/10 pb-0">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[--section-popular]/10 rounded-full border border-[--section-popular]/20 text-xs font-black uppercase text-[--section-popular] tracking-widest">
              <TrendingUp className="w-3 h-3" />
              {t("home.top_enrolled_start") || "Students' Favorites"}
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.9]">
              {t("home.top_enrolled_start")}{" "}
              <span className="text-primary  italic font-serif">{t("home.top_enrolled_end")}</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl font-medium">
              {t("home.top_enrolled_desc")}
            </p>
          </div>
        </div>

        <div className="flex justify-end pb-0">
          <Link
            href="/courses?sort=popular"
            className="hidden md:flex items-center gap-2 group text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-[--section-popular] transition-colors"
          >
            {t("home.view_all")}
            <ArrowRight className="w-4 h-4" />
          </Link>
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
          : courses.map((course) => (
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
