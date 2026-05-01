"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { PlayCircle, GraduationCap, Sparkles, BookMarked, Loader2, Play } from "lucide-react";
import { useGetMyCoursesQuery } from "@/redux/features/course/courseAPi";

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  progressPercentage?: number;
  completedLessonsCount?: number;
  totalLessons?: number;
  instructor?: {
    name?: string;
  };
}

export default function MyCoursesPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetMyCoursesQuery();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  useEffect(() => {
    if (success) {
      toast.success("Payment successful! Welcome to your course.");
    }
  }, [success]);

  const courses: any[] = data?.data?.courses || data?.data || [];

  if (isLoading) {
    return (
      <main className="min-h-screen py-10 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl flex flex-col items-center justify-center min-h-[60vh]">
             <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
             <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">{t("student.my_courses.loading")}</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen py-10 bg-background flex flex-col items-center justify-center relative overflow-hidden">
        <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-red-500">{t("student.my_courses.error_title")}</h2>
            <p className="text-muted-foreground font-medium max-w-md">{t("student.my_courses.error_desc")}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-10 bg-background relative overflow-hidden selection:bg-primary/30">
      {/* Premium Background Decorators */}
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30vw] h-[30vw] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border/50 pb-8">
            <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> {t("student.my_courses.hub")}
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                {t("student.my_courses.title")}
                </h1>
                <p className="text-muted-foreground font-medium text-sm">{t("student.my_courses.subtitle")}</p>
            </div>
            
            <div className="flex items-center gap-6 text-sm font-bold bg-secondary/50 px-6 py-3 rounded-2xl border border-border">
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-primary">{courses.length}</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("student.my_courses.enrolled")}</span>
                </div>
                <div className="w-px h-8 bg-border"></div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-emerald-500">{courses.filter((c:any) => c.progressPercentage === 100).length}</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("student.my_courses.completed")}</span>
                </div>
            </div>
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-4 text-center border border-border/50 border-dashed rounded-[3rem] bg-card/30 backdrop-blur-sm shadow-sm">
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <BookMarked className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-3 tracking-tight">{t("student.my_courses.no_courses")}</h2>
            <p className="text-muted-foreground max-w-md font-medium mb-8">{t("student.my_courses.no_courses_desc")}</p>
            <Link href="/courses" className="h-12 px-8 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform">
                {t("student.my_courses.explore")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course) => {
              const isCompleted = course.progressPercentage === 100;
              return (
              <div
                key={course.id}
                className="group relative bg-card border border-border/60 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 hover:-translate-y-1 flex flex-col"
              >
                {/* Thumbnail Header */}
                <div className="relative h-48 w-full overflow-hidden bg-secondary">
                  <Image
                    src={course.thumbnail !== 'demo-thumbnail.jpg' ? course.thumbnail : 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=800&q=80'}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
                  
                  {isCompleted && (
                     <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400 text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1.5 shadow-lg">
                        <GraduationCap className="w-3.5 h-3.5" /> {t("student.my_courses.completed")}
                     </div>
                  )}

                  <Link href={`/dashboard/student/my-courses/${course.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-500 shadow-xl shadow-primary/30">
                        <Play className="w-6 h-6 ml-1" />
                    </div>
                  </Link>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm relative">
                        <div
                            className={`absolute top-0 bottom-0 left-0 ${isCompleted ? 'bg-emerald-400' : 'bg-primary'} transition-all duration-700 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]`}
                            style={{ width: `${course.progressPercentage || 0}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2 text-[10px] font-black uppercase tracking-widest">
                          <span className="text-white/80">{course.completedLessonsCount || 0} / {course.totalLessons || 0} {t("student.my_courses.lessons")}</span>
                          <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-primary font-bold'}>{course.progressPercentage || 0}%</span>
                      </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-card to-secondary/10">
                  <h3 className="font-black text-lg text-foreground line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
                    <Link href={`/dashboard/student/my-courses/${course.id}`}>{course.title}</Link>
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-6">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-[10px] font-black text-primary uppercase">{(course.instructor?.name || "UN").slice(0, 2)}</span>
                      </div>
                      <p className="text-xs font-bold text-muted-foreground">{course.instructor?.name || t("student.my_courses.expert_instructor")}</p>
                  </div>

                  <div className="mt-auto space-y-3">
                      {isCompleted ? (
                          <Link
                            href={`/dashboard/student/certificate/${course.id}`}
                            className="w-full h-12 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:hover:bg-emerald-500/20 text-xs font-black uppercase tracking-widest rounded-xl transition-colors shadow-sm"
                          >
                            <GraduationCap className="w-4 h-4" /> {t("student.my_courses.view_certificate")}
                          </Link>
                      ) : (
                          <Link
                            href={`/dashboard/student/my-courses/${course.id}`}
                            className="w-full h-12 flex items-center justify-center gap-2 bg-secondary hover:bg-primary hover:text-white hover:border-primary text-foreground border border-border text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95"
                          >
                            <PlayCircle className="w-4 h-4" /> {t("student.my_courses.resume")}
                          </Link>
                      )}
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </main>
  );
}