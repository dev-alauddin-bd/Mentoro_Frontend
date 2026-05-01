"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetDashboardAnalyticsQuery } from "@/redux/features/dashboard/dashboardApi";
import { useGetAllCoursesQuery } from "@/redux/features/course/courseAPi";
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ShieldCheck, 
  Globe, 
  CreditCard,
  Target
} from "lucide-react";
import { TableSkeleton, StatCardSkeleton } from "@/components/dashboard/skeletons";

import { RoleProtectedRoute } from "@/components/shared/RoleProtectedRoute";
import { Role } from "@/interfaces/user.interface";

export default function AdminRevenuePage() {
  return (
    <RoleProtectedRoute allowedRoles={[Role.admin]}>
      <AdminRevenueContent />
    </RoleProtectedRoute>
  );
}

function AdminRevenueContent() {
  const { t } = useTranslation();
  const { data: analyticsData, isLoading: analyticsLoading } = useGetDashboardAnalyticsQuery();
  const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesQuery({ limit: 100 });

  const stats = useMemo(() => analyticsData?.data?.statistics || {}, [analyticsData]);
  const courses = useMemo(() => Array.isArray(coursesData?.data?.courses) ? coursesData?.data?.courses : [], [coursesData]);

  const topCourses = useMemo(() => {
    return courses.map((c: any) => ({
      id: c.id,
      title: c.title,
      instructor: c.instructor?.name || "Unknown",
      revenue: (c.price * (c._count?.enrolledUsers || 0)),
      enrollments: c._count?.enrolledUsers || 0
    })).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [courses]);

  if (analyticsLoading || coursesLoading) {
    return (
      <div className="space-y-16 animate-pulse">
        <div className="h-24 bg-muted rounded-[2.5rem] w-1/2"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <StatCardSkeleton />
           <StatCardSkeleton />
           <StatCardSkeleton />
           <StatCardSkeleton />
        </div>
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      
      {/* ================= PREMIUM HEADER ================= */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-12">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t("admin.global_intel") || "Global Financial Intelligence"}</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
              Platform <br />
              <span className="text-primary italic font-serif">{t("admin.revenue_title") || "Capital Hub."}</span>
           </h1>
           <p className="text-muted-foreground text-lg font-medium max-w-xl leading-relaxed">
              {t("admin.revenue_subtitle") || "Consolidated financial oversight, market penetration metrics, and platform-wide revenue synchronization."}
           </p>
        </div>

        <div className="flex gap-4">
           <div className="px-10 py-8 bg-card border border-border rounded-[2.5rem] shadow-sm flex flex-col justify-center">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">{t("admin.treasury") || "Platform Treasury"}</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-black tracking-tighter">${stats.totalRevenue?.toLocaleString() || 0}</span>
                 <span className="text-[10px] font-bold text-muted-foreground uppercase">USD</span>
              </div>
           </div>
        </div>
      </section>

      {/* ================= ANALYTICS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
         <AdminStatCard 
            label={t("admin.stats.gmv") || "Gross Merchandise Value"} 
            value={`$${stats.totalRevenue?.toLocaleString() || 0}`} 
            icon={<Globe className="w-5 h-5 text-indigo-500" />}
            trend={t("admin.stats.stable_growth") || "Stable Growth"}
         />
         <AdminStatCard 
            label={t("admin.stats.enrollments") || "Course Enrollments"} 
            value={stats.totalEnrollments || 0} 
            icon={<CreditCard className="w-5 h-5 text-primary" />}
            trend="+12% WoW"
         />
         <AdminStatCard 
            label={t("admin.stats.aov") || "Avg. Order Value"} 
            value={`$${stats.totalEnrollments > 0 ? (stats.totalRevenue / stats.totalEnrollments).toFixed(2) : 0}`} 
            icon={<Target className="w-5 h-5 text-emerald-500" />}
            trend={t("admin.stats.optimized") || "Optimized"}
         />
         <AdminStatCard 
            label={t("admin.stats.market_conversion") || "Market Conversion"} 
            value={`${stats.engagementRate || 0}%`} 
            icon={<TrendingUp className="w-5 h-5 text-amber-500" />}
            trend={t("admin.stats.bullish") || "Bullish"}
         />
      </div>

      {/* ================= TOP PERFORMING ASSETS ================= */}
      <div className="bg-card border border-border rounded-[3.5rem] overflow-hidden shadow-sm relative">
         
         <div className="p-12 border-b border-border/50 relative z-10 flex justify-between items-end">
            <div>
               <h2 className="text-3xl font-black tracking-tight">{t("admin.radar_title") || "Financial Performance Radar"}</h2>
               <p className="text-muted-foreground font-medium text-sm">{t("admin.radar_subtitle") || "Identifying top-tier curriculum assets by revenue contributions."}</p>
            </div>
            <div className="flex gap-2">
               <div className="px-5 py-2 bg-indigo-500/5 text-indigo-500 border border-indigo-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  {t("admin.realtime_auditing") || "Real-time Auditing"}
               </div>
            </div>
         </div>

         <div className="relative z-10">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-secondary/20 border-b border-border/50">
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("admin.table.asset") || "Strategic Asset"}</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("admin.table.instructor") || "Lead Instructor"}</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("admin.table.volume") || "Volume"}</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">{t("admin.table.revenue") || "Attributed Revenue"}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                     {topCourses.map((c) => (
                        <tr key={c.id} className="hover:bg-secondary/10 transition-colors group">
                           <td className="px-12 py-8">
                              <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{c.title}</p>
                              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{t("admin.table.verified") || "Verified Placement"}</p>
                           </td>
                           <td className="px-12 py-8">
                              <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                                    {c.instructor.charAt(0)}
                                 </div>
                                 <span className="text-xs font-bold text-foreground">{c.instructor}</span>
                              </div>
                           </td>
                           <td className="px-12 py-8">
                              <span className="text-xs font-black tabular-nums">{c.enrollments} Units</span>
                           </td>
                           <td className="px-12 py-8 text-right">
                              <p className="text-xl font-black tracking-tighter text-foreground">${c.revenue.toLocaleString()}</p>
                           </td>
                        </tr>
                     ))}
                     {topCourses.length === 0 && (
                        <tr>
                           <td colSpan={4} className="px-12 py-20 text-center">
                              <p className="text-muted-foreground font-medium italic">{t("admin.table.no_data") || "No curriculum data synchronized yet."}</p>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

    </div>
  );
}

function AdminStatCard({ label, value, icon, trend }: { label: string, value: string | number, icon: React.ReactNode, trend: string }) {
   return (
      <div className="p-8 bg-card border border-border rounded-[2.5rem] relative overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
         <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
            {icon}
         </div>
         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{label}</p>
         <h3 className="text-3xl font-black text-foreground tracking-tighter mb-4">{value}</h3>
         <div className="pt-4 border-t border-border/50 flex items-center gap-2">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">{trend}</span>
         </div>
      </div>
   )
}
