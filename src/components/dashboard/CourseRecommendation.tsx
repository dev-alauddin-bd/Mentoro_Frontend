"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Star, Users, BookOpen } from "lucide-react";

import { CourseCardSkeleton } from "./skeletons";
import { useGetRecommendationsQuery } from "@/redux/features/course/courseAPi";

export const CourseRecommendation = () => {
  const { data, isLoading, isError } = useGetRecommendationsQuery(undefined);

  const recommendations = data?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded-xl w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </div>
      </div>
    );
  }

  if (isError || recommendations.length === 0) {
    return null;
  }

  return (
    <section className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">AI Tailored</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">Recommended for you</h2>
          <p className="text-muted-foreground font-medium text-sm">Based on your interests and learning history.</p>
        </div>

        <Link
          href="/courses"
          className="group h-11 px-6 bg-secondary border border-border rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-primary hover:text-white transition-all"
        >
          View More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((course: any) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="group relative bg-card border border-border rounded-[2.5rem] overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(var(--primary),0.12)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={course.thumbnail || "/placeholder.png"}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 right-4">
                <div className="px-3 py-1.5 bg-background/80 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-foreground">
                  {course.category?.name || "Premium"}
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span>Enrolled</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{course._count?.lessons || 0} Lessons</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <Star className="w-4 h-4 fill-primary" />
                  <span className="text-xs font-bold">4.9</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
