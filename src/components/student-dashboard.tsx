"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Award,
  PlayCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Star,
  Trophy
} from "lucide-react";

import { RootState } from "@/redux/store";
import { ProgressBar } from "./progress-bar";
import { WelcomeHeroSkeleton, StatCardSkeleton, CourseCardSkeleton } from "./dashboard/skeletons";

import { useGetMyCoursesQuery } from "@/redux/features/course/courseAPi";
import { CourseRecommendation } from "./dashboard/CourseRecommendation";

export function StudentDashboard() {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.cmAuth);
  const { data, isLoading, isError } = useGetMyCoursesQuery();

  const myCourses = useMemo(() => Array.isArray(data?.data) ? data.data : [], [data]);

  // ================= MEMOIZED STATS =================
  const stats = useMemo(() => {
    const totalEnrolled = myCourses.length;
    const completedCount = myCourses.filter((c) => c.progressPercentage === 100).length;
    const inProgressCount = myCourses.filter((c) => c.progressPercentage < 100).length;
    const overallProgressVal = myCourses.reduce((acc, c) => acc + (c.progressPercentage || 0), 0) / (myCourses.length || 1);

    const continueCourses = [...myCourses]
      .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
      .slice(0, 4);

    return {
      totalEnrolled,
      completedCount,
      inProgressCount,
      overallProgressVal,
      continueCourses
    };
  }, [myCourses]);

  if (isLoading) {
    return (
      <div className="space-y-16 animate-pulse">
        <WelcomeHeroSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-center"><div className="h-8 bg-muted rounded-xl w-48"></div><div className="h-10 bg-muted rounded-xl w-32"></div></div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-12 bg-destructive/5 border border-destructive/10 rounded-[2rem] text-center">
        <p className="text-destructive font-black uppercase tracking-widest text-xs">{t("student.sync_failed") || "Failed to synchronize courses"}</p>
      </div>
    );
  }

  const { totalEnrolled, completedCount, inProgressCount, overallProgressVal, continueCourses } = stats;

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">

      {/* ================= PREMIUM WELCOME HERO ================= */}
      <section className="relative overflow-hidden rounded-[3rem] bg-card border border-primary/10 p-10 md:p-16">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-8 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-background shadow-sm border border-border rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("student.achievement_unlocked") || "Achievement Unlocked"}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
              {t("student.welcome_back") || "Welcome Back,"} <br />
              <span className="text-primary italic font-serif">{user?.name?.split(" ")[0]}</span>
            </h1>

            <p className="text-lg text-muted-foreground font-medium max-w-lg leading-relaxed">
              {t("student.curriculum_progress", { progress: Math.round(overallProgressVal) }) || `You have completed ${Math.round(overallProgressVal)}% of your current curriculum. Your next milestone is just a few lessons away.`}
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href="/courses" className="h-14 px-8 bg-primary text-white rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
                {t("home.cta") || "Explore Courses"}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/dashboard/student/certificate" className="h-14 px-8 bg-secondary border border-border text-foreground rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-background transition-all">
                {t("dashboard.certificates") || "View Certificates"}
                <Trophy className="w-4.5 h-4.5" />
              </Link>
            </div>
          </div>

          {/* Circular Progress Display */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="50%" cy="50%" r="45%" className="stroke-primary/5 fill-transparent" strokeWidth="12" />
              <circle cx="50%" cy="50%" r="45%" className="stroke-primary fill-transparent transition-all duration-1000" strokeWidth="12" strokeDasharray="100 100" strokeDashoffset={100 - (isNaN(overallProgressVal) ? 0 : overallProgressVal)} strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black tracking-tighter">{isNaN(overallProgressVal) ? 0 : Math.round(overallProgressVal)}%</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-1">{t("student.consistency") || "Consistency"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= NEXT LESSON HIGHLIGHT ================= */}
      {continueCourses.length > 0 && (
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex flex-col md:flex-row items-center justify-between p-8 bg-card border border-primary/20 rounded-[2.5rem] gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <PlayCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Resume Learning</span>
                <h2 className="text-2xl font-black tracking-tight line-clamp-1">Next up: {continueCourses[0].title}</h2>
                <p className="text-muted-foreground text-sm font-medium">Continue where you left off in this course.</p>
              </div>
            </div>
            <Link
              href={`/dashboard/student/my-courses/${continueCourses[0].id}`}
              className="w-full md:w-auto h-14 px-10 bg-primary text-white rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              Start Lesson
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label={t("student.total_enrolled") || "Total Enrolled"}
          value={totalEnrolled}
          icon={<BookOpen className="w-5 h-5" />}
          trend={t("student.enrolled_trend") || "+2 this month"}
        />
        <StatCard
          label={t("student.mastered") || "Mastered"}
          value={completedCount}
          icon={<Star className="w-5 h-5" />}
          trend={t("student.mastered_trend") || "Top 5% student"}
        />
        <StatCard
          label={t("student.engaged") || "Engaged"}
          value={inProgressCount}
          icon={<Zap className="w-5 h-5" />}
          trend={t("student.engaged_trend") || "Daily streak: 4"}
        />
        <StatCard
          label={t("student.certificates") || "Certificates"}
          value={completedCount} // Mocking match with completed
          icon={<Award className="w-5 h-5" />}
          trend={t("student.certificates_trend") || "Verified assets"}
        />
      </div>

      {/* ================= CONTINUE THE MISSION ================= */}
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-foreground">{t("student.continue_mission") || "Continue the Mission"}</h2>
            <p className="text-muted-foreground font-medium text-sm">{t("student.mission_subtitle") || "Pick up exactly where you left off."}</p>
          </div>

          <Link
            href="/dashboard/student/my-courses"
            className="group h-11 px-6 bg-secondary border border-border rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-primary hover:text-white transition-all"
          >
            {t("student.all_courses") || "All Courses"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {myCourses.length === 0 ? (
          <div className="p-20 bg-secondary/30 border border-dashed border-border rounded-[3rem] text-center">
            <p className="text-muted-foreground font-medium italic">{t("student.empty_library") || "Your learning library is currently empty."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {continueCourses.map((course) => (
              <Link
                key={course.id}
                href={`/dashboard/student/my-courses/${course.id}`}
                className="group relative bg-card border border-border rounded-[2.5rem] p-6 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(var(--primary),0.12)]"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative aspect-video w-full sm:w-56 shrink-0 overflow-hidden rounded-2xl">
                    <img
                      src={course.thumbnail || "/placeholder.png"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="w-12 h-12 text-white shadow-2xl" />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary leading-none">{t("student.in_residence") || "In Residence"}</span>
                      <h3 className="text-xl font-black tracking-tight text-foreground line-clamp-1">{course.title}</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tighter">
                        <span className="text-muted-foreground">{t("student.course_progress_label") || "Course Progress"}</span>
                        <span className="text-primary">{course.progressPercentage || 0}%</span>
                      </div>
                      <ProgressBar progress={course.progressPercentage || 0} size="sm" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ================= RECOMMENDED FOR YOU (AI) ================= */}
      <CourseRecommendation />

    </div>
  );
}

/* ================= PREMIUM STAT CARD ================= */
function StatCard({
  label,
  value,
  icon,
  trend,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
}) {
  return (
    <div className="group relative p-8 bg-card border border-border rounded-[2.5rem] transition-all duration-500 hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
      <div className="space-y-6">
        <div className="w-12 h-12 flex items-center justify-center bg-primary/5 border border-primary/10 rounded-2xl text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
          {icon}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">
            {label}
          </p>
          <p className="text-4xl font-black text-foreground tracking-tighter leading-none">{value}</p>
        </div>

        <div className="pt-4 border-t border-border/50">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">{trend}</p>
        </div>
      </div>
    </div>
  );
}