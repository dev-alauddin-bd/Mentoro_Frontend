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
      className="group relative flex flex-col h-full bg-card rounded-[2.5rem] overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_-20px_rgba(var(--primary),0.15)]"
    >
      {/* --- THUMBNAIL AREA --- */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={course.thumbnail || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        {/* Category Badge */}
        <div className="absolute top-6 left-6 z-10 px-4 py-1.5 bg-background rounded-xl text-[10px] font-black uppercase tracking-widest text-primary shadow-xl border border-primary/10">
          {course.category?.name || t("course_card.uncategorized")}
        </div>

        {/* Floating Play Indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
           <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl">
              <ArrowRight className="w-6 h-6" />
           </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="p-8 flex flex-col flex-grow relative">
        <div className="flex-grow space-y-4">
          
          <h3 className="text-2xl font-black leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {course.title}
          </h3>

          <p className="text-muted-foreground text-sm font-medium line-clamp-2">
            {course.description || "Master the core concepts and advanced techniques in this comprehensive course."}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-secondary border border-border flex items-center justify-center overflow-hidden">
                {course.instructor?.avatar ? (
                  <img src={course.instructor.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-black text-primary uppercase">{course.instructor?.name?.charAt(0) || "I"}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">{t("course_card.instructor")}</span>
                <span className="text-xs font-bold text-foreground mt-1">{course.instructor?.name || t("course_card.academy_expert")}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary rounded-lg border border-border">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-black tabular-nums">{course._count?.enrolledUsers || 0}</span>
            </div>
          </div>
        </div>

        {/* --- PRICING SECTION --- */}
        <div className="mt-auto pt-6 border-t border-primary/5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-none">{t("course_card.investment")}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-foreground tabular-nums leading-none">
                ${course.price || 0}
              </span>
              <span className="text-[10px] font-black text-muted-foreground uppercase">USD</span>
            </div>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 group-hover:scale-110 transition-all duration-500">
             <BookOpen className="w-6 h-6" />
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
