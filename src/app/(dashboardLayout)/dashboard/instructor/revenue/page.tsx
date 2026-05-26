"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useGetInstructorAnalyticsQuery } from "@/redux/features/dashboard/dashboardApi";

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

import DashboardHeader from "@/components/common/DashboardHeader";
import DashboardCard from "@/components/common/DashboardCard";
import DataTable, { Column } from "@/components/common/DataTable";
import Pagination from "@/components/common/Pagination";
import DashboardFilterBar from "@/components/common/DashboardFilterBar";
import { useState } from "react";
import { useGetInstructorAllCoursesQuery } from "@/redux/features/course/courseAPi";

export default function InstructorRevenuePage() {
  return <InstructorRevenueContent />;
}

function InstructorRevenueContent() {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.mentoroAuth);
  const { data: analyticsData, isLoading: analyticsLoading } = useGetInstructorAnalyticsQuery();

  const { data: coursesData, isLoading: coursesLoading } = useGetInstructorAllCoursesQuery({ page: 1, limit: 10 });

  const stats = useMemo(() => analyticsData?.data?.statistics || {}, [analyticsData]);
  
  const [search, setSearch] = useState("");

  // Filter courses created by this instructor
  const myCreatedCourses = useMemo(() => {
    const allCourses = Array.isArray(coursesData?.data?.courses) ? coursesData?.data?.courses : [];
    return allCourses.filter((c: any) => c.instructorId === user?.id);
  }, [coursesData, user]);

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const courseRevenueBreakdown = useMemo(() => {
    return myCreatedCourses
      .map((c: any) => ({
        id: c.id,
        title: c.title,
        price: c.price,
        students: c._count?.enrolledUsers || 0,
        revenue: (c.price * (c._count?.enrolledUsers || 0)),
        share: stats.totalRevenue > 0 ? ((c.price * (c._count?.enrolledUsers || 0)) / stats.totalRevenue) * 100 : 0
      }))
      .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.revenue - a.revenue);
  }, [myCreatedCourses, stats, search]);

  const totalPages = Math.ceil(courseRevenueBreakdown.length / itemsPerPage);
  const paginatedBreakdown = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return courseRevenueBreakdown.slice(start, start + itemsPerPage);
  }, [courseRevenueBreakdown, page]);

  const columns: Column<any>[] = [
    {
      header: t("instructor.table.asset") || "Asset Name",
      accessor: (item) => (
        <div>
          <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{item.title}</p>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-1.5">
             <Target className="w-3 h-3" />
             {t("instructor.table.strategic") || "Strategic Asset"}
          </p>
        </div>
      )
    },
    {
      header: t("instructor.table.price") || "Unit Price",
      accessor: (item) => <span className="font-mono text-xs font-bold">${item.price}</span>
    },
    {
      header: t("instructor.table.students") || "Students",
      accessor: (item) => <span className="font-mono text-xs font-bold">{item.students}</span>
    },
    {
      header: t("instructor.table.market_share") || "Market Share",
      accessor: (item) => (
        <div className="flex flex-col gap-2 w-32">
           <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${item.share}%` }}></div>
           </div>
           <span className="text-[9px] font-black text-muted-foreground uppercase">{item.share.toFixed(1)}% {t("instructor.table.market_share") || "Share"}</span>
        </div>
      )
    },
    {
      header: t("instructor.table.revenue") || "Total Revenue",
      align: "right",
      accessor: (item) => <p className="text-xl font-black tracking-tighter text-foreground">${item.revenue.toLocaleString()}</p>
    }
  ];

  if (analyticsLoading || coursesLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-16 animate-pulse p-4 md:p-8">
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
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      
      <DashboardHeader 
        badgeIcon={<Zap className="w-4 h-4" />}
        badgeText={t("instructor.command_center") || "Revenue Command Center"}
        title={t("instructor.revenue_title") || "Earnings & Royalties."}
        subtitle={t("instructor.revenue_subtitle") || "Real-time synchronization of your intellectual assets and global market performance."}
        action={
            <div className="px-10 py-6 bg-card border border-border rounded-[2.5rem] flex flex-col justify-center shadow-sm">
               <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">{t("instructor.payout_available") || "Available for Payout"}</p>
               <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tighter">${(stats.totalRevenue * 0.8).toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">USD</span>
               </div>
            </div>
        }
      />

      <DashboardFilterBar 
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder="Search courses..."
      />

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

      <DashboardCard
        header={
            <div className="flex justify-between items-end">
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
        }
        footer={
            totalPages > 1 && (
                <Pagination 
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            )
        }
      >
        <DataTable
            columns={columns}
            data={paginatedBreakdown}
            loadingMessage={t("instructor.table.loading") || "Loading performance data..."}
            emptyState={{
                title: t("instructor.table.no_data") || "No active assets generating revenue.",
                description: "Start publishing your knowledge to the global audience.",
                icon: <Target className="w-12 h-12" />
            }}
        />
      </DashboardCard>
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
