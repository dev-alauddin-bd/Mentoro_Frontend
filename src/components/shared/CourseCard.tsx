"use client";

import Link from "next/link";
import { Users, ArrowRight, BookOpen } from "lucide-react";
import { trackEvent } from "@/lib/gtag";
import { useTranslation } from "react-i18next";

interface CourseCardProps {
  course: any;
}

export function CourseCard({ course }: CourseCardProps) {
  const { t } = useTranslation();
  return (
    <Link
      href={`/courses/${course.id}`}
      onClick={() => trackEvent('course_card_click', { course_id: course.id, course_title: course.title })}
      className="group relative flex flex-col h-full bg-card rounded-[2rem] overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* --- THUMBNAIL AREA --- */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-background/90 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-primary border border-primary/10">
          {course.category?.name || t("course_card.uncategorized")}
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="p-6 flex flex-col flex-grow relative">
        <div className="flex-grow space-y-4">
          <h3 className="text-xl font-black leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 min-h-[3.5rem] flex items-center">
            {course.title}
          </h3>

          <p className="text-muted-foreground text-xs font-medium line-clamp-2 min-h-[2.5rem]">
            {course.description || "Master the core concepts and advanced techniques in this comprehensive course."}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-foreground">{course.instructor?.name || t("course_card.academy_expert")}</span>
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{t("course_card.instructor")}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary rounded-lg border border-border">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-black tabular-nums">{course._count?.enrolledUsers || 0}</span>
            </div>
          </div>
        </div>

        {/* --- PRICING SECTION --- */}
        <div className="mt-auto pt-6 border-t border-primary/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">{t("course_card.investment")}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-foreground tabular-nums leading-none">
                ${course.price || 0}
              </span>
              <span className="text-[9px] font-black text-muted-foreground uppercase">USD</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 group-hover:scale-110 transition-all duration-500">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* --- VIEW DETAILS BUTTON --- */}
        <div className="mt-6">
          <div className="w-full py-4 bg-secondary border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-center group-hover:bg-primary group-hover:text-white transition-all">
            {t("course_card.view_details")}
          </div>
        </div>
      </div>
    </Link>
  );
}
