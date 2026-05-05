"use client"

import { useTranslation } from "react-i18next"
import { AdminStats } from "./admin-stats"
import { AdminCoursesTable } from "./admin-courses-table"
import { AdminUsersTable } from "./admin-users-table"
import { useGetAllCoursesQuery } from "@/redux/features/course/courseAPi"
import { useGetAllUsersQuery } from "@/redux/features/user/userApi"
import { useGetAdminAnalyticsQuery } from "@/redux/features/dashboard/dashboardApi"
import { Sparkles, Activity, ShieldCheck, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { AdminAnalytics } from "./dashboard/AdminAnalytics"

export function AdminDashboard() {
  const { t } = useTranslation()
  const { data: analyticsData } = useGetAdminAnalyticsQuery()

  const { data: coursesData } = useGetAllCoursesQuery({ limit: 1000 })
  const { data: usersData } = useGetAllUsersQuery()
  
  const stats = analyticsData?.data?.statistics || {}
  const courses = coursesData?.data?.courses || []
  const users = usersData?.data?.users || usersData?.data || []

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* ================= PREMIUM HEADER ================= */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/5 border border-indigo-500/10 rounded-full text-indigo-500">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t("admin.core_arch")}</span>
           </div>
           <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.9]">
              {t("common.operations")} <br />
              <span className="text-primary italic font-serif">{t("admin.command_center")}</span>
           </h1>
           <p className="text-muted-foreground text-lg font-medium max-w-xl leading-relaxed">
              {t("admin.command_subtitle")}
           </p>
        </div>

        <div className="flex gap-4">
           <Link href="/dashboard/admin/analytics" className="h-14 px-8 bg-primary text-white rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
              {t("admin.live_analytics")}
              <Activity className="w-5 h-5" />
           </Link>
        </div>
      </section>

      {/* ================= STATS GRID ================= */}
      <AdminStats />

      {/* ================= ADVANCED ANALYTICS ================= */}
      <AdminAnalytics courses={courses} users={users} statistics={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        
        {/* Recent Courses Section */}
        <div className="space-y-8 bg-card border border-border rounded-[3.5rem] p-10 relative overflow-hidden">
          
          <div className="flex justify-between items-center relative z-10">
            <div className="space-y-1">
               <h2 className="text-2xl font-black tracking-tight">{t("admin.recent_courses")}</h2>
               <p className="text-muted-foreground font-medium text-xs">{t("admin.latest_curriculum")}</p>
            </div>
            <Link href="/dashboard/admin/manage-categories" className="text-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform">
               {t("admin.configure")}
               <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="relative z-10">
            <AdminCoursesTable showAll={true} />
          </div>
        </div>

        {/* Recent Users Section */}
        <div className="space-y-8 bg-card border border-border rounded-[3.5rem] p-10 relative overflow-hidden">
          
          <div className="flex justify-between items-center relative z-10">
            <div className="space-y-1">
               <h2 className="text-2xl font-black tracking-tight">{t("admin.recent_users")}</h2>
               <p className="text-muted-foreground font-medium text-xs">{t("admin.latest_enrollments")}</p>
            </div>
            <Link href="#" className="text-indigo-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform">
               {t("admin.audit_logs")}
               <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="relative z-10">
            <AdminUsersTable />
          </div>
        </div>

      </div>
    </div>
  )
}
