"use client";

import { useTranslation } from "react-i18next";
import { useGetDashboardAnalyticsQuery } from "@/redux/features/dashboard/dashboardApi";
import { useGetAllCoursesQuery } from "@/redux/features/course/courseAPi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { Users, BookOpen, Inbox, DollarSign, Sparkles, FolderOpen, ArrowRight } from "lucide-react";
import { AdminCoursesTable } from "./admin-courses-table";
import { DashboardStatCard } from "./dashboard/stat-card";
import { StatCardSkeleton, TableSkeleton } from "./dashboard/skeletons";
import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { PlatformAnalytics } from "./dashboard/PlatformAnalytics";

export function InstructorDashboard() {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.cmAuth);
  const { data, isLoading } = useGetDashboardAnalyticsQuery();
  const statistics = useMemo(() => data?.data?.statistics || {}, [data]);
  const { data: coursesData } = useGetAllCoursesQuery({ limit: 1000 });
  const { data: usersData } = useGetAllUsersQuery();

  const courses = coursesData?.data?.courses || [];
  const users = usersData?.data?.users || usersData?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-16 animate-pulse">
        <div className="flex justify-between items-end gap-8">
           <div className="space-y-4 w-full">
              <div className="h-6 bg-muted rounded-full w-40"></div>
              <div className="h-24 bg-muted rounded-2xl w-3/4"></div>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCardSkeleton />
           <StatCardSkeleton />
           <StatCardSkeleton />
           <StatCardSkeleton />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* ================= PREMIUM HEADER ================= */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t("instructor.dashboard_title")}</span>
           </div>
           <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.9]">
              {t("instructor.platform_performance").split(" ")[0]} <br />
              <span className="text-primary italic font-serif">{t("instructor.platform_performance").split(" ")[1]}</span>
           </h1>
           <p className="text-muted-foreground text-lg font-medium max-w-xl leading-relaxed">
              {t("instructor.dashboard_subtitle")}
           </p>
        </div>

        <div className="flex gap-4">
           <Link href="/dashboard/instructor/manage-courses" className="h-14 px-8 bg-secondary border border-border text-foreground rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-background transition-all">
              {t("instructor.manage_content")}
              <FolderOpen className="w-4.5 h-4.5" />
           </Link>
        </div>
      </section>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard 
           label={t("instructor.active_courses")} 
           value={statistics.totalCourses || 0} 
           icon={<BookOpen className="w-5 h-5" />} 
           trend={t("instructor.knowledge_assets")}
           variant="primary"
        />
        <DashboardStatCard 
           label={t("instructor.unique_students")} 
           value={statistics.totalStudents || 0} 
           icon={<Users className="w-5 h-5" />} 
           trend={t("instructor.global_reach")}
           variant="indigo"
        />
        <DashboardStatCard 
           label={t("instructor.course_enrollments")} 
           value={statistics.totalEnrollments || 0} 
           icon={<Inbox className="w-5 h-5" />} 
           trend={t("instructor.student_engagement")}
           variant="emerald"
        />
        <DashboardStatCard 
           label={t("instructor.est_revenue")} 
           value={`$${statistics.totalRevenue?.toLocaleString() || 0}`} 
           icon={<DollarSign className="w-5 h-5" />} 
           trend={t("instructor.platform_earnings")}
           variant="amber"
        />
      </div>

      {/* ================= ADVANCED ANALYTICS ================= */}
      <PlatformAnalytics courses={courses} users={users} statistics={statistics} />

      {/* ================= RECENT CONTENT ================= */}
      <div className="space-y-8 bg-card border border-border rounded-[3rem] p-10 relative overflow-hidden group">
        
        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-1">
             <h2 className="text-3xl font-black tracking-tight">{t("instructor.recent_content")}</h2>
             <p className="text-muted-foreground font-medium text-sm">{t("instructor.curriculum_updates")}</p>
          </div>
          
          <Link href="/dashboard/instructor/manage-courses" className="text-primary flex items-center gap-2 text-xs font-black uppercase tracking-widest group/link">
             {t("instructor.view_library")}
             <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>

        <div className="relative z-10">
          <AdminCoursesTable instructorId={user?.id} />
        </div>
      </div>

    </div>
  );
}
