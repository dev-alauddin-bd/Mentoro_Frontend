"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useGetDashboardAnalyticsQuery } from "@/redux/features/dashboard/dashboardApi";
import { useGetAllCoursesQuery } from "@/redux/features/course/courseAPi";
import { RootState } from "@/redux/store";
import { 
  Zap, 
  DollarSign, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  Wallet,
  PieChart,
  Target
} from "lucide-react";
import { TableSkeleton, StatCardSkeleton } from "@/components/dashboard/skeletons";

import { RoleProtectedRoute } from "@/components/shared/RoleProtectedRoute";
import { Role } from "@/interfaces/user.interface";

export default function InstructorRevenuePage() {
  return (
    <RoleProtectedRoute allowedRoles={[Role.instructor, Role.admin]}>
      <InstructorRevenueContent />
    </RoleProtectedRoute>
  );
}

function InstructorRevenueContent() {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.cmAuth);
  const { data: analyticsData, isLoading: analyticsLoading } = useGetDashboardAnalyticsQuery();
  const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesQuery({ limit: 100, instructorId: user?.id });

  const stats = useMemo(() => analyticsData?.data?.statistics || {}, [analyticsData]);
  
  // Filter courses created by this instructor
  const myCreatedCourses = useMemo(() => {
    const allCourses = Array.isArray(coursesData?.data?.courses) ? coursesData?.data?.courses : [];
    return allCourses.filter((c: any) => c.instructorId === user?.id);
  }, [coursesData, user]);

  const courseRevenueBreakdown = useMemo(() => {
    return myCreatedCourses.map((c: any) => ({
      id: c.id,
      title: c.title,
      price: c.price,
      students: c._count?.enrolledUsers || 0,
      revenue: (c.price * (c._count?.enrolledUsers || 0)),
      share: stats.totalRevenue > 0 ? ((c.price * (c._count?.enrolledUsers || 0)) / stats.totalRevenue) * 100 : 0
    })).sort((a, b) => b.revenue - a.revenue);
  }, [myCreatedCourses, stats]);

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
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      
      {/* ================= PREMIUM HEADER ================= */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-12">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-600">
              <Zap className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t("instructor.command_center") || "Revenue Command Center"}</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
              {t("instructor.revenue_title") || "Earnings & Royalties."}
           </h1>
           <p className="text-muted-foreground text-lg font-medium max-w-xl leading-relaxed">
              {t("instructor.revenue_subtitle") || "Real-time synchronization of your intellectual assets and global market performance."}
           </p>
        </div>

        <div className="flex gap-4">
           <div className="px-10 py-8 bg-card border border-border rounded-[2.5rem] flex flex-col justify-center">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">{t("instructor.payout_available") || "Available for Payout"}</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-black tracking-tighter">${(stats.totalRevenue * 0.8).toLocaleString()}</span>
                 <span className="text-[10px] font-bold text-muted-foreground uppercase">USD</span>
              </div>
           </div>
        </div>
      </section>

      {/* ================= REVENUE STATS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <RevenueCard 
            label={t("instructor.stats.total_revenue") || "Total Revenue"} 
            value={`$${stats.totalRevenue?.toLocaleString() || 0}`} 
            icon={<Wallet className="w-5 h-5" />}
            color="bg-primary shadow-primary/20"
         />
         <RevenueCard 
            label={t("instructor.stats.platform_share") || "Platform Share (20%)"} 
            value={`$${(stats.totalRevenue * 0.2).toLocaleString()}`} 
            icon={<PieChart className="w-5 h-5" />}
            color="bg-indigo-500 shadow-indigo-500/20"
         />
         <RevenueCard 
            label={t("instructor.stats.net_earnings") || "Net Earnings"} 
            value={`$${(stats.totalRevenue * 0.8).toLocaleString()}`} 
            icon={<DollarSign className="w-5 h-5" />}
            color="bg-emerald-500 shadow-emerald-500/20"
         />
         <RevenueCard 
            label={t("instructor.stats.monthly_growth") || "Monthly Growth"} 
            value="+14.2%" 
            icon={<TrendingUp className="w-5 h-5" />}
            color="bg-amber-500 shadow-amber-500/20"
         />
      </div>

      {/* ================= COURSE PERFORMANCE BREAKDOWN ================= */}
      <div className="space-y-8 bg-card border border-border rounded-[3.5rem] p-12 relative overflow-hidden">
         
         <div className="flex justify-between items-end relative z-10">
            <div className="space-y-1">
               <h2 className="text-3xl font-black tracking-tight">{t("instructor.performance_title") || "Curriculum Performance"}</h2>
               <p className="text-muted-foreground font-medium text-sm">{t("instructor.performance_subtitle") || "Financial attribution per intellectual asset."}</p>
            </div>
            
            <div className="flex items-center gap-4 bg-secondary/50 p-2 rounded-2xl border border-border">
               <div className="px-4 py-2 bg-background rounded-xl text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                  {t("instructor.optimization") || "Active Optimization"}
               </div>
            </div>
         </div>

         <div className="relative z-10 pt-4">
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead>
                     <tr className="text-left border-b border-border/50">
                        <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("instructor.table.asset") || "Asset Name"}</th>
                        <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("instructor.table.price") || "Unit Price"}</th>
                        <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("instructor.table.students") || "Students"}</th>
                        <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("instructor.table.market_share") || "Market Share"}</th>
                        <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">{t("instructor.table.revenue") || "Total Revenue"}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                     {courseRevenueBreakdown.map((item) => (
                        <tr key={item.id} className="group hover:bg-secondary/20 transition-all duration-300">
                           <td className="py-8">
                              <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                 <Target className="w-3 h-3" />
                                 {t("instructor.table.strategic") || "Strategic Asset"}
                              </p>
                           </td>
                           <td className="py-8 font-mono text-xs font-bold">${item.price}</td>
                           <td className="py-8 font-mono text-xs font-bold">{item.students}</td>
                           <td className="py-8">
                              <div className="flex flex-col gap-2 w-32">
                                 <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${item.share}%` }}></div>
                                 </div>
                                 <span className="text-[9px] font-black text-muted-foreground uppercase">{item.share.toFixed(1)}% {t("instructor.table.market_share") || "Share"}</span>
                              </div>
                           </td>
                           <td className="py-8 text-right">
                              <p className="text-xl font-black tracking-tighter text-foreground">${item.revenue.toLocaleString()}</p>
                           </td>
                        </tr>
                     ))}
                     {courseRevenueBreakdown.length === 0 && (
                        <tr>
                           <td colSpan={5} className="py-20 text-center">
                              <p className="text-muted-foreground font-medium italic">{t("instructor.table.no_data") || "No active assets generating revenue."}</p>
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

function RevenueCard({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) {
   return (
      <div className="p-8 bg-card border border-border rounded-[2.5rem] relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
         <div className={`w-12 h-12 ${color} text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
            {icon}
         </div>
         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{label}</p>
         <h3 className="text-3xl font-black text-foreground tracking-tighter">{value}</h3>
      </div>
   )
}
